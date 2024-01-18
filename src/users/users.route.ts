import { Router } from 'express';
import UserController from './user.controller';
import { handleSingleFileUpload } from '../core/middlewares/multer-middleware';
import UserMiddleWare from './user.middlewares';
import validate from '../core/middlewares/validate';
import ValidateIdMiddleware from '../core/middlewares/validateId.middleware';
import { validateQueryParams } from '../core/middlewares/validateQueryParams';
import { userQueryParams } from '../queryparams';
import {
  CreateClientSchema,
  CreateUserSchema,
  GetUserDetailsSchema,
  UpdateClientSchema,
  UpdateUserCurrentEmploymentSchema,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
  UserRoleSchema,
} from './user.schema';
import { userService } from '../core/dependecies';
const userRouter = Router();

// inject user service to user controller
const userController = new UserController(userService);

// Get all users
userRouter.get('/users/all', userController.getAllUsers);

// Get users with current employment (with pagination)
userRouter.get('/current-employees', userController.getCurrentEmployees);

// Get all users with current employment
userRouter.get('/current-employees/all', userController.getAllCurrentEmployees);

// Get  users paginated
userRouter.get('/users', validateQueryParams(userQueryParams), userController.getUsers);

// Get a user
userRouter.get(
  '/users/:user_id',
  validate(GetUserDetailsSchema),
  userController.getUserDetails,
);
// Create a user
userRouter.post('/user', validate(CreateUserSchema), userController.createUser);

// Delete a user

// Update a user
userRouter.patch(
  '/user/:user_id',
  validate(UpdateUserSchema),
  ValidateIdMiddleware.validateParamsId,
  userController.updateUser,
);

// Set users employee info
userRouter.put(
  '/users/:user_id/set-employment-info',
  validate(UpdateUserCurrentEmploymentSchema),
  ValidateIdMiddleware.validateParamsId,
  ValidateIdMiddleware.validateBodyId,
  userController.setEmploymentInfo,
);

// Set User Roles
userRouter.post(
  '/users/:user_id/roles',
  validate(UserRoleSchema),
  ValidateIdMiddleware.validateBodyId,
  ValidateIdMiddleware.validateParamsId,
  userController.setUserRoles,
);

// upload profile picture
userRouter.patch(
  '/users/:user_id/profile-picture',
  ValidateIdMiddleware.validateParamsId,
  handleSingleFileUpload,
  userController.uploadProfilePicture,
);

// Reset Password
userRouter.patch(
  '/users/:user_id/reset-password',
  validate(UpdateUserPasswordSchema),
  ValidateIdMiddleware.validateParamsId,
  userController.updatePassword,
);

// Create a client
userRouter.post('/client', validate(CreateClientSchema), userController.createClient);

// Update a Client
userRouter.patch(
  '/client/:user_id',
  validate(UpdateClientSchema),
  ValidateIdMiddleware.validateParamsId,
  userController.updateClient,
);

export default userRouter;
