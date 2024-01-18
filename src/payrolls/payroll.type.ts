import { Payroll } from '@prisma/client';
import { PAYROLL_TYPE } from '../core/types';
import { IEmployee, PrismaEmployeeInfoModel } from '../employee-info/employee.type';

export type IPayroll = {
  id: string;
  salary: number;
  status: PAYROLL_TYPE;
  date: string;
  employee_id: string;
  employee_info?: IEmployee;
};
export type PayrollDto = {
  salary: number;
  bonus?: number;
  reason?: string;
  status: PAYROLL_TYPE;
  date: string;
};
export type UpdatePayrollDto = {
  employee_id?: IEmployee['id'];
  salary?: number;
  status?: PAYROLL_TYPE;
  date?: string;
};

export type PrismaPayrollModel = Payroll & {
  employee_info?: PrismaEmployeeInfoModel;
};

export type IPayrollOverviewForAdmin = {
  month: string;
  totalPayroll: number;
  totalBonus: number;
};

type monthWiseAmountType = {
  month: string;
  payroll: number;
  bonus: number;
};

export type IPayrollOverviewForEmployee = {
  monthWiseAmountList: monthWiseAmountType[];
  lifeTimeIncome: number;
  lifeTimeBonus: number;
};

export type PayrollOverviewDto = {
  payrollStatus: PAYROLL_TYPE;
  bonusStatus: PAYROLL_TYPE;
};
