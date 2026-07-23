// src/api/services/brand.service.ts
import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as BrandInterfaces from "../interfaces/brand.interface";

class BrandService {

    async createBrand(data: BrandInterfaces.CreateBrandPayload, authUser: any) {
        const existing = await prisma.brand.findFirst({
            where: {
                OR: [
                    { slug: data.slug },
                    { name: data.name }
                ],
                is_deleted: false,
            },
        });

        if (existing) {
            if (existing.slug === data.slug)
                throw new AppError(ERROR_MESSAGE.BRAND_SLUG_ALREADY_USED, {}, 400);

            if (existing.name === data.name)
                throw new AppError(ERROR_MESSAGE.BRAND_NAME_ALREADY_USED, {}, 400);
        }

        return prisma.brand.create({
            data: {
                ...data,
                created_by: authUser.id,
                updated_by: authUser.id,
                created_at: new Date(),
                updated_at: new Date(),
                status: data.status || "active"
            },
        });
    }

    async getBrandById(id: string) {
        return prisma.brand.findFirst({
            where: {
                id,
                is_deleted: false
            },
            include: {
                models: {
                    where: { is_deleted: false },
                    take: 5
                }
            }
        });
    }

    async getAllBrands(payload: BrandInterfaces.GetAllBrandsPayload) {
        const { search, offset = 0, limit = 10, status, sort_by = "name", sort_order = "asc" } = payload;

        const where: any = { is_deleted: false };

        if (status) where.status = status;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { country: { contains: search, mode: "insensitive" } },
            ];
        }

        const rows = await prisma.brand.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { [sort_by]: sort_order },
            include: {
                _count: {
                    select: {
                        models: { where: { is_deleted: false } }
                    }
                }
            }
        });

        const count = await prisma.brand.count({ where });

        return { rows, count };
    }

    async getPublicBrands(payload: BrandInterfaces.GetAllBrandsPayload) {
        const { search, offset = 0, limit = 10, sort_by = "name", sort_order = "asc" } = payload;

        const where: any = {
            is_deleted: false,
            status: "active"
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { country: { contains: search, mode: "insensitive" } },
            ];
        }

        const rows = await prisma.brand.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { [sort_by]: sort_order },
            select: {
                id: true,
                slug: true,
                name: true,
                logo: true,
                country: true,
                founded: true,
                description: true,
                website: true,
                _count: {
                    select: {
                        models: { where: { is_deleted: false } }
                    }
                }
            }
        });

        const count = await prisma.brand.count({ where });

        return { rows, count };
    }

    async updateBrand(id: string, data: BrandInterfaces.UpdateBrandPayload, authUser: any) {
        const brand = await prisma.brand.findFirst({
            where: { id, is_deleted: false },
        });

        if (!brand)
            throw new AppError(ERROR_MESSAGE.BRAND_NOT_FOUND, {}, 400);

        if (data.slug || data.name) {
            const orConditions: any[] = [];

            if (data.slug) {
                orConditions.push({ slug: data.slug });
            }

            if (data.name) {
                orConditions.push({ name: data.name });
            }

            if (orConditions.length > 0) {
                const duplicate = await prisma.brand.findFirst({
                    where: {
                        id: { not: id },
                        OR: orConditions,
                        is_deleted: false
                    },
                });

                if (duplicate) {
                    throw new AppError(
                        ERROR_MESSAGE.BRAND_ALREADY_EXISTS,
                        { duplicate },
                        400
                    );
                }
            }
        }

        return prisma.brand.update({
            where: { id },
            data: {
                ...data,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });
    }

    async deleteBrand(id: string, authUser: any) {
        const brand = await prisma.brand.findFirst({
            where: { id, is_deleted: false },
        });

        if (!brand)
            throw new AppError(ERROR_MESSAGE.BRAND_NOT_FOUND, {}, 400);

        // Check if brand has associated models
        const hasModels = await prisma.vehicleModel.count({
            where: { brand_id: id, is_deleted: false }
        });

        if (hasModels > 0) {
            throw new AppError(ERROR_MESSAGE.BRAND_HAS_ASSOCIATIONS, { hasModels }, 400);
        }

        await prisma.brand.update({
            where: { id },
            data: {
                is_deleted: true,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return { id, deletedAt: new Date() };
    }

    async updateBrandStatus(id: string, status: BrandInterfaces.BrandStatus, authUser: any) {
        const brand = await prisma.brand.findFirst({
            where: { id, is_deleted: false },
        });

        if (!brand)
            throw new AppError(ERROR_MESSAGE.BRAND_NOT_FOUND, {}, 400);

        await prisma.brand.update({
            where: { id },
            data: {
                status,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return true;
    }

    async getBrandBySlug(slug: string) {
        return prisma.brand.findFirst({
            where: {
                slug,
                is_deleted: false,
                status: "active"
            },
            include: {
                models: {
                    where: { is_deleted: false },
                    take: 5
                }
            }
        });
    }

    async getBrandVehicles(payload: BrandInterfaces.GetBrandVehiclesPayload) {
        const { brand_id, offset = 0, limit = 10, status } = payload;

        const where: any = {
            is_deleted: false,
            variant: { model: { brand_id } }
        };

        if (status) where.status = status;

        const [subVariants, count] = await Promise.all([
            prisma.subVariant.findMany({
                where,
                skip: offset,
                take: limit,
                include: {
                    variant: {
                        include: {
                            model: { include: { brand: { select: { id: true, name: true } } } }
                        }
                    }
                },
                orderBy: { created_at: "desc" }
            }),
            prisma.subVariant.count({ where })
        ]);

        return { rows: subVariants, count };
    }
}

export default new BrandService();