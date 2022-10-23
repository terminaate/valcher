import {NextFunction, Request, Response} from 'express';
import ServerService from '../services/server.service';
import {UserRequest} from '../middlewares/auth.middleware';

class ServerController {
    async auth(req: Request, res: Response, next: NextFunction) {
        try {
            const {accessToken, username, password} = req.body;
            let userData: {
                puuid: null | string;
                isMultifactor?: boolean;
                accessToken?: string;
                refreshToken?: string;
            };
            if (accessToken) {
                userData = await ServerService.auth(accessToken);
            } else {
                userData = await ServerService.auth('', username, password);
            }
            res.cookie('refreshToken', userData.refreshToken, {
                httpOnly: true,
                maxAge: 172800000,
            }); // 172800000 - 2 days
            res.status(200).json({
                puuid: userData.puuid,
                isMultifactor: userData.isMultifactor,
                accessToken: userData.accessToken,
            });
        } catch (e) {
            next(e);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken} = req.cookies;
            const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
                await ServerService.refresh(refreshToken);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                maxAge: 172800000,
            }); // 172800000 - 2 days
            res.status(200).json({
                accessToken: newAccessToken,
            });
        } catch (e) {
            next(e);
        }
    }

    async getUser(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const userInfo = await ServerService.getUserInfo();
            res.status(200).json(userInfo);
        } catch (e) {
            next(e);
        }
    }

    async getBackground(req: Request, res: Response, next: NextFunction) {
        try {
            const {image, type} = await ServerService.getBackgroundImage();
            res.setHeader('Content-Type', 'image/' + type);
            res.status(200).send(image);
        } catch (e) {
            next(e);
        }
    }

    // async patchBackground(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const {image: newImage} = req.body;
    //         const {image, type} = await ServerService.patchBackgroundImage(newImage) as {image: any, type: string};
    //         res.setHeader("Content-Type", "image/" + type)
    //         res.status(200).send(image);
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    async launch(req: Request, res: Response, next: NextFunction) {
        try {
            await ServerService.launch();
            res.status(200).end();
        } catch (e) {
            next(e);
        }
    }

    async getNews(req: Request, res: Response, next: NextFunction) {
        try {
            const news = await ServerService.getNews();
            res.status(200).json(news);
        } catch (e) {
            next(e);
        }
    }

    async getShop(req: Request, res: Response, next: NextFunction) {
        try {
            const {single} = req.query;
            const shopData = await ServerService.getShop(single !== undefined ? single === "true" : true);
            res.status(200).json(shopData);
        } catch (e) {
            next(e);
        }
    }

    async notFound(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(404).json({error: 'endpoint not found', code: 404});
        } catch (e) {
            next(e);
        }
    }
}

export default new ServerController();
