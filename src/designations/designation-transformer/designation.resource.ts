import { Designation } from '@prisma/client';
import { IDesignation } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';

class DesignationResource implements Transformer {
  transform(designation: Designation): IDesignation {
    return {
      id: designation.id,
      name: designation.name,
    };
  }
}

const designationResource = new DesignationResource();

export default designationResource;
