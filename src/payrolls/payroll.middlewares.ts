import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { db } from '../db.server';
import apiResponse from '../core/services/apiResponse.service';
import ApiError from '../utils/ApiError';

export default class PayrollMiddleware {
  static checkStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const payrollId = req.params.payrollId;

      const existingPayroll = await db.payroll.findUnique({
        where: {
          id: payrollId,
        },
      });

      const { status, salary }: { status: string; salary?: number } = req.body;

      if (existingPayroll.status === 'SENT')
        throw new ApiError(
          400,
          "Payroll is sent already. Can't Update any thing Anymore",
        );
      if (status !== 'DRAFT' && salary) {
        throw new ApiError(400, "Status Not in DRAFT. So you can't change the salary");
      } else {
        return next();
      }
    },
  );
}
