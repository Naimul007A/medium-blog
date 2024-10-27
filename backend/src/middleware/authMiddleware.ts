import { verify } from 'hono/jwt'
import { Hono, Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'
const app = new Hono();
async function authMiddleware(c: Context, next: Next) {
    const token = c.req.header("Authorization")?.split(" ")[1];
    if (!token) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }
    const secret = 'mySecretKey';
    try {
        const payload = await verify(token, secret);
        c.set("jwtPayload", payload);
        if (!payload) {
            throw new HTTPException(401, { message: "Unauthorized" });
        }

    } catch (err) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }
    return await next();
}

export default authMiddleware
