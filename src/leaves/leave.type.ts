import { Leave } from '@prisma/client';
import { IEmployee, PrismaEmployeeInfoModel } from '../employee-info/employee.type';
import { LEAVE_TYPE, LEAVE_STATUS_TYPE } from '../core/types';
import { isValidDate } from '../utils/utils';
import { z } from 'zod';
export type ILeave = {
  id: string;
  employee_id: string;
  action_taken_by_id?: string;
  employee_info?: IEmployee;
  started_at: Date;
  ended_at: Date;
  leave_type: LEAVE_TYPE;
  leave_status?: LEAVE_STATUS_TYPE;
  action_taken_by?: IEmployee;
  description?: string;
};
export type LeaveDto = {
  started_at: Date;
  ended_at: Date;
  leave_type: LEAVE_TYPE;
  description?: string;
};

export type UpdateLeaveDto = Partial<LeaveDto>;

export type LeaveApprovalDto = {
  leave_status: LEAVE_STATUS_TYPE;
};
export type PrismaLeaveModel = Leave & {
  employee_info?: PrismaEmployeeInfoModel;
  action_taken_by?: PrismaEmployeeInfoModel;
};

// This is to validate leave date params
export const LeaveDateSchema = z.object({
  params: z.object({
    date: z.string().refine(isValidDate, {
      message: 'Invalid date format. Date format should be YYYY-MM-DD',
    }),
  }),
});

export type LeaveDateSchemaType = z.infer<typeof LeaveDateSchema>;
