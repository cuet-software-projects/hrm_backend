import dayjs from 'dayjs';
import { db } from '../db.server';
import { IToken } from './auth.type';

export default class ForgotPasswordRepository {
  // Verify token
  public async verifyToken(token: string): Promise<boolean> {
    try {
      const foundToken = await db.forgotPassword.findFirst({
        where: {
          password_reset_token: token,
        },
      });

      // Check for expiry
      if (
        foundToken &&
        foundToken.token_expiry_time.getTime() < dayjs().toDate().getTime()
      ) {
        return false;
      }

      return !!foundToken;
    } catch (error) {
      throw error;
    }
  }

  // Create reset password token
  public async createPasswordResetToken({
    userId,
    token,
    expiry_time,
  }: {
    userId: string;
    token: string;
    expiry_time: Date;
  }) {
    try {
      await db.forgotPassword.create({
        data: {
          password_reset_token: token,
          user_id: userId,
          token_expiry_time: expiry_time,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a reset token by either user ID
   * @param userId The user ID or password reset token to search for.
   * @returns A token object if found, otherwise null.
   */
  public async getResetToken(userId: string): Promise<IToken | null> {
    try {
      const foundTokenObj = await db.forgotPassword.findFirst({
        where: {
          user_id: userId,
        },
      });

      // Check for expiry
      if (
        foundTokenObj &&
        !(await this.verifyToken(foundTokenObj.password_reset_token))
      ) {
        await this.deleteToken(foundTokenObj.id);
        return null;
      }
      // return valid token
      return foundTokenObj;
    } catch (error) {
      throw error;
    }
  }

  // Delete a token
  public async deleteToken(tokenId: string): Promise<void> {
    try {
      await db.forgotPassword.delete({
        where: {
          id: tokenId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
