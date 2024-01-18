import { Router } from 'express';
import DepartmentController from './departmnet.controller';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { departmentQueryParams } from '../queryparams';
import {
  CreateDepartmentSchema,
  DepartmentIdSchema,
  DepartmentUpdateSchema,
} from './department.schema';
import { departmentService } from '../core/dependecies';
const departmentRouter = Router();

const departmentController = new DepartmentController(departmentService);
// Get all departments
departmentRouter.get('/departments/all', departmentController.getAllDepartments);

// Get  departments paginated
departmentRouter.get(
  '/departments',
  validateQueryParams(departmentQueryParams),
  departmentController.getDepartments,
);

// Get a department
departmentRouter.get(
  '/departments/:departmentId',
  validate(DepartmentIdSchema),
  ValidateIdMiddleware.validateParamsId,
  departmentController.getDepartment,
);

// Create a department
departmentRouter.post(
  '/department',
  validate(CreateDepartmentSchema),
  departmentController.createDepartment,
);

// Delete a department
departmentRouter.delete(
  '/departments/:departmentId',
  validate(DepartmentIdSchema),
  ValidateIdMiddleware.validateParamsId,
  departmentController.deleteDepartment,
);

// Update a department
departmentRouter.patch(
  '/departments/:departmentId',
  validate(DepartmentUpdateSchema),
  ValidateIdMiddleware.validateParamsId,
  departmentController.updateDepartment,
);

export default departmentRouter;
