import { Response } from 'express';
const apiResponse = {
  sendSuccess: ({
    res,
    message = 'Successful',
    code = 200,
    data = {},
    meta,
  }: {
    res: Response;
    message?: string;
    code?: number;
    data?: any;
    meta?: Object;
  }) => {
    res.status(code).json({
      message,
      isSuccess: true,
      statusCode: code,
      data: data,
      ...(meta ? { meta: meta } : {}),
    });
  },
  sendError: ({
    res,
    message = 'Error',
    code = 500,
    data = {},
    error,
  }: {
    res: Response;
    message?: string;
    code?: number;
    data?: Object;
    error?: any;
  }) => {
    res.status(error?.code || code).json({
      message: error?.message || message,
      isSuccess: false,
      statusCode: code,
    });
  },
};

export default apiResponse;
