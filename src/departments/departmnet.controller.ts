import {
  DepartmentDto,
  IDepartment,
  PaginateResponse,
  Request,
  UpdateDepartmentDto,
} from '../core/types';
import { Response } from 'express';
import catchAsync from '../utils/catchAsync';
import DepartmentService from './department.service';
import apiResponse from '../core/services/apiResponse.service';

export default class DepartmentController {
  constructor(protected readonly departmentService: DepartmentService) {}
  public getDepartments = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, filters, includes, sorts } = req.query;
    const { data, meta }: PaginateResponse<IDepartment> =
      await this.departmentService.getDepartments({
        page: Number(page),
        limit: Number(limit),
        filters: filters as Record<string, any>,
        includes: includes as string,
        sorts: sorts as string,
      });
    apiResponse.sendSuccess({ res: res, data, meta });
  });

  public getAllDepartments = catchAsync(async (req: Request, res: Response) => {
    const departments: IDepartment[] = await this.departmentService.getAllDepartments();
    apiResponse.sendSuccess({ res: res, data: departments });
  });

  public getDepartment = catchAsync(async (req: Request, res: Response) => {
    const { departmentId } = req.params;
    const department: IDepartment =
      await this.departmentService.getDepartment(departmentId);
    apiResponse.sendSuccess({ res: res, data: department });
  });

  public createDepartment = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as DepartmentDto;

    const newDepartment: IDepartment =
      await this.departmentService.createDepartment(payload);
    apiResponse.sendSuccess({ res: res, data: newDepartment, code: 201 });
  });

  public deleteDepartment = catchAsync(async (req: Request, res: Response) => {
    const departmentId = req.params.departmentId;

    const deletedDepartment: IDepartment =
      await this.departmentService.deleteDepartment(departmentId);
    apiResponse.sendSuccess({ res, data: deletedDepartment });
  });

  public updateDepartment = catchAsync(async (req: Request, res: Response) => {
    const departmentId = req.params.departmentId;
    const payload = req.body as UpdateDepartmentDto;

    const updatedDepartment: IDepartment = await this.departmentService.updateDepartment(
      departmentId,
      payload,
    );
    apiResponse.sendSuccess({ res, data: updatedDepartment, code: 204 });
  });
}
