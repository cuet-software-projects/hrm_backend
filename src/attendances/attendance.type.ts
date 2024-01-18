import { Attendance, Employee_Info } from '@prisma/client';
import { EMPLOYEE_WORK_TYPE } from '../core/types';
import { IEmployee } from '../employee-info/employee.type';
import { z } from 'zod';
import { isValidDate } from '../utils/utils';

export type IAttendance = {
  id: string;
  created_at: string;
  updated_at: string;
  date: string;
  employee_id: string;
  entry_time: string;
  work_plan: string;
  exit_time?: string;
  work_descriptions?: string;
  break_duration?: number;
  reason_of_break?: string;
  work_type?: EMPLOYEE_WORK_TYPE;
  markings?: number;
  employee_info?: IEmployee;
};

export type AttendanceDto = {
  employee_id: string;
  work_type: EMPLOYEE_WORK_TYPE;
  entry_time: string;
  work_plan: string;
};

export type UpdateAttendanceDto = {
  break_duration?: number;
  reason_of_break?: string;
  exit_time: string;
  work_descriptions?: string;
} & Partial<AttendanceDto>;

export type UpdateAttendanceMarkingsDto = {
  markings: number;
};

export type PrismaAttendanceModel = Attendance & {
  employee_info?: Employee_Info;
};

export type AttendanceOverviewType = {
  totalEmployees: number;
  totalEmployeesInLeave: number;
  totalPresentEmployees: number;
  totalAbsentEmployees: number;
};

// This is to validate attendance date params
export const AttendanceDateSchema = z.object({
  params: z.object({
    date: z.string().refine(isValidDate, {
      message: 'Invalid date format. Date format should be YYYY-MM-DD',
    }),
  }),
});

export type AttendanceDateSchemaType = z.infer<typeof AttendanceDateSchema>;
