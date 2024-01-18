import { Response, Request, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import {
  ILeave,
  LeaveApprovalDto,
  LeaveDto,
  PaginateResponse,
  UpdateLeaveDto,
} from '../core/types';
import LeaveService from './leave.service';
import apiResponse from '../core/services/apiResponse.service';
export default class LeaveController {
  constructor(protected readonly leaveService: LeaveService) {}
  public createLeave = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body as LeaveDto;
      const employeeInfoId = req.params.employeeInfoId;

      const newLeave: ILeave = await this.leaveService.createLeave(
        employeeInfoId,
        payload,
      );
      apiResponse.sendSuccess({ res: res, data: newLeave, code: 201 });
    },
  );
  public updateLeave = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body as UpdateLeaveDto;
      const leaveId = req.params.leaveId;

      const updatedLeave: ILeave = await this.leaveService.updateLeave(leaveId, payload);
      apiResponse.sendSuccess({ res: res, data: updatedLeave, code: 204 });
    },
  );
  public leaveApproval = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body as LeaveApprovalDto;
      const approverEmployeeId = req.params.approverEmployeeId;
      const leaveId = req.params.leaveId;

      const leaveApprove = await this.leaveService.leaveApproval(
        approverEmployeeId,
        leaveId,
        payload,
      );
      apiResponse.sendSuccess({ res: res, data: leaveApprove, code: 204 });
    },
  );
  // Get All Leaves of an employee
  public getAlLeaveOfEmployee = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const employeeInfoId = req.params.employeeInfoId;

      const getAllLeave = await this.leaveService.getAllLeavesOfEmployee(employeeInfoId);
      apiResponse.sendSuccess({ res: res, data: getAllLeave, code: 201 });
    },
  );

  public getLeaveDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const leaveId = req.params.leaveId;

      const leaveDetails = await this.leaveService.getLeaveDetails(leaveId);
      apiResponse.sendSuccess({ res: res, data: leaveDetails, code: 201 });
    },
  );

  // Get All Leaves of an employee with pagination
  public getLeavesOfEmployee = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const employeeInfoId = req.params.employeeInfoId;
      const { page = 1, limit = 10 } = req.query;

      const { data, meta }: PaginateResponse<ILeave> =
        await this.leaveService.getLeavesOfemployee(employeeInfoId, {
          page: Number(page),
          limit: Number(limit),
        });
      apiResponse.sendSuccess({ res: res, data, meta });
    },
  );

  // Get paginated leaves of all employee
  public getLeaves = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, sorts, search } = req.query;

    const { data, meta }: PaginateResponse<ILeave> = await this.leaveService.getLeaves({
      page: Number(page ?? 1),
      limit: Number(limit ?? 10),
      filters: filters as Record<string, any>,
      includes: includes as string,
      sorts: sorts as string,
      search: search as string,
    });
    apiResponse.sendSuccess({ res: res, data, meta });
  });

  public leaveOverviewOfEmployee = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const employeeInfoId = req.params.employeeInfoId;

      const leaveOverview = await this.leaveService.leavesOverview(employeeInfoId);
      apiResponse.sendSuccess({ res: res, data: leaveOverview, code: 201 });
    },
  );

  // Get the employees in leave today
  public getEmployeesInLeave = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 5 } = req.query;
    const date = req.params.date;
    const { data, meta }: PaginateResponse<ILeave> =
      await this.leaveService.getEmployeesInLeave({
        page: Number(page),
        limit: Number(limit),
        date: date,
      });
    apiResponse.sendSuccess({ res: res, data, meta });
  });
}
