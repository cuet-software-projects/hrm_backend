import AttendanceRepository from '../attendances/attendance.repository';
import BranchRepository from '../branches/branch.repository';
import DepartmentRepository from '../departments/department.repository';
import EmployeeDesignationSalaryRepository from '../employee-designaiton-salaries/employee-designation-salary.repository';
import EmployeeRepository from './employee.repository';
import UserRepository from '../users/user.repository';
import {
  IAttendance,
  IBranch,
  IDepartment,
  IDesignation,
  PaginateResponse,
  PaginationQueryParams,
} from '../core/types';
import {
  EmployeeDto,
  IEmployee,
  IEmployeeDesignationSalary,
  UpdateEmployeeDto,
} from './employee.type';
import { formatToThreeDigits } from '../utils/utils';
import BaseService from '../core/services/base.service';
import NotificationService from '../core/services/notificaiton-service/notificationService';

export default class EmployeeService extends BaseService {
  constructor(
    protected readonly userRepo: UserRepository,
    protected readonly employeeRepo: EmployeeRepository,
    protected readonly branchRepo: BranchRepository,
    protected readonly attendanceRepo: AttendanceRepository,
    protected readonly departmentRepo: DepartmentRepository,
    protected readonly employeeDesignationSalaryRepo: EmployeeDesignationSalaryRepository,
    protected readonly notificationService: NotificationService,
  ) {
    super();
  }

  public async getAlEmployees(): Promise<IEmployee[]> {
    const allUsers = await this.employeeRepo.getAlEmployees();
    return allUsers;
  }

  public async getEmployeeDetails(employee_info_id: string) {
    const employeeInfo = await this.employeeRepo.getEmployeeDetails(employee_info_id);
    return employeeInfo;
  }

  public async createEmployee(data: EmployeeDto): Promise<IEmployee> {
    return this.runTransaction(async (transaction) => {
      const branch = await this.branchRepo.getBranch(data.branch_id);
      const department = await this.departmentRepo.getDepartment(data.department_id);
      const lastEmployeeNumber =
        await this.employeeRepo.getLastEmployeeNumberByDepartment(data.department_id);

      const employeeId = `${branch.code}-${department.code}-${
        department.prefix_code
      }${formatToThreeDigits(lastEmployeeNumber + 1)}`;

      const newUser = await this.employeeRepo.createNewEmployee(
        data,
        employeeId,
        lastEmployeeNumber + 1,
      );

      await this.userRepo.setCurrentEmployee(data.user_id, newUser.id);

      await this.employeeDesignationSalaryRepo.createDesignationAndSalary({
        employee_id: newUser.id,
        designation_id: data.designation_id,
        salary: data.salary,
        reason: data.reason,
      });
      return newUser;
    });
  }

  public async updateEmployee(
    data: UpdateEmployeeDto,
    employeeInfoId: string,
  ): Promise<IEmployee> {
    const updatedUser = await this.runTransaction(async (transaction) => {
      let branch: IBranch;
      let department: IDepartment;
      let newEmployeeNumber: number | undefined;
      const employee = await this.employeeRepo.getEmployee(employeeInfoId);
      const employeeId = employee.employee_id;
      const employeeIdParts = employeeId.split('-');

      if (data.branch_id && employee.branch_id !== data.branch_id) {
        branch = await this.branchRepo.getBranch(data.branch_id);
        employeeIdParts[0] = branch.code;
      }

      if (data.department_id && employee.department_id !== data.department_id) {
        department = await this.departmentRepo.getDepartment(data.department_id);
        const lastEmployeeNumber =
          await this.employeeRepo.getLastEmployeeNumberByDepartment(data.department_id);

        newEmployeeNumber = lastEmployeeNumber + 1;

        employeeIdParts[1] = department.code;
        employeeIdParts[2] = `${department.prefix_code}${formatToThreeDigits(
          newEmployeeNumber,
        )}`;
      }

      if (data.user_id && employee.user_id !== data.user_id) {
        await this.userRepo.setCurrentEmployee(data.user_id, employeeInfoId);
      }

      const newEmployeeId = employeeIdParts.join('-');

      const updatedUser = await this.employeeRepo.updateEmployee(
        employeeInfoId,
        data,
        newEmployeeId,
        newEmployeeNumber,
      );

      const employeeDesignationSalaryLatestData =
        await this.employeeDesignationSalaryRepo.getLatestDesignationSalaryInfo(
          employee.current_designation_id,
          employee.id,
        );

      if (
        employeeDesignationSalaryLatestData?.salary !== data.salary ||
        employeeDesignationSalaryLatestData?.designation_id !== data.designation_id ||
        employeeDesignationSalaryLatestData?.reason !== data.reason
      ) {
        let updatedSalary = employeeDesignationSalaryLatestData?.salary;
        let updatedDesignation = employeeDesignationSalaryLatestData?.designation_id;
        let updatedReason = employeeDesignationSalaryLatestData?.reason;

        if (data.salary && employeeDesignationSalaryLatestData?.salary !== data.salary) {
          updatedSalary = data.salary;
        }
        if (
          data.designation_id &&
          employeeDesignationSalaryLatestData?.designation_id !== data.designation_id
        ) {
          updatedDesignation = data.designation_id;
        }
        if (data.reason && employeeDesignationSalaryLatestData?.reason !== data.reason) {
          updatedReason = data.reason;
        }

        await this.employeeDesignationSalaryRepo.createDesignationAndSalary({
          employee_id: employee.id,
          designation_id: updatedDesignation,
          salary: updatedSalary,
          reason: updatedReason,
        });
      }

      if (!!data.left_at) {
        await this.userRepo.removeCurrentEmployee(data.user_id);
      }
      return updatedUser;
    });
    return updatedUser;
  }

  public async getEmployeeDesignationSalaries({
    params,
    employeeInfoId,
  }: {
    params: PaginationQueryParams;
    employeeInfoId: string;
  }): Promise<PaginateResponse<IEmployeeDesignationSalary>> {
    return await this.employeeDesignationSalaryRepo.getDesignationSalaryInfos({
      params,
      employeeInfoId: employeeInfoId,
    });
  }

  public async sentNotification({
    employeeInfoId,
    callBackFunctionName,
  }: {
    employeeInfoId: string;
    callBackFunctionName: string;
  }) {
    const employee = await this.employeeRepo.getEmployee(employeeInfoId);
    await this.notificationService.setUser(employee.user_id);
    await this.notificationService?.[callBackFunctionName]?.();
  }
}
