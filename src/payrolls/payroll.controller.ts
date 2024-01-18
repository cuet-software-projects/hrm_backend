import { Response, Request } from 'express';
import catchAsync from '../utils/catchAsync';
import apiResponse from '../core/services/apiResponse.service';
import PayrollService from './payroll.service';
import {
  BranchDto,
  IPayroll,
  PaginateResponse,
  PayrollDto,
  PayrollOverviewDto,
  IPayrollOverviewForAdmin,
  UpdatePayrollDto,
  IPayrollOverviewForEmployee,
} from '../core/types';
export default class PayrollController {
  constructor(protected readonly payrollService: PayrollService) {}
  public createPayroll = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as PayrollDto;
    const employeeInfoId = req.params.employeeInfoId;
    const newPayroll: IPayroll = await this.payrollService.createPayroll(
      employeeInfoId,
      payload,
    );
    apiResponse.sendSuccess({ res: res, data: newPayroll, code: 201 });
  });
  public getAllPayrolls = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, sorts } = req.query;
    const response: PaginateResponse<IPayroll> = await this.payrollService.getAllPayrolls(
      {
        params: {
          page: Number(page ?? 1),
          limit: Number(limit ?? 10),
          filters: filters as Record<string, any>,
          includes: includes as string,
          sorts: sorts as string,
        },
      },
    );
    apiResponse.sendSuccess({ res: res, data: response.data, meta: response.meta });
  });
  public getPayrollOfEmployee = catchAsync(async (req: Request, res: Response) => {
    const employeeInfoId = req.params.employeeInfoId;
    const allPayroll: IPayroll[] =
      await this.payrollService.getPayrollOfEmployee(employeeInfoId);
    apiResponse.sendSuccess({ res: res, data: allPayroll });
  });
  public getPayrollsOfEmployee = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, sorts } = req.query;
    const employeeInfoId = req.params.employeeInfoId;
    const response: PaginateResponse<IPayroll> =
      await this.payrollService.getPayrollsOfEmployee(employeeInfoId, {
        params: {
          page: Number(page ?? 1),
          limit: Number(limit ?? 10),
          filters: filters as Record<string, any>,
          includes: includes as string,
          sorts: sorts as string,
        },
      });
    apiResponse.sendSuccess({ res: res, data: response.data, meta: response.meta });
  });

  // Update payroll
  public updatePayroll = catchAsync(async (req: Request, res: Response) => {
    const payrollId = req.params.payrollId;
    const payload = req.body as UpdatePayrollDto;
    const updatedPayroll: IPayroll = await this.payrollService.updatePayroll(
      payrollId,
      payload,
    );
    apiResponse.sendSuccess({ res: res, data: updatedPayroll, code: 200 });
  });

  // Payroll overview for admin
  public getPayrollOverviewForAdmin = catchAsync(async (req: Request, res: Response) => {
    const date = req.params.date;
    const { payrollStatus, bonusStatus } = req.query as PayrollOverviewDto;
    const payrollOverview: IPayrollOverviewForAdmin[] =
      await this.payrollService.getPayrollOverviewForAdmin({
        date: date,
        payrollStatus,
        bonusStatus,
      });
    apiResponse.sendSuccess({ res: res, data: payrollOverview, code: 200 });
  });

  // Payroll overview for Employee
  public getPayrollOverviewForEmployee = catchAsync(
    async (req: Request, res: Response) => {
      const date = req.params.date;
      const employeeId = req.params.employeeId;
      const { payrollStatus, bonusStatus } = req.query as PayrollOverviewDto;
      const payrollOverview: IPayrollOverviewForEmployee =
        await this.payrollService.getPayrollOverviewForEmployee({
          employeeId,
          date: date,
          payrollStatus,
          bonusStatus,
        });
      apiResponse.sendSuccess({ res: res, data: payrollOverview, code: 200 });
    },
  );
}
