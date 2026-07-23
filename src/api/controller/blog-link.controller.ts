// src/api/controller/blog-link.controller.ts
import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import BlogLinkService from "../services/blog-link.service";

class BlogLinkController {

  // POST /blog-links/add
  async addLink(req: any, res: any) {
    try {
      const payload = req.body;
      if (!payload.blog_id) throw new AppError("blog_id is required", {}, 400);
      if (!payload.linked_type) throw new AppError("linked_type is required", {}, 400);
      if (!payload.linked_id) throw new AppError("linked_id is required", {}, 400);
      if (!["vehicle", "brand", "model"].includes(payload.linked_type)) {
        throw new AppError("linked_type must be vehicle, brand, or model", {}, 400);
      }

      const link = await BlogLinkService.addLink(payload, req.authUsersDetails);
      Responser.success(res, true, "Link added successfully", link, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // POST /blog-links/remove
  async removeLink(req: any, res: any) {
    try {
      const payload = req.body;
      if (!payload.blog_id) throw new AppError("blog_id is required", {}, 400);
      if (!payload.linked_type) throw new AppError("linked_type is required", {}, 400);
      if (!payload.linked_id) throw new AppError("linked_id is required", {}, 400);

      const result = await BlogLinkService.removeLink(payload);
      Responser.success(res, true, "Link removed successfully", result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // GET /blog-links/blog/:blogId
  async getBlogLinks(req: any, res: any) {
    try {
      const { blogId } = req.params;
      const { linked_type } = req.query;
      if (!blogId) throw new AppError("blogId is required", {}, 400);

      const data = await BlogLinkService.getBlogLinks({ blog_id: blogId, linked_type });
      Responser.success(res, true, "Blog links fetched successfully", data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // GET /blog-links/entity/:type/:entityId
  async getLinkedBlogs(req: any, res: any) {
    try {
      const { type, entityId } = req.params;
      const { offset = 0, limit = 10 } = req.query;

      if (!["vehicle", "brand", "model"].includes(type)) {
        throw new AppError("type must be vehicle, brand, or model", {}, 400);
      }

      const data = await BlogLinkService.getLinkedBlogs({
        linked_type: type,
        linked_id: entityId,
        offset: Number(offset),
        limit: Number(limit),
      });
      Responser.success(res, true, "Linked blogs fetched successfully", data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new BlogLinkController();
