export type EmailProviderType = 'smtp' | 'sendgrid' | 'gmail';

export interface EmailPayload {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface IEmailProvider {
  send(payload: EmailPayload): Promise<EmailSendResult>;
}
