import z, { isValid } from 'zod';
import { isValidDate } from '../utils/utils';

export const EventSchema = z.object({
  params: z.object({
    date: z.string().refine(isValidDate, {
      message: 'Invalid date format. Date format should be YYYY-MM-DD',
    }),
  }),
});

export type EventSchemaType = z.infer<typeof EventSchema>;
