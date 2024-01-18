import { Employee_Info } from '@prisma/client';
import dayjs from 'dayjs';
import { DbType, db } from '../db.server';
import employeeCollection from './employee-transformer/employee.collection';
import employeeResource from './employee-transformer/employee.resource';
import { IDepartment } from '../core/types';
import { EmployeeDto, IEmployee, UpdateEmployeeDto } from './employee.type';
import BaseRepository from '../core/repository/base.repository';

export default class EmployeeRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Employee_Info');
  }

  public async getAlEmployees(): Promise<IEmployee[]> {
    try {
      const includes = {
        current_employee_designation: true,
      };
      const allEmployees = await this.getAll<IEmployee, Employee_Info>(
        employeeCollection.transformCollection,
        {
          includes,
        },
      );
      return allEmployees;
    } catch (error) {
      throw error;
    }
  }

  public async getEmployee(employee_info_id) {
    try {
      const employee = await this.get<IEmployee, Employee_Info>(
        employee_info_id,
        employeeResource.transform,
      );
      return employee;
    } catch (error) {
      throw error;
    }
  }

  public async getEmployeeDetails(employee_info_id) {
    try {
      const employee = await db.employee_Info.findUnique({
        where: {
          id: employee_info_id,
        },
        include: {
          user: true,
          employee_designations_salaries: true,
          department: true,
          current_employee_designation: true,
          branch: true,
          reporting_officer: true,
          teams: true,
        },
      });
      return employeeResource.transform(employee);
    } catch (error) {
      throw error;
    }
  }

  public async createNewEmployee(
    data: EmployeeDto,
    employee_id: string,
    employee_number: number,
  ) {
    try {
      const newEmployee = await this.create<IEmployee, Employee_Info>(
        {
          employee_id: employee_id,
          user_id: data.user_id,
          reporting_officer_id: data.reporting_officer_id,
          branch_id: data.branch_id,
          department_id: data.department_id,
          work_type: data.work_type,
          isCurrent: data.isCurrent,
          joined_at: dayjs(data.joined_at).toDate(),
          employee_number: employee_number,
          current_designation_id: data.designation_id,
          current_salary: data.salary || 5000,
        },
        employeeResource.transform,
      );
      return newEmployee;
    } catch (error) {
      throw error;
    }
  }

  public async updateEmployee(
    employee_info_id: string,
    data: UpdateEmployeeDto,
    employee_id?: string,
    employee_number?: number,
  ) {
    try {
      const newEmployee = await this.update<IEmployee, Employee_Info>(
        employee_info_id,
        {
          ...(employee_id && { employee_id }),
          ...(data.user_id && { user_id: data.user_id }),
          ...(data.reporting_officer_id && {
            reporting_officer_id: data.reporting_officer_id,
          }),
          ...(data.branch_id && { branch_id: data.branch_id }),
          ...(data.department_id && { department_id: data.department_id }),
          ...(data.work_type && { work_type: data.work_type }),
          ...(data.isCurrent && { isCurrent: data.isCurrent }),
          ...(data.joined_at && { joined_at: dayjs(data.joined_at).toDate() }),
          ...(employee_number && { employee_number }),
          ...(data.designation_id && { current_designation_id: data.designation_id }),
          ...(data.salary && { current_salary: data.salary }),
          ...(data.left_at && { left_at: dayjs(data.left_at).toDate() }),
        },
        employeeResource.transform,
      );
      return newEmployee;
    } catch (error) {
      throw error;
    }
  }

  public async getLastEmployeeNumberByDepartment(
    department_id: IDepartment['id'],
  ): Promise<number> {
    try {
      const newEmployee = await db.employee_Info.findMany({
        where: {
          department_id,
        },
        orderBy: {
          employee_number: 'desc',
        },
        take: 1,
      });
      return newEmployee[0]?.employee_number || 0;
    } catch (error) {
      throw error;
    }
  }
}
