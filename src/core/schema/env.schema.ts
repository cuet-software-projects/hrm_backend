import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRET_KEY: z.string(),
  REST_SERVER_PORT: z.string(),
  DB_CONNECTION: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_DATABASE: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  APP_ENVIRONMENT: z.string(),
  MAIL_MAILER: z.string(),
  MAIL_HOST: z.string(),
  MAIL_PORT: z.string(),
  MAIL_USERNAME: z.string(),
  MAIL_PASSWORD: z.string(),
  MAIL_ENCRYPTION: z.string(),
  MAIL_FROM_ADDRESS: z.string(),
  MAIL_FROM_NAME: z.string(),
  DB_URL: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_KEY: z.string(),
  AWS_REGION: z.string(),
  BUCKET_NAME: z.string(),
  S3_BASE_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (env: Record<string, string>): Env => {
  return envSchema.parse(env);
};
