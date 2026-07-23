import sgMail from '@sendgrid/mail';
import { IEmailProvider, EmailPayload, EmailSendResult } from '../email.types';

export interface SendGridConfig {
  apiKey: string;
  fromEmail: string;
  fromName?: string;
}

export class SendGridProvider implements IEmailProvider {
  private fromEmail: string;
  private fromName: string;

  constructor(config: SendGridConfig) {
    sgMail.setApiKey(config.apiKey);
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName || 'EVinfo';
  }

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      const message: any = {
        from: { name: this.fromName, email: this.fromEmail },
        to: payload.to,
        subject: payload.subject,
        content: payload.html
          ? [{ type: 'text/html', value: payload.html }]
          : [{ type: 'text/plain', value: payload.text || ' ' }],
      };
      const [response] = await sgMail.send(message);
      console.log('✅ SendGrid email sent:', response.statusCode);
      return { success: true, messageId: String(response.statusCode) };
    } catch (error: any) {
      console.error('❌ SendGrid email failed:', error.response?.body || error.message);
      return { success: false, error: error.response?.body || error.message };
    }
  }
}
