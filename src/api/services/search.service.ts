// src/api/services/search.service.ts
import prisma from "../../db/client";
import * as SearchInterfaces from "../interfaces/search.interface";

class SearchService {

    async searchVehicles(payload: SearchInterfaces.SearchVehiclesPayload) {
        const {
            query,
            offset = 0,
            limit = 10,
            brand_id,
            model_id,
            variant_id,
            body_type,
            fuel_type,
            transmission,
            drivetrain,
            min_price,
            max_price,
            status = 'active',
            sort_by = 'popularity_desc'
        } = payload;

        const where: any = { is_deleted: false, status };

        // Text search across hierarchy
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { slug: { contains: query, mode: 'insensitive' } },
                { variant: { name: { contains: query, mode: 'insensitive' } } },
                { variant: { model: { name: { contains: query, mode: 'insensitive' } } } },
                { variant: { model: { brand: { name: { contains: query, mode: 'insensitive' } } } } }
            ];
        }

        // SubVariant-native filters
        if (fuel_type) where.fuel_type = Array.isArray(fuel_type) ? { in: fuel_type } : fuel_type;
        if (transmission) where.transmission = Array.isArray(transmission) ? { in: transmission } : transmission;
        if (drivetrain) where.drivetrain = Array.isArray(drivetrain) ? { in: drivetrain } : drivetrain;
        if (variant_id) where.variant_id = Array.isArray(variant_id) ? { in: variant_id } : variant_id;

        // Hierarchy filters
        const variantFilter: any = {};
        if (body_type) variantFilter.model = { body_type: Array.isArray(body_type) ? { in: body_type } : body_type };
        if (model_id) variantFilter.model_id = Array.isArray(model_id) ? { in: model_id } : model_id;
        if (brand_id) {
            variantFilter.model = {
                ...variantFilter.model,
                brand_id: Array.isArray(brand_id) ? { in: brand_id } : brand_id
            };
        }
        if (Object.keys(variantFilter).length > 0) where.variant = variantFilter;

        // Price filter via Pricing relation (national base price)
        if (min_price !== undefined || max_price !== undefined) {
            where.pricing = {
                some: {
                    city: null,
                    is_active: true,
                    ...(min_price !== undefined && { ex_showroom_price: { gte: min_price } }),
                    ...(max_price !== undefined && { ex_showroom_price: { lte: max_price } })
                }
            };
        }

        const orderBy = this.getSortOrder(sort_by);

        const [rows, total] = await Promise.all([
            prisma.subVariant.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy,
                include: {
                    variant: {
                        select: {
                            id: true,
                            name: true,
                            trim: true,
                            launch_year: true,
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
                    pricing: {
                        where: { city: null, is_active: true },
                        select: { ex_showroom_price: true, on_road_price: true },
                        take: 1
                    },
                    _count: {
                        select: {
                            reviews: { where: { status: 'approved' } }
                        }
                    }
                }
            }),
            prisma.subVariant.count({ where })
        ]);

        let results: any[] = rows;
        if (query) {
            results = this.calculateMatchScores(rows, query);
        }

        const priceRange = await this.getPriceRange(where);

        return {
            results,
            total,
            offset,
            limit,
            hasMore: offset + limit < total,
            priceRange,
            query: query || null
        };
    }

    async getFilters(payload: SearchInterfaces.GetFiltersPayload) {
        const { include_counts = true } = payload;

        const baseWhere: any = { is_deleted: false, status: 'active' };

        const [brands, fuelTypes, transmissions, bodyTypes, priceStats] = await Promise.all([
            this.getBrandFilters(baseWhere, include_counts),
            this.getFuelTypeFilters(baseWhere, include_counts),
            this.getTransmissionFilters(baseWhere, include_counts),
            this.getBodyTypeFilters(baseWhere, include_counts),
            this.getPriceRange(baseWhere)
        ]);

        return {
            brands,
            fuel_types: fuelTypes,
            transmissions,
            body_types: bodyTypes,
            price: {
                min: priceStats.min,
                max: priceStats.max,
                step: 10000
            }
        };
    }

    async autoComplete(payload: SearchInterfaces.AutoCompletePayload) {
        const { query, type = ['brand', 'model', 'sub_variant'], limit = 10 } = payload as any;

        const suggestions: Array<{
            type: string;
            id: string;
            name: string;
            subtitle?: string;
            image?: string;
        }> = [];

        if (type.includes('brand')) {
            const brands = await prisma.brand.findMany({
                where: { name: { contains: query, mode: 'insensitive' }, is_deleted: false },
                take: limit,
                select: { id: true, name: true, logo: true }
            });
            brands.forEach(brand =>
                suggestions.push({ type: 'brand', id: brand.id, name: brand.name, image: brand.logo })
            );
        }

        if (type.includes('model')) {
            const models = await prisma.vehicleModel.findMany({
                where: { name: { contains: query, mode: 'insensitive' }, is_deleted: false },
                take: limit,
                include: { brand: { select: { name: true } } }
            });
            models.forEach(model =>
                suggestions.push({ type: 'model', id: model.id, name: model.name, subtitle: model.brand.name })
            );
        }

        if (type.includes('vehicle') || type.includes('sub_variant')) {
            const subVariants = await prisma.subVariant.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { slug: { contains: query, mode: 'insensitive' } }
                    ],
                    is_deleted: false,
                    status: 'active'
                },
                take: limit,
                include: {
                    variant: {
                        select: {
                            name: true,
                            model: {
                                select: {
                                    name: true,
                                    brand: { select: { name: true, logo: true } }
                                }
                            }
                        }
                    }
                }
            });
            subVariants.forEach(sv =>
                suggestions.push({
                    type: 'sub_variant',
                    id: sv.id,
                    name: sv.name,
                    subtitle: `${sv.variant.model.brand.name} ${sv.variant.model.name} ${sv.variant.name}`,
                    image: sv.variant.model.brand.logo
                })
            );
        }

        // Exact matches first, then startsWith, then contains
        suggestions.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const q = query.toLowerCase();
            if (aName === q && bName !== q) return -1;
            if (bName === q && aName !== q) return 1;
            if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
            if (bName.startsWith(q) && !aName.startsWith(q)) return 1;
            return aName.localeCompare(bName);
        });

        return suggestions.slice(0, limit);
    }

    async getTrendingVehicles() {
        const subVariants = await prisma.subVariant.findMany({
            where: { is_deleted: false, status: 'active' },
            orderBy: [{ view_count: 'desc' }, { created_at: 'desc' }],
            take: 10,
            include: {
                variant: {
                    select: {
                        name: true,
                        model: {
                            select: {
                                name: true,
                                brand: { select: { name: true, logo: true } }
                            }
                        }
                    }
                }
            }
        });

        return subVariants.map(sv => ({
            id: sv.id,
            slug: sv.slug,
            name: sv.name,
            brand: sv.variant.model.brand.name,
            model: sv.variant.model.name,
            variant: sv.variant.name,
            views: sv.view_count
        }));
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private getSortOrder(sortBy: string): any {
        switch (sortBy) {
            case 'price_asc':  return { pricing: { _min: { ex_showroom_price: 'asc' } } };
            case 'price_desc': return { pricing: { _min: { ex_showroom_price: 'desc' } } };
            case 'name_asc':   return { name: 'asc' };
            case 'name_desc':  return { name: 'desc' };
            case 'newest':     return { created_at: 'desc' };
            case 'popularity_desc':
            default:           return { view_count: 'desc' };
        }
    }

    private calculateMatchScores(subVariants: any[], query: string): any[] {
        const terms = query.toLowerCase().split(' ');
        return subVariants.map(sv => {
            const text = [
                sv.name,
                sv.slug,
                sv.variant?.name,
                sv.variant?.model?.name,
                sv.variant?.model?.brand?.name
            ].filter(Boolean).join(' ').toLowerCase();

            let score = 0;
            terms.forEach(term => {
                if (text.includes(term)) score += 10;
                if (sv.name?.toLowerCase().includes(term)) score += 5;
            });
            return { ...sv, matchScore: score };
        }).sort((a, b) => b.matchScore - a.matchScore);
    }

    private async getBrandFilters(baseWhere: any, includeCounts: boolean) {
        const brands = await prisma.brand.findMany({
            where: { is_deleted: false },
            select: { id: true, name: true, logo: true }
        });

        if (includeCounts) {
            const counts = await Promise.all(
                brands.map(brand =>
                    prisma.subVariant.count({
                        where: { ...baseWhere, variant: { model: { brand_id: brand.id } } }
                    })
                )
            );
            return brands.map((brand, i) => ({ id: brand.id, name: brand.name, logo: brand.logo, count: counts[i] }));
        }
        return brands;
    }

    private async getFuelTypeFilters(baseWhere: any, includeCounts: boolean) {
        const fuelTypes = ["Petrol", "Diesel", "EV", "Hybrid", "CNG", "PHEV"];
        if (includeCounts) {
            const counts = await Promise.all(
                fuelTypes.map(ft => prisma.subVariant.count({ where: { ...baseWhere, fuel_type: ft } }))
            );
            return fuelTypes.map((ft, i) => ({ id: ft.toLowerCase(), name: ft, count: counts[i] }));
        }
        return fuelTypes.map(ft => ({ id: ft.toLowerCase(), name: ft }));
    }

    private async getTransmissionFilters(baseWhere: any, includeCounts: boolean) {
        const transmissions = ["Manual", "Automatic", "CVT", "AMT", "DCT"];
        if (includeCounts) {
            const counts = await Promise.all(
                transmissions.map(t => prisma.subVariant.count({ where: { ...baseWhere, transmission: t } }))
            );
            return transmissions.map((t, i) => ({ id: t.toLowerCase(), name: t, count: counts[i] }));
        }
        return transmissions.map(t => ({ id: t.toLowerCase(), name: t }));
    }

    private async getBodyTypeFilters(baseWhere: any, includeCounts: boolean) {
        const bodyTypes = await prisma.vehicleModel.findMany({
            where: { is_deleted: false },
            distinct: ['body_type'],
            select: { body_type: true }
        });
        const validTypes = bodyTypes.map(bt => bt.body_type).filter((bt): bt is string => bt !== null);

        if (includeCounts) {
            const counts = await Promise.all(
                validTypes.map(bt =>
                    prisma.subVariant.count({
                        where: { ...baseWhere, variant: { model: { body_type: bt } } }
                    })
                )
            );
            return validTypes.map((bt, i) => ({
                id: bt.toLowerCase().replace(/\s+/g, '-'),
                name: bt,
                count: counts[i]
            }));
        }
        return validTypes.map(bt => ({ id: bt.toLowerCase().replace(/\s+/g, '-'), name: bt }));
    }

    private async getPriceRange(where: any) {
        const pricingRecords = await prisma.pricing.findMany({
            where: {
                city: null,
                is_active: true,
                sub_variant: { ...where, is_deleted: false }
            },
            select: { ex_showroom_price: true }
        });

        const prices = pricingRecords.map(p => p.ex_showroom_price).filter((p): p is number => p !== null);
        return {
            min: prices.length ? Math.min(...prices) : 0,
            max: prices.length ? Math.max(...prices) : 10000000
        };
    }
}

export default new SearchService();
