import { Router } from 'express';
import ServerController from './server.controller';
import AuthMiddleware from './middlewares/auth.middleware';

const serverRouter = Router();

serverRouter.post('/auth', ServerController.auth);
serverRouter.get('/users/@me', AuthMiddleware, ServerController.getUser);
serverRouter.get('/config/background', ServerController.getBackground);
// serverRouter.patch("/config/background", ServerController.patchBackground)
serverRouter.post('/launch', AuthMiddleware, ServerController.launch);
serverRouter.get('/news', ServerController.getNews);

serverRouter.use('/*', ServerController.notFound);

export default serverRouter;
