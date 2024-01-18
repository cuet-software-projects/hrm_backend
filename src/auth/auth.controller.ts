import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import apiResponse from '../core/services/apiResponse.service';
import { UserLoginDto } from '../core/types';
import AuthService from './auth.services';

export default class AuthController {
  constructor(protected readonly authService: AuthService) {}

  // Login
  public login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const requestDTO = req.body as UserLoginDto;
    const { token, expiresIn } = await this.authService.login(requestDTO);
    apiResponse.sendSuccess({
      res,
      code: 200,
      data: {
        token: token,
        expiresIn,
      },
    });
  });

  // forgot password
  public forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const { expiry_time } = await this.authService.forgotPassword({ email });
    apiResponse.sendSuccess({
      res,
      code: 200,
      data: {
        email,
        expiry_time,
      },
    });
  });

  // Reset password when forgot
  public resetPassword = catchAsync(async (req: Request, res: Response) => {
    const resetToken = req.params.token;
    const { password } = req.body;
    await this.authService.resetPassword({ password, resetToken });
    apiResponse.sendSuccess({
      res,
      code: 200,
    });
  });

  // Verify reset password token
  public resetPasswordVerifyToken = catchAsync(async (req: Request, res: Response) => {
    const resetToken = req.params.token;
    const verified = await this.authService.resetPasswordVerifyToken({ resetToken });
    apiResponse.sendSuccess({
      res,
      code: 200,
      data: {
        verified,
      },
    });
  });
}
