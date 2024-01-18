import { Router } from 'express';
import DesignationController from './designation.controller';
import {
  CreateDesignationSchema,
  UpdateDesignationSchema,
  DesignationIdSchema,
} from './designation.schema';
import validate from '../core/middlewares/validate';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { designationQueryParams } from '../queryparams';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import DesignationService from './designation.service';
import DesignationRepository from './designation.repository';
import { designationService } from '../core/dependecies';
const designationRouter = Router();

const designationController = new DesignationController(designationService);

// Get all designations
designationRouter.get('/designations/all', designationController.getAllDesignations);

// Get  designations paginated
designationRouter.get(
  '/designations',
  validateQueryParams(designationQueryParams),
  designationController.getDesignations,
);

// Get a designation
designationRouter.get(
  '/designations/:designationId',
  validate(DesignationIdSchema),
  ValidateIdMiddleware.validateParamsId,
  designationController.getDesignation,
);

// Create a designation
designationRouter.post(
  '/designation',
  validate(CreateDesignationSchema),
  designationController.createDesignation,
);

// Delete a designation
designationRouter.delete(
  '/designations/:designationId',
  validate(DesignationIdSchema),
  ValidateIdMiddleware.validateParamsId,
  designationController.deleteDesignation,
);

// Update a designation
designationRouter.patch(
  '/designations/:designationId',
  validate(UpdateDesignationSchema),
  ValidateIdMiddleware.validateParamsId,
  designationController.updateDesignation,
);

export default designationRouter;
