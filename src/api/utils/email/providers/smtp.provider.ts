import nodemailer, { Transporter } from 'nodemailer';
import { IEmailProvider, EmailPayload, EmailSendResult } from '../email.types';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName?: string;
  fromEmail?: string;
}

export class SmtpProvider implements IEmailProvider {
  protected transporter: Transporter;
  protected defaultFrom: string;

  constructor(config: SmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
    const name = config.fromName || 'EVinfo';
    const email = config.fromEmail || config.user;
    this.defaultFrom = `"${name}" <${email}>`;
  }

  async send(payload: EmailPayload): Promise<EmailSendResult> {
    try {
      const info = await this.transporter.sendMail({
        from: this.defaultFrom,
        to: payload.to,
        subject: payload.subject,
        ...(payload.html ? { html: payload.html } : { text: payload.text || '' }),
      });
      console.log('✅ SMTP email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ SMTP email failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}
