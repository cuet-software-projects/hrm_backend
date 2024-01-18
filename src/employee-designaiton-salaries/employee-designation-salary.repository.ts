import { Employee_Designation_And_Salary } from '@prisma/client';
import { DbType, db } from '../db.server';
import employeeDesignationCollection from './employee-designaiton-salary-transformer/employee-designaiton-salary.collection';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import {
  EmployeeDesignationSalaryDto,
  IEmployeeDesignationSalary,
  PrismaEmployeeDesignationSalaryModel,
} from '../employee-info/employee.type';
import BaseRepository from '../core/repository/base.repository';
export default class EmployeeDesignationSalaryRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Employee_Designation_And_Salary');
  }

  public async createDesignationAndSalary(data: EmployeeDesignationSalaryDto) {
    try {
      await db.employee_Designation_And_Salary.create({
        data: {
          employee_id: data.employee_id,
          designation_id: data.designation_id,
          salary: data.salary,
          reason: data.reason,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getLatestDesignationSalaryInfo(
    designation_id: string,
    employee_id: string,
  ) {
    try {
      const data = await db.employee_Designation_And_Salary.findMany({
        where: {
          employee_id: employee_id,
          designation_id: designation_id,
        },
        orderBy: [
          {
            created_at: 'desc',
          },
        ],
        take: 1,
      });
      return data?.[0];
    } catch (error) {
      return null;
    }
  }

  public async getDesignationSalaryInfos({
    employeeInfoId,
    params,
  }: {
    params: PaginationQueryParams;
    employeeInfoId: string;
  }): Promise<PaginateResponse<IEmployeeDesignationSalary>> {
    try {
      const { page = 1, limit = 10 } = params;
      const response = await this.paginate<
        IEmployeeDesignationSalary,
        PrismaEmployeeDesignationSalaryModel
      >({
        page,
        pageSize: limit,
        transformCollection: employeeDesignationCollection.transformCollection,
        options: {
          orderBy: [
            {
              created_at: 'desc',
            },
          ],
          where: {
            employee_id: employeeInfoId,
          },
          includes: {
            designation: true,
          },
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
