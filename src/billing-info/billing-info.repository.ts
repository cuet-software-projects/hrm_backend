import { Billing_Info } from '@prisma/client';
import { DbType, db } from '../db.server';
import { BillingInfoDto, IBillingInfo, UpdateBillingInfoDto } from './billing-info.type';
import BaseRepository from '../core/repository/base.repository';
import billingInfoResource from './billing-info-transformer/billing-info.transformer';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import billingInfoCollection from './billing-info-transformer/billing-info.collection';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';

export default class BillingInfoRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Billing_Info');
  }

  public async getBillingInfos({
    page,
    limit,
    filters,
    includes = '',
    sorts,
  }: PaginationQueryParams): Promise<PaginateResponse<IBillingInfo>> {
    const includeArray = includes.split(',');
    try {
      const response = await this.paginate<IBillingInfo, Billing_Info>({
        page,
        pageSize: limit,
        transformCollection: billingInfoCollection.transformCollection,
        options: {
          includes: buildIncludesObject(includeArray ?? []),
          where: buildWhereObject(filters),
          orderBy: buildSortObject(sorts),
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getUserBillingInfo(user_id: string): Promise<IBillingInfo> {
    try {
      const response = await this.db.billing_Info.findUnique({
        where: { user_id },
        include: {
          user: true,
        },
      });
      return billingInfoResource.transform(response);
    } catch (error) {
      throw error;
    }
  }

  public async createBillingInfo(data: BillingInfoDto): Promise<IBillingInfo> {
    try {
      const response = await this.create<IBillingInfo, Billing_Info>(
        {
          user_id: data.user_id,
          address_line_1: data.address_line_1,
          address_line_2: data.address_line_2,
          city: data.city,
          state: data.state,
          country: data.country,
          zip_code: data.zip_code,
        },
        billingInfoResource.transform,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async updateBillingInfo(
    billing_info_id: string,
    data: UpdateBillingInfoDto,
  ): Promise<IBillingInfo> {
    try {
      const response = await this.update<IBillingInfo, Billing_Info>(
        billing_info_id,
        {
          ...(data.user_id && {
            user_id: data.user_id,
          }),
          ...(data.address_line_1 && {
            address_line_1: data.address_line_1,
          }),
          ...(data.address_line_2 && {
            address_line_2: data.address_line_2,
          }),
          ...(data.city && {
            city: data.city,
          }),
          ...(data.country && {
            country: data.country,
          }),
          ...(data.state && {
            state: data.state,
          }),
          ...(data.zip_code && {
            zip_code: data.zip_code,
          }),
        },
        billingInfoResource.transform,
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}
