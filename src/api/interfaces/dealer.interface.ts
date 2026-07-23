// src/api/interfaces/dealer.interface.ts
export interface Location {
    lat: number;
    lng: number;
}

export interface CreateDealerPayload {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode?: string;
    phone?: string;
    email?: string;
    website?: string;
    coordinates?: Location;
    brands?: string[];
    services?: string[];
    rating?: number;
    status?: string;
}

export interface UpdateDealerPayload {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    phone?: string;
    email?: string;
    website?: string;
    coordinates?: Location;
    brands?: string[];
    services?: string[];
    rating?: number;
    status?: string;
}

export interface GetAllDealersPayload {
    search?: string;
    offset?: number;
    limit?: number;
    status?: string;
    city?: string;
    state?: string;
    country?: string;
    brand_id?: string;
    service?: string;
    min_rating?: number;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
}

export interface GetNearbyDealersPayload {
    lat: number;
    lng: number;
    radius?: number;
    limit?: number;
    brand_id?: string;
    service?: string;
}

export interface GetDealersByVehiclePayload {
    vehicle_id: string;
    offset?: number;
    limit?: number;
    city?: string;
    state?: string;
}

export interface UpdateDealerStatusPayload {
    status: 'active' | 'inactive' | 'closed';
}

export interface UpdateDealerRatingPayload {
    rating: number;
}

export type DealerStatus = "active" | "inactive" | "closed";
export type DealerService = "sales" | "service" | "parts" | "financing" | "insurance" | 
                           "test-drive" | "home-delivery" | "charging-installation" | 
                           "maintenance" | "repair" | "body-shop" | "rental";