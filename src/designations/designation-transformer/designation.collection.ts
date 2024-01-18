import { Designation } from '@prisma/client';
import { IDesignation } from '../../core/types';
import { CollectionTransformer } from '../../core/transformer/transformer';
import designationResource from './designation.resource';

class DesignationCollection implements CollectionTransformer {
  transformCollection(requestedData: Designation[]): IDesignation[] {
    return requestedData.map((Designation) => designationResource.transform(Designation));
  }
}

const designationCollection = new DesignationCollection();

export default designationCollection;
