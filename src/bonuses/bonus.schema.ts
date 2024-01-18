import z from 'zod';
import { isValidDate } from '../utils/utils';
import { BONUS_VALUES } from '../core/types';

export const BonusSchema = z.object({
  body: z.object({
    date: z.string().refine(isValidDate, {
      message: 'Date format is not valid. Please use yyyy-mm-dd',
    }),
    bonus: z.number().min(1),
    reason: z.string(),
    status: z.enum(BONUS_VALUES),
  }),
});

export const UpdateBonusSchema = z.object({
  body: z.object({
    bonus: z.number().min(1).optional(),
    reason: z.string().optional(),
    status: z.enum(BONUS_VALUES).optional(),
  }),
});

export type BonusSchemaType = z.infer<typeof BonusSchema>;
