import httpStatus from 'http-status';
import ApiError from './ApiError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getAppEnvironment } from '../configs/env-config';
import { ZodError } from 'zod';
import { simplifyZodError } from './utils';
import multer from 'multer';

export const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues.map((issue) => issue.message).join(', ');
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
    }
    if (error instanceof multer.MulterError) {
      next(new ApiError(400, error));
    }
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        error = new ApiError(httpStatus.NOT_FOUND, 'Resource not found', true, err.stack);
      } else if (error.code === 'P2002') {
        const errorMessage = error.message;

        const fieldMatch = errorMessage.match(
          /Unique constraint failed on the constraint: `(.+?)`/i,
        );

        if (fieldMatch && fieldMatch.length >= 2) {
          const duplicateField = fieldMatch[1];
          error = new ApiError(
            httpStatus.BAD_REQUEST,
            `Duplicate entry in field: ${duplicateField}`,
            true,
            err.stack,
          );
        } else {
          error = new ApiError(
            httpStatus.BAD_REQUEST,
            `Duplicate entry`,
            true,
            err.stack,
          );
        }
      } else {
        error = new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Prisma error',
          false,
          err.stack,
        );
      }
    } else if (error instanceof ZodError) {
      const errorMessage = simplifyZodError(error);
      error = new ApiError(400, errorMessage, true, error.stack);
    } else {
      const statusCode = error.statusCode
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
      const message = error.message || httpStatus[statusCode];
      error = new ApiError(statusCode, message, false, err.stack);
    }
  }
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (!err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    statusCode: statusCode,
    message,
    isSuccess: false,

    ...(getAppEnvironment() === 'development' && { stack: err.stack }),
  };

  console.error(err);

  res.status(statusCode).send(response);
};
