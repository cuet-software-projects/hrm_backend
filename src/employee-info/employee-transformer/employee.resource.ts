import dayjs from 'dayjs';
import { IEmployee, PrismaEmployeeInfoModel } from '../employee.type';
import branchResource from '../../branches/branch-transformer/branch.resource';
import designationResource from '../../designations/designation-transformer/designation.resource';
import teamCollection from '../../teams/team-transformer/team.collection';
import { Transformer } from '../../core/transformer/transformer';
import userResource from '../../users/user-transformer/user.resource';
import departmentResource from '../../departments/department-transformer/department.resource';

class EmployeeResource implements Transformer {
  transform(employee: PrismaEmployeeInfoModel): IEmployee {
    return {
      id: employee.id,
      user_id: employee.user_id,
      employee_id: employee.employee_id,
      department_id: employee.department_id,
      branch_id: employee.branch_id,
      teams: employee.teams ? teamCollection.transformCollection(employee.teams) : null,
      branch: employee.branch ? branchResource.transform(employee.branch) : null,
      user: employee.user ? userResource.transform(employee.user) : null,
      joined_at: dayjs(employee.joined_at).toString(),
      left_at: employee.left_at ? dayjs(employee.left_at).toString() : null,
      isCurrent: employee.isCurrent,
      reporting_officer_id: employee.reporting_officer_id,
      reporting_officer: employee.reporting_officer
        ? userResource.transform(employee.reporting_officer)
        : null,
      created_at: dayjs(employee.created_at).toString(),
      work_type: employee.work_type,
      current_designation_id: employee.current_designation_id || null,
      current_salary: employee.current_salary || 0,
      current_employee_designation: employee.current_employee_designation
        ? designationResource.transform(employee.current_employee_designation)
        : null,
      department: employee.department
        ? departmentResource.transform(employee.department)
        : null,
    };
  }
}

const employeeResource = new EmployeeResource();

export default employeeResource;
