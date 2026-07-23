import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as SpecInterfaces from "../interfaces/specifications.interface";

class SpecificationsService {

  async upsertSpecifications(data: SpecInterfaces.UpsertSpecificationsPayload, authUser: any) {
    const subVariant = await prisma.subVariant.findFirst({
      where: { id: data.sub_variant_id, is_deleted: false },
    });
    if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

    const existing = await prisma.specifications.findFirst({
      where: { sub_variant_id: data.sub_variant_id },
    });

    const { sub_variant_id, ...fields } = data;

    if (existing) {
      return prisma.specifications.update({
        where: { id: existing.id },
        data: { ...fields, updated_by: authUser.id, updated_at: new Date() },
      });
    }

    return prisma.specifications.create({
      data: {
        sub_variant_id,
        ...fields,
        created_by: authUser.id,
        updated_by: authUser.id,
      },
    });
  }

  async getSpecificationsBySubVariant(subVariantId: string) {
    const subVariant = await prisma.subVariant.findFirst({
      where: { id: subVariantId, is_deleted: false },
    });
    if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

    return prisma.specifications.findFirst({
      where: { sub_variant_id: subVariantId },
    });
  }

  async getSpecificationsById(id: string) {
    return prisma.specifications.findFirst({ where: { id } });
  }

  async updateSpecifications(id: string, data: SpecInterfaces.UpdateSpecificationsPayload, authUser: any) {
    const record = await prisma.specifications.findFirst({ where: { id } });
    if (!record) throw new AppError(ERROR_MESSAGE.SPECIFICATIONS_NOT_FOUND, {}, 400);

    return prisma.specifications.update({
      where: { id },
      data: { ...data, updated_by: authUser.id, updated_at: new Date() },
    });
  }

  async deleteSpecifications(id: string, authUser: any) {
    const record = await prisma.specifications.findFirst({ where: { id } });
    if (!record) throw new AppError(ERROR_MESSAGE.SPECIFICATIONS_NOT_FOUND, {}, 400);

    await prisma.specifications.delete({ where: { id } });
    return { id, deletedAt: new Date() };
  }

  // Returns specs for all sub-variants in one call — used by the compare endpoint
  async getSpecsForComparison(subVariantIds: string[]) {
    return prisma.specifications.findMany({
      where: { sub_variant_id: { in: subVariantIds } },
    });
  }
}

export default new SpecificationsService();
