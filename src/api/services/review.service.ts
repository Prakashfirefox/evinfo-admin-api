import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as ReviewInterfaces from "../interfaces/review.interface";

class ReviewService {

  async createReview(data: ReviewInterfaces.CreateReviewPayload, authUser: any) {
    const subVariant = await prisma.subVariant.findFirst({
      where: { id: data.sub_variant_id, is_deleted: false },
    });
    if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

    const existingReview = await prisma.review.findFirst({
      where: {
        sub_variant_id: data.sub_variant_id,
        user_id: authUser.id,
        is_deleted: false,
      },
    });
    if (existingReview) throw new AppError(ERROR_MESSAGE.REVIEW_ALREADY_EXISTS, {}, 400);

    return prisma.review.create({
      data: {
        sub_variant_id: data.sub_variant_id,
        user_id: authUser.id,
        rating: data.rating,
        title: data.title,
        content: data.content,
        pros: data.pros || [],
        cons: data.cons || [],
        status: "pending",
        helpful_count: 0,
      },
      include: {
        sub_variant: {
          include: {
            variant: {
              select: {
                id: true,
                name: true,
                model: { select: { id: true, name: true, brand: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });
  }

  async getReviewById(id: string) {
    return prisma.review.findFirst({
      where: { id, is_deleted: false },
      include: {
        sub_variant: {
          select: {
            id: true,
            name: true,
            slug: true,
            variant: {
              select: {
                name: true,
                model: { select: { name: true, brand: { select: { name: true } } } },
              },
            },
          },
        },
      },
    });
  }

  async getAllReviews(payload: ReviewInterfaces.GetAllReviewsPayload) {
    const {
      search, offset = 0, limit = 10, status, sub_variant_id,
      user_id, min_rating, max_rating, sort_by = "created_at", sort_order = "desc",
    } = payload;

    const where: any = { is_deleted: false };

    if (status) where.status = status;
    if (sub_variant_id) where.sub_variant_id = sub_variant_id;
    if (user_id) where.user_id = user_id;

    if (min_rating !== undefined || max_rating !== undefined) {
      where.rating = {
        ...(min_rating !== undefined && { gte: min_rating }),
        ...(max_rating !== undefined && { lte: max_rating }),
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [rows, count, avgRating] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: {
          sub_variant: {
            select: {
              id: true,
              name: true,
              slug: true,
              variant: {
                select: {
                  name: true,
                  model: { select: { name: true, brand: { select: { name: true, logo: true } } } },
                },
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where: { ...where, status: "approved" },
        _avg: { rating: true },
      }),
    ]);

    return { rows, count, averageRating: avgRating._avg.rating || 0 };
  }

  async getReviewsBySubVariant(subVariantId: string, payload: any) {
    const { offset = 0, limit = 10, sort_by = "created_at", sort_order = "desc" } = payload;

    const where: any = { sub_variant_id: subVariantId, is_deleted: false, status: "approved" };

    const [rows, count, distribution, avgRating] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        select: {
          id: true, rating: true, title: true, content: true,
          pros: true, cons: true, helpful_count: true, created_at: true, user_id: true,
        },
      }),
      prisma.review.count({ where }),
      prisma.review.groupBy({
        by: ['rating'],
        where,
        _count: true,
      }),
      prisma.review.aggregate({ where, _avg: { rating: true } }),
    ]);

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distribution.forEach(item => {
      const key = Math.round(item.rating);
      if (key >= 1 && key <= 5) ratingDistribution[key] = item._count;
    });

    return { rows, count, averageRating: avgRating._avg.rating || 0, ratingDistribution };
  }

  async getUserReviews(userId: string, payload: any) {
    const { offset = 0, limit = 10, status, sort_by = "created_at", sort_order = "desc" } = payload;

    const where: any = { user_id: userId, is_deleted: false };
    if (status) where.status = status;

    const [rows, count] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sort_by]: sort_order },
        include: {
          sub_variant: {
            select: {
              id: true,
              name: true,
              slug: true,
              variant: {
                select: {
                  name: true,
                  model: { select: { name: true, brand: { select: { name: true, logo: true } } } },
                },
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return { rows, count };
  }

  async updateReview(id: string, data: ReviewInterfaces.UpdateReviewPayload, authUser: any) {
    const review = await prisma.review.findFirst({ where: { id, is_deleted: false } });
    if (!review) throw new AppError(ERROR_MESSAGE.REVIEW_NOT_FOUND, {}, 400);

    return prisma.review.update({
      where: { id },
      data: { ...data, status: "pending", updated_at: new Date() },
      include: { sub_variant: true },
    });
  }

  async deleteReview(id: string, authUser: any) {
    const review = await prisma.review.findFirst({ where: { id, is_deleted: false } });
    if (!review) throw new AppError(ERROR_MESSAGE.REVIEW_NOT_FOUND, {}, 400);

    await prisma.review.update({
      where: { id },
      data: { is_deleted: true, updated_at: new Date() },
    });

    return { id, deletedAt: new Date() };
  }

  async updateReviewStatus(id: string, status: string, authUser: any) {
    const review = await prisma.review.findFirst({ where: { id, is_deleted: false } });
    if (!review) throw new AppError(ERROR_MESSAGE.REVIEW_NOT_FOUND, {}, 400);

    await prisma.review.update({ where: { id }, data: { status, updated_at: new Date() } });
    return true;
  }

  async markReviewHelpful(id: string, action: 'increment' | 'decrement', authUser: any) {
    const review = await prisma.review.findFirst({
      where: { id, is_deleted: false, status: "approved" },
    });
    if (!review) throw new AppError(ERROR_MESSAGE.REVIEW_NOT_FOUND, {}, 400);

    const updated = await prisma.review.update({
      where: { id },
      data: { helpful_count: { increment: action === 'increment' ? 1 : -1 }, updated_at: new Date() },
    });

    return { helpful_count: updated.helpful_count };
  }

  async getPendingReviews(payload: any) {
    const { offset = 0, limit = 10 } = payload;
    const where = { status: "pending", is_deleted: false };

    const [rows, count] = await Promise.all([
      prisma.review.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: "asc" },
        include: {
          sub_variant: {
            select: {
              id: true, name: true,
              variant: {
                select: {
                  name: true,
                  model: { select: { name: true, brand: { select: { name: true } } } },
                },
              },
            },
          },
        },
      }),
      prisma.review.count({ where }),
    ]);

    return { rows, count };
  }

  async getReviewStats() {
    const [total, pending, approved, rejected, avgRating] = await Promise.all([
      prisma.review.count({ where: { is_deleted: false } }),
      prisma.review.count({ where: { is_deleted: false, status: "pending" } }),
      prisma.review.count({ where: { is_deleted: false, status: "approved" } }),
      prisma.review.count({ where: { is_deleted: false, status: "rejected" } }),
      prisma.review.aggregate({ where: { is_deleted: false, status: "approved" }, _avg: { rating: true } }),
    ]);

    return { total, pending, approved, rejected, averageRating: avgRating._avg.rating || 0 };
  }
}

export default new ReviewService();
