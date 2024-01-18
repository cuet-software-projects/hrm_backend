import { IEmployee, PrismaEmployeeInfoModel } from '../employee.type';
import { CollectionTransformer } from '../../core/transformer/transformer';
import employeeResource from './employee.resource';

class EmployeeCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaEmployeeInfoModel[]): IEmployee[] {
    return requestedData.map((employee) => employeeResource.transform(employee));
  }
}

const employeeCollection = new EmployeeCollection();

export default employeeCollection;
