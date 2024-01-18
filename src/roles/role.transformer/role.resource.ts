import { Transformer } from '../../core/transformer/transformer';
import { IRole, PrismaRoleModel, PrismaUserModel } from '../../core/types';

import userResource from '../../users/user-transformer/user.resource';

class RoleResource implements Transformer {
  transform(role: PrismaRoleModel): IRole {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      users: role.user_roles
        ? role.user_roles?.map((user_role) =>
            userResource.transform(user_role.user as PrismaUserModel),
          )
        : undefined,
    };
  }
}

const roleResource = new RoleResource();

export default roleResource;
