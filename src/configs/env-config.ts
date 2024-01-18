import * as dotenv from 'dotenv';
dotenv.config();

export const getRestClientPort = (): string => {
  return process.env.REST_SERVER_PORT ?? '3000';
};

export const getAppEnvironment = (): string => {
  return process.env.APP_ENVIRONMENT ?? 'development';
};

export const getMailConfig = () => {
  return {
    service: process.env.MAIL_MAILER,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    from_address: process.env.MAIL_FROM_ADDRESS,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
  };
};

export const getAWSConfig = () => {
  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.BUCKET_NAME,
  };
};

export const getS3BaseUrl = () => {
  return {
    BASE_URL: process.env.S3_BASE_URL,
  };
};

export const getFEBaseUrl = () => {
  return {
    FE_BASE_URL: process.env.FE_BASE_URL,
  };
};
