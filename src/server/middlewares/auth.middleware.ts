import ServerException from "../exceptions/server.exception";
import {NextFunction, Request, Response} from "express";
import DbRepository from "../db.repository";

export type UserRequest = Request & { user: string }

export default (req: UserRequest, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!DbRepository.db.find(u => u.puuid === authorizationHeader)) {
            return next(ServerException.UnauthorizedError());
        }

        req.user = authorizationHeader;
        next();
    } catch (e) {
        return next(ServerException.UnauthorizedError());
    }
};