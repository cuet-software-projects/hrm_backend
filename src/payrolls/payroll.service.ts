import BonusRepository from '../bonuses/bonus.repository';
import PayrollRepository from './payroll.repository';
import {
  IPayroll,
  IPayrollOverviewForAdmin,
  IPayrollOverviewForEmployee,
  PaginateResponse,
  PaginationQueryParams,
  PayrollDto,
  PayrollOverviewDto,
  UpdatePayrollDto,
} from '../core/types';
import { BonusDto } from '../bonuses/bonus.type';
import EmployeeService from '../employee-info/employee.service';
export default class PayrollService {
  constructor(
    protected readonly payrollRepo: PayrollRepository,
    protected readonly bonusRepo: BonusRepository,
    protected readonly employeeService: EmployeeService,
  ) {}

  public async createPayroll(
    employeeInfoId: string,
    data: PayrollDto,
  ): Promise<IPayroll> {
    try {
      const newPayroll = await this.payrollRepo.createPayroll(employeeInfoId, data);
      if (!!data.bonus) {
        await this.bonusRepo.createBonus(employeeInfoId, data as BonusDto);
      }
      return newPayroll;
    } catch (error) {
      throw error;
    }
  }

  public async getPayrollOfEmployee(employeeInfoId: string): Promise<IPayroll[]> {
    try {
      const allPayrolls = await this.payrollRepo.getPayrollOfEmployee(employeeInfoId);
      return allPayrolls;
    } catch (error) {
      throw error;
    }
  }

  public async getAllPayrolls({
    params,
  }: {
    params: PaginationQueryParams;
  }): Promise<PaginateResponse<IPayroll>> {
    try {
      const allPayrolls = await this.payrollRepo.getAllPayrolls({ ...params });
      return allPayrolls;
    } catch (error) {
      throw error;
    }
  }
  public async getPayrollsOfEmployee(
    employeeInfoId: string,
    {
      params,
    }: {
      params: PaginationQueryParams;
    },
  ): Promise<PaginateResponse<IPayroll>> {
    try {
      const allPayrolls = await this.payrollRepo.getPayrollsOfEmployee(employeeInfoId, {
        ...params,
      });
      return allPayrolls;
    } catch (error) {
      throw error;
    }
  }
  public async updatePayroll(
    payrollId: string,
    data: UpdatePayrollDto,
  ): Promise<IPayroll> {
    try {
      const updatedPayroll = await this.payrollRepo.updatePayroll(payrollId, data);
      if (updatedPayroll.status === 'SENT') {
        const payroll = await this.payrollRepo.getPayroll(payrollId);
        this.employeeService.sentNotification({
          employeeInfoId: payroll.employee_id,
          callBackFunctionName: 'sendPayrollHasDispatched',
        });
      }
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
    try {
      const payrollOverview = await this.payrollRepo.getPayrollOverviewForAdmin({
        date,
        payrollStatus,
        bonusStatus,
      });
      return payrollOverview;
    } catch (error) {
      throw error;
    }
  }

  // Payroll overview for Employee
  public async getPayrollOverviewForEmployee({
    employeeId,
    date,
    payrollStatus,
    bonusStatus,
  }: PayrollOverviewDto & {
    employeeId: string;
    date: string;
  }): Promise<IPayrollOverviewForEmployee> {
    try {
      const payrollOverview = await this.payrollRepo.getPayrollOverviewForEmployee({
        employeeId,
        date,
        payrollStatus,
        bonusStatus,
      });
      return payrollOverview;
    } catch (error) {
      throw error;
    }
  }
}
