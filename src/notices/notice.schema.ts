import { z } from 'zod';
import { isValidIso } from '../utils/utils';
import { NOTICE_TYPE_VALUES } from '../core/types';

export const CreateNoticeSchema = z.object({
  body: z.object({
    issue_date: z
      .string({ required_error: 'issue_date is required' })
      .refine(isValidIso, {
        message: 'Issue Date format is not valid. Please use ISO format',
      }),
    subject: z.string({ required_error: 'Subject is required' }),
    content: z.string({ required_error: 'Content is required' }),
    status: z.enum(NOTICE_TYPE_VALUES, {
      required_error: 'Status is required',
      invalid_type_error: 'Stutus type is not correct',
    }),
    recipient_ids: z.array(z.string()),
    sender_id: z.string(),
  }),
});

export const UpdateNoticeSchema = z.object({
  body: z.object({
    created_at: z
      .string()
      .refine(isValidIso, {
        message: 'created_at Date format is not valid. Please use ISO format',
      })
      .optional(),
    subject: z.string().optional(),
    content: z.string().optional(),
    recipient_ids: z.array(z.string()).optional(),
    sender_id: z.string().optional(),
  }),
});

export const NoticePinnedSchema = z.object({
  body: z.object({
    is_pinned: z.boolean({
      required_error: 'is_pinned is required',
      invalid_type_error: 'Only boolean value is accepted for is_pinned',
    }),
  }),
});
