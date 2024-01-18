import {
  Branch,
  Department,
  Designation,
  Employee_Designation_And_Salary,
  Employee_Info,
  Team,
  User,
} from '@prisma/client';
import {
  EMPLOYEE_PROMOTION_REASON_TYPE,
  EMPLOYEE_WORK_TYPE,
  IBranch,
  IDepartment,
  IDesignation,
  ITeam,
} from '../core/types';
import { IUser } from '../users/user.type';

export type IEmployee = {
  id: string;
  employee_id: string;
  user_id: string;
  user?: IUser;
  reporting_officer_id: string;
  reporting_officer?: IUser;
  joined_at: string;
  left_at?: string;
  work_type: EMPLOYEE_WORK_TYPE;
  branch_id: string;
  branch?: IBranch;
  department_id: string;
  department?: IDepartment;
  teams?: ITeam[];
  isCurrent: boolean;
  created_at: string;
  updated_at?: string;
  current_salary?: number;
  current_designation_id?: string;
  current_employee_designation?: IDesignation;
};

export type EmployeeDto = {
  reporting_officer_id: string;
  joined_at: string;
  left_at?: string;
  work_type: EMPLOYEE_WORK_TYPE;
  branch_id: string;
  department_id: string;
  isCurrent: boolean;
  user_id: string;
  designation_id: string;
  salary: number;
  reason: EMPLOYEE_PROMOTION_REASON_TYPE;
};

export type UpdateEmployeeDto = Partial<EmployeeDto>;

export type IEmployeeDesignationSalary = {
  id: string;
  created_at: string;
  designation?: IDesignation;
  designation_id: string;
  salary: number;
  employee_id: string;
  employee_info?: IEmployee;
  reason: EMPLOYEE_PROMOTION_REASON_TYPE;
};

export type EmployeeDesignationSalaryDto = {
  employee_id: string;
  designation_id: string;
  salary: number;
  reason: EMPLOYEE_PROMOTION_REASON_TYPE;
};

export type EmployeeDesignationSalary = {
  employee_id: string;
  designation_id: string;
  salary: number;
  reason: EMPLOYEE_PROMOTION_REASON_TYPE;
};

export type PrismaEmployeeInfoModel = Employee_Info & {
  user?: User;
  branch?: Branch;
  department?: Department;
  teams?: Team[];
  reporting_officer?: User;
  current_employee_designation?: Designation;
  employee_designations_salaries?: Employee_Designation_And_Salary[];
};

export type PrismaEmployeeDesignationSalaryModel = Employee_Designation_And_Salary & {
  designation?: Designation;
  employee_info?: Employee_Info;
};
