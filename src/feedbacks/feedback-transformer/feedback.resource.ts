import { IFeedback, PrismaFeedbackModel } from '../feedback.type';
import userResource from '../../users/user-transformer/user.resource';
import { Transformer } from '../../core/transformer/transformer';

class FeedbackResource implements Transformer {
  transform(feedback: PrismaFeedbackModel): IFeedback {
    return {
      id: feedback.id,
      created_at: feedback.created_at,
      user_id: feedback.user_id,
      feedback_type: feedback.feedback_type,
      description: feedback.description,
      user: feedback.user ? userResource.transform(feedback.user) : null,
    };
  }
}

const feedbackResource = new FeedbackResource();

export default feedbackResource;
