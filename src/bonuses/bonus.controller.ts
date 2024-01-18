import { Response, Request } from 'express';
import catchAsync from '../utils/catchAsync';
import apiResponse from '../core/services/apiResponse.service';
import BonusService from './bonus.service';
import { BonusDto, IBonus, UpdateBonusDto } from './bonus.type';
import { PaginateResponse } from '../core/types';
export default class BonusController {
  constructor(protected readonly bonusService: BonusService) {}

  public createBonus = catchAsync(async (req: Request, res: Response) => {
    const employeeInfoId = req.params.employeeInfoId;
    const payload = req.body as BonusDto;
    const newBonus: IBonus = await this.bonusService.createBonus(employeeInfoId, payload);
    apiResponse.sendSuccess({ res: res, data: newBonus, code: 200 });
  });

  public getAllBonuses = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, sorts } = req.query;

    const response: PaginateResponse<IBonus> = await this.bonusService.getAllBonuses({
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

  public getBonusesOfEmployee = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, sorts } = req.query;
    const employeeInfoId = req.params.employeeInfoId;
    const response: PaginateResponse<IBonus> =
      await this.bonusService.getBonusesOfEmployee(employeeInfoId, {
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
  public updateBonus = catchAsync(async (req: Request, res: Response) => {
    const bonusIdId = req.params.bonusId;
    const payload = req.body as UpdateBonusDto;
    const updatedBonus: IBonus = await this.bonusService.updateBonus(bonusIdId, payload);
    apiResponse.sendSuccess({ res: res, data: updatedBonus, code: 200 });
  });
}
