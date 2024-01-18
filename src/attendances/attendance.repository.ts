import { Attendance } from '@prisma/client';
import { DbType, db } from '../db.server';
import BaseRepository from '../core/repository/base.repository';
import {
  AttendanceDto,
  AttendanceOverviewType,
  IAttendance,
  PaginateResponse,
  PaginationQueryParams,
  UpdateAttendanceDto,
  UpdateAttendanceMarkingsDto,
} from '../core/types';
import attendanceCollection from './attendance-transfomer/attendance.collection';
import attendanceResource from './attendance-transfomer/attendance.resource';
import dayjs from 'dayjs';
import {
  buildIncludesObject,
  buildSearchQuery,
  buildSortObject,
  buildWhereObject,
} from '../utils/utils';

export default class AttendanceRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Attendance');
  }

  public async getAttendances({
    page,
    limit,
    sorts,
    filters,
    includes,
    search,
  }: PaginationQueryParams): Promise<PaginateResponse<IAttendance>> {
    const searchQuery = buildSearchQuery(search, [
      'first_name',
      'last_name',
      'email',
      'userName',
      'contact_number',
    ]);

    try {
      const data = await this.paginate<IAttendance, Attendance>({
        page: page,
        pageSize: limit,
        transformCollection: attendanceCollection.transformCollection,
        options: {
          where: {
            ...buildWhereObject(filters, 'entry_time'),
          },
          orderBy: buildSortObject(sorts),
          includes: buildIncludesObject(includes?.split(',') ?? []),
        },
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getAllAttendances(): Promise<IAttendance[]> {
    try {
      const allAttendances = await this.getAll<IAttendance, Attendance>(
        attendanceCollection.transformCollection,
      );
      return allAttendances;
    } catch (error) {
      throw error;
    }
  }

  public async getAttendance(attendance_id: string): Promise<IAttendance> {
    try {
      const Attendance = await this.get<IAttendance, Attendance>(
        attendance_id,
        attendanceResource.transform,
      );
      return Attendance;
    } catch (error) {
      throw error;
    }
  }

  public async createAttendance(data: Partial<AttendanceDto>): Promise<IAttendance> {
    try {
      const newAttendance = await this.create<IAttendance, Attendance>(
        {
          date: dayjs().toDate(),
          employee_id: data.employee_id,
          entry_time: data.entry_time,
          work_type: data.work_type,
          work_plan: data.work_plan,
        },
        attendanceResource.transform,
      );
      return newAttendance;
    } catch (error) {
      throw error;
    }
  }

  public async deleteAttendance(attendance_id: string): Promise<IAttendance> {
    try {
      const deletedAttendance = await this.delete<IAttendance>(
        attendance_id,
        attendanceResource.transform,
      );
      return deletedAttendance;
    } catch (error) {
      throw error;
    }
  }

  public async updateAttendance(
    attendance_id: string,
    payload: Partial<UpdateAttendanceDto>,
  ): Promise<IAttendance> {
    try {
      const {
        entry_time,
        exit_time,
        work_descriptions,
        work_plan,
        work_type,
        break_duration,
        reason_of_break,
      } = payload;

      const updatedAttendance = await this.update<IAttendance, Attendance>(
        attendance_id,
        {
          ...(entry_time && { entry_time }),
          ...(exit_time && { exit_time }),
          ...(work_descriptions && { work_descriptions }),
          ...(work_plan && { work_plan }),
          ...(work_type && { work_type }),
          ...(break_duration && { break_duration }),
          ...(reason_of_break && { reason_of_break }),
        },
        attendanceResource.transform,
      );
      return updatedAttendance;
    } catch (error) {
      throw error;
    }
  }

  public async updateMarkings(
    attendance_id: string,
    payload: UpdateAttendanceMarkingsDto,
  ): Promise<IAttendance> {
    try {
      const { markings } = payload;

      const updatedAttendance = await this.update<IAttendance, Attendance>(
        attendance_id,
        {
          ...(markings && { markings }),
        },
        attendanceResource.transform,
      );
      return updatedAttendance;
    } catch (error) {
      throw error;
    }
  }

  public async getEmployeeAttendances({
    employeeInfoId,
    params,
  }: {
    params: PaginationQueryParams;
    employeeInfoId: string;
  }): Promise<PaginateResponse<IAttendance>> {
    const { page = 1, limit = 10, sorts = 'desc' } = params;
    try {
      const response = await this.paginate<IAttendance, Attendance>({
        page,
        pageSize: limit,
        transformCollection: attendanceCollection.transformCollection,
        options: {
          where: {
            employee_id: employeeInfoId,
          },
          orderBy: buildSortObject(sorts),
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  // This is to get the attendance overview on the desired date
  public async getAttendanceOverview(date: string): Promise<AttendanceOverviewType> {
    try {
      const totalEmployees = await this.db.employee_Info.count({
        where: {
          isCurrent: true,
        },
      });
      const totalEmployeesInLeave = await this.db.leave.groupBy({
        by: ['employee_id'],
        where: {
          leave_status: 'APPROVED',
          started_at: {
            lte: dayjs(date).toDate(),
          },
          ended_at: {
            gte: dayjs(date).toDate(),
          },
        },
        _count: true,
      });
      const totalPresentEmployees = await this.db.attendance.groupBy({
        by: ['employee_id'],
        where: {
          entry_time: {
            gte: dayjs(date).startOf('day').toISOString(),
            lte: dayjs(date).endOf('day').toISOString(),
          },
        },
        _count: true,
      });

      const totalEmployeesWithoutLeave = totalEmployees - totalEmployeesInLeave.length;
      return {
        totalEmployees,
        totalEmployeesInLeave: totalEmployeesInLeave.length,
        totalPresentEmployees: totalPresentEmployees.length,
        totalAbsentEmployees: totalEmployeesWithoutLeave - totalPresentEmployees.length,
      };
    } catch (error) {
      throw error;
    }
  }
}
