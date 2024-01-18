import z, { isValid } from 'zod';
import { isValidDate, isValidUUID } from '../utils/utils';
import { SALARY_CERTIFICATE_STATUS_VALUES } from '../core/types';

export const SalaryCertificateSchema = z.object({
  params: z.object({
    user_id: z.string().refine(isValidUUID, {
      message: 'Invalid Uuid',
    }),
  }),
  body: z.object({
    issue_date: z.string().refine(isValidDate, {
      message: 'Date format is not valid. Please use yyyy-mm-dd',
    }),
    reason: z.string(),
  }),
});

export const UpdateSalaryCertificateStatusSchema = z.object({
  params: z.object({
    salary_certificate_id: z.string().refine(isValidUUID, {
      message: 'Invalid Uuid',
    }),
  }),
  body: z.object({
    status: z.enum(SALARY_CERTIFICATE_STATUS_VALUES),
  }),
});

export type SalaryCertificateSchemaType = z.infer<typeof SalaryCertificateSchema>;
