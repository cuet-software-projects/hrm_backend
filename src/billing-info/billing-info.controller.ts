import { Request, Response } from 'express';
import apiResponse from '../core/services/apiResponse.service';
import BillingInfoService from './billing-info.service';
import catchAsync from '../utils/catchAsync';
import { BillingInfoDto, UpdateBillingInfoDto } from './billing-info.type';

export default class BillingInfoController {
  constructor(protected readonly billingInfoService: BillingInfoService) {}

  public getUserBillingInfo = catchAsync(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const data = await this.billingInfoService.getUserBillingInfo(user_id);
    apiResponse.sendSuccess({ res, code: 200, data });
  });

  public getBillingInfos = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, sorts } = req.query;
    const { data, meta } = await this.billingInfoService.getBillingInfos({
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
      includes: includes as string,
      filters: filters as Record<string, any>,
      sorts: sorts as string,
    });

    apiResponse.sendSuccess({ res, code: 200, data, meta });
  });

  public createBillingInfo = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as BillingInfoDto;
    const data = await this.billingInfoService.createBillingInfo(payload);
    apiResponse.sendSuccess({ res, code: 201, data });
  });

  public updateBillingInfo = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as UpdateBillingInfoDto;
    const { billing_info_id } = req.params;
    const data = await this.billingInfoService.updateBillingInfo(
      billing_info_id,
      payload,
    );
    apiResponse.sendSuccess({ res, code: 200, data });
  });
}
