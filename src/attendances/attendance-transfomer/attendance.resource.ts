import { Branch } from '@prisma/client';
import { IAttendance, IBranch, PrismaAttendanceModel } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';
import dayjs from 'dayjs';
import employeeResource from '../../employee-info/employee-transformer/employee.resource';

class AttendanceResource implements Transformer {
  transform(attendance: PrismaAttendanceModel): IAttendance {
    return {
      id: attendance?.id,
      employee_id: attendance.employee_id,
      exit_time: attendance?.exit_time,
      entry_time: attendance.entry_time,
      work_plan: attendance.work_plan,
      work_descriptions: attendance?.work_descriptions,
      break_duration: attendance?.break_duration,
      reason_of_break: attendance?.reason_of_break,
      created_at: dayjs(attendance.created_at).toISOString(),
      updated_at: attendance.updated_at
        ? dayjs(attendance.updated_at).toISOString()
        : null,
      work_type: attendance.work_type,
      date: attendance.date ? dayjs(attendance.date).format('yyyy-mm-dd') : null,
      employee_info: attendance.employee_info
        ? employeeResource.transform(attendance.employee_info)
        : null,
      markings: attendance.markings || null,
    };
  }
}

const attendanceResource = new AttendanceResource();

export default attendanceResource;
