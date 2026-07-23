// src/api/middlewares/validations/brand.validations.ts
import Joi from 'joi';

// Create Brand Validation
export const createBrandValidation = Joi.object({
    slug: Joi.string().required().pattern(/^[a-z0-9-]+$/).messages({
        'string.empty': 'Slug is required',
        'any.required': 'Slug is required',
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens'
    }),
    name: Joi.string().required().max(100).messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
        'string.max': 'Name cannot exceed 100 characters'
    }),
    logo: Joi.string().required().uri().messages({
        'string.empty': 'Logo URL is required',
        'any.required': 'Logo URL is required',
        'string.uri': 'Logo must be a valid URL'
    }),
    country: Joi.string().optional().allow('').max(100).messages({
        'string.max': 'Country name cannot exceed 100 characters'
    }),
    founded: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional().messages({
        'number.base': 'Founded year must be a number',
        'number.integer': 'Founded year must be an integer',
        'number.min': 'Founded year cannot be earlier than 1800',
        'number.max': `Founded year cannot be later than ${new Date().getFullYear()}`
    }),
    description: Joi.string().optional().allow('').max(1000).messages({
        'string.max': 'Description cannot exceed 1000 characters'
    }),
    website: Joi.string().optional().allow('').uri().messages({
        'string.uri': 'Website must be a valid URL'
    }),
    status: Joi.string().valid('active', 'inactive', 'archived').optional().default('active')
});

// Update Brand Validation
export const updateBrandValidation = Joi.object({
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).optional().messages({
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens'
    }),
    name: Joi.string().max(100).optional().messages({
        'string.max': 'Name cannot exceed 100 characters'
    }),
    logo: Joi.string().uri().optional().messages({
        'string.uri': 'Logo must be a valid URL'
    }),
    country: Joi.string().allow('').max(100).optional().messages({
        'string.max': 'Country name cannot exceed 100 characters'
    }),
    founded: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional().messages({
        'number.base': 'Founded year must be a number',
        'number.integer': 'Founded year must be an integer',
        'number.min': 'Founded year cannot be earlier than 1800',
        'number.max': `Founded year cannot be later than ${new Date().getFullYear()}`
    }),
    description: Joi.string().allow('').max(1000).optional().messages({
        'string.max': 'Description cannot exceed 1000 characters'
    }),
    website: Joi.string().allow('').uri().optional().messages({
        'string.uri': 'Website must be a valid URL'
    }),
    status: Joi.string().valid('active', 'inactive', 'archived').optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Get All Brands Validation
export const getAllBrandsValidation = Joi.object({
    search: Joi.string().optional().allow('').max(100).messages({
        'string.max': 'Search term cannot exceed 100 characters'
    }),
    offset: Joi.number().integer().min(0).optional().default(0).messages({
        'number.base': 'Offset must be a number',
        'number.integer': 'Offset must be an integer',
        'number.min': 'Offset cannot be negative'
    }),
    limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
    }),
    status: Joi.string().valid('active', 'inactive', 'archived').optional(),
    sort_by: Joi.string().valid('name', 'created_at', 'updated_at', 'status', 'founded').optional().default('name').messages({
        'any.only': 'Sort by must be one of: name, created_at, updated_at, status, founded'
    }),
    sort_order: Joi.string().valid('asc', 'desc').optional().default('asc').messages({
        'any.only': 'Sort order must be either asc or desc'
    })
});

// Get Brand Vehicles Validation
export const getBrandVehiclesValidation = Joi.object({
    brand_id: Joi.string().required().messages({
        'string.empty': 'Brand ID is required',
        'any.required': 'Brand ID is required'
    }),
    offset: Joi.number().integer().min(0).optional().default(0).messages({
        'number.base': 'Offset must be a number',
        'number.integer': 'Offset must be an integer',
        'number.min': 'Offset cannot be negative'
    }),
    limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
    }),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional()
});

// Update Brand Status Validation
export const updateBrandStatusValidation = Joi.object({
    status: Joi.string().valid('active', 'inactive', 'archived').required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
        'any.only': 'Status must be one of: active, inactive, archived'
    })
});

// Brand ID Param Validation
export const brandIdParamValidation = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Brand ID is required',
        'any.required': 'Brand ID is required'
    })
});

// Brand Slug Param Validation (for public routes)
export const brandSlugParamValidation = Joi.object({
    slug: Joi.string().required().pattern(/^[a-z0-9-]+$/).messages({
        'string.empty': 'Brand slug is required',
        'any.required': 'Brand slug is required',
        'string.pattern.base': 'Invalid brand slug format'
    })
});