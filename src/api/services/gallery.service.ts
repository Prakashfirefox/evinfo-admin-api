// src/api/services/gallery.service.ts
import prisma from "../../db/client";
import AppError from "../core/error-handler";
import * as GalleryInterfaces from "../interfaces/gallery.interface";

class GalleryService {

  async addItem(payload: GalleryInterfaces.CreateGalleryItemPayload, authUser: any) {
    const { entity_type, entity_id, media_type, category, url, thumbnail, title, description, order, is_primary } = payload;

    await this.verifyEntityExists(entity_type, entity_id);

    // If setting as primary, unset all other primary items for this entity
    if (is_primary) {
      await (prisma as any).gallery.updateMany({
        where: { entity_type, entity_id, is_primary: true, is_deleted: false },
        data: { is_primary: false },
      });
    }

    const item = await (prisma as any).gallery.create({
      data: {
        entity_type,
        entity_id,
        media_type,
        category: category || "exterior",
        url,
        thumbnail: thumbnail || null,
        title: title || null,
        description: description || null,
        order: order || 0,
        is_primary: is_primary || false,
        created_by: authUser?.id || null,
      },
    });

    return item;
  }

  async getItems(payload: GalleryInterfaces.GetGalleryPayload) {
    const { entity_type, entity_id, media_type, category } = payload;

    const where: any = { entity_type, entity_id, is_deleted: false };
    if (media_type) where.media_type = media_type;
    if (category) where.category = category;

    const items = await (prisma as any).gallery.findMany({
      where,
      orderBy: [{ is_primary: "desc" }, { order: "asc" }, { created_at: "desc" }],
    });

    const images = items.filter((i: any) => i.media_type === "image");
    const videos = items.filter((i: any) => i.media_type === "video");

    // Group images by category
    const imagesByCategory: Record<string, any[]> = {};
    images.forEach((img: any) => {
      if (!imagesByCategory[img.category]) imagesByCategory[img.category] = [];
      imagesByCategory[img.category].push(img);
    });

    return { items, images, videos, imagesByCategory, total: items.length };
  }

  async updateItem(id: string, payload: GalleryInterfaces.UpdateGalleryItemPayload, authUser: any) {
    const item = await (prisma as any).gallery.findFirst({ where: { id, is_deleted: false } });
    if (!item) throw new AppError("Gallery item not found", {}, 404);

    if (payload.is_primary) {
      await (prisma as any).gallery.updateMany({
        where: { entity_type: item.entity_type, entity_id: item.entity_id, is_primary: true, is_deleted: false, id: { not: id } },
        data: { is_primary: false },
      });
    }

    const updated = await (prisma as any).gallery.update({
      where: { id },
      data: { ...payload },
    });
    return updated;
  }

  async deleteItem(id: string) {
    const item = await (prisma as any).gallery.findFirst({ where: { id, is_deleted: false } });
    if (!item) throw new AppError("Gallery item not found", {}, 404);

    await (prisma as any).gallery.update({ where: { id }, data: { is_deleted: true } });
    return { message: "Item deleted successfully" };
  }

  async reorderItems(items: { id: string; order: number }[]) {
    await Promise.all(
      items.map(({ id, order }) =>
        (prisma as any).gallery.update({ where: { id }, data: { order } })
      )
    );
    return { message: "Reordered successfully" };
  }

  private async verifyEntityExists(type: GalleryInterfaces.GalleryEntityType, id: string) {
    switch (type) {
      case "variant": {
        const e = await prisma.variant.findFirst({ where: { id, is_deleted: false } });
        if (!e) throw new AppError("Variant not found", {}, 404);
        break;
      }
      case "model": {
        const e = await prisma.vehicleModel.findFirst({ where: { id, is_deleted: false } });
        if (!e) throw new AppError("Model not found", {}, 404);
        break;
      }
      case "sub_variant": {
        const e = await prisma.subVariant.findFirst({ where: { id, is_deleted: false } });
        if (!e) throw new AppError("Sub-variant not found", {}, 404);
        break;
      }
    }
  }
}

export default new GalleryService();
