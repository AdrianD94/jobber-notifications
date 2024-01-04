import { IEmailLocals } from '@adriand94/jobber-shared';
import { Config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';
import { Logger } from 'winston';

export async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals, log: Logger, config: Config): Promise<void> {
  try {
    log.info('email sent succesfull');
    await emailTemplates(template, receiverEmail, locals, log, config);
  } catch (error) {
    log.log('error', 'NotificationService MailTransport sendEmail() method error:', error);
  }
}
