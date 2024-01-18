import dayjs from 'dayjs';
import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import apiResponse from '../core/services/apiResponse.service';
import { userService } from '../core/dependecies';
import TokenServices from '../core/services/token.service';
import { Request } from '../core/types';
import catchAsync from '../utils/catchAsync';
export const verifyToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.header('Authorization') || '';
    const token = bearer.split(' ')[1];

    const authData: any = await new TokenServices().verifyToken(token);
    if (!authData?.userId || dayjs().valueOf() > authData?.exp) {
      return apiResponse.sendError({
        res,
        message: 'Please Authenticate',
        code: httpStatus.UNAUTHORIZED,
      });
    }
    const currentUser = await userService.getUser(authData.userId);

    req.user = currentUser;

    next();
  },
);
