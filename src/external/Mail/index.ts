import nodemailer from 'nodemailer';
import { getMailConfig } from '../../configs/env-config';
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs/promises';
const mailConfig = getMailConfig();
export default class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: mailConfig.service,
      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },
      host: mailConfig.host,
      port: mailConfig.port,
    });
  }

  private async sendMail({
    to,
    template,
    subject,
    text = '',
  }: {
    to: string;
    template: string;
    subject: string;
    text?: string;
  }) {
    try {
      const mailOptions = {
        from: mailConfig.from_address,
        to,
        subject,
        text,
        html: template,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  private async renderEmailTemplate(templateName: string, data?: any) {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'email-templates',
      `${templateName}.hbs`,
    );

    try {
      const templateSource = await fs.readFile(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      return template(data);
    } catch (error) {
      throw error;
    }
  }

  public async sendUserUpdatedItem(recipientEmail: string, data: any) {
    const templateName = 'user-updated-item-template';
    const subject = 'User Updated Item';

    try {
      const template = `
        hi`;

      await this.sendMail({
        to: recipientEmail,
        subject,
        text: 'User Updated Item email text',
        template,
      });
    } catch (error) {
      throw error;
    }
  }

  public async sendWelcomeNotification({ to, data }: { to: string; data: any }) {
    const templateName = 'user-profile-created-template';
    const subject = 'Welcome to the Diligite Family! 🌟';

    try {
      const template = await this.renderEmailTemplate(templateName, data);

      await this.sendMail({
        to,
        subject,
        template,
      });
    } catch (error) {
      throw error;
    }
  }

  public async sendPayrollHasDispatched({ to, data }: { to: string; data: any }) {
    const templateName = 'payroll-send-template';
    const subject = 'Your Hard Work = Payday Party! 🎉💰';

    try {
      const template = await this.renderEmailTemplate(templateName, data);

      await this.sendMail({
        to,
        subject,
        template,
      });
    } catch (error) {
      throw error;
    }
  }

  public async sendBonusHasDispatched({ to, data }: { to: string; data: any }) {
    const templateName = 'bonus-send-template';
    const subject = 'Cha-Ching! You Just Got a Bonus Surprise! 💰';

    try {
      const template = await this.renderEmailTemplate(templateName, data);

      await this.sendMail({
        to,
        subject,
        template,
      });
    } catch (error) {
      throw error;
    }
  }

  public async sendLeaveApproved({ to, data }: { to: string; data: any }) {
    const templateName = 'leave-approved-template';
    const subject = 'Your Leave Request Has Been Approved! 🎉';

    try {
      const template = await this.renderEmailTemplate(templateName, data);

      await this.sendMail({
        to,
        subject,
        template,
      });
    } catch (error) {
      throw error;
    }
  }

  public async sendLeaveRejected({ to, data }: { to: string; data: any }) {
    const templateName = 'leave-rejected-template';
    const subject = 'Your Leave Request Has Been Rejected! 😢';

    try {
      const template = await this.renderEmailTemplate(templateName, data);

      await this.sendMail({
        to,
        subject,
        template,
      });
    } catch (error) {
      throw error;
    }
  }

  // Send a reset password link to the user
  public async sendResetPasswordLink({ to, data }: { to: string; data: any }) {
    const templateName = 'forgot-password-template';
    const subject = 'Reset Your Password';

    try {
      const template = await this.renderEmailTemplate(templateName, data);

      await this.sendMail({
        to,
        subject,
        template,
      });
    } catch (error) {
      throw error;
    }
  }
}
