import { z } from 'zod';
import { isValidUUID } from '../utils/utils';

export const CreateBillingInfoSchema = z.object({
  body: z.object({
    user_id: z.string().refine(isValidUUID, { message: 'Invalid UUID' }),
    address_line_1: z.string(),
    address_line_2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zip_code: z.string().optional(),
  }),
});

export const UpdateBillingInfoSchema = z.object({
  body: z.object({
    user_id: z.string().refine(isValidUUID, { message: 'Invalid UUID' }).optional(),
    addess_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zip_code: z.string().optional(),
  }),
});
