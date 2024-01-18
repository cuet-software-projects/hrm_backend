import {
  BranchDto,
  IBranch,
  PaginateResponse,
  Request,
  UpdateBranchDto,
} from '../core/types';
import { Response } from 'express';
import catchAsync from '../utils/catchAsync';
import apiResponse from '../core/services/apiResponse.service';
import BranchService from './branch.service';

export default class BranchController {
  constructor(protected readonly branchService: BranchService) {}
  public getBranches = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, filters, includes, sorts } = req.query;
    const { data, meta }: PaginateResponse<IBranch> =
      await this.branchService.getBranches({
        page: Number(page),
        limit: Number(limit),
        filters: filters as Record<string, any>,
        includes: includes as string,
        sorts: sorts as string,
      });
    apiResponse.sendSuccess({ res: res, data, meta });
  });

  public getAllBranches = catchAsync(async (req: Request, res: Response) => {
    const branches: IBranch[] = await this.branchService.getAllBranches();
    apiResponse.sendSuccess({ res: res, data: branches });
  });

  public getBranch = catchAsync(async (req: Request, res: Response) => {
    const { branchId } = req.params;
    const Branch: IBranch = await this.branchService.getBranch(branchId);
    apiResponse.sendSuccess({ res: res, data: Branch });
  });

  public createBranch = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as BranchDto;

    const newBranch: IBranch = await this.branchService.createBranch(payload);
    apiResponse.sendSuccess({ res: res, data: newBranch, code: 201 });
  });

  public deleteBranch = catchAsync(async (req: Request, res: Response) => {
    const branchId = req.params.branchId;

    const deletedBranch: IBranch = await this.branchService.deleteBranch(branchId);
    apiResponse.sendSuccess({ res, data: deletedBranch });
  });

  public updateBranch = catchAsync(async (req: Request, res: Response) => {
    const branchId = req.params.branchId;
    const payload = req.body as UpdateBranchDto;

    const updatedBranch: IBranch = await this.branchService.updateBranch(
      branchId,
      payload,
    );
    apiResponse.sendSuccess({ res, data: updatedBranch, code: 204 });
  });
}
