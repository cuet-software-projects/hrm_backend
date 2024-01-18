import { IFeedback, PrismaFeedbackModel } from '../feedback.type';
import { CollectionTransformer } from '../../core/transformer/transformer';
import feedbackResource from './feedback.resource';

class FeedbackCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaFeedbackModel[]): IFeedback[] {
    return requestedData.map((attendance) => feedbackResource.transform(attendance));
  }
}

const feedbackCollection = new FeedbackCollection();

export default feedbackCollection;
