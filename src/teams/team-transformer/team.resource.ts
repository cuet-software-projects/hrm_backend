import { Team } from '@prisma/client';
import { ITeam } from '../../core/types';
import { Transformer } from '../../core/transformer/transformer';

class TeamResource implements Transformer {
  transform(team: Team): ITeam {
    return {
      id: team.id,
      name: team.name,
      description: team.description,
    };
  }
}

const teamResource = new TeamResource();

export default teamResource;
