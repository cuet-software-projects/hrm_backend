import { Branch } from '@prisma/client';
import { IAttendance, IBranch, PrismaAttendanceModel } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';
import dayjs from 'dayjs';
import employeeResource from '../../employee-info/employee-transformer/employee.resource';
import {
  IEmployeeDesignationSalary,
  PrismaEmployeeDesignationSalaryModel,
} from '../../employee-info/employee.type';
import designationResource from '../../designations/designation-transformer/designation.resource';

class EmployeeDesignationSalaryResource implements Transformer {
  transform(data: PrismaEmployeeDesignationSalaryModel): IEmployeeDesignationSalary {
    return {
      id: data?.id,
      employee_id: data.employee_id,
      designation_id: data.designation_id,
      designation: data.designation
        ? designationResource.transform(data.designation)
        : null,
      employee_info: data.employee_info
        ? employeeResource.transform(data.employee_info)
        : null,
      created_at: dayjs(data.created_at).toISOString(),
      salary: data.salary,
      reason: data.reason,
    };
  }
}

const employeeDesignationSalaryResource = new EmployeeDesignationSalaryResource();

export default employeeDesignationSalaryResource;
