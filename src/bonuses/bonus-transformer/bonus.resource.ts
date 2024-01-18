import { BONUS_TYPE, PAYROLL_TYPE, PrismaPayrollModel } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';
import { Payroll } from '@prisma/client';

import employeeResource from '../../employee-info/employee-transformer/employee.resource';
import { IBonus, PrismaBonusModel } from '../bonus.type';
import dayjs from 'dayjs';
class BonusResource implements Transformer {
  transform(bonus: PrismaBonusModel): IBonus {
    return {
      id: bonus.id,
      bonus: bonus.bonus,
      status: bonus.status as BONUS_TYPE,
      date: dayjs(bonus.date).toISOString(),
      employee_id: bonus.employee_id,
      employee_info: bonus?.employee_info
        ? employeeResource.transform(bonus.employee_info)
        : null,
      reason: bonus.reason,
    };
  }
}
const bonusResource = new BonusResource();
export default bonusResource;
