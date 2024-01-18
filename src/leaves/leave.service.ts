import LeaveRepository from './leave.repository';
import {
  ILeave,
  LeaveApprovalDto,
  LeaveDto,
  PaginateResponse,
  PaginationQueryParams,
  UpdateLeaveDto,
} from '../core/types';
import EmployeeService from '../employee-info/employee.service';

export default class LeaveService {
  constructor(
    protected readonly leaveRepo: LeaveRepository,
    protected readonly employeeService: EmployeeService,
  ) {}

  public async createLeave(employeeInfoId: string, data: LeaveDto): Promise<ILeave> {
    try {
      const newLeave = this.leaveRepo.createLeave(employeeInfoId, data);
      return newLeave;
    } catch (error) {
      throw error;
    }
  }

  public async leavesOverview(employeeInfoId: string) {
    const leavesOverview = await this.leaveRepo.leavesOverview(employeeInfoId);
    return leavesOverview;
  }

  public async getLeaveDetails(leaveId: string): Promise<ILeave> {
    return await this.leaveRepo.getLeaveDetails(leaveId);
  }

  public async updateLeave(leaveId: string, data: UpdateLeaveDto): Promise<ILeave> {
    try {
      const updatedLeave = await this.leaveRepo.updateLeave(leaveId, data);
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
      const leaveApprove = await this.leaveRepo.leaveApproval(
        approverEmployeeId,
        leaveId,
        data,
      );
      const leave = await this.leaveRepo.getLeave(leaveId);
      this.employeeService.sentNotification({
        employeeInfoId: leave.employee_id,
        callBackFunctionName:
          data.leave_status === 'APPROVED' ? 'sendLeaveApproved' : 'sendLeaveRejected',
      });

      return leaveApprove;
    } catch (error) {
      throw error;
    }
  }
  // Get All Leaves of an employee
  public async getAllLeavesOfEmployee(employeeInfoId: string): Promise<ILeave[]> {
    try {
      const getAllLeave = await this.leaveRepo.getAlleavesOfEmployee(employeeInfoId);
      return getAllLeave;
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
      const getAllLeaves = this.leaveRepo.getLeavesOfemployee(employeeInfoId, {
        page,
        limit,
      });
      return getAllLeaves;
    } catch (error) {
      throw error;
    }
  }

  // Get paginated leaves of all users
  public async getLeaves(
    params: PaginationQueryParams,
  ): Promise<PaginateResponse<ILeave>> {
    try {
      const allLeaves = await this.leaveRepo.getLeaves({ ...params });
      return allLeaves;
    } catch (error) {
      throw error;
    }
  }

  // Get the employees in leave today
  public async getEmployeesInLeave({
    page = 1,
    limit = 5,
    date,
  }: PaginationQueryParams & { date: string }): Promise<PaginateResponse<ILeave>> {
    try {
      const employeesInleave = await this.leaveRepo.getEmployeesInLeave({
        page,
        limit,
        date,
      });
      return employeesInleave;
    } catch (error) {
      throw error;
    }
  }
}
