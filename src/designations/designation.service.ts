import DesignationRepository from './designation.repository';
import {
  DesignationDto,
  IDesignation,
  PaginateResponse,
  PaginationQueryParams,
  UpdateDesignationDto,
} from '../core/types';

export default class DesignationService {
  constructor(protected readonly designationRepo: DesignationRepository) {}
  public async getDesignations(
    params: PaginationQueryParams,
  ): Promise<PaginateResponse<IDesignation>> {
    try {
      const allDesignations = await this.designationRepo.getDesignations({ ...params });
      return allDesignations;
    } catch (error) {
      throw error;
    }
  }

  public async getAllDesignations(): Promise<IDesignation[]> {
    try {
      const allDesignations = await this.designationRepo.getAllDesignations();
      return allDesignations;
    } catch (error) {
      throw error;
    }
  }

  public async getDesignation(designationId: string): Promise<IDesignation> {
    try {
      const designation = await this.designationRepo.getDesignation(designationId);
      return designation;
    } catch (error) {
      throw error;
    }
  }

  public async createDesignation(data: Partial<DesignationDto>): Promise<IDesignation> {
    try {
      const newDesignation = await this.designationRepo.createDesignation(data);
      return newDesignation;
    } catch (error) {
      throw error;
    }
  }

  public async deleteDesignation(designationId: string): Promise<IDesignation> {
    try {
      const deletedDesignation =
        await this.designationRepo.deleteDesignation(designationId);
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
      const updatedDesignation = await this.designationRepo.updateDesignation(
        designationId,
        payload,
      );
      return updatedDesignation;
    } catch (error) {
      throw error;
    }
  }
}
