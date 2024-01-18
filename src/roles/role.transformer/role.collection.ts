import { CollectionTransformer } from '../../core/transformer/transformer';
import { IRole, PrismaRoleModel } from '../../core/types';
import roleResource from './role.resource';

class RoleCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaRoleModel[]): IRole[] {
    return requestedData.map((role) => roleResource.transform(role));
  }
}

const roleCollection = new RoleCollection();

export default roleCollection;
