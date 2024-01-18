import { db, DbType } from '../db.server';
import BaseRepository from '../core/repository/base.repository';
import { Payroll } from '@prisma/client';
import {
  PayrollDto,
  IPayroll,
  UpdatePayrollDto,
  PrismaPayrollModel,
  IPayrollOverviewForAdmin,
  PayrollOverviewDto,
  IPayrollOverviewForEmployee,
} from './payroll.type';
import payrollResource from './payroll-transformer/payroll.resource';
import dayjs from 'dayjs';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import payrollCollection from './payroll-transformer/payroll.collection';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';
export default class PayrollRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Payroll');
  }
  public async getAllPayrolls({
    page,
    limit,
    sorts,
    filters,
    includes,
  }: PaginationQueryParams): Promise<PaginateResponse<IPayroll>> {
    try {
      const data = await this.paginate<IPayroll, Payroll>({
        page: page,
        pageSize: limit,
        transformCollection: payrollCollection.transformCollection,
        options: {
          where: buildWhereObject(filters),
          orderBy: buildSortObject(sorts),
          includes: buildIncludesObject(includes?.split(',') ?? []),
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getPayroll(payRollId: string): Promise<IPayroll> {
    try {
      const payroll = await this.get<IPayroll, PrismaPayrollModel>(
        payRollId,
        payrollResource.transform,
      );
      return payroll;
    } catch (error) {
      throw error;
    }
  }

  public async getPayrollsOfEmployee(
    employeeInfoId,
    { page, limit, sorts, filters, includes }: PaginationQueryParams,
  ): Promise<PaginateResponse<IPayroll>> {
    try {
      const options = {
        where: buildWhereObject(filters),
        orderBy: buildSortObject(sorts),
        includes: buildIncludesObject(includes?.split(',') ?? []),
      };
      const newOptions = {
        ...options,
        where: {
          ...options.where,
          employee_id: {
            equals: employeeInfoId,
          },
        },
      };
      const data = await this.paginate<IPayroll, Payroll>({
        page: page,
        pageSize: limit,
        transformCollection: payrollCollection.transformCollection,
        options: newOptions,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async createPayroll(employeeId: string, data: PayrollDto): Promise<IPayroll> {
    try {
      const newPayroll = await this.create<IPayroll, Payroll>(
        {
          employee_id: employeeId,
          salary: data.salary,
          date: dayjs(data.date).toDate(),
          status: data.status,
        },
        payrollResource.transform,
      );
      return newPayroll;
    } catch (error) {
      throw error;
    }
  }
  public async getPayrollOfEmployee(employeeId: string): Promise<IPayroll[]> {
    const allPayrolls = await db.payroll.findMany({
      where: {
        employee_id: employeeId,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return payrollCollection.transformCollection(allPayrolls);
  }
  public async updatePayroll(
    payrollId: string,
    data: UpdatePayrollDto,
  ): Promise<IPayroll> {
    try {
      const updatedPayroll = await this.update(
        payrollId,
        {
          ...(data.employee_id && { employee_id: data.employee_id }),
          ...(data.salary && { salary: data.salary }),
          ...(data.status && { status: data.status }),
          ...(data.date && { date: dayjs(data.date).toDate() }),
        },
        payrollResource.transform,
      );

      return updatedPayroll;
    } catch (error) {
      throw error;
    }
  }

  // Payroll overview for admin
  public async getPayrollOverviewForAdmin({
    date,
    payrollStatus,
    bonusStatus,
  }: PayrollOverviewDto & {
    date: string;
  }): Promise<IPayrollOverviewForAdmin[]> {
    const receivedDate = dayjs(date).toDate();
    try {
      const startDate = dayjs(`${receivedDate.getFullYear()}-07-01`).toDate();
      const endDate = dayjs(`${receivedDate.getFullYear() + 1}-06-30`).toDate();

      const payrollOverviewOperation = this.db.payroll.groupBy({
        by: ['date'],
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          status: payrollStatus,
        },
        _sum: {
          salary: true,
        },
      });

      const bonusOverviewOperation = this.db.bonus.groupBy({
        by: ['date'],
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
          status: bonusStatus,
        },
        _sum: {
          bonus: true,
        },
      });

      const [payrollOverview, bonusOverview] = await Promise.all([
        payrollOverviewOperation,
        bonusOverviewOperation,
      ]);

      const result = payrollOverview.map((payrollEntry) => {
        const month = dayjs(payrollEntry.date).format('MMM');
        const totalPayroll = payrollEntry._sum.salary;
        const totalBonus =
          bonusOverview.find(
            (bonusEntry) => dayjs(bonusEntry.date).format('MMM') === month,
          )?._sum.bonus || 0;
        return {
          month,
          totalPayroll,
          totalBonus,
        };
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Payroll overview for Single Employee
  public async getPayrollOverviewForEmployee({
    employeeId,
    date,
    payrollStatus,
    bonusStatus,
  }: PayrollOverviewDto & {
    date: string;
    employeeId: string;
  }): Promise<IPayrollOverviewForEmployee> {
    const receivedDate = dayjs(date).toDate();
    try {
      const startDate = dayjs(`${receivedDate.getFullYear()}-07-01`).toDate();
      const endDate = dayjs(`${receivedDate.getFullYear() + 1}-06-30`).toDate();

      const payrollOverviewOperation = this.db.payroll.groupBy({
        by: ['date'],
        where: {
          employee_id: employeeId,
          date: {
            gte: startDate,
            lte: endDate,
          },
          status: payrollStatus,
        },
        _sum: {
          salary: true,
        },
      });

      const bonusOverviewOperation = this.db.bonus.groupBy({
        by: ['date'],
        where: {
          employee_id: employeeId,
          date: {
            gte: startDate,
            lte: endDate,
          },
          status: bonusStatus,
        },
        _sum: {
          bonus: true,
        },
      });

      const payrollTotalOperation = this.db.payroll.aggregate({
        where: {
          employee_id: employeeId,
        },
        _sum: {
          salary: true,
        },
      });

      const bonusTotalOperation = this.db.bonus.aggregate({
        where: {
          employee_id: employeeId,
        },
        _sum: {
          bonus: true,
        },
      });

      const [payrollOverview, bonusOverview, payrollTotal, bonusTotal] =
        await Promise.all([
          payrollOverviewOperation,
          bonusOverviewOperation,
          payrollTotalOperation,
          bonusTotalOperation,
        ]);

      const result = payrollOverview.map((payrollEntry) => {
        const month = dayjs(payrollEntry.date).format('MMM');
        const payroll = payrollEntry._sum.salary;
        const bonus =
          bonusOverview.find(
            (bonusEntry) => dayjs(bonusEntry.date).format('MMM') === month,
          )?._sum.bonus || 0;
        return {
          month,
          payroll,
          bonus,
        };
      });

      return {
        monthWiseAmountList: result,
        lifeTimeIncome: (payrollTotal._sum.salary || 0) + (bonusTotal._sum.bonus || 0),
        lifeTimeBonus: bonusTotal._sum.bonus,
      };
    } catch (error) {
      throw error;
    }
  }
}
