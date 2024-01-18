import { IUser, PrismaUserModel } from '../../core/types';
import { CollectionTransformer } from '../../core/transformer/transformer';
import userResource from './user.resource';

class UserCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaUserModel[]): IUser[] {
    return requestedData.map((user) => userResource.transform(user));
  }
}

const userCollection = new UserCollection();

export default userCollection;
