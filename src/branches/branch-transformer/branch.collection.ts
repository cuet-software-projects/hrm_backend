import { Branch } from '@prisma/client';
import { CollectionTransformer } from '../../core/transformer/transformer';
import branchResource from './branch.resource';
import { IBranch } from '../../core/types';

class BranchCollection implements CollectionTransformer {
  transformCollection(requestedData: Branch[]): IBranch[] {
    return requestedData.map((branch) => branchResource.transform(branch));
  }
}

const branchCollection = new BranchCollection();

export default branchCollection;
