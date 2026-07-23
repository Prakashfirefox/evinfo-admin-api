// src/api/interfaces/stats.interface.ts
export interface GetPopularVehiclesPayload {
    limit?: number;
    period?: 'day' | 'week' | 'month' | 'year' | 'all';
    brand_id?: string;
    fuel_type?: string;
}

export interface GetVehicleStatsPayload {
    id: string;
    period?: 'day' | 'week' | 'month' | 'year';
}

export interface GetBrandsStatsPayload {
    limit?: number;
    sort_by?: 'vehicles' | 'views' | 'models' | 'rating';
    sort_order?: 'asc' | 'desc';
}

export interface GetOverviewStatsPayload {
    include_history?: boolean;
    days?: number;
}

export interface DateRangePayload {
    start_date?: Date;
    end_date?: Date;
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface TimeSeriesDataPoint {
    date: string;
    value: number;
}

export interface OverviewStats {
    totalVehicles: number;
    totalBrands: number;
    totalModels: number;
    totalVariants: number;
    totalReviews: number;
    totalDealers: number;
    totalUsers: number;
    totalViews: number;
    averageRating: number;
    recentActivity: {
        vehiclesAdded: number;
        reviewsAdded: number;
        dealersAdded: number;
    };
    history?: {
        vehicles: TimeSeriesDataPoint[];
        views: TimeSeriesDataPoint[];
        reviews: TimeSeriesDataPoint[];
    };
}

export interface BrandStats {
    brandId: string;
    brandName: string;
    brandLogo: string;
    vehicleCount: number;
    modelCount: number;
    totalViews: number;
    averageRating: number;
    topVehicles: Array<{
        id: string;
        name: string;
        views: number;
        rating: number;
    }>;
}

export interface VehicleStats {
    vehicleId: string;
    vehicleName: string;
    vehicleSlug: string;
    brandName: string;
    modelName: string;
    variantName: string;
    totalViews: number;
    totalReviews: number;
    averageRating: number;
    viewTrend: TimeSeriesDataPoint[];
    reviewTrend: TimeSeriesDataPoint[];
    competitorComparison?: Array<{
        vehicleId: string;
        vehicleName: string;
        views: number;
        rating: number;
    }>;
}