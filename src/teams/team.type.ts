export type ITeam = {
  id: string;
  name: string;
  description?: string | null;
};

export type TeamDto = {
  name: string;
  code: string;
  description?: string;
};
export type UpdateTeamDto = Partial<TeamDto>;
