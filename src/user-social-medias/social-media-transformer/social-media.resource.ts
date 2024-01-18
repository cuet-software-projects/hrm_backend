import { IUserSocialMedia, PrismaUserSocialMediaModel } from '../user-social-media.type';
import { Transformer } from '../../core/transformer/transformer';
import userResource from '../../users/user-transformer/user.resource';

class UserSocialMediaResource implements Transformer {
  transform(userSocialMedia: PrismaUserSocialMediaModel): IUserSocialMedia {
    return {
      id: userSocialMedia.id,
      user_id: userSocialMedia.user_id,
      facebook: userSocialMedia.facebook,
      linkedin: userSocialMedia.linkedin,
      user: userSocialMedia.user ? userResource.transform(userSocialMedia.user) : null,
    };
  }
}

const userSocialMediaResource = new UserSocialMediaResource();

export default userSocialMediaResource;
