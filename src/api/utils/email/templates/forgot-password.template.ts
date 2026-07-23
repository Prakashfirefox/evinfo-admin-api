export function forgotPasswordTemplate(fullName: string, resetLink: string, expiryMinutes = 15): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>EVinfo - Reset Your Password</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6f8; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width: 620px; margin: 40px auto; background: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 18px rgba(0,0,0,0.08); }
    h2 { color: #1e88e5; margin-bottom: 12px; font-size: 24px; }
    p { color: #444; line-height: 1.6; font-size: 15px; }
    .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #1e88e5; color: #ffffff !important; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px; }
    .warning { margin-top: 16px; padding: 12px 16px; background: #fff8e1; border-left: 4px solid #ffc107; border-radius: 4px; font-size: 13px; color: #555; }
    .link-fallback { word-break: break-all; color: #1e88e5; font-size: 13px; }
    .footer { margin-top: 32px; text-align: center; color: #777; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password</h2>
    <p>Hello <strong>${fullName}</strong>,</p>
    <p>We received a request to reset the password for your <strong>EVinfo</strong> account. Click the button below to set a new password:</p>
    <div style="text-align: center;">
      <a href="${resetLink}" class="btn">Reset Password</a>
    </div>
    <p>If the button does not work, copy and paste the link below into your browser:</p>
    <p class="link-fallback">${resetLink}</p>
    <div class="warning">
      ⚠️ This link will expire in <strong>${expiryMinutes} minutes</strong>. If you did not request a password reset, please ignore this email — your account is safe.
    </div>
    <div class="footer">© ${new Date().getFullYear()} EVinfo — All rights reserved.</div>
  </div>
</body>
</html>
  `;
}
