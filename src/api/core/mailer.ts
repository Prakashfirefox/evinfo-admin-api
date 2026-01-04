// src/api/utils/mailer.ts
import config from '../../config/config';
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

interface MailOptions {
  email: string;
  subject: string;
  content?: string;
  htmlContent?: string;
  provider?: 'sendgrid' | 'gmail'; // choose provider
}

export const sendMail = async (mailOptions: MailOptions) => {
  const provider = mailOptions.provider || 'sendgrid';

  if (provider === 'sendgrid') {
    sgMail.setApiKey(config.SENDGRID_API_KEY || '');
    // Always create a non-empty content array
    // Ensure array has at least 1 item
    const contentArray = mailOptions.htmlContent
      ? [{ type: "text/html", value: mailOptions.htmlContent }]
      : [{ type: "text/plain", value: mailOptions.content || " " }];

    const message: any = {
      from: {
        name: "BIZManager",
        email: config.SENDGRID_EMAIL || "",
      },
      to: mailOptions.email,
      subject: mailOptions.subject,
      content: contentArray, // ✅ array guaranteed to have one element
    };

    try {
      const [response] = await sgMail.send(message);
      console.log("✅ SendGrid Email sent:", response.statusCode, response.headers);

      return {
        success: true,
        info: {
          statusCode: response.statusCode,
          headers: response.headers,
        },
      };
    } catch (error: any) {
      console.error("❌ SendGrid Email sending failed:", error.response?.body || error.message);
      return { success: false, error: error.response?.body || error.message };
    }
  }
  else if (provider === 'gmail') {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.GMAIL_EMAIL || '',
        pass: config.GMAIL_PASSWORD || '',
      },
    });

    const mailData = {
      from: `"BIZManager" <${config.GMAIL_EMAIL}>`,
      to: mailOptions.email,
      subject: mailOptions.subject,
      ...(mailOptions.htmlContent
        ? { html: mailOptions.htmlContent }
        : { text: mailOptions.content })
    };

    try {
      const info = await transporter.sendMail(mailData);
      console.log("✅ Gmail Email sent:", info.messageId);
      return { success: true, info };
    } catch (error: any) {
      console.error("❌ Gmail Email sending failed:", error.message);
      return { success: false, error: error.message };
    }
  }
  else {
    throw new Error("Invalid email provider. Choose 'sendgrid' or 'gmail'.");
  }
};
