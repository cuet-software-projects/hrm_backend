import { Feedback } from '@prisma/client';
import { DbType, db } from '../db.server';
import { FeedbackDto, IFeedback } from './feedback.type';
import BaseRepository from '../core/repository/base.repository';
import dayjs from 'dayjs';
import feedbackResource from './feedback-transformer/feedback.resource';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import feedbackCollection from './feedback-transformer/feedback.collection';
import { buildWhereObject } from '../utils/utils';

export default class FeedbackRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Feedback');
  }
  // This is for creaeting feedback by user
  public async createFeedback({
    userId,
    data,
  }: {
    userId: string;
    data: FeedbackDto;
  }): Promise<IFeedback> {
    try {
      const newFeedback = await this.create<IFeedback, Feedback>(
        {
          user_id: userId,
          created_at: dayjs().toDate(),
          description: data.description,
          feedback_type: data.feedback_type,
        },
        feedbackResource.transform,
      );
      return newFeedback;
    } catch (error) {
      throw error;
    }
  }

  // This is for getting paginated feedbacks of all users
  public async getFeedbacks({
    page,
    limit,
    filters,
  }: PaginationQueryParams): Promise<PaginateResponse<IFeedback>> {
    try {
      const userFeedbacks = await this.paginate<IFeedback, Feedback>({
        page: page,
        pageSize: limit,
        transformCollection: feedbackCollection.transformCollection,
        options: {
          where: buildWhereObject(filters),
          includes: {
            user: true,
          },
          orderBy: [{ created_at: 'desc' }],
        },
      });
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
  }: PaginationQueryParams & {
    userId: string;
  }): Promise<PaginateResponse<IFeedback>> {
    try {
      const singleUserFeedbacks = await this.paginate<IFeedback, Feedback>({
        page: page,
        pageSize: limit,
        transformCollection: feedbackCollection.transformCollection,
        options: {
          where: {
            user_id: userId,
          },
          orderBy: [
            {
              created_at: 'desc',
            },
          ],
        },
      });
      return singleUserFeedbacks;
    } catch (error) {
      throw error;
    }
  }
}
