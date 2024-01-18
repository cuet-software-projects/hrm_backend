import { Department } from '@prisma/client';
import { IDepartment } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';

class DepartmentResource implements Transformer {
  transform(department: Department): IDepartment {
    return {
      id: department.id,
      name: department.name,
      description: department.description,
      code: department.code,
      prefix_code: department.prefix_code,
    };
  }
}

const departmentResource = new DepartmentResource();

export default departmentResource;
