export function otpTemplate(fullName: string, otp: number): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>EVinfo - OTP Verification</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6f8; font-family: Arial, Helvetica, sans-serif; }
    .container { max-width: 620px; margin: 40px auto; background: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 18px rgba(0,0,0,0.08); }
    h2 { color: #1e88e5; margin-bottom: 12px; font-size: 24px; }
    p { color: #444; line-height: 1.6; font-size: 15px; }
    .otp-box { display: inline-block; margin: 20px 0; padding: 14px 28px; background: #1e88e5; color: #ffffff; font-size: 22px; font-weight: bold; border-radius: 8px; letter-spacing: 4px; text-align: center; }
    .footer { margin-top: 32px; text-align: center; color: #777; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>EVinfo OTP Verification</h2>
    <p>Hello <strong>${fullName}</strong>,</p>
    <p>Use the following OTP to verify your email and complete your account setup on <strong>EVinfo</strong>:</p>
    <div class="otp-box">${otp}</div>
    <p>This OTP will expire in <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>
    <div class="footer">© ${new Date().getFullYear()} EVinfo — All rights reserved.</div>
  </div>
</body>
</html>
  `;
}
