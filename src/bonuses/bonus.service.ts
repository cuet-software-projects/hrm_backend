import BonusRepository from './bonus.repository';
import { PaginateResponse, PaginationQueryParams } from '../core/types';
import { BonusDto, IBonus, UpdateBonusDto } from './bonus.type';
import EmployeeService from '../employee-info/employee.service';

export default class BonusService {
  constructor(
    protected readonly bonusRepo: BonusRepository,
    protected readonly employeeService: EmployeeService,
  ) {}
  public async getAllBonuses({
    params,
  }: {
    params: PaginationQueryParams;
  }): Promise<PaginateResponse<IBonus>> {
    try {
      const allBonus = await this.bonusRepo.getAllBonuses({
        ...params,
      });
      return allBonus;
    } catch (error) {
      throw error;
    }
  }
  public async getBonusesOfEmployee(
    employeeInfoId: string,
    {
      params,
    }: {
      params: PaginationQueryParams;
    },
  ): Promise<PaginateResponse<IBonus>> {
    try {
      const allBonus = await this.bonusRepo.getBonusesOfEmployee(employeeInfoId, {
        ...params,
      });
      return allBonus;
    } catch (error) {
      throw error;
    }
  }
  public async createBonus(employeeInfoId: string, data: BonusDto): Promise<IBonus> {
    try {
      const newBonus = await this.bonusRepo.createBonus(employeeInfoId, data);
      return newBonus;
    } catch (error) {
      throw error;
    }
  }
  public async updateBonus(bonusId: string, data: UpdateBonusDto): Promise<IBonus> {
    try {
      const updatedBonus = await this.bonusRepo.updateBonus(bonusId, data);
      if (data.status === 'SENT') {
        const bonus = await this.bonusRepo.getBonus(bonusId);
        await this.employeeService.sentNotification({
          employeeInfoId: bonus.employee_id,
          callBackFunctionName: 'sendBonusHasDispatched',
        });
      }
      return updatedBonus;
    } catch (error) {
      throw error;
    }
  }
}
