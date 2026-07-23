// src/api/services/vehicleModel.service.ts
import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as VehicleModelInterfaces from "../interfaces/vehicleModel.interface";

class VehicleModelService {

    async createModel(data: VehicleModelInterfaces.CreateVehicleModelPayload, authUser: any) {
        // Check if brand exists
        const brand = await prisma.brand.findFirst({
            where: { id: data.brand_id, is_deleted: false }
        });

        if (!brand) {
            throw new AppError(ERROR_MESSAGE.BRAND_NOT_FOUND, {}, 400);
        }

        // Check for duplicate slug or name within same brand
        const existing = await prisma.vehicleModel.findFirst({
            where: {
                OR: [
                    { slug: data.slug },
                    { 
                        AND: [
                            { name: data.name },
                            { brand_id: data.brand_id }
                        ]
                    }
                ],
                is_deleted: false,
            },
        });

        if (existing) {
            if (existing.slug === data.slug)
                throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_SLUG_ALREADY_USED, {}, 400);

            if (existing.name === data.name && existing.brand_id === data.brand_id)
                throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_NAME_ALREADY_USED_IN_BRAND, {}, 400);
        }

        const { body_type, production_years, ...restData } = data;
        return prisma.vehicleModel.create({
            data: {
                ...restData,
                ...(body_type !== undefined && { body_type: body_type }),
                ...(production_years !== undefined && { production_years: production_years }),
                created_by: authUser.id,
                updated_by: authUser.id,
                created_at: new Date(),
                updated_at: new Date(),
                status: data.status || "active"
            },
            include: {
                brand: true
            }
        });
    }

    async getModelById(id: string) {
        return prisma.vehicleModel.findFirst({
            where: { 
                id, 
                is_deleted: false 
            },
            include: {
                brand: true,
                variants: {
                    where: { is_deleted: false },
                    take: 10
                }
            }
        });
    }

    async getAllModels(payload: VehicleModelInterfaces.GetAllVehicleModelsPayload) {
        const { search, offset = 0, limit = 10, status, brand_id, sort_by = "name", sort_order = "asc" } = payload;

        const where: any = { is_deleted: false };

        if (status) where.status = status;
        if (brand_id) where.brand_id = brand_id;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { generation: { contains: search, mode: "insensitive" } },
                { body_type: { contains: search, mode: "insensitive" } },
            ];
        }

        const rows = await prisma.vehicleModel.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { [sort_by]: sort_order },
            include: {
                brand: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        logo: true
                    }
                },
                _count: {
                    select: {
                        variants: { where: { is_deleted: false } }
                    }
                }
            }
        });

        const count = await prisma.vehicleModel.count({ where });

        return { rows, count };
    }

    async updateModel(id: string, data: VehicleModelInterfaces.UpdateVehicleModelPayload, authUser: any) {
        const model = await prisma.vehicleModel.findFirst({
            where: { id, is_deleted: false },
        });

        if (!model)
            throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_NOT_FOUND, {}, 400);

        // If brand_id is being updated, check if new brand exists
        if (data.brand_id) {
            const brand = await prisma.brand.findFirst({
                where: { id: data.brand_id, is_deleted: false }
            });

            if (!brand) {
                throw new AppError(ERROR_MESSAGE.BRAND_NOT_FOUND, {}, 400);
            }
        }

        // Check for duplicates
        if (data.slug || data.name) {
            const orConditions: any[] = [];

            if (data.slug) {
                orConditions.push({ slug: data.slug });
            }

            if (data.name) {
                orConditions.push({ 
                    AND: [
                        { name: data.name },
                        { brand_id: data.brand_id || model.brand_id }
                    ]
                });
            }

            if (orConditions.length > 0) {
                const duplicate = await prisma.vehicleModel.findFirst({
                    where: {
                        id: { not: id },
                        OR: orConditions,
                        is_deleted: false
                    },
                });

                if (duplicate) {
                    throw new AppError(
                        ERROR_MESSAGE.VEHICLE_MODEL_ALREADY_EXISTS,
                        { duplicate },
                        400
                    );
                }
            }
        }

        const { body_type, production_years, ...restUpdateData } = data;
        return prisma.vehicleModel.update({
            where: { id },
            data: {
                ...restUpdateData,
                ...(body_type !== undefined && { body_type: body_type }),
                ...(production_years !== undefined && { production_years: production_years }),
                updated_by: authUser.id,
                updated_at: new Date(),
            },
            include: {
                brand: true
            }
        });
    }

    async deleteModel(id: string, authUser: any) {
        const model = await prisma.vehicleModel.findFirst({
            where: { id, is_deleted: false },
            include: {
                variants: {
                    where: { is_deleted: false }
                }
            }
        });

        if (!model)
            throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_NOT_FOUND, {}, 400);

        // Check if model has associated variants
        if (model.variants.length > 0) {
            throw new AppError(
                ERROR_MESSAGE.VEHICLE_MODEL_HAS_ASSOCIATIONS,
                { variantsCount: model.variants.length },
                400
            );
        }

        await prisma.vehicleModel.update({
            where: { id },
            data: {
                is_deleted: true,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return { id, deletedAt: new Date() };
    }

    async updateModelStatus(id: string, status: VehicleModelInterfaces.VehicleModelStatus, authUser: any) {
        const model = await prisma.vehicleModel.findFirst({
            where: { id, is_deleted: false },
        });

        if (!model)
            throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_NOT_FOUND, {}, 400);

        await prisma.vehicleModel.update({
            where: { id },
            data: {
                status,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return true;
    }

    async getModelsByBrand(payload: VehicleModelInterfaces.GetModelsByBrandPayload) {
        const { brand_id, offset = 0, limit = 10, status } = payload;

        const where: any = {
            brand_id,
            is_deleted: false
        };

        if (status) where.status = status;

        const models = await prisma.vehicleModel.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                brand: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                    }
                },
                _count: {
                    select: {
                        variants: { where: { is_deleted: false } }
                    }
                }
            },
            orderBy: { name: "asc" }
        });

        const count = await prisma.vehicleModel.count({ where });

        return { rows: models, count };
    }

    
    async getPublicModels(payload: VehicleModelInterfaces.GetAllVehicleModelsPayload) {
        const { search, offset = 0, limit = 10, status = "active", brand_id, body_type, sort_by = "name", sort_order = "asc" } = payload;
        const where: any = { is_deleted: false, status };

        if (brand_id) where.brand_id = brand_id;
        // contains (not equals) so legacy values like "Compact SUV" still match the
        // canonical filter value "SUV" until models are re-saved with clean types
        if (body_type) where.body_type = { contains: body_type, mode: "insensitive" };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { generation: { contains: search, mode: "insensitive" } },
                { body_type: { contains: search, mode: "insensitive" } },
            ];
        }

        const [rows, count] = await Promise.all([
            prisma.vehicleModel.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { [sort_by]: sort_order },
                include: {
                    brand: { select: { id: true, name: true, slug: true, logo: true } },
                    _count: { select: { variants: { where: { is_deleted: false } } } },
                    variants: {
                        where: { is_deleted: false },
                        select: {
                            id: true,
                            slug: true,
                            cover_image: true,
                            sub_variants: {
                                where: { is_deleted: false, status: "active" },
                                select: {
                                    id: true,
                                    slug: true,
                                    fuel_type: true,
                                    transmission: true,
                                    pricing: {
                                        where: { city: null, is_active: true },
                                        select: { ex_showroom_price: true },
                                        take: 1
                                    }
                                }
                            }
                        },
                        take: 10
                    }
                }
            }),
            prisma.vehicleModel.count({ where })
        ]);

        // Photos live on the Variant now (shared by sub-variants). Batch-fetch
        // primary gallery images for BOTH sub-variants and variants in one query,
        // so the representative image resolves: sub-variant → variant → cover_image.
        const allSubVariantIds = rows.flatMap(r =>
            r.variants.flatMap(v => v.sub_variants.map(sv => sv.id))
        );
        const allVariantIds = rows.flatMap(r => r.variants.map(v => v.id));
        const svImg: Record<string, string> = {};
        const varImg: Record<string, string> = {};
        if (allSubVariantIds.length > 0 || allVariantIds.length > 0) {
            const primaryImages = await (prisma as any).gallery.findMany({
                where: {
                    OR: [
                        { entity_type: "sub_variant", entity_id: { in: allSubVariantIds } },
                        { entity_type: "variant", entity_id: { in: allVariantIds } },
                    ],
                    is_primary: true,
                    is_deleted: false,
                    media_type: "image",
                },
                select: { entity_type: true, entity_id: true, url: true },
            });
            primaryImages.forEach((img: any) => {
                if (img.entity_type === "sub_variant") svImg[img.entity_id] = img.url;
                else varImg[img.entity_id] = img.url;
            });
        }

        const enriched = rows.map(({ variants, _count, ...model }) => {
            const allSubVariants = variants.flatMap(v => v.sub_variants);
            const prices = allSubVariants
                .flatMap(sv => sv.pricing.map(p => p.ex_showroom_price))
                .filter((p): p is number => p !== null);
            const rep = variants[0];
            const firstSvId = allSubVariants[0]?.id;
            const representativeImage =
                (firstSvId && svImg[firstSvId]) ||
                varImg[rep?.id ?? ""] ||
                rep?.cover_image ||
                null;
            return {
                ...model,
                variantCount: _count.variants,
                minPrice: prices.length > 0 ? Math.min(...prices) : null,
                representativeSlug: allSubVariants[0]?.slug ?? null,
                representativeImage,
            };
        });

        return { rows: enriched, count };
    }
}

export default new VehicleModelService();