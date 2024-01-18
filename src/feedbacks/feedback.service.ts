import FeedbackRepository from './feedback.repository';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import { FeedbackDto, IFeedback } from './feedback.type';

export default class FeedbackService {
  constructor(protected readonly feedbackRepo: FeedbackRepository) {}

  // Create a feedback
  public async createFeedback(userId: string, data: FeedbackDto): Promise<IFeedback> {
    try {
      const newFeedback = this.feedbackRepo.createFeedback({
        userId: userId,
        data: data,
      });
      return newFeedback;
    } catch (error) {
      throw error;
    }
  }

  // Get Feedbacks of all users with pagination
  public async getFeedbacks({
    page,
    limit,
    filters,
  }: PaginationQueryParams): Promise<PaginateResponse<IFeedback>> {
    try {
      const userFeedbacks = this.feedbackRepo.getFeedbacks({ page, limit, filters });
      return userFeedbacks;
    } catch (error) {
      throw error;
    }
  }

  // This is for getting paginated feedbacks for a single user
  public async getFeedbacksOfUser({
    userId,
    page,
    limit,
  }: PaginationQueryParams & { userId: string }): Promise<PaginateResponse<IFeedback>> {
    try {
      const singleUserFeedbacks = this.feedbackRepo.getFeedbacksOfUser({
        page,
        limit,
        userId,
      });
      return singleUserFeedbacks;
    } catch (error) {
      throw error;
    }
  }
}
