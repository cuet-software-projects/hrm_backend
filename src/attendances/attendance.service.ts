import {
  AttendanceDto,
  IAttendance,
  UpdateAttendanceDto,
  PaginateResponse,
  PaginationQueryParams,
  UpdateAttendanceMarkingsDto,
  AttendanceOverviewType,
} from '../core/types';
import AttendanceRepository from './attendance.repository';
export default class AttendanceService {
  constructor(protected readonly attendanceRepo: AttendanceRepository) {}

  public async getAttendances({
    params,
  }: {
    params: PaginationQueryParams;
  }): Promise<PaginateResponse<IAttendance>> {
    try {
      const allAttendances = await this.attendanceRepo.getAttendances({ ...params });
      return allAttendances;
    } catch (error) {
      throw error;
    }
  }

  public async getEmployeeAttendances({
    params,
    employeeInfoId,
  }: {
    params: PaginationQueryParams;
    employeeInfoId: string;
  }): Promise<PaginateResponse<IAttendance>> {
    return await this.attendanceRepo.getEmployeeAttendances({
      params,
      employeeInfoId: employeeInfoId,
    });
  }

  public async getAllAttendances(): Promise<IAttendance[]> {
    try {
      const allAttendances = await this.attendanceRepo.getAllAttendances();
      return allAttendances;
    } catch (error) {
      throw error;
    }
  }

  public async getAttendance(attendance_id: string): Promise<IAttendance> {
    try {
      const Attendance = await this.attendanceRepo.getAttendance(attendance_id);
      return Attendance;
    } catch (error) {
      throw error;
    }
  }

  public async createAttendance(data: Partial<AttendanceDto>): Promise<IAttendance> {
    try {
      const newAttendance = await this.attendanceRepo.createAttendance(data);
      return newAttendance;
    } catch (error) {
      throw error;
    }
  }

  public async deleteAttendance(attendance_id: string): Promise<IAttendance> {
    try {
      const deletedAttendance = await this.attendanceRepo.deleteAttendance(attendance_id);
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
      const updatedAttendance = await this.attendanceRepo.updateAttendance(
        attendance_id,
        payload,
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
      const updatedAttendance = await this.attendanceRepo.updateMarkings(
        attendance_id,
        payload,
      );
      return updatedAttendance;
    } catch (error) {
      throw error;
    }
  }

  // This is to get the attendance overview on the desired date
  public async getAttendanceOverview(date: string): Promise<AttendanceOverviewType> {
    try {
      const attendanceOverview = await this.attendanceRepo.getAttendanceOverview(date);
      return attendanceOverview;
    } catch (error) {
      throw error;
    }
  }
}
