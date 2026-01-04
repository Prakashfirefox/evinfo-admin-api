// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { encrypt } from "../utils/crypto.util";
import * as UserInterfaces from "../interfaces/auth.interface";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants/index";
import { auth } from "express-openid-connect";
import prisma from "../../db/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key";

export class AuthService {
  //Super Admin Login
  async login(email: string, password: string) {
    const user = await prisma.users.findFirst({
      where: { email, is_deleted: false }
    });

    if (!user)
      throw new AppError(
        ERROR_MESSAGE.USER_NOT_FOUND,
        {
          data: ERROR_MESSAGE.USER_NOT_FOUND,
        },
        400
      );
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      throw new AppError(
        ERROR_MESSAGE.INVALID_CREDENTIALS,
        {
          data: ERROR_MESSAGE.INVALID_CREDENTIALS,
        },
        400
      );
    if (!user.is_admin)
      throw new AppError(
        ERROR_MESSAGE.ACCESS_RESTRICTED,
        {
          data: ERROR_MESSAGE.ACCESS_RESTRICTED,
        },
        400
      );
    const userData = user;
    //Payload to encrypt
    const payload = {
      user_id: userData.id,
      email: userData.email,
    };

    //  Encrypt payload before signing
    const encryptedPayload = encrypt(JSON.stringify(payload));

    //Access Token (short expiry)
    const accessToken = jwt.sign(
      { data: encryptedPayload },
      JWT_SECRET,
      { expiresIn: "1d" } // 1 day
    );

    //Refresh Token (longer expiry)
    const refreshToken = jwt.sign(
      { data: encryptedPayload },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // 7 days
    );

    // Optional: Save refresh token in DB for revocation tracking
    await prisma.users.update({
      where: { id: userData.id },
      data: {
        refresh_token: refreshToken,
        last_login: new Date(),
      },
    });
    const { password: _, refresh_token, ...userWithoutSensitive } = userData;
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userWithoutSensitive,
    };
  }


  // 🔹 Logout
  async logout(userId: string) {
    await prisma.users.update({
      where: { id: userId },
      data: { last_logout: new Date() },
    });

    return true;
  }

  async getUserByEmail(email: string) {
    return await prisma.users.findFirst({
      where: { email, is_deleted: false },
    });
  }

  async getUserByUserName(user_name: string) {
    return await prisma.users.findFirst({
      where: { user_name, is_deleted: false },
    });
  }

  // CreateUser
  async createUser(data: UserInterfaces.CreateUserDTO, authUser: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const CreateUserPayload = {
      user_name: data.user_name,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashedPassword,
      organization_id: data.organization_id,
      otp_verified: true,
      email_verified: true,
      date_joined: new Date(),
      full_name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      is_admin: data.is_admin || false,
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_by: authUser?.id,
      created_at: new Date()
    }
    const newUser = await prisma.users.create({ data: CreateUserPayload });
    return newUser;

  }
  async createUserWithOTP(data: UserInterfaces.CreateUserDTO & { otp: number }, authUser: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const CreateUserPayload = {
      user_name: data.user_name,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: hashedPassword,
      organization_id: data.organization_id,
      otp_verified: false, // not verified yet
      email_verified: false,
      otp: String(data.otp),
      date_joined: new Date(),
      full_name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      is_admin: data.is_admin || false,
      is_active: true,
      created_by: authUser?.id,
      created_at: new Date()
    };

    const newUser = await prisma.users.create({ data: CreateUserPayload });
    return newUser;
  }
  async verifyOtpService(userId: string, otp: string) {
    // Get user
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) throw new AppError("User not found", {}, 404);

    // Compare OTP
    if (String(user.otp) !== String(otp)) {
      throw new AppError("Invalid OTP", {}, 400);
    }

    // Update verify status
    await prisma.users.update({
      where: { id: userId },
      data: {
        otp_verified: true,
        email_verified: true,
        otp: null,
        status: "active",
      }
    });

    return true;
  }
  async getUserById(id: string) {
    const user = await prisma.users.findFirst({ where: { id, is_deleted: false } });
    if (user) {
      return user;
    }
    return false;
  }


  // 🔹 Users
  async getAllUsers(payload: UserInterfaces.GetAllUserPayload) {
    const { is_admin, is_superuser, offset, limit, status, search } = payload;

    // Build Prisma WHERE
    const where: any = {
      is_deleted: false,
    };

    // is_admin filter (simulate OR condition)
    if (is_admin !== undefined) {
      where.OR = [
        { is_admin: is_admin },
        { is_admin: 0 }
      ];
    }

    if (is_superuser !== undefined) {
      where.is_superuser = is_superuser;
    }

    if (status !== undefined) {
      where.status = status;
    }

    // Search conditions
    if (search) {
      where.AND = {
        OR: [
          { first_name: { contains: search, mode: "insensitive" } },
          { full_name: { contains: search, mode: "insensitive" } },
          { org_name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone_no: { contains: search, mode: "insensitive" } },
        ]
      };
    }

    // Fetch rows
    const users = await prisma.users.findMany({
      where,

      skip: offset || 0,
      take: limit || 10,

      orderBy: { id: "desc" },

      select: {
        id: true,
        user_name: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_no: true,
        gender: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Total count
    const totalCount = await prisma.users.count({ where });

    return {
      count: totalCount,
      rows: users,
    };
  }



  async updateUser(id: string, data: UserInterfaces.UpdateUserPayload, authUser: any) {
    // 1. Check for duplicate user_name or email (excluding current user)
    if (data.user_name || data.email) {
      const orConditions: any[] = [];

      if (data.user_name) {
        orConditions.push({ user_name: data.user_name });
      }

      if (data.email) {
        orConditions.push({ email: data.email });
      }

      const existingUser = await prisma.users.findFirst({
        where: {
          id: { not: id }, // exclude current user
          OR: orConditions,
        },
      });

      if (existingUser) {
        if (existingUser.user_name === data.user_name) {
          throw new AppError(
            ERROR_MESSAGE.USERNAME_ALREADY_USED,
            { data: ERROR_MESSAGE.USERNAME_ALREADY_USED },
            400
          );
        }

        if (existingUser.email === data.email) {
          throw new AppError(
            ERROR_MESSAGE.EMAIL_ALREADY_USED,
            { data: ERROR_MESSAGE.EMAIL_ALREADY_USED },
            400
          );
        }
      }
    }

    // 2. Build update payload
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }


    // 3. Update user
    await prisma.users.update({
      where: { id },
      data: {...updateData, updated_at: new Date() , updated_by: authUser?.id },
    });

    // 4. Fetch updated user
    const updatedUser = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        user_name: true,
        full_name: true,
        email: true,
        first_name: true,
        last_name: true,
        country_code: true,
        dob: true,
        phone_no: true,
        gender: true,
        status: true,
        created_at: true,
        updated_at: true,

        // sensitive fields are excluded
        password: false,
        refresh_token: false,
        is_admin: false,
        is_superuser: false,
      },
    });

    return updatedUser || false;
  }




  async deleteUser(id: string, authUser: any) {
    // 1. Check if user exists & not deleted
    const user = await prisma.users.findFirst({
      where: {
        id: id,
        is_deleted: false,
      },
    });

    if (!user) {
      throw new AppError(
        ERROR_MESSAGE.USER_NOT_FOUND,
        { data: ERROR_MESSAGE.USER_NOT_FOUND },
        400
      );
    }
    console.log("Deleting User ID:", id, authUser.id);

    // 2. Perform soft delete
    const deletedUser = await prisma.users.update({
      where: { id },
      data: {
        is_deleted: true,
        updated_by: authUser.id,
        updated_at: new Date(),
      },
    });

    // 3. Response
    return {
      id: deletedUser.id,
      message: "User soft deleted successfully",
      deletedAt: new Date(),
    };
  }

  async updateUserStatus(id: string, status: string, authUser: any) {
    // 1. Check if user exists & not deleted
    const user = await prisma.users.findFirst({
      where: {
        id: id,
        is_deleted: false,
      },
    });

    if (!user) {
      throw new AppError(
        ERROR_MESSAGE.USER_NOT_FOUND,
        {
          data: ERROR_MESSAGE.USER_NOT_FOUND,
        },
        400
      );
    }

    // 2. Update status
    await prisma.users.update({
      where: { id },
      data: {
        status: status,
        updated_by: authUser.id,
        updated_at: new Date(),
      },
    });

    return true;
  }




}

export default new AuthService();
