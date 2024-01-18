import { IUserSocialMedia, PrismaUserSocialMediaModel } from '../user-social-media.type';
import { CollectionTransformer } from '../../core/transformer/transformer';
import userSocialMediaResource from './social-media.resource';

class UserSocialMediaCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaUserSocialMediaModel[]): IUserSocialMedia[] {
    return requestedData.map((socialMediaItem) =>
      userSocialMediaResource.transform(socialMediaItem),
    );
  }
}

const userSocialMediaCollection = new UserSocialMediaCollection();

export default userSocialMediaCollection;
