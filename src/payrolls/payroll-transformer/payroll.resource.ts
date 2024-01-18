import { IPayroll, PAYROLL_TYPE, PrismaPayrollModel } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';
import { Payroll } from '@prisma/client';

import employeeResource from '../../employee-info/employee-transformer/employee.resource';
import dayjs from 'dayjs';
class PayrollResource implements Transformer {
  transform(payroll: PrismaPayrollModel): IPayroll {
    return {
      id: payroll.id,
      salary: payroll.salary,
      status: payroll.status as PAYROLL_TYPE,
      date: dayjs(payroll.date).toISOString(),
      employee_id: payroll.employee_id,
      employee_info: payroll?.employee_info
        ? employeeResource.transform(payroll.employee_info)
        : null,
    };
  }
}
const payrollResource = new PayrollResource();
export default payrollResource;
