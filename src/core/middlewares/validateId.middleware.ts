import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { db } from '../../db.server';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';

export interface IdParamsMap {
  [key: string]: Prisma.ModelName;
}
export interface IdBodyMap {
  [key: string]: Prisma.ModelName;
}
export default class ValidateIdMiddleware {
  static validateParamsId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const idParams = [
        'user_id',
        'teamId',
        'roleId',
        'payrollId',
        'leaveId',
        'employeeInfoId',
        'designationId',
        'departmentId',
        'branchId',
        'bonusId',
        'attendance_id',
        'salary_certificate_id',
        'invoice_id',
        'billing_info_id',
        'notice_id',
      ];

      const idNames: IdParamsMap = {
        user_id: 'User',
        teamId: 'Team',
        roleId: 'Role',
        payrollId: 'Payroll',
        leaveId: 'Leave',
        employeeInfoId: 'Employee_Info',
        designationId: 'Designation',
        departmentId: 'Department',
        branchId: 'Branch',
        bonusId: 'Bonus',
        attendance_id: 'Attendance',
        salary_certificate_id: 'Salary_Certificate',
        invoice_id: 'Invoice',
        billing_info_id: 'Billing_Info',
        notice_id: 'Notice',
      };

      const validations = idParams.map(async (param) => {
        const id: string = req.params[param];
        if (id !== undefined) {
          try {
            let existsId = await db[idNames[param]].findUnique({
              where: { id: id },
            });

            if (!existsId) {
              throw new ApiError(400, `Id doesn't exist in ${idNames[param]}`);
            }
          } catch (error) {
            throw error;
          }
        }
      });

      await Promise.all(validations);
      next();
    },
  );
  static validateBodyId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const idBody = [
        'user_id',
        'team_id',
        'role_id',
        'role_ids',
        'payroll_id',
        'leave_id',
        'employee_id',
        'reporting_officer_id',
        'designation_id',
        'department_id',
        'branch_id',
        'bonus_id',
        'attendance_id',
        'current_employee_id',
        'parent_invoice_id',
        'received_by_id',
        'sender_id',
      ];

      const idNames: IdBodyMap = {
        user_id: 'User',
        team_id: 'Team',
        role_id: 'Role',
        role_ids: 'Role',
        payroll_id: 'Payroll',
        leave_id: 'Leave',
        employee_id: 'Employee_Info',
        reporting_officer_id: 'User',
        designation_id: 'Designation',
        department_id: 'Department',
        branch_id: 'Branch',
        bonus_id: 'Bonus',
        attendance_id: 'Attendance',
        current_employee_id: 'Employee_Info',
        parent_invoice_id: 'Invoice',
        received_by_id: 'User',
        sender_id: 'User',
      };

      const validations = idBody.map(async (body) => {
        const ids = req.body[body];

        if (ids !== undefined) {
          const idArray = Array.isArray(ids) ? ids : [ids];

          for (const id of idArray) {
            try {
              const existsId = await db[idNames[body]].findUnique({
                where: { id },
              });

              if (!existsId) {
                throw new ApiError(400, `Id doesn't exist in ${idNames[body]}`);
              }
            } catch (error) {
              throw error;
            }
          }
        }
      });

      await Promise.all(validations);
      next();
    },
  );
}
