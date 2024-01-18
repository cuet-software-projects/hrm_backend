import { Bonus } from '@prisma/client';
import { db, DbType } from '../db.server';
import bonusResource from './bonus-transformer/bonus.resource';
import { BonusDto, IBonus, UpdateBonusDto } from './bonus.type';
import BaseRepository from '../core/repository/base.repository';
import dayjs from 'dayjs';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';
import bonusCollection from './bonus-transformer/bonus.collection';
export default class BonusRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Bonus');
  }

  public async getBonus(bonusId: string): Promise<IBonus> {
    try {
      const bonus = await this.get<IBonus, Bonus>(bonusId, bonusResource.transform);
      return bonus;
    } catch (error) {
      throw error;
    }
  }

  public async getAllBonuses({
    page,
    limit,
    sorts,
    filters,
    includes,
  }: PaginationQueryParams): Promise<PaginateResponse<IBonus>> {
    try {
      const data = await this.paginate<IBonus, Bonus>({
        page: page,
        pageSize: limit,
        transformCollection: bonusCollection.transformCollection,
        options: {
          where: buildWhereObject(filters),
          orderBy: buildSortObject(sorts),
          includes: buildIncludesObject(includes?.split(',') ?? []),
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getBonusesOfEmployee(
    employeeInfoId,
    { page, limit, sorts, filters, includes }: PaginationQueryParams,
  ): Promise<PaginateResponse<IBonus>> {
    try {
      const options = {
        where: buildWhereObject(filters),
        orderBy: buildSortObject(sorts),
        includes: buildIncludesObject(includes?.split(',') ?? []),
      };
      const newOptions = {
        ...options,
        where: {
          ...options.where,
          employee_id: {
            equals: employeeInfoId,
          },
        },
      };
      const data = await this.paginate<IBonus, Bonus>({
        page: page,
        pageSize: limit,
        transformCollection: bonusCollection.transformCollection,
        options: newOptions,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  public async createBonus(employeeInfoId: string, data: BonusDto): Promise<IBonus> {
    try {
      const newBonus = await this.create<IBonus, Bonus>(
        {
          employee_id: employeeInfoId,
          date: dayjs(data.date).toDate(),
          status: data.status,
          bonus: data.bonus,
          reason: data.reason,
        },
        bonusResource.transform,
      );
      return newBonus;
    } catch (error) {
      throw error;
    }
  }
  public async updateBonus(bonusId: string, data: UpdateBonusDto): Promise<IBonus> {
    try {
      const updateBonus = await this.update<IBonus, Bonus>(
        bonusId,
        {
          ...(data.employee_id && { employee_id: data.employee_id }),
          ...(data.status && { status: data.status }),
          ...(data.bonus && { bonus: data.bonus }),
          ...(data.reason && { reason: data.reason }),
        },
        bonusResource.transform,
      );
      return updateBonus;
    } catch (error) {
      throw error;
    }
  }
}
