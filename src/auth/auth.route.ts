import { Router } from 'express';
import AuthController from './auth.controller';
import validate from '../core/middlewares/validate';
import {
  ForgotPasswordSchema,
  ForgotResetPasswordSchema,
  LoginSchema,
  ResetPasswordVerifyTokenSchema,
} from './auth.schema';
import { authService } from '../core/dependecies';
const authRouter = Router();

const authController = new AuthController(authService);

authRouter.post('/login', validate(LoginSchema), authController.login);

// Forgot password
authRouter.post(
  '/forgot-password',
  validate(ForgotPasswordSchema),
  authController.forgotPassword,
);

// Reset password When Forgot
authRouter.post(
  '/reset-password/:token',
  validate(ForgotResetPasswordSchema),
  authController.resetPassword,
);

// Verify reset password token
authRouter.get(
  '/reset-password/verify/:token',
  validate(ResetPasswordVerifyTokenSchema),
  authController.resetPasswordVerifyToken,
);

export default authRouter;
