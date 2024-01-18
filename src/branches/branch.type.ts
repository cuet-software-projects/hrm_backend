import { BRANCH_CODE_TYPE } from '../core/types';

export type IBranch = {
  id: string;
  name: string;
  code: string;
  address?: string;
};

export type BranchDto = {
  name: string;
  code: string;
  address?: string;
};
export type UpdateBranchDto = Omit<Partial<BranchDto>, 'code'>;
