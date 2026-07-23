// src/api/utils/otp.util.ts
import config from "../../config/config";

/** Generate a numeric OTP of configured length. */
export function generateOtp(length = config.OTP_LENGTH): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

export function otpExpiry(): Date {
  return new Date(Date.now() + config.OTP_EXPIRY_MINUTES * 60 * 1000);
}

export function isOtpExpired(expiresAt?: Date | null): boolean {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
}
