import { z } from 'zod';
import { LEAVE_STATUS_VALUE } from '../core/types';
import { isValidDate, isValidUUID } from '../utils/utils';

export const GetLeaveDetailsSchema = z.object({
  params: z.object({
    leaveId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});

export const CreateLeaveSchema = z.object({
  body: z.object({
    started_at: z.string().refine(isValidDate, {
      message: 'Date format is not valid. Please use yyyy-mm-dd',
    }),
    ended_at: z.string().refine(isValidDate, {
      message: 'Date format is not valid. Please use yyyy-mm-dd',
    }),
    leave_type: z.string(),
    description: z.string().optional(),
  }),
  params: z.object({
    employeeInfoId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});

export const UpdateLeaveSchema = z.object({
  body: z.object({
    started_at: z
      .string()
      .refine(isValidDate, {
        message: 'Date format is not valid. Please use yyyy-mm-dd',
      })
      .optional(),
    ended_at: z
      .string()
      .refine(isValidDate, {
        message: 'Date format is not valid. Please use yyyy-mm-dd',
      })
      .optional(),
    leave_type: z.string().optional(),
    description: z.string().optional(),
  }),
  params: z.object({
    employeeInfoId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
    leaveId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});

export const LeaveApprovalSchema = z.object({
  body: z.object({
    leave_status: z.enum(LEAVE_STATUS_VALUE),
  }),
  params: z.object({
    approverEmployeeId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
    leaveId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});

export const LeaveOverviewSchema = z.object({
  params: z.object({
    employeeInfoId: z.string().refine(isValidUUID, { message: 'Invalid Uuid' }),
  }),
});
