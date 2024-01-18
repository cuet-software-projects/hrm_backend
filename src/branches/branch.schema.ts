import { z } from 'zod';
import { isValidUUID } from '../utils/utils';

export const CreateBranchSchemaType = z.object({
  body: z.object({
    name: z.string().min(1),
    code: z.string().length(3),
    address: z.string().optional(),
  }),
});
export const BranchIdSchema = z.object({
  params: z.object({
    branchId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
