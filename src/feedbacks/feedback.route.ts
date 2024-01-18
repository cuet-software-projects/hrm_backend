import { Router } from 'express';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import FeedbackController from './feedback.controller';
import { feedbackService } from '../core/dependecies';
import validate from '../core/middlewares/validate';
import { CreateFeedbackSchema } from './feedback.schema';

const feedbackRoute = Router();

const feedbackController = new FeedbackController(feedbackService);

// Create a feedback by user
feedbackRoute.post(
  '/users/:userId/feedback',
  validate(CreateFeedbackSchema),
  ValidateIdMiddleware.validateParamsId,
  feedbackController.createFeedback,
);

// Get feedbacks of all user with pagination
feedbackRoute.get('/feedbacks', feedbackController.getFeedbacks);

// This is for getting paginated feedbacks for a single user
feedbackRoute.get(
  '/users/:userId/feedbacks',
  ValidateIdMiddleware.validateParamsId,
  feedbackController.getFeedbacksOfUser,
);

export default feedbackRoute;
