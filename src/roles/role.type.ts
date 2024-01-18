import { Role } from '@prisma/client';
import { IUserRole, PrismaUserRoleModel } from '../user-roles/user-role.type';
import { IUser } from '../users/user.type';

export type IRole = {
  name: string;
  description: string | null;
  id: string;
  users?: IUser[];
};

export type IRoleCreateDto = {
  name: string;
  description: string | null;
};

export type IRoleUpdateDto = Partial<IRoleCreateDto>;

export type PrismaRoleModel = Role & {
  user_roles?: PrismaUserRoleModel[];
};
