import {Router} from "express";
import ServerController from "./server.controller";
import AuthMiddleware from "./middlewares/auth.middleware";

const serverRouter = Router()

serverRouter.post("/auth", ServerController.auth)
serverRouter.get("/users/@me", AuthMiddleware, ServerController.getUser)

serverRouter.use("/*", ServerController.notFound)

export default serverRouter