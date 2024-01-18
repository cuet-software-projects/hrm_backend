export type UserLoginDto = {
  email: string;
  password: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  password: string;
  resetToken: string;
};

export type IToken = {
  id: string;
  user_id: string;
  password_reset_token: string;
  token_expiry_time: Date;
};
