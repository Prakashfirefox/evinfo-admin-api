// src/api/services/stats.service.ts
import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as StatsInterfaces from "../interfaces/stats.interface";

class StatsService {

    async getOverviewStats(payload: StatsInterfaces.GetOverviewStatsPayload) {
        const { include_history = false, days = 30 } = payload;

        const [
            totalSubVariants,
            totalBrands,
            totalModels,
            totalVariants,
            totalReviews,
            totalDealers,
            totalUsers,
            totalViews,
            averageRating
        ] = await Promise.all([
            prisma.subVariant.count({ where: { is_deleted: false } }),
            prisma.brand.count({ where: { is_deleted: false } }),
            prisma.vehicleModel.count({ where: { is_deleted: false } }),
            prisma.variant.count({ where: { is_deleted: false } }),
            prisma.review.count({ where: { is_deleted: false, status: "approved" } }),
            prisma.dealer.count({ where: { is_deleted: false, status: "active" } }),
            prisma.users.count({ where: { is_deleted: false, is_active: true } }),
            prisma.subVariant.aggregate({ _sum: { view_count: true } }),
            prisma.review.aggregate({
                where: { status: "approved" },
                _avg: { rating: true }
            })
        ]);

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - days);

        const [subVariantsAdded, reviewsAdded, dealersAdded] = await Promise.all([
            prisma.subVariant.count({
                where: { is_deleted: false, created_at: { gte: sinceDate } }
            }),
            prisma.review.count({
                where: { is_deleted: false, created_at: { gte: sinceDate } }
            }),
            prisma.dealer.count({
                where: { is_deleted: false, created_at: { gte: sinceDate } }
            })
        ]);

        const overview: StatsInterfaces.OverviewStats = {
            totalVehicles: totalSubVariants,
            totalBrands,
            totalModels,
            totalVariants,
            totalReviews,
            totalDealers,
            totalUsers,
            totalViews: totalViews._sum.view_count || 0,
            averageRating: averageRating._avg.rating || 0,
            recentActivity: {
                vehiclesAdded: subVariantsAdded,
                reviewsAdded,
                dealersAdded
            }
        };

        if (include_history) {
            overview.history = {
                vehicles: await this.getTimeSeriesData('vehicle', days),
                views: await this.getTimeSeriesData('view', days),
                reviews: await this.getTimeSeriesData('review', days)
            };
        }

        return overview;
    }

    async getBrandsStats(payload: StatsInterfaces.GetBrandsStatsPayload) {
        const { limit = 20, sort_by = 'vehicles', sort_order = 'desc' } = payload;

        const brands = await prisma.brand.findMany({
            where: { is_deleted: false },
            include: {
                _count: {
                    select: {
                        models: { where: { is_deleted: false } }
                    }
                },
                models: {
                    where: { is_deleted: false },
                    include: {
                        variants: {
                            where: { is_deleted: false },
                            include: {
                                sub_variants: {
                                    where: { is_deleted: false },
                                    select: {
                                        id: true,
                                        slug: true,
                                        view_count: true,
                                        reviews: {
                                            where: { status: "approved" },
                                            select: { rating: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const brandStats: StatsInterfaces.BrandStats[] = brands.map(brand => {
            const allSubVariants = brand.models.flatMap(m =>
                m.variants.flatMap(v => v.sub_variants)
            );
            const totalViews = allSubVariants.reduce((sum, sv) => sum + (sv.view_count || 0), 0);
            const allRatings = allSubVariants.flatMap(sv => sv.reviews.map(r => r.rating));
            const avgRating = allRatings.length
                ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
                : 0;

            const topVehicles = [...allSubVariants]
                .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                .slice(0, 5)
                .map(sv => ({
                    id: sv.id,
                    name: sv.slug,
                    views: sv.view_count || 0,
                    rating: sv.reviews.length
                        ? sv.reviews.reduce((a, r) => a + r.rating, 0) / sv.reviews.length
                        : 0
                }));

            return {
                brandId: brand.id,
                brandName: brand.name,
                brandLogo: brand.logo,
                vehicleCount: allSubVariants.length,
                modelCount: brand._count.models,
                totalViews,
                averageRating: avgRating,
                topVehicles
            };
        });

        brandStats.sort((a, b) => {
            let comparison = 0;
            switch (sort_by) {
                case 'vehicles':
                    comparison = a.vehicleCount - b.vehicleCount;
                    break;
                case 'views':
                    comparison = a.totalViews - b.totalViews;
                    break;
                case 'models':
                    comparison = a.modelCount - b.modelCount;
                    break;
                case 'rating':
                    comparison = a.averageRating - b.averageRating;
                    break;
                default:
                    comparison = a.vehicleCount - b.vehicleCount;
            }
            return sort_order === 'asc' ? comparison : -comparison;
        });

        return {
            total: brandStats.length,
            brands: brandStats.slice(0, limit)
        };
    }

    async getPopularVehicles(payload: StatsInterfaces.GetPopularVehiclesPayload) {
        const { limit = 10, brand_id, fuel_type } = payload;

        const where: any = { is_deleted: false, status: "active" };

        if (brand_id) where.variant = { model: { brand_id } };
        if (fuel_type) where.fuel_type = fuel_type;

        const subVariants = await prisma.subVariant.findMany({
            where,
            orderBy: { view_count: 'desc' },
            take: limit,
            include: {
                variant: {
                    select: {
                        id: true,
                        name: true,
                        trim: true,
                        model: {
                            select: {
                                id: true,
                                name: true,
                                body_type: true,
                                brand: {
                                    select: { id: true, name: true, logo: true }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        reviews: { where: { status: "approved" } }
                    }
                }
            }
        });

        return subVariants.map(sv => ({
            id: sv.id,
            slug: sv.slug,
            name: sv.name,
            status: sv.status,
            fuel_type: sv.fuel_type,
            transmission: sv.transmission,
            brand: sv.variant.model.brand,
            model: { id: sv.variant.model.id, name: sv.variant.model.name, body_type: sv.variant.model.body_type },
            variant: { id: sv.variant.id, name: sv.variant.name, trim: sv.variant.trim },
            views: sv.view_count,
            reviewCount: sv._count.reviews
        }));
    }

    async getSubVariantStats(payload: StatsInterfaces.GetVehicleStatsPayload) {
        const { id, period = 'month' } = payload;

        const subVariant = await prisma.subVariant.findFirst({
            where: { id, is_deleted: false },
            include: {
                variant: {
                    select: {
                        name: true,
                        model: {
                            select: {
                                name: true,
                                brand: { select: { name: true } }
                            }
                        }
                    }
                },
                reviews: {
                    where: { status: "approved" },
                    select: { rating: true, created_at: true }
                }
            }
        });

        if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

        const endDate = new Date();
        const startDate = new Date();
        switch (period) {
            case 'day':   startDate.setDate(startDate.getDate() - 1); break;
            case 'week':  startDate.setDate(startDate.getDate() - 7); break;
            case 'month': startDate.setMonth(startDate.getMonth() - 1); break;
            case 'year':  startDate.setFullYear(startDate.getFullYear() - 1); break;
        }

        const viewTrend = this.generateTimeSeriesData(startDate, endDate, period, subVariant.view_count || 0);
        const reviewTrend = this.generateReviewTrend(subVariant.reviews, startDate, endDate, period);

        const avgRating = subVariant.reviews.length
            ? subVariant.reviews.reduce((a, r) => a + r.rating, 0) / subVariant.reviews.length
            : 0;

        const stats: StatsInterfaces.VehicleStats = {
            vehicleId: subVariant.id,
            vehicleName: `${subVariant.variant.model.brand.name} ${subVariant.variant.model.name} ${subVariant.variant.name} ${subVariant.name}`,
            vehicleSlug: subVariant.slug,
            brandName: subVariant.variant.model.brand.name,
            modelName: subVariant.variant.model.name,
            variantName: subVariant.variant.name,
            totalViews: subVariant.view_count || 0,
            totalReviews: subVariant.reviews.length,
            averageRating: avgRating,
            viewTrend,
            reviewTrend
        };

        return stats;
    }

    async getBrandDetailStats(brandId: string, payload: any) {
        const brand = await prisma.brand.findFirst({
            where: { id: brandId, is_deleted: false },
            include: {
                models: {
                    where: { is_deleted: false },
                    include: {
                        variants: {
                            where: { is_deleted: false },
                            include: {
                                sub_variants: {
                                    where: { is_deleted: false },
                                    select: { id: true, slug: true, view_count: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!brand) throw new AppError(ERROR_MESSAGE.BRAND_NOT_FOUND, {}, 400);

        let totalSubVariants = 0;
        let totalViews = 0;

        brand.models.forEach(model => {
            model.variants.forEach(variant => {
                totalSubVariants += variant.sub_variants.length;
                variant.sub_variants.forEach(sv => {
                    totalViews += sv.view_count || 0;
                });
            });
        });

        return {
            brandId: brand.id,
            brandName: brand.name,
            brandLogo: brand.logo,
            brandCountry: brand.country,
            brandFounded: brand.founded,
            totalModels: brand.models.length,
            totalVehicles: totalSubVariants,
            totalViews,
            models: brand.models.map(model => ({
                id: model.id,
                name: model.name,
                variants: model.variants.length,
                vehicles: model.variants.reduce((sum, v) => sum + v.sub_variants.length, 0)
            }))
        };
    }

    async getModelDetailStats(modelId: string, payload: any) {
        const model = await prisma.vehicleModel.findFirst({
            where: { id: modelId, is_deleted: false },
            include: {
                brand: true,
                variants: {
                    where: { is_deleted: false },
                    include: {
                        sub_variants: {
                            where: { is_deleted: false },
                            select: { id: true, slug: true, view_count: true }
                        }
                    }
                }
            }
        });

        if (!model) throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_NOT_FOUND, {}, 400);

        let totalSubVariants = 0;
        let totalViews = 0;

        model.variants.forEach(variant => {
            totalSubVariants += variant.sub_variants.length;
            variant.sub_variants.forEach(sv => {
                totalViews += sv.view_count || 0;
            });
        });

        return {
            modelId: model.id,
            modelName: model.name,
            brandName: model.brand.name,
            generation: model.generation,
            body_type: model.body_type,
            production_years: model.production_years,
            totalVariants: model.variants.length,
            totalVehicles: totalSubVariants,
            totalViews,
            variants: model.variants.map(variant => ({
                id: variant.id,
                name: variant.name,
                vehicles: variant.sub_variants.length,
                views: variant.sub_variants.reduce((sum, sv) => sum + (sv.view_count || 0), 0)
            }))
        };
    }

    async getReviewStats(payload: any) {
        const [totalReviews, pendingReviews, approvedReviews, rejectedReviews, avgRating, ratingDistribution] =
            await Promise.all([
                prisma.review.count({ where: { is_deleted: false } }),
                prisma.review.count({ where: { is_deleted: false, status: "pending" } }),
                prisma.review.count({ where: { is_deleted: false, status: "approved" } }),
                prisma.review.count({ where: { is_deleted: false, status: "rejected" } }),
                prisma.review.aggregate({
                    where: { is_deleted: false, status: "approved" },
                    _avg: { rating: true }
                }),
                prisma.review.groupBy({
                    by: ['rating'],
                    where: { is_deleted: false, status: "approved" },
                    _count: true
                })
            ]);

        return {
            total: totalReviews,
            byStatus: {
                pending: pendingReviews,
                approved: approvedReviews,
                rejected: rejectedReviews
            },
            averageRating: avgRating._avg.rating || 0,
            ratingDistribution: ratingDistribution.reduce((acc, curr) => {
                acc[curr.rating] = curr._count;
                return acc;
            }, {} as Record<number, number>)
        };
    }

    async getDealerStats(payload: any) {
        const [totalDealers, activeDealers, inactiveDealers, avgRating, topCities, dealers] =
            await Promise.all([
                prisma.dealer.count({ where: { is_deleted: false } }),
                prisma.dealer.count({ where: { is_deleted: false, status: "active" } }),
                prisma.dealer.count({ where: { is_deleted: false, status: "inactive" } }),
                prisma.dealer.aggregate({
                    where: { is_deleted: false, rating: { not: null } },
                    _avg: { rating: true }
                }),
                prisma.dealer.groupBy({
                    by: ['city', 'state'],
                    where: { is_deleted: false, status: "active" },
                    _count: true,
                    orderBy: { _count: { city: "desc" } },
                    take: 10
                }),
                prisma.dealer.findMany({
                    where: { is_deleted: false },
                    select: { services: true }
                })
            ]);

        const serviceCount: Record<string, number> = {};
        dealers.forEach(dealer => {
            dealer.services?.forEach(service => {
                serviceCount[service] = (serviceCount[service] || 0) + 1;
            });
        });

        return {
            total: totalDealers,
            active: activeDealers,
            inactive: inactiveDealers,
            averageRating: avgRating._avg.rating || 0,
            topCities: topCities.map(c => ({ city: c.city, state: c.state, count: c._count })),
            serviceDistribution: serviceCount
        };
    }

    async getUserStats(payload: any) {
        const [totalUsers, activeUsers, newUsersLast30Days, usersByRole, usersWithReviews] =
            await Promise.all([
                prisma.users.count({ where: { is_deleted: false } }),
                prisma.users.count({ where: { is_deleted: false, is_active: true } }),
                prisma.users.count({
                    where: {
                        is_deleted: false,
                        created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
                    }
                }),
                prisma.users.groupBy({
                    by: ['role'],
                    where: { is_deleted: false },
                    _count: true
                }),
                prisma.review.groupBy({
                    by: ['user_id'],
                    where: { is_deleted: false }
                })
            ]);

        return {
            total: totalUsers,
            active: activeUsers,
            newLast30Days: newUsersLast30Days,
            byRole: usersByRole.reduce((acc, curr) => {
                acc[curr.role || 'user'] = curr._count;
                return acc;
            }, {} as Record<string, number>),
            usersWithReviews: usersWithReviews.length,
            engagementRate: totalUsers ? (usersWithReviews.length / totalUsers) * 100 : 0
        };
    }

    async getDashboardStats() {
        const [overview, popularVehicles, recentReviews, dealerStats] = await Promise.all([
            this.getOverviewStats({ include_history: false }),
            this.getPopularVehicles({ limit: 5 }),
            prisma.review.findMany({
                where: { is_deleted: false, status: "approved" },
                orderBy: { created_at: 'desc' },
                take: 10,
                include: {
                    sub_variant: {
                        select: {
                            slug: true,
                            name: true,
                            variant: {
                                select: {
                                    name: true,
                                    model: {
                                        select: {
                                            name: true,
                                            brand: { select: { name: true } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }),
            this.getDealerStats({})
        ]);

        return { overview, popularVehicles, recentReviews, dealerStats };
    }

    private async getTimeSeriesData(type: 'vehicle' | 'view' | 'review', days: number): Promise<StatsInterfaces.TimeSeriesDataPoint[]> {
        const data: StatsInterfaces.TimeSeriesDataPoint[] = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        for (let i = 0; i <= days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.floor(Math.random() * 100)
            });
        }
        return data;
    }

    private generateTimeSeriesData(
        startDate: Date,
        endDate: Date,
        period: string,
        totalValue: number
    ): StatsInterfaces.TimeSeriesDataPoint[] {
        const data: StatsInterfaces.TimeSeriesDataPoint[] = [];
        const currentDate = new Date(startDate);
        let format: Intl.DateTimeFormatOptions;

        switch (period) {
            case 'day':   format = { hour: '2-digit' }; break;
            case 'week':  format = { weekday: 'short' }; break;
            case 'year':  format = { month: 'short' }; break;
            default:      format = { day: '2-digit', month: 'short' };
        }

        while (currentDate <= endDate) {
            data.push({
                date: currentDate.toLocaleDateString('en-US', format),
                value: Math.floor(totalValue / 30)
            });
            switch (period) {
                case 'day':  currentDate.setHours(currentDate.getHours() + 1); break;
                case 'year': currentDate.setMonth(currentDate.getMonth() + 1); break;
                default:     currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        return data;
    }

    private generateReviewTrend(
        reviews: any[],
        startDate: Date,
        endDate: Date,
        period: string
    ): StatsInterfaces.TimeSeriesDataPoint[] {
        const data: StatsInterfaces.TimeSeriesDataPoint[] = [];
        const reviewsByDate: Record<string, number> = {};
        reviews.forEach(review => {
            const date = review.created_at.toISOString().split('T')[0];
            reviewsByDate[date] = (reviewsByDate[date] || 0) + 1;
        });

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            data.push({
                date: currentDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
                value: reviewsByDate[dateStr] || 0
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return data;
    }
}

export default new StatsService();
