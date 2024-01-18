import { z } from 'zod';
import { EMPLOYEE_PROMOTION_REASON_VALUES, WORK_TYPE } from '../core/types';
import { isValidDate, isValidUUID } from '../utils/utils';
export const CreateEmployeeSchemaType = z.object({
  body: z.object({
    user_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
    branch_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
    department_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
    work_type: z.string(),
    isCurrent: z.boolean(),
    joined_at: z.string().refine(isValidDate, {
      message: 'Date format is not valid. Please use yyyy-mm-dd',
    }),
    reporting_officer_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
    designation_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
    reason: z.string(),
    salary: z.number(),
    left_at: z.string().optional(),
  }),
});
export const UpdateEmployeeSchemaType = z.object({
  body: z
    .object({
      reporting_officer_id: z
        .string()
        .refine(isValidUUID, { message: 'Invalid Uuid' })
        .optional(),
      joined_at: z
        .string()
        .refine(isValidDate, {
          message: 'Date format is not valid. Please use yyyy-mm-dd',
        })
        .optional(),
      left_at: z
        .string()
        .refine(isValidDate, {
          message: 'Date format is not valid. Please use yyyy-mm-dd',
        })
        .optional(),
      work_type: z.enum(WORK_TYPE).optional(),
      branch_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }).optional(),
      department_id: z
        .string()
        .refine(isValidUUID, { message: 'Invalid Uuid' })
        .optional(),
      isCurrent: z.boolean().optional(),
      user_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }).optional(),
      designation_id: z
        .string()
        .refine(isValidUUID, { message: 'Invalid Uuid' })
        .optional(),
      salary: z.number().optional(),
      reason: z.enum(EMPLOYEE_PROMOTION_REASON_VALUES).optional(),
    })
    .refine(
      (data) => {
        if (data.salary !== undefined || data.designation_id !== undefined) {
          return data.reason !== undefined;
        }
        return true;
      },
      {
        message:
          'If salary and designation_id are provided, reason must also be provided.',
      },
    ),
  params: z.object({
    employeeInfoId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
