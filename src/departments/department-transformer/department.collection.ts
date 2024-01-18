import { Department } from '@prisma/client';
import { CollectionTransformer } from '../../core/transformer/transformer';
import departmentResource from './department.resource';
import { IDepartment } from '../../core/types';

class DepartmentCollection implements CollectionTransformer {
  transformCollection(requestedData: Department[]): IDepartment[] {
    return requestedData.map((department) => departmentResource.transform(department));
  }
}

const departmentCollection = new DepartmentCollection();

export default departmentCollection;
