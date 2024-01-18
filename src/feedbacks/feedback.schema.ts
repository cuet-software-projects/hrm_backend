import { z } from 'zod';
import { isValidUUID } from '../utils/utils';

export const CreateFeedbackSchema = z.object({
  body: z.object({
    feedback_type: z.string(),
    description: z.string(),
  }),
  params: z.object({
    userId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
