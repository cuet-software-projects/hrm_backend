import { DbType, db } from '../db.server';
import BaseRepository from '../core/repository/base.repository';
export default class UserNotificationPreferenceRepository extends BaseRepository<DbType> {
  constructor() {
    super(db, 'User_Notification_Preference');
  }

  public async createUserNotificationPreference(user_id: string) {
    try {
      await db.user_Notification_Preference.create({
        data: {
          user_id,
          email: true,
          sms: true,
          db_notification: true,
          push_notification: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
