import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { db } from '../db.server';

export default class UserMiddleWare {
  static checkUpdateUserCurrentEmploymentUUids = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { current_employee_id } = req.body;
      await db.employee_Info.findUniqueOrThrow({
        where: {
          id: current_employee_id,
        },
      });

      next();
    },
  );

  static checkUserRolesUuids = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { role_ids } = req.body;
      if (role_ids) {
        await Promise.all(
          role_ids.map(async (role) => {
            return await db.role.findUniqueOrThrow({
              where: {
                id: role,
              },
            });
          }),
        );
      }

      next();
    },
  );
}
