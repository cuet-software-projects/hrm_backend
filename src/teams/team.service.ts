import { TeamDto, ITeam, UpdateTeamDto, PaginateResponse } from '../core/types';
import TeamRepository from './team.repository';
export default class TeamService {
  constructor(protected readonly teamRepo: TeamRepository) {}

  public async getTeams({
    page = 1,
    limit = 20,
  }: {
    page?: number;
    limit?: number;
  }): Promise<PaginateResponse<ITeam>> {
    try {
      const allTeams = await this.teamRepo.getTeams({ page, limit });
      return allTeams;
    } catch (error) {
      throw error;
    }
  }

  public async getAllTeams(): Promise<ITeam[]> {
    try {
      const allTeams = await this.teamRepo.getAllTeams();
      return allTeams;
    } catch (error) {
      throw error;
    }
  }

  public async getTeam(teamId: string): Promise<ITeam> {
    try {
      const Team = await this.teamRepo.getTeam(teamId);
      return Team;
    } catch (error) {
      throw error;
    }
  }

  public async createTeam(data: Partial<TeamDto>): Promise<ITeam> {
    try {
      const newTeam = await this.teamRepo.createTeam(data);
      return newTeam;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTeam(teamId: string): Promise<ITeam> {
    try {
      const deletedTeam = await this.teamRepo.deleteTeam(teamId);
      return deletedTeam;
    } catch (error) {
      throw error;
    }
  }

  public async updateTeam(
    teamId: string,
    payload: Partial<UpdateTeamDto>,
  ): Promise<ITeam> {
    try {
      const updatedTeam = await this.teamRepo.updateTeam(teamId, payload);
      return updatedTeam;
    } catch (error) {
      throw error;
    }
  }
}
