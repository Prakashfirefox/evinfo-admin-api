import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as SubVariantInterfaces from "../interfaces/sub-variant.interface";

class SubVariantService {

  async createSubVariant(data: SubVariantInterfaces.CreateSubVariantPayload, authUser: any) {
    const variant = await prisma.variant.findFirst({
      where: { id: data.variant_id, is_deleted: false },
    });
    if (!variant) throw new AppError(ERROR_MESSAGE.VARIANT_NOT_FOUND, {}, 400);

    const existing = await prisma.subVariant.findFirst({
      where: { slug: data.slug, is_deleted: false },
    });
    if (existing) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_SLUG_ALREADY_USED, {}, 400);

    const duplicate = await prisma.subVariant.findFirst({
      where: {
        variant_id: data.variant_id,
        fuel_type: data.fuel_type,
        transmission: data.transmission,
        is_deleted: false,
      },
    });
    if (duplicate) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_ALREADY_EXISTS, {}, 400);

    return prisma.subVariant.create({
      data: {
        slug: data.slug,
        name: data.name,
        variant_id: data.variant_id,
        fuel_type: data.fuel_type,
        transmission: data.transmission,
        engine: data.engine,
        drivetrain: data.drivetrain,
        ownership: data.ownership,
        status: data.status || "active",
        view_count: 0,
        created_by: authUser.id,
        updated_by: authUser.id,
      },
      include: this._include(),
    });
  }

  async getSubVariantById(id: string) {
    const sv = await prisma.subVariant.findFirst({
      where: { id, is_deleted: false },
      include: this._includeWithDetails(),
    });
    return sv ? this._attachGallery(sv) : null;
  }

  async getSubVariantBySlug(slug: string) {
    await prisma.subVariant.updateMany({
      where: { slug, is_deleted: false },
      data: { view_count: { increment: 1 } },
    });
    const sv = await prisma.subVariant.findFirst({
      where: { slug, is_deleted: false },
      include: this._includeWithDetails(),
    });
    return sv ? this._attachGallery(sv) : null;
  }

  async getAllSubVariants(payload: SubVariantInterfaces.GetAllSubVariantsPayload) {
    const {
      search,
      offset = 0,
      limit = 10,
      status,
      variant_id,
      model_id,
      brand_id,
      fuel_type,
      transmission,
      sort_by = "created_at",
      sort_order = "desc",
    } = payload;

    const where: any = { is_deleted: false };

    if (status) where.status = status;
    if (variant_id) where.variant_id = variant_id;
    if (fuel_type) where.fuel_type = fuel_type;
    if (transmission) where.transmission = transmission;

    if (model_id || brand_id) {
      where.variant = {
        ...(model_id ? { model_id } : {}),
        ...(brand_id ? { model: { brand_id } } : {}),
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { engine: { contains: search, mode: "insensitive" } },
      ];
    }

    const [rows, count] = await Promise.all([
      prisma.subVariant.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: this._include(),
      }),
      prisma.subVariant.count({ where }),
    ]);

    return { rows, count };
  }

  async getSubVariantsByVariant(variantId: string, payload: any) {
    const { offset = 0, limit = 50, status, fuel_type, transmission } = payload;

    const variant = await prisma.variant.findFirst({
      where: { id: variantId, is_deleted: false },
    });
    if (!variant) throw new AppError(ERROR_MESSAGE.VARIANT_NOT_FOUND, {}, 400);

    const where: any = { variant_id: variantId, is_deleted: false };
    if (status) where.status = status;
    if (fuel_type) where.fuel_type = fuel_type;
    if (transmission) where.transmission = transmission;

    const [rows, count] = await Promise.all([
      prisma.subVariant.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: [{ fuel_type: "asc" }, { transmission: "asc" }],
        include: {
          pricing: { where: { is_active: true, city: null }, take: 1 },
          specs: { take: 1 },
        },
      }),
      prisma.subVariant.count({ where }),
    ]);

    return { rows, count };
  }

  async updateSubVariant(id: string, data: SubVariantInterfaces.UpdateSubVariantPayload, authUser: any) {
    const subVariant = await prisma.subVariant.findFirst({
      where: { id, is_deleted: false },
    });
    if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

    if (data.slug && data.slug !== subVariant.slug) {
      const existing = await prisma.subVariant.findFirst({
        where: { slug: data.slug, is_deleted: false },
      });
      if (existing) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_SLUG_ALREADY_USED, {}, 400);
    }

    return prisma.subVariant.update({
      where: { id },
      data: { ...data, updated_by: authUser.id, updated_at: new Date() },
      include: this._include(),
    });
  }

  async deleteSubVariant(id: string, authUser: any) {
    const subVariant = await prisma.subVariant.findFirst({
      where: { id, is_deleted: false },
    });
    if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

    const reviewCount = await prisma.review.count({
      where: { sub_variant_id: id, is_deleted: false },
    });
    if (reviewCount > 0) {
      throw new AppError(ERROR_MESSAGE.SUB_VARIANT_HAS_REVIEWS, { reviewCount }, 400);
    }

    await prisma.subVariant.update({
      where: { id },
      data: { is_deleted: true, updated_by: authUser.id, updated_at: new Date() },
    });

    return { id, deletedAt: new Date() };
  }

  async updateSubVariantStatus(id: string, status: string, authUser: any) {
    const subVariant = await prisma.subVariant.findFirst({
      where: { id, is_deleted: false },
    });
    if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

    await prisma.subVariant.update({
      where: { id },
      data: { status, updated_by: authUser.id, updated_at: new Date() },
    });

    return true;
  }

  async bulkUpdateSubVariantStatus(
    payload: SubVariantInterfaces.BulkUpdateSubVariantStatusPayload,
    authUser: any
  ) {
    const { sub_variant_ids, status } = payload;

    const result = await prisma.subVariant.updateMany({
      where: { id: { in: sub_variant_ids }, is_deleted: false },
      data: { status, updated_by: authUser.id, updated_at: new Date() },
    });

    return { updatedCount: result.count };
  }

  async compareSubVariants(payload: SubVariantInterfaces.CompareSubVariantsPayload) {
    const { sub_variant_ids } = payload;

    const subVariants = await prisma.subVariant.findMany({
      where: {
        id: { in: sub_variant_ids },
        is_deleted: false,
        status: "active",
      },
      include: this._includeWithDetails(),
    });

    if (subVariants.length !== sub_variant_ids.length) {
      throw new AppError(ERROR_MESSAGE.SOME_SUB_VARIANTS_NOT_FOUND, {}, 400);
    }

    return subVariants;
  }

  async getFeaturedSubVariants() {
    const rows = await prisma.subVariant.findMany({
      where: {
        is_deleted: false,
        status: "active",
        variant: { featured: true, is_deleted: false },
      },
      take: 12,
      include: this._include(),
      orderBy: { created_at: "desc" },
    });
    return this._attachPrimaryImages(rows);
  }

  async getLatestSubVariants() {
    const rows = await prisma.subVariant.findMany({
      where: { is_deleted: false, status: "active" },
      take: 12,
      include: this._include(),
      orderBy: { created_at: "desc" },
    });
    return this._attachPrimaryImages(rows);
  }

  // ── Public endpoints ────────────────────────────────────────────────────────

  async getPublicSubVariants(payload: SubVariantInterfaces.GetAllSubVariantsPayload) {
    const {
      offset = 0,
      limit = 10,
      variant_id,
      model_id,
      brand_id,
      fuel_type,
      transmission,
      min_price,
      max_price,
      sort_by = "created_at",
      sort_order = "desc",
    } = payload;

    const where: any = { is_deleted: false, status: "active" };

    if (variant_id) where.variant_id = variant_id;
    if (fuel_type) where.fuel_type = fuel_type;
    if (transmission) where.transmission = transmission;

    if (model_id || brand_id) {
      where.variant = {
        ...(model_id ? { model_id } : {}),
        ...(brand_id ? { model: { brand_id } } : {}),
      };
    }

    if (min_price !== undefined || max_price !== undefined) {
      where.pricing = {
        some: {
          is_active: true,
          city: null,
          ...(min_price !== undefined && { ex_showroom_price: { gte: min_price } }),
          ...(max_price !== undefined && { ex_showroom_price: { lte: max_price } }),
        },
      };
    }

    const [rows, count] = await Promise.all([
      prisma.subVariant.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: {
          variant: {
            select: {
              id: true,
              name: true,
              slug: true,
              cover_image: true,
              colors: true,
              model: {
                select: {
                  id: true,
                  name: true,
                  body_type: true,
                  brand: { select: { id: true, name: true, logo: true } },
                },
              },
            },
          },
          pricing: { where: { is_active: true, city: null }, take: 1 },
          specs: { take: 1 },
        },
      }),
      prisma.subVariant.count({ where }),
    ]);

    const enriched = await this._attachPrimaryImages(rows);
    return { rows: enriched, count };
  }

  // Attach one primary display image per row:
  // sub-variant primary gallery → variant primary gallery → variant.cover_image
  private async _attachPrimaryImages(rows: any[]) {
    if (rows.length === 0) return rows;
    const svIds = rows.map(r => r.id);
    const varIds = [...new Set(rows.map(r => r.variant?.id).filter(Boolean))];
    const primaries = await (prisma as any).gallery.findMany({
      where: {
        OR: [
          { entity_type: "sub_variant", entity_id: { in: svIds } },
          { entity_type: "variant", entity_id: { in: varIds } },
        ],
        is_primary: true,
        is_deleted: false,
        media_type: "image",
      },
      select: { entity_type: true, entity_id: true, url: true },
    });
    const svImg: Record<string, string> = {};
    const varImg: Record<string, string> = {};
    primaries.forEach((g: any) => {
      if (g.entity_type === "sub_variant") svImg[g.entity_id] = g.url;
      else varImg[g.entity_id] = g.url;
    });
    return rows.map(r => ({
      ...r,
      primary_image: svImg[r.id] ?? varImg[r.variant?.id] ?? r.variant?.cover_image ?? null,
    }));
  }

  async getPublicSubVariantById(id: string) {
    await prisma.subVariant.updateMany({
      where: { id, is_deleted: false },
      data: { view_count: { increment: 1 } },
    });
    const sv = await prisma.subVariant.findFirst({
      where: { id, is_deleted: false, status: "active" },
      include: this._includeWithDetails(),
    });
    return sv ? this._attachGallery(sv) : null;
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private _include() {
    return {
      variant: {
        select: {
          id: true,
          name: true,
          slug: true,
          cover_image: true,
          colors: true,
          model: {
            select: {
              id: true,
              name: true,
              slug: true,
              body_type: true,
              brand: { select: { id: true, name: true, slug: true, logo: true } },
            },
          },
        },
      },
      pricing: { where: { is_active: true, city: null }, take: 1 },
      specs: { take: 1 },
    };
  }

  private async _attachGallery(sv: any) {
    let gallery = await (prisma as any).gallery.findMany({
      where: { entity_type: "sub_variant", entity_id: sv.id, is_deleted: false, media_type: "image" },
      orderBy: [{ is_primary: "desc" }, { order: "asc" }],
      select: { id: true, url: true, category: true, title: true, is_primary: true },
    });
    // Photos live on the Variant (shared by its sub-variants); a sub-variant
    // only overrides when it has its own shots.
    if (gallery.length === 0 && sv.variant?.id) {
      gallery = await (prisma as any).gallery.findMany({
        where: { entity_type: "variant", entity_id: sv.variant.id, is_deleted: false, media_type: "image" },
        orderBy: [{ is_primary: "desc" }, { order: "asc" }],
        select: { id: true, url: true, category: true, title: true, is_primary: true },
      });
    }
    return { ...sv, gallery };
  }

  private _includeWithDetails() {
    return {
      variant: {
        select: {
          id: true,
          name: true,
          slug: true,
          cover_image: true,
          colors: true,
          competitor_ids: true,
          model: {
            select: {
              id: true,
              name: true,
              slug: true,
              body_type: true,
              generation: true,
              timeline: true,
              brand: { select: { id: true, name: true, slug: true, logo: true, country: true } },
            },
          },
        },
      },
      pricing: { where: { is_active: true }, orderBy: { created_at: "asc" as const } },
      specs: true,
      reviews: {
        where: { is_deleted: false, status: "approved" },
        take: 10,
        orderBy: { created_at: "desc" as const },
      },
    };
  }
}

export default new SubVariantService();
