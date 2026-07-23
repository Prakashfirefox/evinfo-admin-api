// src/api/services/dealer.service.ts
import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as DealerInterfaces from "../interfaces/dealer.interface";

class DealerService {

    async createDealer(data: DealerInterfaces.CreateDealerPayload, authUser: any) {
        // Check if dealer with same name exists in same city
        const existing = await prisma.dealer.findFirst({
            where: {
                name: data.name,
                city: data.city,
                is_deleted: false
            }
        });

        if (existing) {
            throw new AppError(ERROR_MESSAGE.DEALER_ALREADY_EXISTS, {}, 400);
        }

        // Validate brand IDs if provided
        if (data.brands && data.brands.length > 0) {
            const brands = await prisma.brand.findMany({
                where: {
                    id: { in: data.brands },
                    is_deleted: false
                }
            });
            if (brands.length !== data.brands.length) {
                throw new AppError(ERROR_MESSAGE.INVALID_BRAND_IDS, {}, 400);
            }
        }

        return prisma.dealer.create({
            data: {
                ...data,
                created_by: authUser.id,
                updated_by: authUser.id,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
    }

    async getDealerById(id: string) {
        const dealer = await prisma.dealer.findFirst({
            where: { 
                id, 
                is_deleted: false 
            }
        });

        if (dealer && dealer.brands && dealer.brands.length > 0) {
            // Fetch brand details
            const brands = await prisma.brand.findMany({
                where: {
                    id: { in: dealer.brands },
                    is_deleted: false
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    logo: true
                }
            });
            
            return {
                ...dealer,
                brandDetails: brands
            };
        }

        return dealer;
    }

    async getAllDealers(payload: DealerInterfaces.GetAllDealersPayload) {
        const {
            search, offset = 0, limit = 10, status, city,
            state, country, brand_id, service, min_rating,
            sort_by = "name", sort_order = "asc"
        } = payload;

        const where: any = { is_deleted: false };

        if (status) where.status = status;
        if (city) where.city = { contains: city, mode: "insensitive" };
        if (state) where.state = { contains: state, mode: "insensitive" };
        if (country) where.country = { contains: country, mode: "insensitive" };
        if (brand_id) where.brands = { has: brand_id };
        if (service) where.services = { has: service };
        if (min_rating) where.rating = { gte: min_rating };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { address: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
                { state: { contains: search, mode: "insensitive" } }
            ];
        }

        const rows = await prisma.dealer.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { [sort_by]: sort_order }
        });

        const count = await prisma.dealer.count({ where });

        // Get unique cities and states for filters
        const filters = await this.getDealerFilters();

        return { 
            rows, 
            count,
            filters
        };
    }

    async updateDealer(id: string, data: DealerInterfaces.UpdateDealerPayload, authUser: any) {
        const dealer = await prisma.dealer.findFirst({
            where: { id, is_deleted: false }
        });

        if (!dealer) throw new AppError(ERROR_MESSAGE.DEALER_NOT_FOUND, {}, 400);

        // Check for duplicate name in same city if name or city is being updated
        if (data.name || data.city) {
            const existing = await prisma.dealer.findFirst({
                where: {
                    name: data.name || dealer.name,
                    city: data.city || dealer.city,
                    id: { not: id },
                    is_deleted: false
                }
            });
            if (existing) {
                throw new AppError(ERROR_MESSAGE.DEALER_ALREADY_EXISTS, {}, 400);
            }
        }

        // Validate brand IDs if provided
        if (data.brands && data.brands.length > 0) {
            const brands = await prisma.brand.findMany({
                where: {
                    id: { in: data.brands },
                    is_deleted: false
                }
            });
            if (brands.length !== data.brands.length) {
                throw new AppError(ERROR_MESSAGE.INVALID_BRAND_IDS, {}, 400);
            }
        }

        return prisma.dealer.update({
            where: { id },
            data: {
                ...data,
                updated_by: authUser.id,
                updated_at: new Date()
            }
        });
    }

    async deleteDealer(id: string, authUser: any) {
        const dealer = await prisma.dealer.findFirst({
            where: { id, is_deleted: false }
        });

        if (!dealer) throw new AppError(ERROR_MESSAGE.DEALER_NOT_FOUND, {}, 400);

        await prisma.dealer.update({
            where: { id },
            data: {
                is_deleted: true,
                updated_by: authUser.id,
                updated_at: new Date()
            }
        });

        return { id, deletedAt: new Date() };
    }

    async updateDealerStatus(id: string, status: string, authUser: any) {
        const dealer = await prisma.dealer.findFirst({
            where: { id, is_deleted: false }
        });

        if (!dealer) throw new AppError(ERROR_MESSAGE.DEALER_NOT_FOUND, {}, 400);

        await prisma.dealer.update({
            where: { id },
            data: {
                status,
                updated_by: authUser.id,
                updated_at: new Date()
            }
        });

        return true;
    }

    async updateDealerRating(id: string, rating: number, authUser: any) {
        const dealer = await prisma.dealer.findFirst({
            where: { id, is_deleted: false }
        });

        if (!dealer) throw new AppError(ERROR_MESSAGE.DEALER_NOT_FOUND, {}, 400);

        return prisma.dealer.update({
            where: { id },
            data: {
                rating,
                updated_by: authUser.id,
                updated_at: new Date()
            }
        });
    }

    async getNearbyDealers(payload: DealerInterfaces.GetNearbyDealersPayload) {
        const { lat, lng, radius = 10, limit = 20, brand_id, service } = payload;

        // Get all active dealers
        const where: any = { 
            is_deleted: false, 
            status: "active",
            coordinates: { not: null }
        };

        if (brand_id) where.brands = { has: brand_id };
        if (service) where.services = { has: service };

        const dealers = await prisma.dealer.findMany({
            where
        });

        // Calculate distance and filter by radius
        const dealersWithDistance = dealers
            .filter(dealer => dealer.coordinates)
            .map(dealer => {
                const distance = this.calculateDistance(
                    lat, 
                    lng, 
                    dealer.coordinates!.lat, 
                    dealer.coordinates!.lng
                );
                return {
                    ...dealer,
                    distance: parseFloat(distance.toFixed(2))
                };
            })
            .filter(dealer => dealer.distance <= radius)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, limit);

        return dealersWithDistance;
    }

    async getDealersByVehicle(payload: DealerInterfaces.GetDealersByVehiclePayload) {
        const { vehicle_id, offset = 0, limit = 10, city, state } = payload;

        // Get sub-variant to find its brand via variant→model→brand
        const subVariant = await prisma.subVariant.findFirst({
            where: { id: vehicle_id, is_deleted: false },
            select: {
                variant: { select: { model: { select: { brand_id: true } } } }
            }
        });

        if (!subVariant) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 400);

        const vehicle = { brand_id: subVariant.variant.model.brand_id };

        const where: any = {
            is_deleted: false,
            status: "active",
            brands: { has: vehicle.brand_id }
        };

        if (city) where.city = { contains: city, mode: "insensitive" };
        if (state) where.state = { contains: state, mode: "insensitive" };

        const dealers = await prisma.dealer.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { rating: "desc" }
        });

        const count = await prisma.dealer.count({ where });

        return { rows: dealers, count };
    }

    async getDealerServices(id: string) {
        const dealer = await prisma.dealer.findFirst({
            where: { id, is_deleted: false },
            select: { services: true }
        });

        if (!dealer) throw new AppError(ERROR_MESSAGE.DEALER_NOT_FOUND, {}, 400);

        return dealer.services;
    }

    async addDealerServices(id: string, services: string[], authUser: any) {
        const dealer = await prisma.dealer.findFirst({
            where: { id, is_deleted: false }
        });

        if (!dealer) throw new AppError(ERROR_MESSAGE.DEALER_NOT_FOUND, {}, 400);

        const currentServices = dealer.services || [];
        const newServices = [...new Set([...currentServices, ...services])];

        return prisma.dealer.update({
            where: { id },
            data: {
                services: newServices,
                updated_by: authUser.id,
                updated_at: new Date()
            }
        });
    }

    async removeDealerServices(id: string, services: string[], authUser: any) {
        const dealer = await prisma.dealer.findFirst({
            where: { id, is_deleted: false }
        });

        if (!dealer) throw new AppError(ERROR_MESSAGE.DEALER_NOT_FOUND, {}, 400);

        const currentServices = dealer.services || [];
        const newServices = currentServices.filter(s => !services.includes(s));

        return prisma.dealer.update({
            where: { id },
            data: {
                services: newServices,
                updated_by: authUser.id,
                updated_at: new Date()
            }
        });
    }

    async getDealerStats() {
        const total = await prisma.dealer.count({ where: { is_deleted: false } });
        
        const active = await prisma.dealer.count({ 
            where: { is_deleted: false, status: "active" } 
        });
        
        const inactive = await prisma.dealer.count({ 
            where: { is_deleted: false, status: "inactive" } 
        });
        
        const closed = await prisma.dealer.count({ 
            where: { is_deleted: false, status: "closed" } 
        });

        const avgRating = await prisma.dealer.aggregate({
            where: { is_deleted: false, rating: { not: null } },
            _avg: { rating: true }
        });

        // Get top cities by dealer count
        const topCities = await prisma.dealer.groupBy({
            by: ['city', 'state'],
            where: { is_deleted: false, status: "active" },
            _count: true,
            orderBy: { _count: { city: "desc" } },
            take: 10
        });

        // Get service distribution
        const allDealers = await prisma.dealer.findMany({
            where: { is_deleted: false },
            select: { services: true }
        });

        const serviceCount: Record<string, number> = {};
        allDealers.forEach(dealer => {
            dealer.services?.forEach(service => {
                serviceCount[service] = (serviceCount[service] || 0) + 1;
            });
        });

        return {
            total,
            active,
            inactive,
            closed,
            averageRating: avgRating._avg.rating || 0,
            topCities,
            serviceDistribution: serviceCount
        };
    }

    async getDealerFilters() {
        const cities = await prisma.dealer.findMany({
            where: { is_deleted: false, status: "active" },
            distinct: ['city', 'state'],
            select: {
                city: true,
                state: true
            }
        });

        const services = await prisma.dealer.findMany({
            where: { is_deleted: false },
            distinct: ['services'],
            select: {
                services: true
            }
        });

        // Flatten and unique services
        const uniqueServices = [...new Set(
            services.flatMap(s => s.services || [])
        )];

        return {
            cities: cities.filter(c => c.city && c.state),
            services: uniqueServices
        };
    }

    // Helper function to calculate distance between two coordinates using Haversine formula
    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private toRad(value: number): number {
        return value * Math.PI / 180;
    }
}

export default new DealerService();