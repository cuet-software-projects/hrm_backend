import { Router } from 'express';
import UserSocialMediaController from '../users/user-social-media.controller';
import { userSocialMediaService } from '../core/dependecies';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';

const userSocialMediaRouter = Router();

const userSocialMediaController = new UserSocialMediaController(userSocialMediaService);

// Get the social media info of a user
userSocialMediaRouter.get(
  '/social-media/:userId',
  ValidateIdMiddleware.validateParamsId,
  userSocialMediaController.getUserSocialMediaInfo,
);

// Create social media info for a user
userSocialMediaRouter.post(
  '/social-media',
  userSocialMediaController.createUserSocialMediaInfo,
);

// Update the social media info of a user
userSocialMediaRouter.patch(
  '/social-media/:social_media_id',
  ValidateIdMiddleware.validateParamsId,
  userSocialMediaController.updateUserSocialMediaInfo,
);

export default userSocialMediaRouter;
