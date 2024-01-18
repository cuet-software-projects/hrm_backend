import { z } from 'zod';
import { PAYROLL_VALUES } from '../core/types';
import { isValidDate, isValidUUID } from '../utils/utils';
export const CreatePayrollSchema = z.object({
  body: z
    .object({
      salary: z.number(),
      bonus: z.number().optional(),
      status: z.enum(PAYROLL_VALUES),
      date: z.string().refine(isValidDate, {
        message: 'Date format is not valid. Please use yyyy-mm-dd',
      }),
      reason: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.bonus !== undefined) {
          return data.reason !== undefined;
        }
        return true;
      },
      {
        message: 'If bonus is provided, reason must also be provided.',
      },
    ),
  params: z.object({
    employeeInfoId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});

export const UpdatePayrollSchema = z.object({
  body: z.object({
    employee_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }).optional(),
    salary: z.number().optional(),
    status: z.enum(PAYROLL_VALUES).optional(),
    date: z
      .string()
      .refine(isValidDate, {
        message: 'Date format is not valid. Please use yyyy-mm-dd',
      })
      .optional(),
  }),
});

// To validate the date params
export const PayrollDateSchema = z.object({
  params: z.object({
    date: z.string().refine(isValidDate, {
      message: 'Invalid date format. Date format should be YYYY-MM-DD',
    }),
  }),
});

export type PayrollDateSchemaType = z.infer<typeof PayrollDateSchema>;
