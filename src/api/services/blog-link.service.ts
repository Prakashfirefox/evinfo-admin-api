// src/api/services/blog-link.service.ts
import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants/index";
import * as BlogLinkInterfaces from "../interfaces/blog-link.interface";

class BlogLinkService {

  // Add a link between a blog and a vehicle/brand/model
  async addLink(payload: BlogLinkInterfaces.AddBlogLinkPayload, authUser: any) {
    const { blog_id, linked_type, linked_id } = payload;

    // Verify blog exists
    const blog = await prisma.blog.findFirst({ where: { id: blog_id, is_deleted: false } });
    if (!blog) throw new AppError(ERROR_MESSAGE.BLOG_NOT_FOUND, {}, 404);

    // Verify linked entity exists
    await this.verifyEntityExists(linked_type, linked_id);

    // Prevent duplicate links
    const existing = await prisma.blogLink.findFirst({ where: { blog_id, linked_type, linked_id } });
    if (existing) throw new AppError("Link already exists", {}, 409);

    const link = await prisma.blogLink.create({
      data: {
        blog_id,
        linked_type,
        linked_id,
        created_by: authUser?.id || null,
      },
    });

    return link;
  }

  // Remove a link
  async removeLink(payload: BlogLinkInterfaces.RemoveBlogLinkPayload) {
    const { blog_id, linked_type, linked_id } = payload;

    const link = await prisma.blogLink.findFirst({ where: { blog_id, linked_type, linked_id } });
    if (!link) throw new AppError("Link not found", {}, 404);

    await prisma.blogLink.delete({ where: { id: link.id } });
    return { message: "Link removed successfully" };
  }

  // Get all links for a blog (optionally filter by type)
  async getBlogLinks(payload: BlogLinkInterfaces.GetBlogLinksPayload) {
    const { blog_id, linked_type } = payload;

    const where: any = { blog_id };
    if (linked_type) where.linked_type = linked_type;

    const links = await prisma.blogLink.findMany({
      where,
      orderBy: { created_at: "desc" },
    });

    // Populate linked entity details for each link
    const populated = await Promise.all(
      links.map(async (link) => {
        const entity = await this.getEntityDetails(link.linked_type as BlogLinkInterfaces.BlogLinkType, link.linked_id);
        return { ...link, linked_entity: entity };
      })
    );

    // Group by type
    const grouped = {
      vehicles: populated.filter(l => l.linked_type === "vehicle"),
      brands: populated.filter(l => l.linked_type === "brand"),
      models: populated.filter(l => l.linked_type === "model"),
    };

    return { links: populated, grouped, total: populated.length };
  }

  // Get all blogs linked to a specific entity (vehicle/brand/model)
  async getLinkedBlogs(payload: BlogLinkInterfaces.GetLinkedBlogsPayload) {
    const { linked_type, linked_id, offset = 0, limit = 10 } = payload;

    const links = await prisma.blogLink.findMany({
      where: { linked_type, linked_id },
      skip: offset,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const total = await prisma.blogLink.count({ where: { linked_type, linked_id } });

    // Populate blog details
    const blogIds = links.map(l => l.blog_id);
    const blogs = await prisma.blog.findMany({
      where: { id: { in: blogIds }, is_deleted: false },
      select: { id: true, title: true, slug: true, status: true, cover_images: true, published_at: true },
    });

    return { blogs, total, offset, limit };
  }

  // Private helpers
  private async verifyEntityExists(type: BlogLinkInterfaces.BlogLinkType, id: string) {
    switch (type) {
      case "sub_variant": {
        const e = await prisma.subVariant.findFirst({ where: { id, is_deleted: false } });
        if (!e) throw new AppError("Sub-variant not found", {}, 404);
        break;
      }
      case "brand": {
        const e = await prisma.brand.findFirst({ where: { id, is_deleted: false } });
        if (!e) throw new AppError("Brand not found", {}, 404);
        break;
      }
      case "model": {
        const e = await prisma.vehicleModel.findFirst({ where: { id, is_deleted: false } });
        if (!e) throw new AppError("Model not found", {}, 404);
        break;
      }
    }
  }

  private async getEntityDetails(type: BlogLinkInterfaces.BlogLinkType, id: string) {
    switch (type) {
      case "sub_variant":
        return prisma.subVariant.findFirst({
          where: { id },
          select: { id: true, name: true, slug: true, status: true },
        });
      case "brand":
        return prisma.brand.findFirst({
          where: { id },
          select: { id: true, name: true, slug: true, logo: true, status: true },
        });
      case "model":
        return prisma.vehicleModel.findFirst({
          where: { id },
          select: { id: true, name: true, slug: true, status: true },
        });
    }
  }
}

export default new BlogLinkService();
