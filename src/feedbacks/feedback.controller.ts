import { Response, Request, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import { FeedbackDto, IFeedback } from './feedback.type';
import apiResponse from '../core/services/apiResponse.service';
import FeedbackService from './feedback.service';
import { PaginateResponse } from '../core/types';

export default class FeedbackController {
  constructor(protected readonly feedbackService: FeedbackService) {}

  // create feedback
  public createFeedback = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body as FeedbackDto;
      const userId = req.params.userId;

      const newFeedback: IFeedback = await this.feedbackService.createFeedback(
        userId,
        payload,
      );
      apiResponse.sendSuccess({ res: res, data: newFeedback, code: 201 });
    },
  );

  // Get feedbacks of all users with pagination
  public getFeedbacks = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, filters } = req.query;

    const { data, meta }: PaginateResponse<IFeedback> =
      await this.feedbackService.getFeedbacks({
        page: Number(page),
        limit: Number(limit),
        filters: filters as Record<string, any>,
      });
    apiResponse.sendSuccess({ res: res, data, meta });
  });

  // This is for getting paginated feedbacks for a single user
  public getFeedbacksOfUser = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const { userId } = req.params;

    const { data, meta }: PaginateResponse<IFeedback> =
      await this.feedbackService.getFeedbacksOfUser({
        page: Number(page),
        limit: Number(limit),
        userId: userId as string,
      });
    apiResponse.sendSuccess({ res: res, data, meta });
  });
}
