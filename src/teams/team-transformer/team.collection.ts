import { Team } from '@prisma/client';
import { CollectionTransformer } from '../../core/transformer/transformer';
import departmentResource from './team.resource';
import { ITeam } from '../../core/types';

class TeamCollection implements CollectionTransformer {
  transformCollection(requestedData: Team[]): ITeam[] {
    return requestedData.map((department) => departmentResource.transform(department));
  }
}

const teamCollection = new TeamCollection();

export default teamCollection;
