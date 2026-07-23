import config from '../../../config/config';
import { IEmailProvider, EmailPayload, EmailSendResult, EmailProviderType } from './email.types';
import { SmtpProvider } from './providers/smtp.provider';
import { GmailProvider } from './providers/gmail.provider';
import { SendGridProvider } from './providers/sendgrid.provider';

class EmailService {
  private providers: Map<EmailProviderType, IEmailProvider> = new Map();

  private getProvider(type: EmailProviderType): IEmailProvider {
    if (this.providers.has(type)) {
      return this.providers.get(type)!;
    }

    let provider: IEmailProvider;

    switch (type) {
      case 'smtp':
        provider = new SmtpProvider({
          host: config.SMTP_HOST,
          port: config.SMTP_PORT,
          secure: config.SMTP_SECURE,
          user: config.SMTP_USER,
          pass: config.SMTP_PASS,
          fromName: config.EMAIL_FROM_NAME,
          fromEmail: config.SMTP_USER,
        });
        break;

      case 'gmail':
        provider = new GmailProvider({
          email: config.GMAIL_EMAIL,
          password: config.GMAIL_PASSWORD,
          fromName: config.EMAIL_FROM_NAME,
        });
        break;

      case 'sendgrid':
        provider = new SendGridProvider({
          apiKey: config.SENDGRID_API_KEY,
          fromEmail: config.SENDGRID_EMAIL,
          fromName: config.EMAIL_FROM_NAME,
        });
        break;

      default:
        throw new Error(`Unknown email provider: ${type}`);
    }

    // Cache the provider instance (lazy singleton per type)
    this.providers.set(type, provider);
    return provider;
  }

  async send(payload: EmailPayload, providerType?: EmailProviderType): Promise<EmailSendResult> {
    const type: EmailProviderType =
      providerType || (config.DEFAULT_EMAIL_PROVIDER as EmailProviderType) || 'smtp';
    const provider = this.getProvider(type);
    return provider.send(payload);
  }
}

// Export as singleton
export const emailService = new EmailService();
