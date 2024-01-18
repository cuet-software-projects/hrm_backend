import {
  DesignationDto,
  IDesignation,
  PaginateResponse,
  Request,
  UpdateDesignationDto,
} from '../core/types';
import { Response } from 'express';
import catchAsync from '../utils/catchAsync';
import apiResponse from '../core/services/apiResponse.service';
import DesignationService from './designation.service';

export default class DesignationController {
  constructor(protected readonly designationService: DesignationService) {}
  public getDesignations = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, filters, includes, sorts } = req.query;
    const { data, meta }: PaginateResponse<IDesignation> =
      await this.designationService.getDesignations({
        page: Number(page),
        limit: Number(limit),
        filters: filters as Record<string, any>,
        includes: includes as string,
        sorts: sorts as string,
      });
    apiResponse.sendSuccess({ res: res, data, meta });
  });

  public getAllDesignations = catchAsync(async (req: Request, res: Response) => {
    const Designations: IDesignation[] =
      await this.designationService.getAllDesignations();
    apiResponse.sendSuccess({ res: res, data: Designations });
  });

  public getDesignation = catchAsync(async (req: Request, res: Response) => {
    const { designationId } = req.params;
    const Designation: IDesignation =
      await this.designationService.getDesignation(designationId);
    apiResponse.sendSuccess({ res: res, data: Designation });
  });

  public createDesignation = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as DesignationDto;

    const newDesignation: IDesignation =
      await this.designationService.createDesignation(payload);
    apiResponse.sendSuccess({ res: res, data: newDesignation, code: 201 });
  });

  public deleteDesignation = catchAsync(async (req: Request, res: Response) => {
    const designationId = req.params.designationId;

    const deletedDesignation: IDesignation =
      await this.designationService.deleteDesignation(designationId);
    apiResponse.sendSuccess({ res, data: deletedDesignation });
  });

  public updateDesignation = catchAsync(async (req: Request, res: Response) => {
    const designationId = req.params.designationId;

    const payload = req.body as UpdateDesignationDto;

    const updatedDesignation: IDesignation =
      await this.designationService.updateDesignation(designationId, payload);
    apiResponse.sendSuccess({ res, data: updatedDesignation, code: 204 });
  });
}
