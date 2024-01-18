import { ILeave, PrismaLeaveModel } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';
import { Leave } from '@prisma/client';

import employeeResource from '../../employee-info/employee-transformer/employee.resource';
import { string } from 'yargs';
class LeaveResource implements Transformer {
  transform(leave: PrismaLeaveModel): ILeave {
    return {
      id: leave.id,
      employee_id: leave.employee_id,
      leave_type: leave.leave_type,
      action_taken_by_id: leave?.action_taken_by_id,
      started_at: leave.started_at,
      leave_status: leave.leave_status ?? null,
      ended_at: leave.ended_at,
      description: leave.description,
      action_taken_by: leave?.action_taken_by
        ? employeeResource.transform(leave.action_taken_by)
        : null,
      employee_info: leave?.employee_info
        ? employeeResource.transform(leave.employee_info)
        : null,
    };
  }
}
const leaveResource = new LeaveResource();
export default leaveResource;
