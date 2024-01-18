import { Router } from 'express';

import UserController from '../users/user.controller';
import { userService } from '../core/dependecies';
const meRouter = Router();

// inject user service to user controller
const userController = new UserController(userService);

meRouter.get('/me', userController.me);
export default meRouter;
