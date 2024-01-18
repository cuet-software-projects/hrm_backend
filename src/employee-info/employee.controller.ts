import { Response } from 'express';
import apiResponse from '../core/services/apiResponse.service';
import EmployeeService from './employee.service';
import { IAttendance, PaginateResponse, Request } from '../core/types';
import {
  EmployeeDto,
  IEmployee,
  IEmployeeDesignationSalary,
  UpdateEmployeeDto,
} from './employee.type';
import catchAsync from '../utils/catchAsync';

export default class EmployeeController {
  constructor(protected readonly employeeInfoService: EmployeeService) {}
  public getAllEmployeeInfos = catchAsync(async (req: Request, res: Response) => {
    const employeeInfos: IEmployee[] = await this.employeeInfoService.getAlEmployees();
    apiResponse.sendSuccess({ res: res, data: employeeInfos });
  });

  public getEmployeeDesignationSalaries = catchAsync(
    async (req: Request, res: Response) => {
      const { page, limit } = req.query;
      const { employeeInfoId } = req.params;
      const employeeDesignationSalaries: PaginateResponse<IEmployeeDesignationSalary> =
        await this.employeeInfoService.getEmployeeDesignationSalaries({
          employeeInfoId: employeeInfoId,
          params: {
            page: Number(page ?? 1),
            limit: Number(limit ?? 10),
          },
        });
      apiResponse.sendSuccess({
        res: res,
        data: employeeDesignationSalaries.data,
        meta: employeeDesignationSalaries.meta,
      });
    },
  );

  public getEmployeeDetails = catchAsync(async (req: Request, res: Response) => {
    const { employeeInfoId } = req.params;
    const employeeDetails =
      await this.employeeInfoService.getEmployeeDetails(employeeInfoId);
    apiResponse.sendSuccess({ res: res, data: employeeDetails });
  });

  public createEmployee = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as EmployeeDto;
    const newUser = await this.employeeInfoService.createEmployee(payload);
    apiResponse.sendSuccess({ res: res, data: newUser, code: 201 });
  });

  public updateEmployee = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as UpdateEmployeeDto;
    const employeeInfoId = req.params.employeeInfoId;
    const newUser = await this.employeeInfoService.updateEmployee(
      payload,
      employeeInfoId,
    );
    apiResponse.sendSuccess({ res: res, data: newUser, code: 201 });
  });
}
