// src/services/auth.service.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { encrypt } from "../utils/crypto.util";
import * as BlogsInterfaces from "../interfaces/blogs.interface";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants/index";
import { auth } from "express-openid-connect";
import prisma from "../../db/client";
import { title } from "process";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret_key";

export class BlogsServices {
  // CreateUser
  async createBlog(data: BlogsInterfaces.CreateBlogPayload, authUser: any): Promise<any> {
    const dataNew = { ...data, created_by: authUser?.id, created_at: new Date(), updated_at: new Date(), author_id: authUser?.id };
    if (data.slug) {
      const orConditions: any[] = [];

      if (data.slug) {
        orConditions.push({ slug: data.slug });
      }

      if (data.title) {
        orConditions.push({ title: data.title });
      }


      const blog = await prisma.blog.findFirst({
        where: {
          OR: orConditions,
        },
      });

      if (blog) {
        if (data.slug === blog.slug) {
          throw new AppError(
            ERROR_MESSAGE.BLOG_SLUG_ALREADY_USED,
            { data: ERROR_MESSAGE.BLOG_SLUG_ALREADY_USED },
            400
          );
        }

        if (data.title === blog.title) {
          throw new AppError(
            ERROR_MESSAGE.BLOG_TITLE_ALREADY_USED,
            { data: ERROR_MESSAGE.BLOG_TITLE_ALREADY_USED },
            400
          );
        }
      }
    }

    const newBlog = await prisma.blog.create({ data: dataNew });
    return newBlog;
  }
  async getBlogById(id: string) {
    const blog = await prisma.blog.findFirst({ where: { id, is_deleted: false } });
    if (blog) {
      return blog;
    }
    return false;
  }
  async getAllBlogs(payload: BlogsInterfaces.GetAllBlogsPayload) {
    const { search, offset, limit, status } = payload;
    // Build Prisma WHERE
    const where: any = {
      is_deleted: false,
    };
    // Search conditions
    if (search) {
      where.AND = {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ]
      };
    }

    // Fetch rows
    const orgs = await prisma.blog.findMany({
      where,
      skip: offset || 0,
      take: limit || 10,
      orderBy: { id: "desc" }
    });

    // Total count
    const totalCount = await prisma.blog.count({ where });

    return {
      count: totalCount,
      rows: orgs,
    };
  }
  async updateBlog(id: string, data: BlogsInterfaces.UpdateBlogPayload, authUser: any) {
    // 1. Check for duplicate user_name or email (excluding current user)
    if (data.slug) {
      const orConditions: any[] = [];

      if (data.slug) {
        orConditions.push({ slug: data.slug });
      }

      if (data.title) {
        orConditions.push({ title: data.title });
      }


      const blog = await prisma.blog.findFirst({
        where: {
          id: { not: id },
          OR: orConditions,
        },
      });

      if (blog) {
        if (data.slug === blog.slug) {
          throw new AppError(
            ERROR_MESSAGE.BLOG_SLUG_ALREADY_USED,
            { data: ERROR_MESSAGE.BLOG_SLUG_ALREADY_USED },
            400
          );
        }

        if (data.title === blog.title) {
          throw new AppError(
            ERROR_MESSAGE.BLOG_TITLE_ALREADY_USED,
            { data: ERROR_MESSAGE.BLOG_TITLE_ALREADY_USED },
            400
          );
        }
      }
    }
    // 2. Build update payload
    const updateData: any = { ...data };

    updateData.updated_at = new Date();
    updateData.updated_by = authUser?.id;

    // 3. Update user
    await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    // 4. Fetch updated user
    const updatedBlog = await prisma.blog.findUnique({
      where: { id }
    });

    return updatedBlog || false;
  }
  async deleteBlog(id: string, authUser: any) {
    // 1. Check if user exists & not deleted
    const org = await prisma.blog.findFirst({
      where: {
        id: id,
        is_deleted: false,
      },
    });

    if (!org) {
      throw new AppError(
        ERROR_MESSAGE.BLOG_NOT_FOUND,
        { data: ERROR_MESSAGE.BLOG_NOT_FOUND },
        400
      );
    }
    // 2. Perform soft delete
    const deletedBlog = await prisma.blog.update({
      where: { id },
      data: {
        is_deleted: true,
        updated_by: authUser.id,
        updated_at: new Date()
      },
    });

    // 3. Response
    return {
      id: deletedBlog.id,
      name: deletedBlog.title,
      deletedAt: new Date(),
    };
  }

  async updateBlogStatus(id: string, status: BlogsInterfaces.BlogStatus, authUser: any) {
    // 1. Check if user exists & not deleted
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
        is_deleted: false,
      },
    });

    if (!blog) {
      throw new AppError(
        ERROR_MESSAGE.BLOG_NOT_FOUND,
        {
          data: ERROR_MESSAGE.BLOG_NOT_FOUND,
        },
        400
      );
    }

    // 2. Update status
    await prisma.blog.update({
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

export default new BlogsServices();
