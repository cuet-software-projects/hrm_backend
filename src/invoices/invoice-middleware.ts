import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { db } from '../db.server';
import ApiError from '../utils/ApiError';

export default class InvoiceMiddleware {
  static checkAmountPaid = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { amount_paid }: { amount_paid?: number } = req.body;

      if (amount_paid !== undefined) {
        let invoice_id = req.params.invoice_id ?? req.body.invoice_id;
        const existingInvoice = await db.invoice.findUnique({
          where: {
            id: invoice_id,
          },
        });

        if (amount_paid > existingInvoice.total) {
          throw new ApiError(
            400,
            "Invoice amount paid can't exceed the total invoice amount!",
          );
        }
        return next();
      }

      next();
    },
  );
}
