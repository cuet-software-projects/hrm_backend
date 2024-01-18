import httpStatus from 'http-status';
import { UserLoginDto, ForgotPasswordDto, ResetPasswordDto, IToken } from '../core/types';
import ApiError from '../utils/ApiError';
import BcryptService from '../core/services/bcrypt.service';
import TokenServices from '../core/services/token.service';
import UserRepository from '../users/user.repository';
import dayjs from 'dayjs';
import MailService from '../external/Mail';
import ForgotPasswordRepository from './forgot-password.repository';
import { getFEBaseUrl } from '../configs/env-config';
export default class AuthService {
  constructor(
    private tokenService: TokenServices,
    private userRepo: UserRepository,
    private forgotPasswordRepo: ForgotPasswordRepository,
    private bcryptService: BcryptService,
    private mailService: MailService,
  ) {}

  // Generate a reset Link
  private getResetLink(token: string): string {
    const resetLink = `${getFEBaseUrl().FE_BASE_URL}reset-password?token=${token}`;
    return resetLink;
  }

  // Send token and expiry time when user wants to log in
  public async login(
    payload: UserLoginDto,
  ): Promise<{ token: string; expiresIn: number }> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userRepo.findByEmail(payload.email);
        if (!user) {
          throw new ApiError(httpStatus.NOT_FOUND, 'User Not Exists');
        }

        const isPasswordMatched = await this.bcryptService.compareHash(
          payload.password,
          user.password,
        );

        if (!isPasswordMatched) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Password Does not Matched');
        }
        const expiresIn = new Date(
          Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10,
        ).getTime();
        const token = await this.tokenService.generateToken({
          payload: {
            userId: user.id,
          },
          expiresIn,
        });
        resolve({ token, expiresIn });
      } catch (error) {
        reject(error);
      }
    });
  }

  // handle the user forgot password request
  public async forgotPassword(
    payload: ForgotPasswordDto,
  ): Promise<{ expiry_time: Date }> {
    try {
      const user = await this.userRepo.findByEmail(payload.email);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User Not Exists');
      } else {
        // If a token exists and not expired, send that
        const existingValidToken = await this.forgotPasswordRepo.getResetToken(user.id);

        if (existingValidToken) {
          // Send the email with the reset link
          await this.mailService.sendResetPasswordLink({
            to: payload.email,
            data: {
              resetLink: this.getResetLink(existingValidToken.password_reset_token),
            },
          });
          return Promise.resolve({
            expiry_time: existingValidToken.token_expiry_time,
          });
        }

        // Expire token after 30mins
        const expiresIn = dayjs().add(30, 'minute').toDate().getTime();

        // Generate a unique token
        const token = await this.tokenService.generateToken({
          payload: {
            userId: user.id,
          },
          expiresIn,
        });

        // Save the userid, token and expiry time in the database
        await this.forgotPasswordRepo.createPasswordResetToken({
          userId: user.id,
          token: token,
          expiry_time: dayjs(expiresIn).toDate(),
        });

        // Send the email with the reset link
        await this.mailService.sendResetPasswordLink({
          to: payload.email,
          data: { resetLink: this.getResetLink(token) },
        });

        return Promise.resolve({
          expiry_time: dayjs(expiresIn).toDate(),
        });
      }
    } catch (error) {
      throw error;
    }
  }

  // Handle the user reset password action
  public async resetPassword(payload: ResetPasswordDto) {
    try {
      const { resetToken, password } = payload;
      // If the token is not valid
      if (!this.forgotPasswordRepo.verifyToken(resetToken)) {
        throw new ApiError(
          httpStatus.METHOD_NOT_ALLOWED,
          'Your Reset Password Request is Expired!',
        );
      }

      // decode the token
      const decodedData: any = await this.tokenService.verifyToken(resetToken);

      // Generate and save new password if the token is valid
      const hashPassword = await this.bcryptService.generateHash(password);
      await this.userRepo.updateUser({ password: hashPassword }, decodedData?.userId);
      const foundToken = await this.forgotPasswordRepo.getResetToken(decodedData?.userId);
      if (foundToken) {
        await this.forgotPasswordRepo.deleteToken(foundToken.id);
      }
    } catch (error) {
      throw error;
    }
  }

  // Verify reset password token
  public async resetPasswordVerifyToken(
    payload: Omit<ResetPasswordDto, 'password'>,
  ): Promise<boolean> {
    try {
      const { resetToken } = payload;
      const verified = await this.forgotPasswordRepo.verifyToken(resetToken);
      return verified;
    } catch (error) {
      throw error;
    }
  }
}
