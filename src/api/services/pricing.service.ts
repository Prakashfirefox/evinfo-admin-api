import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as PricingInterfaces from "../interfaces/pricing.interface";

class PricingService {

  async createPricing(data: PricingInterfaces.CreatePricingPayload, authUser: any) {
    const subVariant = await prisma.subVariant.findFirst({
      where: { id: data.sub_variant_id, is_deleted: false },
    });
    if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

    // Prevent duplicate city entries for the same sub-variant
    const existing = await prisma.pricing.findFirst({
      where: {
        sub_variant_id: data.sub_variant_id,
        city: data.city ?? null,
      },
    });
    if (existing) throw new AppError(ERROR_MESSAGE.PRICING_ALREADY_EXISTS, {}, 400);

    return prisma.pricing.create({
      data: {
        sub_variant_id: data.sub_variant_id,
        city: data.city,
        state: data.state,
        ex_showroom_price: data.ex_showroom_price,
        on_road_price: data.on_road_price,
        insurance: data.insurance,
        registration: data.registration,
        tcs_tax: data.tcs_tax,
        financing: data.financing,
        is_active: data.is_active ?? true,
        created_by: authUser.id,
        updated_by: authUser.id,
      },
    });
  }

  async getPricingById(id: string) {
    return prisma.pricing.findFirst({ where: { id } });
  }

  async getPricingBySubVariant(subVariantId: string, city?: string) {
    const subVariant = await prisma.subVariant.findFirst({
      where: { id: subVariantId, is_deleted: false },
    });
    if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

    const where: any = { sub_variant_id: subVariantId, is_active: true };

    if (city) {
      // Return city-specific price if it exists, otherwise fall back to base (city = null)
      const cityPrice = await prisma.pricing.findFirst({ where: { ...where, city } });
      if (cityPrice) return [cityPrice];
      where.city = null;
    }

    return prisma.pricing.findMany({ where, orderBy: { created_at: "asc" } });
  }

  async getAllPricing(payload: PricingInterfaces.GetPricingPayload) {
    const { sub_variant_id, city, state, is_active, offset = 0, limit = 20 } = payload;

    const where: any = {};
    if (sub_variant_id) where.sub_variant_id = sub_variant_id;
    if (city !== undefined) where.city = city;
    if (state) where.state = state;
    if (is_active !== undefined) where.is_active = is_active;

    const [rows, count] = await Promise.all([
      prisma.pricing.findMany({ where, skip: offset, take: limit, orderBy: { created_at: "asc" } }),
      prisma.pricing.count({ where }),
    ]);

    return { rows, count };
  }

  async updatePricing(id: string, data: PricingInterfaces.UpdatePricingPayload, authUser: any) {
    const record = await prisma.pricing.findFirst({ where: { id } });
    if (!record) throw new AppError(ERROR_MESSAGE.PRICING_NOT_FOUND, {}, 400);

    return prisma.pricing.update({
      where: { id },
      data: { ...data, updated_by: authUser.id, updated_at: new Date() },
    });
  }

  async deletePricing(id: string, authUser: any) {
    const record = await prisma.pricing.findFirst({ where: { id } });
    if (!record) throw new AppError(ERROR_MESSAGE.PRICING_NOT_FOUND, {}, 400);

    await prisma.pricing.delete({ where: { id } });
    return { id, deletedAt: new Date() };
  }

  async getPricingForComparison(subVariantIds: string[], city?: string) {
    const where: any = {
      sub_variant_id: { in: subVariantIds },
      is_active: true,
    };

    // Prefer city-specific price if supplied, else return base (city = null)
    where.city = city ?? null;

    return prisma.pricing.findMany({ where });
  }
}

export default new PricingService();
