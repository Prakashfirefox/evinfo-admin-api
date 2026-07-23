// src/api/controller/gallery.controller.ts
import Responser from "../core/responser";
import AppError from "../core/error-handler";
import GalleryService from "../services/gallery.service";

const VALID_ENTITY_TYPES = ["variant", "model", "sub_variant"];
const VALID_MEDIA_TYPES = ["image", "video"];

class GalleryController {

  // POST /gallery/add
  async addItem(req: any, res: any) {
    try {
      const payload = req.body;
      if (!payload.entity_type) throw new AppError("entity_type is required", {}, 400);
      if (!payload.entity_id) throw new AppError("entity_id is required", {}, 400);
      if (!payload.media_type) throw new AppError("media_type is required", {}, 400);
      if (!payload.url) throw new AppError("url is required", {}, 400);
      if (!VALID_ENTITY_TYPES.includes(payload.entity_type))
        throw new AppError("entity_type must be variant, model, or sub_variant", {}, 400);
      if (!VALID_MEDIA_TYPES.includes(payload.media_type))
        throw new AppError("media_type must be image or video", {}, 400);

      const item = await GalleryService.addItem(payload, req.authUsersDetails);
      Responser.success(res, true, "Gallery item added successfully", item, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // GET /gallery/:entityType/:entityId
  async getItems(req: any, res: any) {
    try {
      const { entityType, entityId } = req.params;
      const { media_type, category } = req.query;

      if (!VALID_ENTITY_TYPES.includes(entityType))
        throw new AppError("entityType must be variant, model, or sub_variant", {}, 400);

      const data = await GalleryService.getItems({
        entity_type: entityType,
        entity_id: entityId,
        media_type,
        category,
      });
      Responser.success(res, true, "Gallery items fetched successfully", data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // PATCH /gallery/:id
  async updateItem(req: any, res: any) {
    try {
      const { id } = req.params;
      const payload = req.body;
      const item = await GalleryService.updateItem(id, payload, req.authUsersDetails);
      Responser.success(res, true, "Gallery item updated successfully", item, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // DELETE /gallery/:id
  async deleteItem(req: any, res: any) {
    try {
      const { id } = req.params;
      const result = await GalleryService.deleteItem(id);
      Responser.success(res, true, "Gallery item deleted successfully", result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // POST /gallery/reorder
  async reorderItems(req: any, res: any) {
    try {
      const { items } = req.body;
      if (!Array.isArray(items)) throw new AppError("items must be an array", {}, 400);
      const result = await GalleryService.reorderItems(items);
      Responser.success(res, true, "Gallery reordered successfully", result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new GalleryController();
