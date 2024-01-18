import { IAttendance, PrismaAttendanceModel } from '../../core/types';
import {
  IEmployeeDesignationSalary,
  PrismaEmployeeDesignationSalaryModel,
} from '../../employee-info/employee.type';
import { CollectionTransformer } from '../../core/transformer/transformer';
import employeeDesignationSalaryResource from './employee-designaiton-salary.resource';

class EmployeeDesignationCollection implements CollectionTransformer {
  transformCollection(
    requestedData: PrismaEmployeeDesignationSalaryModel[],
  ): IEmployeeDesignationSalary[] {
    return requestedData.map((data) => employeeDesignationSalaryResource.transform(data));
  }
}

const employeeDesignationCollection = new EmployeeDesignationCollection();

export default employeeDesignationCollection;
