import { Router } from 'express';
import RoleController from './role.controller';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { roleService } from '../core/dependecies';

const roleRouter = Router();

const roleController = new RoleController(roleService);

//get all roles
roleRouter.get('/roles/all', roleController.getAllRoles);

//get specialization with pagination
roleRouter.get('/roles', roleController.getRoles);

//get a role
roleRouter.get(
  '/roles/:roleId',
  ValidateIdMiddleware.validateParamsId,
  roleController.getRole,
);

//create a role
roleRouter.post('/role', roleController.createRole);

//delete a role
roleRouter.delete(
  '/roles/:roleId',
  ValidateIdMiddleware.validateParamsId,
  roleController.deleteRole,
);

//update a role
roleRouter.patch(
  '/roles/:roleId',
  ValidateIdMiddleware.validateParamsId,
  roleController.updateRole,
);

export default roleRouter;
