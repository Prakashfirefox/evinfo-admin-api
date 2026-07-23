// src/api/middlewares/validations/search.validations.ts
import Joi from 'joi';

// Search Vehicles Validation
export const searchVehiclesValidation = Joi.object({
    // Text search
    query: Joi.string().optional().allow('').max(100).messages({
        'string.max': 'Search query cannot exceed 100 characters'
    }),
    
    // Pagination
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).max(50).optional().default(10),
    
    // Filters
    brand_id: Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(Joi.string())
    ).optional(),
    
    model_id: Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(Joi.string())
    ).optional(),
    
    variant_id: Joi.alternatives().try(
        Joi.string(),
        Joi.array().items(Joi.string())
    ).optional(),
    
    body_type: Joi.alternatives().try(
        Joi.string().valid(
            'Sedan', 'SUV', 'Crossover', 'Hatchback', 'Coupe',
            'Convertible', 'Truck', 'Minivan', 'MPV/MUV', 'Sports Car'
        ),
        Joi.array().items(Joi.string().valid(
            'Sedan', 'SUV', 'Crossover', 'Hatchback', 'Coupe',
            'Convertible', 'Truck', 'Minivan', 'MPV/MUV', 'Sports Car'
        ))
    ).optional(),

    segment: Joi.alternatives().try(
        Joi.string().valid('Budget', 'Mid', 'Premium', 'Luxury'),
        Joi.array().items(Joi.string().valid('Budget', 'Mid', 'Premium', 'Luxury'))
    ).optional(),
    
    // Price range
    min_price: Joi.number().min(0).optional(),
    max_price: Joi.number().min(0).greater(Joi.ref('min_price')).optional().messages({
        'number.greater': 'Maximum price must be greater than minimum price'
    }),

    // Year range
    min_year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional(),
    max_year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional(),

    // Performance filters
    min_power: Joi.number().min(0).optional(),
    min_acceleration: Joi.number().min(0).optional(), // 0-60 mph in seconds
    drivetrain: Joi.alternatives().try(
        Joi.string().valid('FWD', 'RWD', 'AWD', '4WD'),
        Joi.array().items(Joi.string().valid('FWD', 'RWD', 'AWD', '4WD'))
    ).optional(),

    // Range & efficiency (for EVs)
    min_range: Joi.number().min(0).optional(),
    min_efficiency: Joi.number().min(0).optional(), // MPGe

    // Features
    features: Joi.array().items(Joi.string()).optional(),
    safety_features: Joi.array().items(Joi.string()).optional(),
    comfort_features: Joi.array().items(Joi.string()).optional(),

    // Seating capacity
    seating_capacity: Joi.number().integer().min(2).max(9).optional(),
    
    // Status
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional().default('active'),
    featured: Joi.boolean().optional(),
    
    // Sorting
    sort_by: Joi.string().valid(
        'price_asc', 'price_desc',
        'name_asc', 'name_desc',
        'year_asc', 'year_desc',
        'rating_asc', 'rating_desc',
        'popularity_desc',
        'range_desc',
        'acceleration_asc'
    ).optional().default('popularity_desc')
});

// Get Filters Validation
export const getFiltersValidation = Joi.object({
    include_counts: Joi.boolean().optional().default(true),
    category: Joi.string().valid('all', 'ev', 'hybrid', 'ice').optional().default('all')
});

// Compare Vehicles Validation
export const compareVehiclesValidation = Joi.object({
    vehicle_ids: Joi.array().items(Joi.string()).min(2).max(5).required().messages({
        'array.min': 'At least 2 vehicles are required for comparison',
        'array.max': 'Cannot compare more than 5 vehicles at once',
        'any.required': 'Vehicle IDs are required'
    }),

    compare_fields: Joi.array().items(Joi.string().valid(
        'price', 'performance', 'range', 'efficiency', 'dimensions',
        'features', 'safety', 'warranty', 'ratings', 'colors'
    )).optional().default(['price', 'performance', 'range', 'features', 'safety'])
});

// Advanced Search Validation
export const advancedSearchValidation = Joi.object({
    // Vehicle type
    vehicleType: Joi.string().valid('ev', 'hybrid', 'ice', 'all').optional().default('all'),
    
    // Budget
    budget: Joi.object({
        min: Joi.number().min(0).optional(),
        max: Joi.number().min(0).optional(),
        currency: Joi.string().length(3).optional().default('USD')
    }).optional(),
    
    // Usage
    primaryUse: Joi.string().valid(
        'daily_commute', 'family', 'offroad', 'luxury', 'sports', 
        'commercial', 'long_distance', 'city_driving'
    ).optional(),
    
    // Preferences
    preferences: Joi.object({
        fuelType: Joi.array().items(Joi.string().valid('petrol', 'diesel', 'electric', 'hybrid')).optional(),
        transmission: Joi.array().items(Joi.string().valid('automatic', 'manual', 'cvt')).optional(),
        bodyStyle: Joi.array().items(Joi.string()).optional(),
        brandPreference: Joi.array().items(Joi.string()).optional()
    }).optional(),
    
    // Location (for dealer availability)
    location: Joi.object({
        lat: Joi.number().min(-90).max(90).optional(),
        lng: Joi.number().min(-180).max(180).optional(),
        radius: Joi.number().min(1).max(100).optional().default(50)
    }).optional()
});

// Save Search Validation
export const saveSearchValidation = Joi.object({
    name: Joi.string().required().max(100).messages({
        'string.empty': 'Search name is required',
        'string.max': 'Search name cannot exceed 100 characters',
        'any.required': 'Search name is required'
    }),
    criteria: Joi.object().required().messages({
        'any.required': 'Search criteria is required'
    }),
    notifications: Joi.boolean().optional().default(false)
});

// Get Saved Searches Validation
export const getSavedSearchesValidation = Joi.object({
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).max(50).optional().default(20)
});

// Search History Validation
export const searchHistoryValidation = Joi.object({
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).max(50).optional().default(20)
});

// Auto Complete Validation
export const autoCompleteValidation = Joi.object({
    query: Joi.string().required().min(1).max(50).messages({
        'string.empty': 'Search query is required',
        'string.min': 'Search query must be at least 1 character',
        'string.max': 'Search query cannot exceed 50 characters',
        'any.required': 'Search query is required'
    }),
    type: Joi.array().items(Joi.string().valid('brand', 'model', 'vehicle')).optional().default(['brand', 'model', 'vehicle']),
    limit: Joi.number().integer().min(1).max(20).optional().default(10)
});