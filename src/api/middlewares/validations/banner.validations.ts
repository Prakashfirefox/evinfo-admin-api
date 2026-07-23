// src/api/middlewares/validations/banner.validations.ts
import Joi from 'joi';
import { BannerStatus } from '../../interfaces/banner.interface';

// Create Banner Validation
export const createBannerValidation = Joi.object({
    title: Joi.string().required().max(200).messages({
        'string.empty': 'Banner title is required',
        'any.required': 'Banner title is required',
        'string.max': 'Banner title cannot exceed 200 characters'
    }),
    
    slug: Joi.string().required().pattern(/^[a-z0-9-]+$/).max(200).messages({
        'string.empty': 'Banner slug is required',
        'any.required': 'Banner slug is required',
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
        'string.max': 'Slug cannot exceed 200 characters'
    }),
    
    image_url: Joi.string().required().uri().messages({
        'string.empty': 'Image URL is required',
        'any.required': 'Image URL is required',
        'string.uri': 'Image must be a valid URL'
    }),
    
    redirect_url: Joi.string().uri().optional().allow(null).messages({
        'string.uri': 'Redirect URL must be a valid URL'
    }),
    
    position: Joi.string().valid(
        'HOME_TOP', 
        'HOME_MIDDLE', 
        'HOME_BOTTOM',
        'POPUP',
        'SIDEBAR',
        'HEADER',
        'FOOTER'
    ).optional().allow(null).messages({
        'any.only': 'Position must be one of: HOME_TOP, HOME_MIDDLE, HOME_BOTTOM, POPUP, SIDEBAR, HEADER, FOOTER'
    }),
    
    priority: Joi.number().integer().min(0).max(999).optional().default(0).messages({
        'number.base': 'Priority must be a number',
        'number.integer': 'Priority must be an integer',
        'number.min': 'Priority cannot be negative',
        'number.max': 'Priority cannot exceed 999'
    }),
    
    start_date: Joi.date().iso().optional().allow(null).messages({
        'date.base': 'Start date must be a valid date',
        'date.iso': 'Start date must be in ISO format'
    }),
    
    end_date: Joi.date().iso().greater(Joi.ref('start_date')).optional().allow(null).messages({
        'date.base': 'End date must be a valid date',
        'date.iso': 'End date must be in ISO format',
        'date.greater': 'End date must be after start date'
    }),
    
    status: Joi.string().valid(...Object.values(BannerStatus)).optional().default(BannerStatus.ACTIVE).messages({
        'any.only': `Status must be one of: ${Object.values(BannerStatus).join(', ')}`
    })
});

// Update Banner Validation
export const updateBannerValidation = Joi.object({
    title: Joi.string().max(200).optional().messages({
        'string.max': 'Banner title cannot exceed 200 characters'
    }),
    
    slug: Joi.string().pattern(/^[a-z0-9-]+$/).max(200).optional().messages({
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
        'string.max': 'Slug cannot exceed 200 characters'
    }),
    
    image_url: Joi.string().uri().optional().messages({
        'string.uri': 'Image must be a valid URL'
    }),
    
    redirect_url: Joi.string().uri().optional().allow(null).messages({
        'string.uri': 'Redirect URL must be a valid URL'
    }),
    
    position: Joi.string().valid(
        'HOME_TOP', 
        'HOME_MIDDLE', 
        'HOME_BOTTOM',
        'POPUP',
        'SIDEBAR',
        'HEADER',
        'FOOTER'
    ).optional().allow(null).messages({
        'any.only': 'Position must be one of: HOME_TOP, HOME_MIDDLE, HOME_BOTTOM, POPUP, SIDEBAR, HEADER, FOOTER'
    }),
    
    priority: Joi.number().integer().min(0).max(999).optional().messages({
        'number.base': 'Priority must be a number',
        'number.integer': 'Priority must be an integer',
        'number.min': 'Priority cannot be negative',
        'number.max': 'Priority cannot exceed 999'
    }),
    
    start_date: Joi.date().iso().optional().allow(null).messages({
        'date.base': 'Start date must be a valid date',
        'date.iso': 'Start date must be in ISO format'
    }),
    
    end_date: Joi.date().iso().optional().allow(null).messages({
        'date.base': 'End date must be a valid date',
        'date.iso': 'End date must be in ISO format'
    }).when('start_date', {
        is: Joi.date().required(),
        then: Joi.date().greater(Joi.ref('start_date')).messages({
            'date.greater': 'End date must be after start date'
        })
    }),
    
    status: Joi.string().valid(...Object.values(BannerStatus)).optional().messages({
        'any.only': `Status must be one of: ${Object.values(BannerStatus).join(', ')}`
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Get All Banners Validation
export const getAllBannersValidation = Joi.object({
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
    position: Joi.string().valid(
        'HOME_TOP', 
        'HOME_MIDDLE',
        'HOME_BOTTOM',
        'POPUP',
        'SIDEBAR',
        'HEADER',
        'FOOTER'
    ).optional().messages({
        'any.only': 'Position must be one of: HOME_TOP, HOME_MIDDLE, HOME_BOTTOM, POPUP, SIDEBAR, HEADER, FOOTER'
    }),
    
    status: Joi.string().valid(...Object.values(BannerStatus)).optional().messages({
        'any.only': `Status must be one of: ${Object.values(BannerStatus).join(', ')}`
    })
});

// Update Banner Status Validation
export const updateBannerStatusValidation = Joi.object({
    status: Joi.string().valid(...Object.values(BannerStatus)).required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
        'any.only': `Status must be one of: ${Object.values(BannerStatus).join(', ')}`
    })
});

// Banner ID Param Validation
export const bannerIdParamValidation = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Banner ID is required',
        'any.required': 'Banner ID is required'
    })
});

// Banner Slug Param Validation
export const bannerSlugParamValidation = Joi.object({
    slug: Joi.string().required().pattern(/^[a-z0-9-]+$/).messages({
        'string.empty': 'Banner slug is required',
        'any.required': 'Banner slug is required',
        'string.pattern.base': 'Invalid banner slug format'
    })
});

// Date Range Validation for Banner Reports
export const bannerDateRangeValidation = Joi.object({
    start_date: Joi.date().iso().required().messages({
        'date.base': 'Start date must be a valid date',
        'date.iso': 'Start date must be in ISO format',
        'any.required': 'Start date is required'
    }),
    
    end_date: Joi.date().iso().greater(Joi.ref('start_date')).required().messages({
        'date.base': 'End date must be a valid date',
        'date.iso': 'End date must be in ISO format',
        'date.greater': 'End date must be after start date',
        'any.required': 'End date is required'
    })
});

// Banner Position Validation
export const bannerPositionValidation = Joi.object({
    position: Joi.string().valid(
        'HOME_TOP', 
        'HOME_MIDDLE', 
        'HOME_BOTTOM',
        'POPUP',
        'SIDEBAR',
        'HEADER',
        'FOOTER'
    ).required().messages({
        'string.empty': 'Position is required',
        'any.required': 'Position is required',
        'any.only': 'Position must be one of: HOME_TOP, HOME_MIDDLE, HOME_BOTTOM, POPUP, SIDEBAR, HEADER, FOOTER'
    })
});

// Bulk Banner Status Update Validation
export const bulkBannerStatusValidation = Joi.object({
    banner_ids: Joi.array().items(Joi.string()).min(1).max(50).required().messages({
        'array.min': 'At least one banner ID is required',
        'array.max': 'Cannot update more than 50 banners at once',
        'any.required': 'Banner IDs are required'
    }),
    
    status: Joi.string().valid(...Object.values(BannerStatus)).required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
        'any.only': `Status must be one of: ${Object.values(BannerStatus).join(', ')}`
    })
});

// Banner Priority Update Validation
export const updateBannerPriorityValidation = Joi.object({
    priority: Joi.number().integer().min(0).max(999).required().messages({
        'number.base': 'Priority must be a number',
        'number.integer': 'Priority must be an integer',
        'number.min': 'Priority cannot be negative',
        'number.max': 'Priority cannot exceed 999',
        'any.required': 'Priority is required'
    })
});