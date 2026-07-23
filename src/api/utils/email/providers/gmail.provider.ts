import { SmtpProvider } from './smtp.provider';

export interface GmailConfig {
  email: string;
  password: string;
  fromName?: string;
}

export class GmailProvider extends SmtpProvider {
  constructor(config: GmailConfig) {
    super({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      user: config.email,
      pass: config.password,
      fromName: config.fromName || 'EVinfo',
      fromEmail: config.email,
    });
  }
}
