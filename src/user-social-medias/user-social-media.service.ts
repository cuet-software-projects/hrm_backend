import UserSocialMediaRepository from './user-social-media.repository';
import UserRepository from '../users/user.repository';
import { IUserSocialMedia, UserSocialMediaDto } from './user-social-media.type';

export default class UserSocialMediaService {
  constructor(
    protected readonly userSocialMediaRepo: UserSocialMediaRepository,
    protected readonly userRepo: UserRepository,
  ) {}

  // Get the social media info of a user
  public async getUserSocialMediaInfo(userId: string): Promise<IUserSocialMedia> {
    try {
      const userSocialMediaInfo =
        await this.userSocialMediaRepo.getUserSocialMediaInfo(userId);
      return userSocialMediaInfo;
    } catch (error) {
      throw error;
    }
  }

  // Create social media info for a user
  public async createUserSocialMediaInfo(
    data: UserSocialMediaDto,
  ): Promise<IUserSocialMedia> {
    try {
      const newSocialMediaInfo =
        await this.userSocialMediaRepo.createUserSocialMediaInfo(data);
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
      const updatedSocialMediaInfo =
        await this.userSocialMediaRepo.updateUserSocialMediaInfo({
          social_media_id,
          payload,
        });
      return updatedSocialMediaInfo;
    } catch (error) {
      throw error;
    }
  }
}
