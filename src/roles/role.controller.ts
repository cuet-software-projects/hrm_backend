import apiResponse from '../core/services/apiResponse.service';
import RoleService from './role.service';
import { IRole, IRoleCreateDto, IRoleUpdateDto } from '../core/types';
import catchAsync from '../utils/catchAsync';
import { PaginateResponse, Request } from '../core/types';
import { Response } from 'express';

export default class RoleController {
  constructor(protected readonly roleService: RoleService) {}
  public createRole = catchAsync(async (req: Request, res: Response) => {
    const requestDto = req.body as IRoleCreateDto;

    const newRole: IRole = await this.roleService.createRole({ roleData: requestDto });
    apiResponse.sendSuccess({ res: res, data: newRole, code: 201 });
  });

  public getRoles = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, filters, includes } = req.query;
    const response: PaginateResponse<IRole> = await this.roleService.getRoles({
      params: {
        page: Number(page ?? 1),
        limit: Number(limit ?? 20),
        filters: filters as Record<string, any>,
        includes: includes as string,
      },
    });
    apiResponse.sendSuccess({ res: res, data: response.data, meta: response.meta });
  });

  public getAllRoles = catchAsync(async (req: Request, res: Response) => {
    const roles: IRole[] = await this.roleService.getAllRoles();
    apiResponse.sendSuccess({ res: res, data: roles });
  });

  public getRole = catchAsync(async (req: Request, res: Response) => {
    const { roleId } = req.params;

    const role: IRole = await this.roleService.getRole(roleId);
    apiResponse.sendSuccess({ res: res, data: role });
  });

  public updateRole = catchAsync(async (req: Request, res: Response) => {
    const { roleId } = req.params;
    const requestDto = req.body as IRoleUpdateDto;

    const updatedRole: IRole = await this.roleService.updateRole(roleId, requestDto);
    apiResponse.sendSuccess({ res: res, data: updatedRole });
  });

  public deleteRole = catchAsync(async (req: Request, res: Response) => {
    const { roleId } = req.params;

    const deletedRole: IRole = await this.roleService.deleteRole(roleId);
    apiResponse.sendSuccess({ res: res, data: deletedRole });
  });
}
