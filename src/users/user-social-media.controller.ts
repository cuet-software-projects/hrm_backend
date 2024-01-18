import { Response } from 'express';
import UserSocialMediaService from '../user-social-medias/user-social-media.service';
import { Request } from '../core/types';
import catchAsync from '../utils/catchAsync';
import {
  IUserSocialMedia,
  UserSocialMediaDto,
} from '../user-social-medias/user-social-media.type';
import apiResponse from '../core/services/apiResponse.service';

export default class UserSocialMediaController {
  constructor(private readonly userSocialMediaService: UserSocialMediaService) {}

  //  Get the social media info of a user
  public getUserSocialMediaInfo = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const socialMediaInfo: IUserSocialMedia =
      await this.userSocialMediaService.getUserSocialMediaInfo(userId);
    apiResponse.sendSuccess({ res: res, data: socialMediaInfo });
  });

  // Create social media info for a user
  public createUserSocialMediaInfo = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as UserSocialMediaDto;
    const newSocialMediaInfo =
      await this.userSocialMediaService.createUserSocialMediaInfo(payload);
    apiResponse.sendSuccess({ res: res, data: newSocialMediaInfo, code: 201 });
  });

  // Update the social media info of a user
  public updateUserSocialMediaInfo = catchAsync(async (req: Request, res: Response) => {
    const social_media_id = req.params.social_media_id;
    const payload = req.body as Partial<UserSocialMediaDto>;
    const updatedSocialMediaInfo: IUserSocialMedia =
      await this.userSocialMediaService.updateUserSocialMediaInfo({
        social_media_id,
        payload,
      });
    apiResponse.sendSuccess({ res, data: updatedSocialMediaInfo, code: 204 });
  });
}
