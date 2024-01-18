import { Branch } from '@prisma/client';
import { IBranch } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';

class BranchResource implements Transformer {
  transform(branch: Branch): IBranch {
    return {
      id: branch?.id,
      name: branch?.name,
      address: branch?.address,
      code: branch?.code,
    };
  }
}

const branchResource = new BranchResource();

export default branchResource;
