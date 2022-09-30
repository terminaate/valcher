import {NextFunction, Request, Response} from "express";
import ServerService from "./server.service";
import {UserRequest} from "./middlewares/auth.middleware";

class ServerController {
    async auth(req: Request, res: Response, next: NextFunction) {
        try {
            const {puuid, username, password} = req.body;
            let userData: {puuid: null | string, isMultifactor?: boolean};
            if (puuid) {
                userData = await ServerService.auth(puuid);
            } else {
                userData = await ServerService.auth("", username, password);
            }
            res.status(200).json(userData);
        } catch (e) {
            next(e)
        }
    }

    async getUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userInfo = await ServerService.getUserInfo();
            res.status(200).json(userInfo);
        } catch (e) {
            next(e)
        }
    }

    async notFound(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(404).json({error: "endpoint not found", code: 404})
        } catch (e) {
            next(e)
        }
    }
}

export default new ServerController()