import { FEEDBACK_TYPE, Feedback } from '@prisma/client';
import { IUser, PrismaUserModel } from '../users/user.type';

export type IFeedback = {
  id: string;
  user_id: string;
  created_at: Date;
  feedback_type: FEEDBACK_TYPE;
  description: string;
  user?: IUser;
};

export type FeedbackDto = {
  feedback_type: FEEDBACK_TYPE;
  description: string;
};

export type PrismaFeedbackModel = Feedback & {
  user?: PrismaUserModel;
};
