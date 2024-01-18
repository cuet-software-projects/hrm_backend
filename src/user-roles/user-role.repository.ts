import { DbType, db } from '../db.server';
import { itemDeletedAndAdded } from '../helpers/utility';
import ApiError from '../utils/ApiError';
import BaseRepository from '../core/repository/base.repository';
export default class UserRoleRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'User_Role');
  }

  public async updateUserRole({
    role_ids,
    user_id,
  }: {
    role_ids: string[];
    user_id: string;
  }) {
    try {
      const user = await db.user.findUnique({
        where: {
          id: user_id,
        },
        include: {
          user_roles: true,
        },
      });

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      const existingRoles = user.user_roles.map((userRole) => userRole.role_id);
      const { itemsToBeDeleted, itemsToBeAdded } = itemDeletedAndAdded(
        existingRoles,
        role_ids,
      );

      if (!!itemsToBeDeleted.length) {
        await db.user_Role.deleteMany({
          where: {
            role_id: {
              in: itemsToBeDeleted,
            },
            user_id,
          },
        });
      }
      if (!!itemsToBeAdded.length) {
        await db.user_Role.createMany({
          data: itemsToBeAdded.map((role_id) => ({
            role_id,
            user_id,
          })),
        });
      }

      return 'updated';
    } catch (error) {
      throw error;
    }
  }
}
