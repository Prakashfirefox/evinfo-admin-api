// src/services/blogs.service.ts
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
  // Create Blog
  async createBlog(data: BlogsInterfaces.CreateBlogPayload, authUser: any): Promise<any> {
    // Check for existing blog with same slug or title
    if (data.slug) {
      const orConditions: any[] = [];

      if (data.slug) {
        orConditions.push({ slug: data.slug });
      }

      if (data.title) {
        orConditions.push({ title: data.title });
      }

      const existingBlog = await prisma.blog.findFirst({
        where: {
          OR: orConditions,
          is_deleted: false
        },
      });

      if (existingBlog) {
        if (data.slug === existingBlog.slug) {
          throw new AppError(
            ERROR_MESSAGE.BLOG_SLUG_ALREADY_USED,
            { data: ERROR_MESSAGE.BLOG_SLUG_ALREADY_USED },
            400
          );
        }

        if (data.title === existingBlog.title) {
          throw new AppError(
            ERROR_MESSAGE.BLOG_TITLE_ALREADY_USED,
            { data: ERROR_MESSAGE.BLOG_TITLE_ALREADY_USED },
            400
          );
        }
      }
    }

    const formattedCategories = data.categories.map((cat) => {
      if (!Object.values(BlogsInterfaces.Categories).includes(cat)) {
        throw new AppError("Invalid category", {}, 400);
      }
      return cat;
    });

    // Prepare data for Prisma - handle null/undefined values properly
    const dataNew: any = {
      title: data.title,
      slug: data.slug,
      created_by: authUser?.id,
      updated_by: authUser?.id,
      created_at: new Date(),
      updated_at: new Date(),
      author_id: authUser?.id,
      categories: formattedCategories,
      status: data.status || 'draft',
      featured: data.featured || false,
      view_count: data.view_count || 0,
      published: data.published || false,
    };

    // Only add optional fields if they exist (remove null/undefined)
    if (data.excerpt !== undefined && data.excerpt !== null) {
      dataNew.excerpt = data.excerpt;
    }

    if (data.cover_images !== undefined && data.cover_images !== null && data.cover_images.length > 0) {
      dataNew.cover_images = data.cover_images;
    }

    if (data.tags !== undefined && data.tags !== null && data.tags.length > 0) {
      dataNew.tags = data.tags;
    }

    if (data.sections !== undefined && data.sections !== null && data.sections.length > 0) {
      dataNew.sections = data.sections;
    }

    if (data.seo !== undefined && data.seo !== null) {
      dataNew.seo = data.seo;
    }

    if (data.published_at !== undefined && data.published_at !== null) {
      dataNew.published_at = data.published_at;
    }

    const newBlog = await prisma.blog.create({ data: dataNew });
    return newBlog;
  }

  async getBlogById(id: string) {
    const blog = await prisma.blog.findFirst({
      where: { id, is_deleted: false }
    });
    return blog || null;
  }

  async getAllBlogs(payload: BlogsInterfaces.GetAllBlogsPayload) {
    const { search, offset = 0, limit = 10, status } = payload;
    console.log("Get All Blogs Payload:", payload);
    // Build Prisma WHERE
    const where: any = {
      is_deleted: false,
    };

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    console.log("Prisma WHERE clause for getAllBlogs:", where);

    // Search conditions
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } }
      ];
    }

    // Fetch rows
    const blogs = await prisma.blog.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { created_at: "desc" }
    });

    // Total count
    const totalCount = await prisma.blog.count({ where });

    return {
      count: totalCount,
      rows: blogs,
    };
  }

  async updateBlog(id: string, data: BlogsInterfaces.UpdateBlogPayload, authUser: any) {
    // Check if blog exists
    const existingBlog = await prisma.blog.findFirst({
      where: { id, is_deleted: false }
    });

    if (!existingBlog) {
      throw new AppError(ERROR_MESSAGE.BLOG_NOT_FOUND, {}, 404);
    }

    // Check for duplicate slug or title (excluding current blog)
    if (data.slug || data.title) {
      const orConditions: any[] = [];

      if (data.slug) {
        orConditions.push({ slug: data.slug });
      }

      if (data.title) {
        orConditions.push({ title: data.title });
      }

      if (orConditions.length > 0) {
        const duplicateBlog = await prisma.blog.findFirst({
          where: {
            id: { not: id },
            OR: orConditions,
            is_deleted: false
          },
        });

        if (duplicateBlog) {
          if (data.slug && data.slug === duplicateBlog.slug) {
            throw new AppError(
              ERROR_MESSAGE.BLOG_SLUG_ALREADY_USED,
              { data: ERROR_MESSAGE.BLOG_SLUG_ALREADY_USED },
              400
            );
          }

          if (data.title && data.title === duplicateBlog.title) {
            throw new AppError(
              ERROR_MESSAGE.BLOG_TITLE_ALREADY_USED,
              { data: ERROR_MESSAGE.BLOG_TITLE_ALREADY_USED },
              400
            );
          }
        }
      }
    }

    // Build update payload - only include fields that are provided
    const updateData: any = {
      updated_at: new Date(),
      updated_by: authUser?.id,
    };

    // Add fields only if they are provided (not undefined)
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.cover_images !== undefined) updateData.cover_images = data.cover_images;
    if (data.author_id !== undefined) updateData.author_id = data.author_id;
    if (data.categories !== undefined) updateData.categories = data.categories;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.sections !== undefined) updateData.sections = data.sections;
    if (data.seo !== undefined) updateData.seo = data.seo;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.view_count !== undefined) updateData.view_count = data.view_count;
    if (data.published !== undefined) updateData.published = data.published;
    if (data.published_at !== undefined) updateData.published_at = data.published_at;

    // Update blog
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return updatedBlog;
  }

  async deleteBlog(id: string, authUser: any) {
    // Check if blog exists & not deleted
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
        is_deleted: false,
      },
    });

    if (!blog) {
      throw new AppError(
        ERROR_MESSAGE.BLOG_NOT_FOUND,
        { data: ERROR_MESSAGE.BLOG_NOT_FOUND },
        404
      );
    }

    // Perform soft delete
    const deletedBlog = await prisma.blog.update({
      where: { id },
      data: {
        is_deleted: true,
        updated_by: authUser.id,
        updated_at: new Date()
      },
    });

    return {
      id: deletedBlog.id,
      title: deletedBlog.title,
      deletedAt: new Date(),
    };
  }

  async updateBlogStatus(id: string, status: BlogsInterfaces.BlogStatus, authUser: any) {
    // Check if blog exists & not deleted
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
        is_deleted: false,
      },
    });

    if (!blog) {
      throw new AppError(
        ERROR_MESSAGE.BLOG_NOT_FOUND,
        { data: ERROR_MESSAGE.BLOG_NOT_FOUND },
        404
      );
    }

    // Update status
    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        status: status,
        updated_by: authUser.id,
        updated_at: new Date(),
        // If status is published, set published_at if not already set
        ...(status === 'published' && !blog.published_at ? {
          published: true,
          published_at: new Date()
        } : {})
      },
    });

    return updatedBlog;
  }

  async getBlogBySlug(slug: string) {
    const blog = await prisma.blog.findFirst({
      where: { slug, is_deleted: false }
    });

    if (blog) {
      // Increment view count
      await prisma.blog.update({
        where: { id: blog.id },
        data: { view_count: { increment: 1 } }
      });
      return blog;
    }
    return null;
  }

  async getPublishedBlogs(payload: BlogsInterfaces.GetAllBlogsPayload) {
    const { search, offset = 0, limit = 10, categories, tags } = payload;

    const where: any = {
      is_deleted: false,
      status: 'published',
      published: true
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } }
      ];
    }

    if (categories && categories.length > 0) {
      where.categories = { hasSome: categories };
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    const blogs = await prisma.blog.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { published_at: "desc" }
    });

    const totalCount = await prisma.blog.count({ where });

    return {
      count: totalCount,
      rows: blogs,
    };
  }
}

export default new BlogsServices();