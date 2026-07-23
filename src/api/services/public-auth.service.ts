// src/api/services/public-auth.service.ts
// Public (consumer) account auth: register → OTP verify (email/phone/both) → login.
// Separate from the admin AuthService.login which requires is_admin.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../db/client";
import config from "../../config/config";
import AppError from "../core/error-handler";
import { encrypt } from "../utils/crypto.util";
import { generateOtp, otpExpiry, isOtpExpired } from "../utils/otp.util";
import { sendSms } from "../utils/sms.util";
import { emailService } from "../utils/email/email.service";
import { otpTemplate } from "../utils/email/templates/otp.template";

const JWT_SECRET = config.JWT_SECRET;
const JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET;

type Channels = { email: boolean; phone: boolean };

function channelsForMethod(): Channels {
  const m = config.AUTH_VERIFY_METHOD;
  return { email: m === "email" || m === "both", phone: m === "phone" || m === "both" };
}

function issueTokens(user: any) {
  const payload = { user_id: user.id, email: user.email };
  const enc = encrypt(JSON.stringify(payload));
  const access_token = jwt.sign({ data: enc }, JWT_SECRET, { expiresIn: "7d" });
  const refresh_token = jwt.sign({ data: enc }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
  return { access_token, refresh_token };
}

function publicUser(u: any) {
  const { password, refresh_token, otp, phone_otp, otp_expires_at, ...safe } = u;
  return safe;
}

class PublicAuthService {
  getVerifyConfig() {
    return { method: config.AUTH_VERIFY_METHOD, ...channelsForMethod() };
  }

  async register(data: { full_name: string; email: string; phone_no?: string; country_code?: string; password: string }) {
    const email = data.email.toLowerCase().trim();
    const ch = channelsForMethod();

    if (ch.phone && !data.phone_no) {
      throw new AppError("Phone number is required", {}, 400);
    }

    const existing = await prisma.users.findFirst({ where: { email, is_deleted: false } });
    if (existing) {
      // Allow re-registering an unverified account (resend fresh OTP)
      const verified = existing.email_verified && (!ch.phone || existing.phone_verified);
      if (verified) throw new AppError("An account with this email already exists. Please sign in.", {}, 400);
    }

    const hashed = await bcrypt.hash(data.password, 10);
    const emailOtp = ch.email ? generateOtp() : null;
    const phoneOtp = ch.phone ? generateOtp() : null;
    const expires = otpExpiry();
    const userName = email; // public users keyed by email

    const base = {
      user_name: userName,
      full_name: data.full_name.trim(),
      first_name: data.full_name.trim().split(" ")[0],
      email,
      phone_no: data.phone_no || null,
      country_code: data.country_code || "+91",
      password: hashed,
      is_admin: false,
      is_active: true,
      role: "user",
      otp: emailOtp,
      phone_otp: phoneOtp,
      otp_expires_at: expires,
      email_verified: false,
      phone_verified: false,
      otp_verified: false,
      status: "pending",
      date_joined: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const user = existing
      ? await prisma.users.update({ where: { id: existing.id }, data: base })
      : await prisma.users.create({ data: base });

    await this.dispatchOtps(user, ch, emailOtp, phoneOtp);
    return { userId: user.id, channels: ch, email: user.email, phone_no: user.phone_no };
  }

  private async dispatchOtps(user: any, ch: Channels, emailOtp: string | null, phoneOtp: string | null) {
    if (ch.email && emailOtp) {
      await emailService
        .send({ to: user.email, subject: "Your EVInfo verification code", html: otpTemplate(user.full_name || "there", Number(emailOtp)) })
        .catch((e) => console.error("OTP email failed:", e?.message));
    }
    if (ch.phone && phoneOtp && user.phone_no) {
      await sendSms(`${user.country_code || ""}${user.phone_no}`, `Your EVInfo verification code is ${phoneOtp}. Valid for ${config.OTP_EXPIRY_MINUTES} minutes.`);
    }
  }

  async resendOtp(userId: string) {
    const user = await prisma.users.findFirst({ where: { id: userId, is_deleted: false } });
    if (!user) throw new AppError("Account not found", {}, 404);
    const ch = channelsForMethod();
    const emailOtp = ch.email ? generateOtp() : null;
    const phoneOtp = ch.phone ? generateOtp() : null;
    await prisma.users.update({
      where: { id: userId },
      data: { otp: emailOtp, phone_otp: phoneOtp, otp_expires_at: otpExpiry() },
    });
    await this.dispatchOtps(user, ch, emailOtp, phoneOtp);
    return { channels: ch };
  }

  async verifyOtp(userId: string, emailOtp?: string, phoneOtp?: string) {
    const user = await prisma.users.findFirst({ where: { id: userId, is_deleted: false } });
    if (!user) throw new AppError("Account not found", {}, 404);
    if (isOtpExpired(user.otp_expires_at)) throw new AppError("OTP has expired. Please request a new one.", {}, 400);

    const ch = channelsForMethod();
    if (ch.email) {
      if (!emailOtp || String(user.otp) !== String(emailOtp)) throw new AppError("Incorrect email OTP", {}, 400);
    }
    if (ch.phone) {
      if (!phoneOtp || String(user.phone_otp) !== String(phoneOtp)) throw new AppError("Incorrect phone OTP", {}, 400);
    }

    const updated = await prisma.users.update({
      where: { id: userId },
      data: {
        email_verified: ch.email ? true : user.email_verified,
        phone_verified: ch.phone ? true : user.phone_verified,
        otp_verified: true,
        otp: null,
        phone_otp: null,
        otp_expires_at: null,
        status: "active",
        last_login: new Date(),
      },
    });

    const tokens = issueTokens(updated);
    await prisma.users.update({ where: { id: userId }, data: { refresh_token: tokens.refresh_token } });
    return { ...tokens, user: publicUser(updated) };
  }

  async login(email: string, password: string) {
    const user = await prisma.users.findFirst({ where: { email: email.toLowerCase().trim(), is_deleted: false } });
    if (!user) throw new AppError("No account found with this email", {}, 400);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError("Incorrect password", {}, 400);

    const ch = channelsForMethod();
    const verified = (!ch.email || user.email_verified) && (!ch.phone || user.phone_verified);
    if (!verified) {
      // Re-arm OTP so the client can jump straight to verification
      const emailOtp = ch.email ? generateOtp() : null;
      const phoneOtp = ch.phone ? generateOtp() : null;
      await prisma.users.update({ where: { id: user.id }, data: { otp: emailOtp, phone_otp: phoneOtp, otp_expires_at: otpExpiry() } });
      await this.dispatchOtps(user, ch, emailOtp, phoneOtp);
      throw new AppError("ACCOUNT_NOT_VERIFIED", { userId: user.id, channels: ch }, 403);
    }

    const tokens = issueTokens(user);
    await prisma.users.update({ where: { id: user.id }, data: { refresh_token: tokens.refresh_token, last_login: new Date() } });
    return { ...tokens, user: publicUser(user) };
  }

  async me(userId: string) {
    const user = await prisma.users.findFirst({ where: { id: userId, is_deleted: false } });
    if (!user) throw new AppError("Account not found", {}, 404);
    return publicUser(user);
  }
}

export default new PublicAuthService();
