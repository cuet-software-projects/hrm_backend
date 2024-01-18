import { z } from 'zod';
import { isValidUUID } from '../utils/utils';

export const CreateRoleSchemaType = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  }),
});
export const RoleIdSchema = z.object({
  params: z.object({
    roleId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
