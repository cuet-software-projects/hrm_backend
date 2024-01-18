import { IBonus, PrismaBonusModel } from '../bonus.type';
import { CollectionTransformer } from '../../core/transformer/transformer';
import bonusResource from './bonus.resource';
class BonusCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaBonusModel[]): IBonus[] {
    return requestedData.map((bonus) => bonusResource.transform(bonus));
  }
}
const bonusCollection = new BonusCollection();
export default bonusCollection;
