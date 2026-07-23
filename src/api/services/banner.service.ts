import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as BannerInterfaces from "../interfaces/banner.interface";

class BannerService {

    async createBanner(data: BannerInterfaces.CreateBannerPayload, authUser: any) {
        const existing = await prisma.banner.findFirst({
            where: {
                OR: [{ slug: data.slug }, { title: data.title }],
                is_deleted: false,
            },
        });

        if (existing) {
            if (existing.slug === data.slug)
                throw new AppError(ERROR_MESSAGE.BANNER_SLUG_ALREADY_USED, {}, 400);

            if (existing.title === data.title)
                throw new AppError(ERROR_MESSAGE.BANNER_TITLE_ALREADY_USED, {}, 400);
        }

        return prisma.banner.create({
            data: {
                ...data,
                created_by: authUser.id,
                updated_by: authUser.id,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }

    async getBannerById(id: string) {
        return prisma.banner.findFirst({
            where: { id, is_deleted: false },
        });
    }

    async getAllBanners(payload: BannerInterfaces.GetAllBannersPayload) {
        const { search, offset = 0, limit = 10, status } = payload;
        console.log("Get All Banners Payload:", payload);
        const where: any = { is_deleted: false };

        if (status ) where.status = status;

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
            ];
        }

        const rows = await prisma.banner.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: [{ priority: "asc" }, { created_at: "desc" }],
        });

        const count = await prisma.banner.count({ where });

        return { rows, count };
    }

    async updateBanner(id: string, data: BannerInterfaces.UpdateBannerPayload, authUser: any) {
        const banner = await prisma.banner.findFirst({
            where: { id, is_deleted: false },
        });

        if (!banner)
            throw new AppError(ERROR_MESSAGE.BANNER_NOT_FOUND, {}, 400);

        if (data.slug || data.title) {
            const orConditions: any[] = [];

            if (data.slug) {
                orConditions.push({ slug: data.slug });
            }

            if (data.title) {
                orConditions.push({ title: data.title });
            }

            if (orConditions.length > 0) {
                const duplicate = await prisma.banner.findFirst({
                    where: {
                        id: { not: id },
                        OR: orConditions,
                    },
                });

                console.log("duplicate", duplicate);

                if (duplicate) {
                    throw new AppError(
                        ERROR_MESSAGE.BANNER_ALREADY_EXISTS,
                        { duplicate },
                        400
                    );
                }
            }
        }


        return prisma.banner.update({
            where: { id },
            data: {
                ...data,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });
    }

    async deleteBanner(id: string, authUser: any) {
        const banner = await prisma.banner.findFirst({
            where: { id, is_deleted: false },
        });

        if (!banner)
            throw new AppError(ERROR_MESSAGE.BANNER_NOT_FOUND, {}, 400);

        await prisma.banner.update({
            where: { id },
            data: {
                is_deleted: true,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return { id, deletedAt: new Date() };
    }

    async updateBannerStatus(id: string, status: BannerInterfaces.BannerStatus, authUser: any) {
        const banner = await prisma.banner.findFirst({
            where: { id, is_deleted: false },
        });

        if (!banner)
            throw new AppError(ERROR_MESSAGE.BANNER_NOT_FOUND, {}, 400);

        await prisma.banner.update({
            where: { id },
            data: {
                status,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return true;
    }
    async getBannerBySlug(slug: string) {
        return prisma.banner.findFirst({
            where: { slug, is_deleted: false, status: "active" },
        });
    }
    async getActiveBanners(payload: any) {
        const { position, limit = 10, offset = 0 } = payload;
        const now = new Date();

        const where: any = {
            is_deleted: false,
            status: "active",
            OR: [
                {
                    AND: [
                        { start_date: { lte: now } },
                        { end_date: { gte: now } }
                    ]
                },
                {
                    AND: [
                        { start_date: null },
                        { end_date: null }
                    ]
                }
            ]
        };

        if (position) {
            where.position = position;
        }

        const rows = await prisma.banner.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: [{ priority: "asc" }, { created_at: "desc" }],
        });

        const count = await prisma.banner.count({ where });

        return { rows, count };
    }

    // NEW: Get banners by position
    async getBannersByPosition(position: string, payload: any) {
        const { offset = 0, limit = 10, status } = payload;

        const where: any = {
            position,
            is_deleted: false
        };

        if (status) where.status = status;

        const rows = await prisma.banner.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: [{ priority: "asc" }, { created_at: "desc" }],
        });

        const count = await prisma.banner.count({ where });

        return { rows, count };
    }
    async updateBannerPriority(id: string, priority: number, authUser: any) {
        const banner = await prisma.banner.findFirst({
            where: { id, is_deleted: false },
        });

        if (!banner)
            throw new AppError(ERROR_MESSAGE.BANNER_NOT_FOUND, {}, 400);

        return prisma.banner.update({
            where: { id },
            data: {
                priority,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });
    }
    async bulkUpdateBannerStatus(bannerIds: string[], status: BannerInterfaces.BannerStatus, authUser: any) {
        const result = await prisma.banner.updateMany({
            where: {
                id: { in: bannerIds },
                is_deleted: false
            },
            data: {
                status,
                updated_by: authUser.id,
                updated_at: new Date(),
            },
        });

        return { updatedCount: result.count };
    }

}

export default new BannerService();
