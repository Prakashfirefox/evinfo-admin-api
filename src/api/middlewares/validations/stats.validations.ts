// src/api/middlewares/validations/stats.validations.ts
import Joi from 'joi';

// Get Popular Vehicles Validation
export const getPopularVehiclesValidation = Joi.object({
    limit: Joi.number().integer().min(1).max(50).optional().default(10),
    period: Joi.string().valid('day', 'week', 'month', 'year', 'all').optional().default('all'),
    brand_id: Joi.string().optional(),
    model_id: Joi.string().optional(),
    vehicle_type: Joi.string().valid('ev', 'hybrid', 'ice').optional()
});

// Get Vehicle Stats Validation
export const getVehicleStatsValidation = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Vehicle ID is required',
        'any.required': 'Vehicle ID is required'
    }),
    period: Joi.string().valid('day', 'week', 'month', 'year').optional().default('month')
});

// Get Brands Stats Validation
export const getBrandsStatsValidation = Joi.object({
    limit: Joi.number().integer().min(1).max(50).optional().default(20),
    sort_by: Joi.string().valid('vehicles', 'views', 'models', 'rating').optional().default('vehicles'),
    sort_order: Joi.string().valid('asc', 'desc').optional().default('desc')
});

// Get Overview Stats Validation
export const getOverviewStatsValidation = Joi.object({
    include_history: Joi.boolean().optional().default(false),
    days: Joi.number().integer().min(1).max(365).optional().default(30)
});

// Date Range Validation
export const dateRangeValidation = Joi.object({
    start_date: Joi.date().iso().optional(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).optional(),
    period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').optional()
});

// Vehicle ID Param Validation
export const vehicleIdParamValidation = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Vehicle ID is required',
        'any.required': 'Vehicle ID is required'
    })
});

// Brand ID Param Validation
export const brandIdParamValidation = Joi.object({
    brandId: Joi.string().required().messages({
        'string.empty': 'Brand ID is required',
        'any.required': 'Brand ID is required'
    })
});

// Model ID Param Validation
export const modelIdParamValidation = Joi.object({
    modelId: Joi.string().required().messages({
        'string.empty': 'Model ID is required',
        'any.required': 'Model ID is required'
    })
});