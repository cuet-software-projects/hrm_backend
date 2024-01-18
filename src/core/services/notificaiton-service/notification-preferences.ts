export default class NotificationPreferences {
  private emailEnabled: boolean = true;
  private smsEnabled: boolean = false;

  public enableEmailNotifications() {
    this.emailEnabled = true;
  }

  public enableSMSNotifications() {
    this.smsEnabled = true;
  }

  public isEmailEnabled() {
    return this.emailEnabled;
  }

  public isSMSEnabled() {
    return this.smsEnabled;
  }

  public disableEmailNotifications() {
    this.emailEnabled = false;
  }

  public disableSMSNotifications() {
    this.smsEnabled = false;
  }

  public disableNotifications() {
    this.smsEnabled = false;
    this.emailEnabled = false;
  }
}
