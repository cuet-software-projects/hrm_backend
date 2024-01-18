import { TeamDto, ITeam, Request, UpdateTeamDto, PaginateResponse } from '../core/types';
import { Response } from 'express';
import catchAsync from '../utils/catchAsync';
import TeamService from './team.service';
import apiResponse from '../core/services/apiResponse.service';

export default class TeamController {
  constructor(protected readonly teamService: TeamService) {}
  public getTeams = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const { data, meta }: PaginateResponse<ITeam> = await this.teamService.getTeams({
      page: Number(page),
      limit: Number(limit),
    });
    apiResponse.sendSuccess({ res: res, data, meta });
  });

  public getAllTeams = catchAsync(async (req: Request, res: Response) => {
    const teams: ITeam[] = await this.teamService.getAllTeams();
    apiResponse.sendSuccess({ res: res, data: teams });
  });

  public getTeam = catchAsync(async (req: Request, res: Response) => {
    const { teamId } = req.params;
    const Team: ITeam = await this.teamService.getTeam(teamId);
    apiResponse.sendSuccess({ res: res, data: Team });
  });

  public createTeam = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as TeamDto;
    const newTeam: ITeam = await this.teamService.createTeam(payload);
    apiResponse.sendSuccess({ res: res, data: newTeam, code: 201 });
  });

  public deleteTeam = catchAsync(async (req: Request, res: Response) => {
    const teamId = req.params.teamId;
    const deletedTeam: ITeam = await this.teamService.deleteTeam(teamId);
    apiResponse.sendSuccess({ res, data: deletedTeam });
  });

  public updateTeam = catchAsync(async (req: Request, res: Response) => {
    const teamId = req.params.teamId;
    const payload = req.body as UpdateTeamDto;
    const updatedTeam: ITeam = await this.teamService.updateTeam(teamId, payload);
    apiResponse.sendSuccess({ res, data: updatedTeam, code: 204 });
  });
}
