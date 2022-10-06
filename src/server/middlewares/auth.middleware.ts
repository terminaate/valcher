import ServerException from '../exceptions/server.exception';
import {NextFunction, Request, Response} from 'express';
import Account from '../models/user.model';
import JwtService from '../services/jwt.service';
import {Model} from 'sequelize';
import ServerService from "../server.service";

export type UserRequest = Request & { user: Model<typeof Account, any> };

export default async (
    req: UserRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1];
        const userData = await JwtService.verify(accessToken);
        if (!userData || !accessToken) {
            return next(ServerException.UnauthorizedError());
        }

        await ServerService.auth(accessToken);
        req.user = await Account.findByPk(userData.id);
        next();
    } catch (e) {
        return next(ServerException.UnauthorizedError());
    }
};
