import { Designation } from '@prisma/client';
import { DbType, db } from '../db.server';
import designationCollection from './designation-transformer/designation.collection';
import designationResource from './designation-transformer/designation.resource';
import {
  DesignationDto,
  IDesignation,
  PaginateResponse,
  PaginationQueryParams,
  UpdateDesignationDto,
} from '../core/types';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';
import BaseRepository from '../core/repository/base.repository';

export default class DesignationRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Designation');
  }

  public async getDesignations({
    page,
    limit,
    filters,
    sorts,
    includes,
  }: PaginationQueryParams): Promise<PaginateResponse<IDesignation>> {
    try {
      const data = await this.paginate<IDesignation, Designation>({
        page: page,
        pageSize: limit,
        transformCollection: designationCollection.transformCollection,
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

  public async getAllDesignations(): Promise<IDesignation[]> {
    try {
      const allDesignations = await this.getAll<IDesignation, Designation>(
        designationCollection.transformCollection,
      );
      return allDesignations;
    } catch (error) {
      throw error;
    }
  }

  public async getDesignation(designationId: string): Promise<IDesignation> {
    try {
      const Designation = await this.get<IDesignation, Designation>(
        designationId,
        designationResource.transform,
      );
      return Designation;
    } catch (error) {
      throw error;
    }
  }

  public async createDesignation(data: Partial<DesignationDto>): Promise<IDesignation> {
    try {
      const newDesignation = await this.create<IDesignation, Designation>(
        {
          name: data.name,
        },
        designationResource.transform,
      );
      return newDesignation;
    } catch (error) {
      throw error;
    }
  }

  public async deleteDesignation(designationId: string): Promise<IDesignation> {
    try {
      const deletedDesignation = await this.delete<IDesignation>(
        designationId,
        designationResource.transform,
      );
      return deletedDesignation;
    } catch (error) {
      throw error;
    }
  }

  public async updateDesignation(
    designationId: string,
    payload: Partial<UpdateDesignationDto>,
  ): Promise<IDesignation> {
    try {
      const { name } = payload;
      const updatedDesignation = await this.update<IDesignation, Designation>(
        designationId,
        {
          ...(name ? { name } : {}),
        },
        designationResource.transform,
      );
      return updatedDesignation;
    } catch (error) {
      throw error;
    }
  }
}
