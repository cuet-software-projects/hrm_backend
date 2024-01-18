import { Bonus, Payroll } from '@prisma/client';

import { IEmployee, PrismaEmployeeInfoModel } from '../employee-info/employee.type';
import { BONUS_TYPE } from '../core/types';

export type IBonus = {
  id: string;
  status: BONUS_TYPE;
  date: string;
  bonus: number;
  employee_id: string;
  employee_info?: IEmployee;
  reason: string;
};
export type BonusDto = {
  employee_id?: string;
  status: BONUS_TYPE;
  date: string;
  bonus: number;
  reason: string;
};

export type UpdateBonusDto = Partial<BonusDto>;

export type PrismaBonusModel = Bonus & {
  employee_info?: PrismaEmployeeInfoModel;
};
