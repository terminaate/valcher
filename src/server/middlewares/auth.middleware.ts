import ServerException from '../exceptions/server.exception';
import { NextFunction, Request, Response } from 'express';
import DbRepository from '../db.repository';
import ServerService from '../server.service';

export type UserRequest = Request & { user: string };

export default async (req: UserRequest, res: Response, next: NextFunction) => {
	try {
		const authorizationHeader = req.headers.authorization;
		const userData = DbRepository.db.find(
			(u) => u.puuid === authorizationHeader
		);
		if (!userData) {
			return next(ServerException.UnauthorizedError());
		}

		await ServerService.auth(userData.puuid);
		req.user = authorizationHeader;
		next();
	} catch (e) {
		return next(ServerException.UnauthorizedError());
	}
};
