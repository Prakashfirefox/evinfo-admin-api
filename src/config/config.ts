const   SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3003;
const SERVER = {
  hostname: SERVER_HOSTNAME,
  port : PORT
};
const config = {
  SERVER: SERVER,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_EMAIL: process.env.SENDGRID_EMAIL || '',
  WEBSITE_URL: process.env.WEBSITE_URL || 'http://localhost:3003',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'default_encryption_key_32b',
  GMAIL_EMAIL: process.env.GMAIL_EMAIL || '',
  GMAIL_PASSWORD: process.env.GMAIL_PASSWORD || '',

};

export default config;
