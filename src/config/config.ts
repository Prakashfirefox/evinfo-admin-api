const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3003;
const SERVER = { hostname: SERVER_HOSTNAME, port: PORT };

const config = {
  SERVER,
  // App
  WEBSITE_URL: process.env.WEBSITE_URL || 'http://localhost:3003',
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'default_encryption_key_32b',
  // Email — provider selection
  DEFAULT_EMAIL_PROVIDER: process.env.DEFAULT_EMAIL_PROVIDER || 'smtp', // 'smtp' | 'gmail' | 'sendgrid'
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'EVinfo',
  // SMTP (generic — works with any SMTP relay: Mailgun, Brevo, Zoho, etc.)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true', // true for port 465
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  // Gmail (OAuth app-password shorthand)
  GMAIL_EMAIL: process.env.GMAIL_EMAIL || '',
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || '',
  // SendGrid
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_EMAIL: process.env.SENDGRID_EMAIL || '',
  // Password reset
  PASSWORD_RESET_EXPIRY_MINUTES: process.env.PASSWORD_RESET_EXPIRY_MINUTES
    ? parseInt(process.env.PASSWORD_RESET_EXPIRY_MINUTES)
    : 15,

  // ── Public user signup verification ──────────────────────────────────
  // Which channel(s) a new public user must verify: 'email' | 'phone' | 'both'
  AUTH_VERIFY_METHOD: (process.env.AUTH_VERIFY_METHOD || 'email') as 'email' | 'phone' | 'both',
  OTP_EXPIRY_MINUTES: process.env.OTP_EXPIRY_MINUTES ? parseInt(process.env.OTP_EXPIRY_MINUTES) : 10,
  OTP_LENGTH: process.env.OTP_LENGTH ? parseInt(process.env.OTP_LENGTH) : 6,

  // SMS provider (Twilio) — if unset, phone OTPs are logged to the server
  // console in dev instead of being sent (so the flow still works locally)
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'console', // 'twilio' | 'console'
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_FROM: process.env.TWILIO_FROM || '',
};

export default config;
