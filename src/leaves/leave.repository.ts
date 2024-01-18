import { db, DbType } from '../db.server';
import leaveCollection from './leave-transformer/leave.collection';
import leaveResource from './leave-transformer/leave.resource';
import {
  LEAVE_TYPE_VALUES,
  PaginateResponse,
  PaginationQueryParams,
} from '../core/types';
import {
  ILeave,
  LeaveApprovalDto,
  LeaveDto,
  PrismaLeaveModel,
  UpdateLeaveDto,
} from './leave.type';
import BaseRepository from '../core/repository/base.repository';
import { Leave } from '@prisma/client';
import dayjs from 'dayjs';
import { buildIncludesObject, buildSortObject, buildWhereObject } from '../utils/utils';
export default class LeaveRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Leave');
  }

  public async leavesOverview(employeeInfoId: string) {
    try {
      const currentYear = dayjs().year();
      const startDate = dayjs().year(currentYear).month(5).date(1).toDate();
      const endDate = dayjs()
        .year(currentYear + 1)
        .month(4)
        .date(30)
        .toDate();

      const leaves = await db.leave.findMany({
        where: {
          employee_id: employeeInfoId,
          leave_status: 'APPROVED',
          created_at: { gte: startDate, lte: endDate },
        },
      });

      const leavesOverview = LEAVE_TYPE_VALUES.reduce((overview, leaveType) => {
        overview[leaveType] = 0;
        return overview;
      }, {});

      leaves.forEach((leave) => {
        const totalDays = dayjs(leave.ended_at).diff(dayjs(leave.started_at), 'day');
        leavesOverview[leave.leave_type] += totalDays + 1;
      });

      return leavesOverview;
    } catch (error) {
      throw error;
    }
  }

  public async getLeaveDetails(leaveId: string): Promise<ILeave> {
    try {
      return await this.get<ILeave, PrismaLeaveModel>(leaveId, leaveResource.transform, {
        includes: {
          employee_info: {
            include: {
              user: true,
            },
          },
          action_taken_by: {
            include: {
              user: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  public async getLeave(leaveId: string): Promise<ILeave> {
    try {
      return await this.get<ILeave, PrismaLeaveModel>(leaveId, leaveResource.transform);
    } catch (error) {
      throw error;
    }
  }

  public async createLeave(employeeInfoId: string, data: LeaveDto): Promise<ILeave> {
    try {
      const newLeave = await this.create<ILeave, Leave>(
        {
          employee_id: employeeInfoId,
          started_at: dayjs(data.started_at).toDate(),
          ended_at: dayjs(data.ended_at).toDate(),
          leave_type: data.leave_type,
          description: data.description,
        },
        leaveResource.transform,
      );
      return newLeave;
    } catch (error) {
      throw error;
    }
  }
  public async updateLeave(leaveId: string, data: UpdateLeaveDto): Promise<ILeave> {
    try {
      const updatedLeave = await db.leave.update({
        where: {
          id: leaveId,
        },
        data: {
          ...(data.started_at && { started_at: dayjs(data.started_at).toDate() }),
          ...(data.description && { description: data.description }),
          ...(data.ended_at && { ended_at: dayjs(data.ended_at).toDate() }),
          ...(data.leave_type && { leave_type: data.leave_type }),
        },
      });
      return updatedLeave;
    } catch (error) {
      throw error;
    }
  }
  public async leaveApproval(
    approverEmployeeId: string,
    leaveId: string,
    data: LeaveApprovalDto,
  ): Promise<ILeave> {
    try {
      const { leave_status } = data;
      const leaveApprove = await db.leave.update({
        where: {
          id: leaveId,
        },
        data: {
          leave_status: leave_status,
          action_taken_by_id: approverEmployeeId,
        },
      });
      return leaveApprove;
    } catch (error) {
      throw error;
    }
  }
  // Get All Leaves of an employee
  public async getAlleavesOfEmployee(employeeInfoId: string): Promise<ILeave[]> {
    try {
      const getAlLeaves = await db.leave.findMany({
        where: {
          employee_id: employeeInfoId,
        },
        orderBy: [
          {
            created_at: 'desc',
          },
        ],
      });
      return leaveCollection.transformCollection(getAlLeaves);
    } catch (error) {
      throw error;
    }
  }
  // Get Leaves of an employee with pagination
  public async getLeavesOfemployee(
    employeeInfoId: string,
    {
      page,
      limit,
    }: {
      limit: number;
      page: number;
    },
  ): Promise<PaginateResponse<ILeave>> {
    try {
      const leaves = await this.paginate<ILeave, Leave>({
        page: page,
        pageSize: limit,
        transformCollection: leaveCollection.transformCollection,
        options: {
          where: {
            employee_id: employeeInfoId,
          },
          includes: {
            employee_info: {
              include: {
                user: true,
              },
            },
            action_taken_by: {
              include: {
                user: true,
              },
            },
          },
          orderBy: [
            {
              created_at: 'desc',
            },
          ],
        },
      });
      return leaves;
    } catch (error) {
      throw error;
    }
  }
  // Get paginated leaves of all employees
  public async getLeaves({
    page,
    limit,
    filters,
    includes,
    search,
    sorts,
  }: PaginationQueryParams): Promise<PaginateResponse<ILeave>> {
    try {
      const leaves = await this.paginate<ILeave, Leave>({
        page: page,
        pageSize: limit,
        transformCollection: leaveCollection.transformCollection,
        options: {
          where: buildWhereObject(filters),
          includes: buildIncludesObject(includes?.split(',') ?? []),
          orderBy: buildSortObject(sorts),
        },
      });
      return leaves;
    } catch (error) {
      throw error;
    }
  }
  // Get the employees in leave today
  public async getEmployeesInLeave({
    page,
    limit,
    date,
  }: PaginationQueryParams & { date: string }): Promise<PaginateResponse<ILeave>> {
    try {
      const employeesInLeave = await this.paginate<ILeave, Leave>({
        page: page,
        pageSize: limit,
        transformCollection: leaveCollection.transformCollection,
        options: {
          includes: {
            employee_info: {
              include: {
                user: true,
              },
            },
          },
          where: {
            leave_status: 'APPROVED',
            started_at: {
              lte: dayjs(date).toDate().toISOString(),
            },
            ended_at: {
              gte: dayjs(date).toDate().toISOString(),
            },
          },
          orderBy: [
            {
              created_at: 'desc',
            },
          ],
        },
      });
      return employeesInLeave;
    } catch (error) {
      throw error;
    }
  }
}
