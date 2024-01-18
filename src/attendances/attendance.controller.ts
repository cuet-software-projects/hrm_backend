import {
  IAttendance,
  PaginateResponse,
  Request,
  AttendanceDto,
  UpdateAttendanceDto,
  UpdateAttendanceMarkingsDto,
} from '../core/types';
import { Response } from 'express';
import catchAsync from '../utils/catchAsync';
import apiResponse from '../core/services/apiResponse.service';
import AttendanceService from './attendance.service';

export default class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  public createAttendance = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as AttendanceDto;
    const newAttendance = await this.attendanceService.createAttendance(payload);
    apiResponse.sendSuccess({ res: res, data: newAttendance, code: 201 });
  });

  public getAttendances = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, sorts, search } = req.query;
    const response: PaginateResponse<IAttendance> =
      await this.attendanceService.getAttendances({
        params: {
          page: Number(page ?? 1),
          limit: Number(limit ?? 10),
          filters: filters as Record<string, any>,
          includes: includes as string,
          sorts: sorts as string,
          search: search as string,
        },
      });
    apiResponse.sendSuccess({ res: res, data: response.data, meta: response.meta });
  });

  public getAllAttendances = catchAsync(async (req: Request, res: Response) => {
    const Attendances: IAttendance[] = await this.attendanceService.getAllAttendances();
    apiResponse.sendSuccess({ res: res, data: Attendances });
  });

  public getEmployeeAttendances = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, sorts, filters, includes } = req.query;
    const { employeeInfoId } = req.params;
    const employeeAttendances: PaginateResponse<IAttendance> =
      await this.attendanceService.getEmployeeAttendances({
        employeeInfoId: employeeInfoId,
        params: {
          page: Number(page ?? 1),
          limit: Number(limit ?? 10),
          sorts: sorts as string,
          filters: filters as object,
          includes: includes as string,
        },
      });
    apiResponse.sendSuccess({
      res: res,
      data: employeeAttendances.data,
      meta: employeeAttendances.meta,
    });
  });

  public getAttendance = catchAsync(async (req: Request, res: Response) => {
    const { attendance_id } = req.params;
    const attendance: IAttendance =
      await this.attendanceService.getAttendance(attendance_id);
    apiResponse.sendSuccess({ res: res, data: attendance });
  });

  public updateAttendance = catchAsync(async (req: Request, res: Response) => {
    const attendance_id = req.params.attendance_id;
    const payload = req.body as UpdateAttendanceDto;
    const updatedAttendance: IAttendance = await this.attendanceService.updateAttendance(
      attendance_id,
      payload,
    );
    apiResponse.sendSuccess({ res, data: updatedAttendance, code: 204 });
  });

  public updateMarkings = catchAsync(async (req: Request, res: Response) => {
    const attendance_id = req.params.attendance_id;
    const payload = req.body as UpdateAttendanceMarkingsDto;
    const updatedAttendance: IAttendance = await this.attendanceService.updateMarkings(
      attendance_id,
      payload,
    );
    apiResponse.sendSuccess({ res, data: updatedAttendance, code: 204 });
  });

  // This is to get the attendance overview on the desired date
  public getAttendanceOverview = catchAsync(async (req: Request, res: Response) => {
    const date = req.params.date;
    const attendanceOverview = await this.attendanceService.getAttendanceOverview(date);
    apiResponse.sendSuccess({ res, data: attendanceOverview, code: 200 });
  });
}
