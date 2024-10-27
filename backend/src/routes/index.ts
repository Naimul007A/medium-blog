import { Hono, Context } from "hono";
import { HTTPException } from "hono/http-exception";
import prisma from "../utils/prisma";
import authMiddleware from "../middleware/authMiddleware";
import { getUsers, singIn, singUp } from "../controllers/UserController";
const routes = new Hono();


routes.get("/db-test", async (c) => {
    const users = await prisma.user.findMany();
    c.status(200);
    return c.json<{ success: { message: string; data: typeof users } }>({
        success: {
            message: "list of users",
            data: users,
        }
    });
});


routes.post("/sing-up", singUp);
routes.post("/sing-in", singIn);
routes.get("/users", authMiddleware, getUsers);

export default routes;
