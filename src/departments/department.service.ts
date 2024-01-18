import DepartmentRepository from './department.repository';
import {
  DepartmentDto,
  IDepartment,
  PaginateResponse,
  PaginationQueryParams,
  UpdateDepartmentDto,
} from '../core/types';

export default class DepartmentService {
  constructor(protected readonly departmentRepo: DepartmentRepository) {}
  public async getDepartments(
    params: PaginationQueryParams,
  ): Promise<PaginateResponse<IDepartment>> {
    try {
      const allDepartments = await this.departmentRepo.getDepartments({ ...params });
      return allDepartments;
    } catch (error) {
      throw error;
    }
  }

  public async getAllDepartments(): Promise<IDepartment[]> {
    try {
      const allDepartments = await this.departmentRepo.getAllDepartments();
      return allDepartments;
    } catch (error) {
      throw error;
    }
  }

  public async getDepartment(departmentId: string): Promise<IDepartment> {
    try {
      const department = await this.departmentRepo.getDepartment(departmentId);
      return department;
    } catch (error) {
      throw error;
    }
  }

  public async createDepartment(data: Partial<DepartmentDto>): Promise<IDepartment> {
    try {
      const newDepartment = await this.departmentRepo.createDepartment(data);
      return newDepartment;
    } catch (error) {
      throw error;
    }
  }

  public async deleteDepartment(departmentId: string): Promise<IDepartment> {
    try {
      const deletedDepartment = await this.departmentRepo.deleteDepartment(departmentId);
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
      const updatedDepartment = await this.departmentRepo.updateDepartment(
        departmentId,
        payload,
      );
      return updatedDepartment;
    } catch (error) {
      throw error;
    }
  }
}
