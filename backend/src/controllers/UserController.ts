import prisma from "../utils/prisma";
import { HTTPException } from "hono/http-exception";
import { Context } from "hono";
import { z } from "zod";
import { sign } from 'hono/jwt'


async function getUsers(c: Context) {
    const payload = c.get("jwtPayload");
    const users = await prisma.user.findMany();
    c.status(200);
    return c.json<{ success: { message: string; payload?: typeof payload; data: typeof users } }>({
        success: {
            message: "list of users",
            data: users,
        }
    });
}
const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
});
async function singUp(c: Context) {
    const body = await c.req.json();
    const { success, data, error } = createUserSchema.safeParse(body);
    if (!success) {
        throw new HTTPException(422, { message: error.message });
    }
    const userExists = await prisma.user.findFirst({
        where: {
            email: data.email,
        },
    });
    if (userExists) {
        throw new HTTPException(409, { message: "user already exists" });
    }
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password
        },
    });
    c.status(201);
    return c.json<{ success: { message: string; data: typeof user } }>({
        success: {
            message: "user created",
            data: user,
        }
    });
}
const singInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});
async function singIn(c: Context) {
    const body = await c.req.json();
    const { success, data, error } = singInSchema.safeParse(body);
    if (!success) {
        throw new HTTPException(422, { message: error.message });
    }
    const user = await prisma.user.findFirst({
        where: {
            email: data.email,
            password: data.password,
        },
    });
    if (!user) {
        throw new HTTPException(404, { message: "user not found" });
    }
    const payload = {
        sub: user.id,
        role: 'user',
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 7, // Token expires in 5 minutes
    }
    const secret = 'mySecretKey'
    const token = await sign(payload, secret);
    c.status(200);
    return c.json<{ success: { message: string; token: string; data: typeof user } }>({
        success: {
            message: "user found",
            token: token,
            data: user,
        }
    });
}

export {
    getUsers,
    singUp,
    singIn
}
