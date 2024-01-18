import { ZodObject, z } from 'zod';
import { isValidDate, isValidIso, isValidTime, isValidUUID } from '../utils/utils';
export const CreateAttendanceSchema = z.object({
  body: z.object({
    employee_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
    entry_time: z
      .string()
      .refine(isValidIso, { message: 'Date format is not valid. Please use ISO format' }),
    work_type: z.string(),
    work_plan: z.string(),
  }),
});
export const GetSingleAttendanceSchema = z.object({
  params: z.object({
    attendance_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
export const UpdateAttendanceSchema = z.object({
  body: z.object({
    exit_time: z
      .string()
      .refine(isValidIso, { message: 'Date format is not valid. Please use ISO format' }),
    break_duration: z.number().optional(),
    reason_of_break: z.string().optional(),
    work_descriptions: z.string().optional(),
  }),
  params: z.object({
    attendance_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
export const UpdateAttendanceMarkingsSchema = z.object({
  body: z.object({
    markings: z.number(),
  }),
  params: z.object({
    attendance_id: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
