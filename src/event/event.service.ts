import EmployeeRepository from '../employee-info/employee.repository';
import UserRepository from '../users/user.repository';
import { IUser } from '../core/types';

export default class EventService {
  constructor(protected readonly userRepo: UserRepository) {}

  public async getTodaysEvent(date: string): Promise<{
    birthday: IUser[];
    anniversary?: IUser[];
  }> {
    const todaysBirthday = await this.userRepo.getUsersByBirthday(date);
    return {
      birthday: todaysBirthday,
    };
  }
}
