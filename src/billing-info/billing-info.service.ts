import BillingInfoRepository from './billing-info.repository';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import { IBillingInfo, BillingInfoDto, UpdateBillingInfoDto } from './billing-info.type';

export default class BillingInfoService {
  constructor(protected readonly billingInfoRepo: BillingInfoRepository) {}

  public async getBillingInfos(
    params: PaginationQueryParams,
  ): Promise<PaginateResponse<IBillingInfo>> {
    return await this.billingInfoRepo.getBillingInfos(params);
  }

  public async getUserBillingInfo(user_id: string): Promise<IBillingInfo> {
    return await this.billingInfoRepo.getUserBillingInfo(user_id);
  }

  public async createBillingInfo(payload: BillingInfoDto): Promise<IBillingInfo> {
    return await this.billingInfoRepo.createBillingInfo(payload);
  }

  public async updateBillingInfo(
    billing_info_id: string,
    payload: UpdateBillingInfoDto,
  ): Promise<IBillingInfo> {
    return await this.billingInfoRepo.updateBillingInfo(billing_info_id, payload);
  }
}
