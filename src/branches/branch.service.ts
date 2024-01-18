import BranchRepository from './branch.repository';
import {
  BranchDto,
  IBranch,
  PaginateResponse,
  PaginationQueryParams,
  UpdateBranchDto,
} from '../core/types';

export default class BranchService {
  constructor(protected readonly branchRepo: BranchRepository) {}

  public async getBranches(
    params: PaginationQueryParams,
  ): Promise<PaginateResponse<IBranch>> {
    try {
      const allBranches = await this.branchRepo.getBranches({ ...params });
      return allBranches;
    } catch (error) {
      throw error;
    }
  }

  public async getAllBranches(): Promise<IBranch[]> {
    try {
      const allBranches = await this.branchRepo.getAllBranches();
      return allBranches;
    } catch (error) {
      throw error;
    }
  }

  public async getBranch(branchId: string): Promise<IBranch> {
    try {
      const Branch = await this.branchRepo.getBranch(branchId);
      return Branch;
    } catch (error) {
      throw error;
    }
  }

  public async createBranch(data: BranchDto): Promise<IBranch> {
    try {
      const newBranch = await this.branchRepo.createBranch(data);
      return newBranch;
    } catch (error) {
      throw error;
    }
  }

  public async deleteBranch(branchId: string): Promise<IBranch> {
    try {
      const deletedBranch = await this.branchRepo.deleteBranch(branchId);
      return deletedBranch;
    } catch (error) {
      throw error;
    }
  }

  public async updateBranch(
    branchId: string,
    payload: Partial<UpdateBranchDto>,
  ): Promise<IBranch> {
    try {
      const updatedBranch = await this.branchRepo.updateBranch(branchId, payload);
      return updatedBranch;
    } catch (error) {
      throw error;
    }
  }
}
