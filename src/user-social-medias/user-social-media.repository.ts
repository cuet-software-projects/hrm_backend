import { USER_SCOCIAL_MEDIA } from '@prisma/client';
import { DbType, db } from '../db.server';
import { UserSocialMediaDto, IUserSocialMedia } from './user-social-media.type';
import BaseRepository from '../core/repository/base.repository';
import userSocialMediaResource from './social-media-transformer/social-media.resource';

export default class UserSocialMediaRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'USER_SCOCIAL_MEDIA');
  }

  // Get the social media info of a user
  public async getUserSocialMediaInfo(userId: string): Promise<IUserSocialMedia> {
    try {
      const userSocialMediaInfo = await db.uSER_SCOCIAL_MEDIA.findUnique({
        where: {
          user_id: userId,
        },
      });
      if (userSocialMediaInfo === null) {
        return null;
      }
      return userSocialMediaResource.transform(userSocialMediaInfo);
    } catch (error) {
      throw error;
    }
  }

  // Create social media info for a user
  public async createUserSocialMediaInfo(
    data: UserSocialMediaDto,
  ): Promise<IUserSocialMedia> {
    try {
      const newSocialMediaInfo = await this.create<IUserSocialMedia, USER_SCOCIAL_MEDIA>(
        {
          ...data,
        },
        userSocialMediaResource.transform,
      );
      return newSocialMediaInfo;
    } catch (error) {
      throw error;
    }
  }

  // Update the social media info of a user
  public async updateUserSocialMediaInfo({
    social_media_id,
    payload,
  }: {
    social_media_id: string;
    payload: Partial<UserSocialMediaDto>;
  }): Promise<IUserSocialMedia> {
    try {
      const updatedSocialMediaInfo = await this.update<
        IUserSocialMedia,
        USER_SCOCIAL_MEDIA
      >(
        social_media_id,
        {
          ...payload,
        },
        userSocialMediaResource.transform,
      );
      return updatedSocialMediaInfo;
    } catch (error) {
      throw error;
    }
  }
}
