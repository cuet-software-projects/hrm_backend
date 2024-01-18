import { Team } from '@prisma/client';
import { DbType, db } from '../db.server';
import BaseRepository from '../core/repository/base.repository';
import { TeamDto, ITeam, UpdateTeamDto, PaginateResponse } from '../core/types';
import teamCollection from './team-transformer/team.collection';
import teamResource from './team-transformer/team.resource';

export default class TeamRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'Team');
  }

  public async getTeams({
    page,
    limit,
  }: {
    limit: number;
    page: number;
  }): Promise<PaginateResponse<ITeam>> {
    try {
      const data = await this.paginate<ITeam, Team>({
        page: page,
        pageSize: limit,
        transformCollection: teamCollection.transformCollection,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getAllTeams(): Promise<ITeam[]> {
    try {
      const allTeams = await this.getAll<ITeam, Team>(teamCollection.transformCollection);
      return allTeams;
    } catch (error) {
      throw error;
    }
  }

  public async getTeam(TeamId: string): Promise<ITeam> {
    try {
      const Team = await this.get<ITeam, Team>(TeamId, teamResource.transform);
      return Team;
    } catch (error) {
      throw error;
    }
  }

  public async createTeam(data: Partial<TeamDto>): Promise<ITeam> {
    try {
      const newTeam = await this.create<ITeam, Team>(
        {
          name: data.name,
          description: data.description,
        },
        teamResource.transform,
      );
      return newTeam;
    } catch (error) {
      throw error;
    }
  }

  public async deleteTeam(TeamId: string): Promise<ITeam> {
    try {
      const deletedTeam = await this.delete<ITeam>(TeamId, teamResource.transform);
      return deletedTeam;
    } catch (error) {
      throw error;
    }
  }

  public async updateTeam(
    TeamId: string,
    payload: Partial<UpdateTeamDto>,
  ): Promise<ITeam> {
    try {
      const { name, description } = payload;
      const updatedTeam = await this.update<ITeam, Team>(
        TeamId,
        {
          ...(name ? { name } : {}),
          ...(description ? { description } : {}),
        },
        teamResource.transform,
      );
      return updatedTeam;
    } catch (error) {
      throw error;
    }
  }
}
