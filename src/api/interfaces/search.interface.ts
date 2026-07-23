// src/api/interfaces/search.interface.ts
export interface SearchVehiclesPayload {
    query?: string;
    offset?: number;
    limit?: number;
    brand_id?: string | string[];
    model_id?: string | string[];
    variant_id?: string | string[];
    body_type?: string | string[];
    fuel_type?: string | string[];
    transmission?: string | string[];
    drivetrain?: string | string[];
    min_price?: number;
    max_price?: number;
    status?: string;
    sort_by?: string;
}

export interface GetFiltersPayload {
    include_counts?: boolean;
    category?: 'all' | 'ev' | 'hybrid' | 'ice';
}

export interface CompareVehiclesPayload {
    sub_variant_ids: string[];
    compare_fields?: Array<
        'price' | 'performance' | 'range' | 'efficiency' | 'dimensions' |
        'features' | 'safety' | 'warranty' | 'ratings'
    >;
}

export interface AdvancedSearchPayload {
    vehicleType?: 'ev' | 'hybrid' | 'ice' | 'all';
    budget?: {
        min?: number;
        max?: number;
        currency?: string;
    };
    primaryUse?: string;
    preferences?: {
        fuelType?: string[];
        transmission?: string[];
        bodyStyle?: string[];
        brandPreference?: string[];
    };
    location?: {
        lat?: number;
        lng?: number;
        radius?: number;
    };
}

export interface SaveSearchPayload {
    name: string;
    criteria: any;
    notifications?: boolean;
}

export interface AutoCompletePayload {
    query: string;
    type?: ('brand' | 'model' | 'vehicle')[];
    limit?: number;
}

export interface SearchResult {
    id: string;
    name: string;
    slug: string;
    brand: {
        id: string;
        name: string;
        logo: string;
    };
    model: {
        id: string;
        name: string;
        body_type: string;
    };
    variant: {
        id: string;
        name: string;
        trim: string;
        launch_year?: number;
    };
    images: {
        exterior?: string[];
        interior?: string[];
    };
    pricing?: {
        basePrice?: number;
        onRoadPrice?: number;
    };
    ratings?: {
        overall?: number;
    };
    specifications?: {
        performance?: {
            acceleration?: string;
            power?: string;
            drivetrain?: string;
        };
        battery?: {
            range?: string;
            efficiency?: string;
        };
    };
    matchScore?: number;
}

export interface FilterOption {
    id: string;
    name: string;
    count?: number;
    icon?: string;
}

export interface FilterCategory {
    id: string;
    name: string;
    type: 'single' | 'multiple' | 'range' | 'boolean';
    options?: FilterOption[];
    range?: {
        min: number;
        max: number;
        step: number;
    };
}

export interface ComparisonResult {
    vehicles: Array<{
        id: string;
        name: string;
        brand: string;
        model: string;
        variant: string;
        images: string[];
    }>;
    comparison: Record<string, Array<{
        field: string;
        value: any;
        highlight?: boolean;
    }>>;
    summary: {
        bestInClass: Record<string, string>;
        priceDifference: {
            min: number;
            max: number;
            average: number;
        };
    };
}