import { z } from 'zod';
import { isValidUUID } from '../utils/utils';
export const CreateDepartmentSchema = z.object({
  body: z.object({
    name: z.string(),
    code: z.string(),
    description: z.string(),
    prefix_code: z.string(),
  }),
});
export const DepartmentIdSchema = z.object({
  params: z.object({
    departmentId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
export const DepartmentUpdateSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    description: z.string().optional(),
    prefix_code: z.string(),
  }),
  params: z.object({
    departmentId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
