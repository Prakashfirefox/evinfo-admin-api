// src/api/middlewares/validations/vehicleModel.validations.ts
import Joi from 'joi';

const timelineEventValidation = Joi.object({
    year: Joi.number().integer().min(1900).max(2100).required(),
    event: Joi.string().required(),
    description: Joi.string().optional().allow(''),
});

// Create Vehicle Model Validation
export const createVehicleModelValidation = Joi.object({
    slug: Joi.string().required().messages({
        'string.empty': 'Slug is required',
        'any.required': 'Slug is required'
    }),
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    generation: Joi.string().optional().allow(''),
    body_type: Joi.string().valid('Sedan', 'SUV', 'Crossover', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Minivan', 'MPV/MUV', 'Sports Car').optional().allow(''),
    production_years: Joi.string().optional().allow(''),
    platform: Joi.string().optional().allow(''),
    timeline: Joi.array().items(timelineEventValidation).optional(),
    brand_id: Joi.string().required().messages({
        'string.empty': 'Brand ID is required',
        'any.required': 'Brand ID is required'
    }),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional().default('active')
});

// Update Vehicle Model Validation
export const updateVehicleModelValidation = Joi.object({
    slug: Joi.string().optional(),
    name: Joi.string().optional(),
    generation: Joi.string().optional().allow(''),
    body_type: Joi.string().valid('Sedan', 'SUV', 'Crossover', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Minivan', 'MPV/MUV', 'Sports Car').optional().allow(''),
    production_years: Joi.string().optional().allow(''),
    platform: Joi.string().optional().allow(''),
    timeline: Joi.array().items(timelineEventValidation).optional(),
    brand_id: Joi.string().optional(),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Get All Vehicle Models Validation
export const getAllVehicleModelsValidation = Joi.object({
    search: Joi.string().optional().allow(''),
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional(),
    brand_id: Joi.string().optional(),
    body_type: Joi.string().optional().allow(''),
    sort_by: Joi.string().valid('name', 'created_at', 'updated_at', 'status').optional().default('name'),
    sort_order: Joi.string().valid('asc', 'desc').optional().default('asc')
});

// Get Models By Brand Validation
export const getModelsByBrandValidation = Joi.object({
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional()
});

// Update Vehicle Model Status Validation
export const updateVehicleModelStatusValidation = Joi.object({
    status: Joi.string().valid('active', 'discontinued', 'upcoming').required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
        'any.only': 'Status must be one of: active, discontinued, upcoming'
    })
});

// Vehicle Model ID Param Validation
export const vehicleModelIdParamValidation = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Vehicle model ID is required',
        'any.required': 'Vehicle model ID is required'
    })
});

// Brand ID Param Validation
export const brandIdParamValidation = Joi.object({
    brandId: Joi.string().required().messages({
        'string.empty': 'Brand ID is required',
        'any.required': 'Brand ID is required'
    })
});