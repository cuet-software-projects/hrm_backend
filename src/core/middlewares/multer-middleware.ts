import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import apiResponse from '../services/apiResponse.service';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handleSingleFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const uploadMiddleware = upload.single('file');
  uploadMiddleware(req, res, (error) => {
    if (error) {
      apiResponse.sendError({
        res,
        message: error,
        code: httpStatus.NOT_ACCEPTABLE,
      });
    }

    next();
  });
};

const handleMultipleFileUpload = (maximumFileNumber: number) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const uploadMiddleware = upload.array('files', maximumFileNumber);
    uploadMiddleware(req, res, (error) => {
      const maxSize = 300 * 1024;
      const files = req.files as Express.Multer.File[];

      if (files) {
        files.forEach((file) => {
          if (file.size > maxSize) {
            apiResponse.sendError({
              res,
              message: 'File size can not be greater than 300KB!',
              code: httpStatus.NOT_ACCEPTABLE,
            });
          }
        });
      }

      if (error) {
        apiResponse.sendError({
          res,
          message: 'Maximum 5 files are allowed',
          code: httpStatus.NOT_ACCEPTABLE,
        });
      }

      next();
    });
  });

export { handleSingleFileUpload, handleMultipleFileUpload };
