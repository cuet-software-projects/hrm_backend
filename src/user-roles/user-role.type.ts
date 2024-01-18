import { Role, User, User_Role } from '@prisma/client';

export type IUserRole = {
  user_id: string;
  role_id: string;
};

export type PrismaUserRoleModel = User_Role & {
  role?: Role;
  user?: User;
};
