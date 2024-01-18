import { Router } from 'express';
import BranchController from './branch.controller';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { branchQueryParams } from '../queryparams';
import { BranchIdSchema, CreateBranchSchemaType } from './branch.schema';
import { branchService } from '../core/dependecies';

const branchRouter = Router();

const branchController = new BranchController(branchService);

// Get all branches
branchRouter.get('/branches/all', branchController.getAllBranches);

// Get branches pagination
branchRouter.get(
  '/branches',
  validateQueryParams(branchQueryParams),
  branchController.getBranches,
);
// Get a Branch
branchRouter.get(
  '/branches/:branchId',
  validate(BranchIdSchema),
  ValidateIdMiddleware.validateParamsId,
  branchController.getBranch,
);

// Create a Branch
branchRouter.post(
  '/branch',
  validate(CreateBranchSchemaType),
  branchController.createBranch,
);

// Delete a Branch
branchRouter.delete(
  '/branches/:branchId',
  validate(BranchIdSchema),
  ValidateIdMiddleware.validateParamsId,
  branchController.deleteBranch,
);

// Update a Branch
branchRouter.patch(
  '/branches/:branchId',
  validate(BranchIdSchema),
  ValidateIdMiddleware.validateParamsId,
  branchController.updateBranch,
);

export default branchRouter;
