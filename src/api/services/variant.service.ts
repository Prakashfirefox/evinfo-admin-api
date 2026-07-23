// src/api/services/variant.service.ts
import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as VariantInterfaces from "../interfaces/variant.interface";

class VariantService {

    async createVariant(data: VariantInterfaces.CreateVariantPayload, authUser: any) {
        // Check if model exists
        const model = await prisma.vehicleModel.findFirst({
            where: { id: data.model_id, is_deleted: false }
        });

        if (!model) {
            throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_NOT_FOUND, {}, 400);
        }

        // Check for duplicate slug or name within same model
        const existing = await prisma.variant.findFirst({
            where: {
                OR: [
                    { slug: data.slug },
                    { 
                        AND: [
                            { name: data.name },
                            { model_id: data.model_id }
                        ]
                    }
                ],
                is_deleted: false,
            },
        });

        if (existing) {
            if (existing.slug === data.slug)
                throw new AppError(ERROR_MESSAGE.VARIANT_SLUG_ALREADY_USED, {}, 400);

            if (existing.name === data.name && existing.model_id === data.model_id)
                throw new AppError(ERROR_MESSAGE.VARIANT_NAME_ALREADY_USED_IN_MODEL, {}, 400);
        }

        const { launch_year, production_status, ...restData } = data;
        return prisma.variant.create({
            data: {
                ...restData,
                launch_year: launch_year,
                production_status: production_status || "in-production",
                created_by: authUser.id,
                updated_by: authUser.id,
                created_at: new Date(),
                updated_at: new Date(),
                status: data.status || "active"
            },
            include: {
                model: {
                    include: {
                        brand: true
                    }
                }
            }
        });
    }

    async getVariantById(id: string) {
        return prisma.variant.findFirst({
            where: { 
                id, 
                is_deleted: false 
            },
            include: {
                model: {
                    include: {
                        brand: true
                    }
                },
                sub_variants: {
                    where: { is_deleted: false },
                    take: 5
                }
            }
        });
    }

    async getAllVariants(payload: VariantInterfaces.GetAllVariantsPayload) {
        const {
            search, offset = 0, limit = 10, status, model_id,
            segment, launch_year, sort_by = "name", sort_order = "asc"
        } = payload;

        const where: any = { is_deleted: false };

        if (status) where.status = status;
        if (model_id) where.model_id = model_id;
        if (segment) where.segment = segment;
        if (launch_year) where.launch_year = launch_year;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { trim: { contains: search, mode: "insensitive" } },
                { segment: { contains: search, mode: "insensitive" } },
            ];
        }

        const rows = await prisma.variant.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { [sort_by]: sort_order },
            include: {
                model: {
                    include: {
                        brand: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                logo: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        sub_variants: { where: { is_deleted: false } }
                    }
                }
            }
        });

        const count = await prisma.variant.count({ where });
        console.log("VariantService.getAllVariants - count:", count);
        return { rows, count };
    }

    async updateVariant(id: string, data: VariantInterfaces.UpdateVariantPayload, authUser: any) {
        const variant = await prisma.variant.findFirst({
            where: { id, is_deleted: false },
        });

        if (!variant)
            throw new AppError(ERROR_MESSAGE.VARIANT_NOT_FOUND, {}, 400);

        // If model_id is being updated, check if new model exists
        if (data.model_id) {
            const model = await prisma.vehicleModel.findFirst({
                where: { id: data.model_id, is_deleted: false }
            });

            if (!model) {
                throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_NOT_FOUND, {}, 400);
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
                        { model_id: data.model_id || variant.model_id }
                    ]
                });
            }

            if (orConditions.length > 0) {
                const duplicate = await prisma.variant.findFirst({
                    where: {
                        id: { not: id },
                        OR: orConditions,
                        is_deleted: false
                    },
                });

                if (duplicate) {
                    throw new AppError(
                        ERROR_MESSAGE.VARIANT_ALREADY_EXISTS,
                        { duplicate },
                        400
                    );
                }
            }
        }

        const { launch_year, production_status, ...restUpdateData } = data;
        return prisma.variant.update({
            where: { id },
            data: {
                ...restUpdateData,
                ...(launch_year !== undefined && { launch_year: launch_year }),
                ...(production_status !== undefined && { production_status }),
                updated_by: authUser.id,
                updated_at: new Date(),
            },
            include: {
                model: {
                    include: {
                        brand: true
                    }
                }
            }
        });
    }

    async deleteVariant(id: string, authUser: any) {
        const variant = await prisma.variant.findFirst({
            where: { id, is_deleted: false },
            include: {
                sub_variants: {
                    where: { is_deleted: false }
                }
            }
        });

        if (!variant)
            throw new AppError(ERROR_MESSAGE.VARIANT_NOT_FOUND, {}, 400);

        // Check if variant has associated sub-variants
        if (variant.sub_variants.length > 0) {
            throw new AppError(
                ERROR_MESSAGE.VARIANT_HAS_ASSOCIATIONS,
                { subVariantsCount: variant.sub_variants.length },
                400
            );
        }

        await prisma.variant.update({
            where: { id },
            data: {
                is_deleted: true,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return { id, deletedAt: new Date() };
    }

    async updateVariantStatus(id: string, status: VariantInterfaces.VariantStatus, authUser: any) {
        const variant = await prisma.variant.findFirst({
            where: { id, is_deleted: false },
        });

        if (!variant)
            throw new AppError(ERROR_MESSAGE.VARIANT_NOT_FOUND, {}, 400);

        await prisma.variant.update({
            where: { id },
            data: {
                status,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return true;
    }

    async getVariantsByModel(payload: VariantInterfaces.GetVariantsByModelPayload) {
        const { model_id, offset = 0, limit = 10, status, segment } = payload;

        const where: any = {
            model_id,
            is_deleted: false
        };

        if (status) where.status = status;
        if (segment) where.segment = segment;

        const variants = await prisma.variant.findMany({
            where,
            skip: offset,
            take: limit,
            include: {
                model: {
                    include: {
                        brand: {
                            select: {
                                id: true,
                                name: true,
                                logo: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        sub_variants: { where: { is_deleted: false } }
                    }
                }
            },
            orderBy: { name: "asc" }
        });

        const count = await prisma.variant.count({ where });

        return { rows: variants, count };
    }

    async getPublicVariants(payload: VariantInterfaces.GetAllVariantsPayload) {
        // Force status to active for public endpoint
        return this.getAllVariants({ ...payload, status: "active" });
    }

    async getPublicVariantById(id: string) {
        const variant = await this.getVariantById(id);
        if (variant?.status !== "active") return null;
        return variant;
    }

    // Competitor cards: hydrate a list of variant ids into display-ready rows
    // (brand · model · variant, price-from, representative slug, primary image)
    async getPublicVariantsByIds(ids: string[]) {
        if (ids.length === 0) return [];
        const rows = await prisma.variant.findMany({
            where: { id: { in: ids }, is_deleted: false, status: "active" },
            include: {
                model: {
                    select: {
                        id: true, name: true, slug: true, body_type: true,
                        brand: { select: { id: true, name: true, slug: true, logo: true } },
                    },
                },
                sub_variants: {
                    where: { is_deleted: false, status: "active" },
                    take: 1,
                    include: {
                        pricing: { where: { is_active: true, city: null }, take: 1 },
                        specs: { take: 1 },
                    },
                },
            },
        });

        // Primary image per variant from its gallery, falling back to cover_image
        const primaries = await (prisma as any).gallery.findMany({
            where: {
                entity_type: "variant",
                entity_id: { in: rows.map(r => r.id) },
                is_primary: true,
                is_deleted: false,
                media_type: "image",
            },
            select: { entity_id: true, url: true },
        });
        const imgMap: Record<string, string> = {};
        primaries.forEach((g: any) => { imgMap[g.entity_id] = g.url; });

        return rows.map(r => ({
            ...r,
            primary_image: imgMap[r.id] ?? r.cover_image ?? null,
        }));
    }

    async getVariantBySlug(slug: string) {
        return prisma.variant.findFirst({
            where: { slug, is_deleted: false },
            include: {
                model: {
                    include: {
                        brand: true
                    }
                },
                sub_variants: {
                    where: { is_deleted: false },
                    take: 5
                }
            }
        });
    }




}

export default new VariantService();