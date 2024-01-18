import { z } from 'zod';
import { isValidUUID } from '../utils/utils';
export const CreateTeamSchema = z.object({
  body: z.object({
    name: z.string(),
    code: z.string().optional(),
    description: z.string(),
  }),
});
export const UpdateTeamSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    description: z.string(),
  }),
  params: z.object({
    teamId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
export const TeamIdSchema = z.object({
  params: z.object({
    teamId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
