import {NextFunction, Request, Response} from 'express';
import ServerException from '../exceptions/server.exception';

export default (
    err: ServerException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // TODO
    // add logging of exceptions
    if (process.env.NODE_ENV === "dev") {
        console.log(err);
    }
    if (err instanceof ServerException || (err as Error) instanceof Error) {
        res.status(err.code);
        return res.json({code: err.code, message: err.message});
    }
    res.status(500);
    return res.json({code: 500, message: 'Unknown server error.'});
};
