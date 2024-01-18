import { z } from 'zod';
import { isValidUUID } from '../utils/utils';
export const CreateDesignationSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});
export const UpdateDesignationSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
  params: z.object({
    designationId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
export const DesignationIdSchema = z.object({
  params: z.object({
    designationId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
