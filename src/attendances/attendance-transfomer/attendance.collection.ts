import { IAttendance, PrismaAttendanceModel } from '../../core/types';
import { CollectionTransformer } from '../../core/transformer/transformer';
import attendanceResource from './attendance.resource';

class AttendanceCollection implements CollectionTransformer {
  transformCollection(requestedData: PrismaAttendanceModel[]): IAttendance[] {
    return requestedData.map((attendance) => attendanceResource.transform(attendance));
  }
}

const attendanceCollection = new AttendanceCollection();

export default attendanceCollection;
