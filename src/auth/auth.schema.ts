import z from 'zod';

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().min(1),
    password: z.string().min(1),
  }),
});

// This is for forgot-password route
export const ForgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Email is invalid'),
  }),
});

// This is reset-password route. Naming may seem awkward. But this done in this way because there is a separate module for reset-password
export const ForgotResetPasswordSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must have at least 8 characters'),
  }),
});

export const ResetPasswordVerifyTokenSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type ForgotResetPasswordSchemaType = z.infer<typeof ForgotResetPasswordSchema>;
export type ResetPasswordVerifyTokenSchemaType = z.infer<
  typeof ResetPasswordVerifyTokenSchema
>;
