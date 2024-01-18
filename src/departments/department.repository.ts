import { Department } from '@prisma/client';
import { DbType, db } from '../db.server';
import BaseRepository from '../core/repository/base.repository';
import {
  DepartmentDto,
  IDepartment,
  PaginateResponse,
  PaginationQueryParams,
  UpdateDepartmentDto,
} from '../core/types';
import departmentCollection from './department-transformer/department.collection';
import departmentResource from './department-transformer/department.resource';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';

export default class DepartmentRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Department');
  }

  public async getDepartments({
    page = 1,
    limit = 10,
    filters,
    sorts,
    includes,
  }: PaginationQueryParams): Promise<PaginateResponse<IDepartment>> {
    try {
      const data = await this.paginate<IDepartment, Department>({
        page: page,
        pageSize: limit,
        transformCollection: departmentCollection.transformCollection,
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

  public async getAllDepartments(): Promise<IDepartment[]> {
    try {
      const allDepartments = await this.getAll<IDepartment, Department>(
        departmentCollection.transformCollection,
      );
      return allDepartments;
    } catch (error) {
      throw error;
    }
  }

  public async getDepartment(departmentId: string): Promise<IDepartment> {
    try {
      const department = await this.get<IDepartment, Department>(
        departmentId,
        departmentResource.transform,
      );
      return department;
    } catch (error) {
      throw error;
    }
  }

  public async createDepartment(data: Partial<DepartmentDto>): Promise<IDepartment> {
    try {
      const newDepartment = await this.create<IDepartment, Department>(
        {
          name: data.name,
          description: data.description,
          code: data.code,
          prefix_code: data.prefix_code,
        },
        departmentResource.transform,
      );
      return newDepartment;
    } catch (error) {
      throw error;
    }
  }

  public async deleteDepartment(departmentId: string): Promise<IDepartment> {
    try {
      const deletedDepartment = await this.delete<IDepartment>(
        departmentId,
        departmentResource.transform,
      );
      return deletedDepartment;
    } catch (error) {
      throw error;
    }
  }

  public async updateDepartment(
    departmentId: string,
    payload: Partial<UpdateDepartmentDto>,
  ): Promise<IDepartment> {
    try {
      const { name, description, code, prefix_code } = payload;
      const updatedDepartment = await this.update<IDepartment, Department>(
        departmentId,
        {
          ...(name ? { name } : {}),
          ...(description ? { description } : {}),
          ...(code ? { code } : {}),
          ...(prefix_code ? { prefix_code } : {}),
        },
        departmentResource.transform,
      );
      return updatedDepartment;
    } catch (error) {
      throw error;
    }
  }
}
