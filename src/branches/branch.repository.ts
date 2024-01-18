import { Branch } from '@prisma/client';
import { DbType, db } from '../db.server';
import BaseRepository from '../core/repository/base.repository';
import {
  BranchDto,
  IBranch,
  PaginateResponse,
  PaginationQueryParams,
  UpdateBranchDto,
} from '../core/types';
import branchCollection from './branch-transformer/branch.collection';
import branchResource from './branch-transformer/branch.resource';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';

export default class BranchRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Branch');
  }

  public async getBranches({
    page,
    limit = 10,
    sorts,
    includes,
    filters,
  }: PaginationQueryParams): Promise<PaginateResponse<IBranch>> {
    try {
      const data = await this.paginate<IBranch, Branch>({
        page: page,
        pageSize: limit,
        transformCollection: branchCollection.transformCollection,
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

  public async getAllBranches(): Promise<IBranch[]> {
    try {
      const allBranches = await this.getAll<IBranch, Branch>(
        branchCollection.transformCollection,
      );
      return allBranches;
    } catch (error) {
      throw error;
    }
  }

  public async getBranch(BranchId: string): Promise<IBranch> {
    try {
      const Branch = await this.get<IBranch, Branch>(BranchId, branchResource.transform);
      return Branch;
    } catch (error) {
      throw error;
    }
  }

  public async createBranch(data: BranchDto): Promise<IBranch> {
    try {
      const newBranch = await this.create<IBranch, Branch>(
        {
          name: data.name,
          address: data.address,
          code: data.code,
        },
        branchResource.transform,
      );
      return newBranch;
    } catch (error) {
      throw error;
    }
  }

  public async deleteBranch(BranchId: string): Promise<IBranch> {
    try {
      const deletedBranch = await this.delete<IBranch>(
        BranchId,
        branchResource.transform,
      );
      return deletedBranch;
    } catch (error) {
      throw error;
    }
  }

  public async updateBranch(
    BranchId: string,
    payload: Partial<UpdateBranchDto>,
  ): Promise<IBranch> {
    try {
      const { name, address } = payload;
      const updatedBranch = await this.update<IBranch, Branch>(
        BranchId,
        {
          ...(name ? { name } : {}),
          ...(address ? { address } : {}),
        },
        branchResource.transform,
      );
      return updatedBranch;
    } catch (error) {
      throw error;
    }
  }
}
