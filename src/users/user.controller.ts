import {
  ClientDto,
  IUser,
  PaginateResponse,
  Request,
  UpdateClientDto,
  UpdateUserCurrentEmploymentDto,
  UpdateUserDto,
  UserDto,
} from '../core/types';
import { Response } from 'express';
import catchAsync from '../utils/catchAsync';
import apiResponse from '../core/services/apiResponse.service';
import UserService from './user.service';

export default class UserController {
  constructor(protected readonly userService: UserService) {}

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as UserDto;

    const newUser = await this.userService.createUser(payload);
    apiResponse.sendSuccess({ res: res, data: newUser, code: 201 });
  });

  public getUsers = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes, search, sorts } = req.query;

    const response: PaginateResponse<IUser> = await this.userService.getUsers({
      params: {
        page: Number(page ?? 1),
        limit: Number(limit ?? 10),
        filters: filters as Record<string, any>,
        includes: includes as string,
        search: search as string,
        sorts: sorts as string,
      },
    });
    apiResponse.sendSuccess({ res: res, data: response.data, meta: response.meta });
  });

  public getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users: IUser[] = await this.userService.getAllUsers();
    apiResponse.sendSuccess({ res: res, data: users });
  });

  // Get users with current employment (with pagination)
  public getCurrentEmployees = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes } = req.query;
    const response: PaginateResponse<IUser> = await this.userService.getCurrentEmployees({
      params: {
        page: Number(page ?? 1),
        limit: Number(limit ?? 10),
        filters: filters as Record<string, any>,
        includes: includes as string,
      },
    });
    apiResponse.sendSuccess({ res: res, data: response.data, meta: response.meta });
  });

  // Get all users with current employment
  public getAllCurrentEmployees = catchAsync(async (req: Request, res: Response) => {
    const usersWithCurrentEmployment: IUser[] =
      await this.userService.getAllCurrentEmployees();
    apiResponse.sendSuccess({ res: res, data: usersWithCurrentEmployment });
  });

  public getUserDetails = catchAsync(async (req: Request, res: Response) => {
    const { user_id } = req.params;

    const userDetails = await this.userService.getUserDetails(user_id);
    apiResponse.sendSuccess({ res: res, data: userDetails });
  });

  public updateUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as UpdateUserDto;
    const userId = req.params.user_id;

    const updatedUser: UpdateUserDto = await this.userService.updateUser(payload, userId);
    apiResponse.sendSuccess({ res, data: updatedUser, code: 204 });
  });

  public setEmploymentInfo = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as UpdateUserCurrentEmploymentDto;
    const user_id = req.params.user_id;

    await this.userService.setEmploymentInfo({ data: payload, user_id });
    apiResponse.sendSuccess({ res, code: 204 });
  });

  public me = catchAsync(async (req: Request, res: Response) => {
    const user_id = req.user.id;

    const user = await this.userService.getUserLoginInfo(user_id);
    apiResponse.sendSuccess({ res, data: user });
  });

  public setUserRoles = catchAsync(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { role_ids } = req.body;

    await this.userService.setUserRoles({ user_id, role_ids });
    apiResponse.sendSuccess({ res, code: 204 });
  });

  public uploadProfilePicture = catchAsync(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const file = req.file;

    await this.userService.uploadProfilePicture({ user_id, file });
    apiResponse.sendSuccess({ res, code: 204 });
  });

  // reset password
  public updatePassword = catchAsync(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { old_password, new_password } = req.body;

    await this.userService.updatePassword({ user_id, old_password, new_password });
    apiResponse.sendSuccess({ res, code: 204 });
  });

  // Create a client
  public createClient = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as ClientDto;

    const newClient = await this.userService.createClient(payload);
    apiResponse.sendSuccess({ res: res, data: newClient, code: 201 });
  });

  // Update a client
  public updateClient = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as UpdateClientDto;
    const userId = req.params.user_id;

    const updatedClient: UpdateClientDto = await this.userService.updateClient(
      payload,
      userId,
    );
    apiResponse.sendSuccess({ res, data: updatedClient, code: 204 });
  });
}
