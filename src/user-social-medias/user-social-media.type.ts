import { USER_SCOCIAL_MEDIA } from '@prisma/client';
import { IUser, PrismaUserModel } from '../users/user.type';

export type IUserSocialMedia = {
  id: string;
  user?: IUser;
  user_id: string;
  facebook?: string | null;
  linkedin?: string | null;
};

export type UserSocialMediaDto = {
  user_id: string;
  facebook?: string;
  linkedin?: string;
};

export type PrismaUserSocialMediaModel = USER_SCOCIAL_MEDIA & {
  user?: PrismaUserModel;
};
