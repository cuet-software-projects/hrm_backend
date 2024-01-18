import { db } from '../../../db.server';
import MailService from '../../../external/Mail';
import { PrismaUserModel } from '../../types';
import NotificationPreferences from './notification-preferences';

type NotificationFunction =
  | 'sendWelcomeNotification'
  | 'sendPayrollHasDispatched'
  | 'sendBonusHasDispatched'
  | 'sendLeaveApproved'
  | 'sendLeaveRejected';

export default class NotificationService {
  private user?: PrismaUserModel;

  constructor(
    private readonly mail: MailService,
    private preference: NotificationPreferences,
  ) {}

  public async setUser(user_id?: string) {
    await this.init(user_id);
  }

  public async unsetUser() {
    this.user = undefined;
    this.preference.disableNotifications();
  }

  private async init(user_id?: string) {
    if (!user_id) return;
    this.user = await db.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        notification_preference: true,
      },
    });

    this.user.notification_preference?.email &&
      this.preference.enableEmailNotifications();
  }

  private async sendNotification(
    notificationFunctionName: NotificationFunction,
    data: any,
  ) {
    if (this.preference.isEmailEnabled()) {
      const user_email = this.user?.email;
      this.mail?.[notificationFunctionName]?.({ to: user_email, data });
    }
    this.unsetUser();
  }

  public async sendWelcomeNotification() {
    await this.sendNotification('sendWelcomeNotification', { ...this.user });
  }

  public async sendPayrollHasDispatched() {
    await this.sendNotification('sendPayrollHasDispatched', { ...this.user });
  }

  public async sendBonusHasDispatched() {
    await this.sendNotification('sendBonusHasDispatched', { ...this.user });
  }

  public async sendLeaveApproved() {
    await this.sendNotification('sendLeaveApproved', { ...this.user });
  }

  public async sendLeaveRejected() {
    await this.sendNotification('sendLeaveRejected', { ...this.user });
  }
}
