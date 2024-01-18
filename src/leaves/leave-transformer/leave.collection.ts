import { ILeave, PrismaLeaveModel } from '../../core/types';
import { CollectionTransformer } from '../../core/transformer/transformer';
import leaveResource from './leave.resource';
class LeaveCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaLeaveModel[]): ILeave[] {
    return requestedData.map((leave) => leaveResource.transform(leave));
  }
}
const leaveCollection = new LeaveCollection();
export default leaveCollection;
