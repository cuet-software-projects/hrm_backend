import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { db } from '../db.server';
import apiResponse from '../core/services/apiResponse.service';
import { BONUS_TYPE } from '../core/types';
import ApiError from '../utils/ApiError';
export default class BonusMiddleware {
  static checkStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const bonusId = req.params.bonusId;
      const existingBonus = await db.bonus.findUnique({
        where: {
          id: bonusId,
        },
      });
      const {
        status,
        bonus,
        reason,
      }: { status?: BONUS_TYPE; bonus?: number; reason?: string } = req.body;
      if (existingBonus.status === 'SENT')
        throw new ApiError(400, "Bonus Already send. Can't Update any thing Anymore");
      if (existingBonus.status !== 'DRAFT' && bonus) {
        throw new ApiError(400, "Status Not in DRAFT.So you can't change the Bonus");
      } else {
        next();
      }
    },
  );
}
