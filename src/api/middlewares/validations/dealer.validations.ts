// src/api/middlewares/validations/dealer.validations.ts
import Joi from 'joi';

// Location coordinates validation
const locationValidation = Joi.object({
    lat: Joi.number().min(-90).max(90).required().messages({
        'number.base': 'Latitude must be a number',
        'number.min': 'Latitude must be between -90 and 90',
        'number.max': 'Latitude must be between -90 and 90',
        'any.required': 'Latitude is required'
    }),
    lng: Joi.number().min(-180).max(180).required().messages({
        'number.base': 'Longitude must be a number',
        'number.min': 'Longitude must be between -180 and 180',
        'number.max': 'Longitude must be between -180 and 180',
        'any.required': 'Longitude is required'
    })
});

// Create Dealer Validation
export const createDealerValidation = Joi.object({
    name: Joi.string().required().max(200).messages({
        'string.empty': 'Dealer name is required',
        'string.max': 'Dealer name cannot exceed 200 characters',
        'any.required': 'Dealer name is required'
    }),
    address: Joi.string().required().max(500).messages({
        'string.empty': 'Address is required',
        'string.max': 'Address cannot exceed 500 characters',
        'any.required': 'Address is required'
    }),
    city: Joi.string().required().max(100).messages({
        'string.empty': 'City is required',
        'string.max': 'City cannot exceed 100 characters',
        'any.required': 'City is required'
    }),
    state: Joi.string().required().max(100).messages({
        'string.empty': 'State is required',
        'string.max': 'State cannot exceed 100 characters',
        'any.required': 'State is required'
    }),
    country: Joi.string().required().max(100).messages({
        'string.empty': 'Country is required',
        'string.max': 'Country cannot exceed 100 characters',
        'any.required': 'Country is required'
    }),
    pincode: Joi.string().pattern(/^[0-9]{5,10}$/).optional().allow('').messages({
        'string.pattern.base': 'Pincode must contain 5-10 digits'
    }),
    phone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/).optional().allow('').messages({
        'string.pattern.base': 'Please enter a valid phone number'
    }),
    email: Joi.string().email().optional().allow('').messages({
        'string.email': 'Please enter a valid email address'
    }),
    website: Joi.string().uri().optional().allow('').messages({
        'string.uri': 'Please enter a valid website URL'
    }),
    coordinates: locationValidation.optional(),
    brands: Joi.array().items(Joi.string()).min(1).optional().messages({
        'array.min': 'At least one brand must be selected'
    }),
    services: Joi.array().items(Joi.string().valid(
        'sales',
        'service',
        'parts',
        'financing',
        'insurance',
        'test-drive',
        'home-delivery',
        'charging-installation',
        'maintenance',
        'repair',
        'body-shop',
        'rental'
    )).optional().default([]),
    rating: Joi.number().min(0).max(5).precision(1).optional(),
    status: Joi.string().valid('active', 'inactive', 'closed').optional().default('active')
});

// Update Dealer Validation
export const updateDealerValidation = Joi.object({
    name: Joi.string().max(200).optional(),
    address: Joi.string().max(500).optional(),
    city: Joi.string().max(100).optional(),
    state: Joi.string().max(100).optional(),
    country: Joi.string().max(100).optional(),
    pincode: Joi.string().pattern(/^[0-9]{5,10}$/).optional().allow(''),
    phone: Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/).optional().allow(''),
    email: Joi.string().email().optional().allow(''),
    website: Joi.string().uri().optional().allow(''),
    coordinates: locationValidation.optional(),
    brands: Joi.array().items(Joi.string()).min(1).optional(),
    services: Joi.array().items(Joi.string().valid(
        'sales', 'service', 'parts', 'financing', 'insurance',
        'test-drive', 'home-delivery', 'charging-installation',
        'maintenance', 'repair', 'body-shop', 'rental'
    )).optional(),
    rating: Joi.number().min(0).max(5).precision(1).optional(),
    status: Joi.string().valid('active', 'inactive', 'closed').optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Get All Dealers Validation
export const getAllDealersValidation = Joi.object({
    search: Joi.string().optional().allow('').max(100).messages({
        'string.max': 'Search term cannot exceed 100 characters'
    }),
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    status: Joi.string().valid('active', 'inactive', 'closed').optional(),
    city: Joi.string().optional().max(100),
    state: Joi.string().optional().max(100),
    country: Joi.string().optional().max(100),
    brand_id: Joi.string().optional(),
    service: Joi.string().valid(
        'sales', 'service', 'parts', 'financing', 'insurance',
        'test-drive', 'home-delivery', 'charging-installation',
        'maintenance', 'repair', 'body-shop', 'rental'
    ).optional(),
    min_rating: Joi.number().min(0).max(5).optional(),
    sort_by: Joi.string().valid('name', 'city', 'state', 'rating', 'created_at').optional().default('name'),
    sort_order: Joi.string().valid('asc', 'desc').optional().default('asc')
});

// Get Nearby Dealers Validation
export const getNearbyDealersValidation = Joi.object({
    lat: Joi.number().min(-90).max(90).required().messages({
        'number.base': 'Latitude is required',
        'any.required': 'Latitude is required'
    }),
    lng: Joi.number().min(-180).max(180).required().messages({
        'number.base': 'Longitude is required',
        'any.required': 'Longitude is required'
    }),
    radius: Joi.number().integer().min(1).max(100).optional().default(10).messages({
        'number.min': 'Radius must be at least 1 km',
        'number.max': 'Radius cannot exceed 100 km'
    }),
    limit: Joi.number().integer().min(1).max(50).optional().default(20),
    brand_id: Joi.string().optional(),
    service: Joi.string().valid(
        'sales', 'service', 'parts', 'financing', 'insurance',
        'test-drive', 'home-delivery', 'charging-installation',
        'maintenance', 'repair', 'body-shop', 'rental'
    ).optional()
});

// Get Dealers By Vehicle Validation
export const getDealersByVehicleValidation = Joi.object({
    vehicle_id: Joi.string().required().messages({
        'string.empty': 'Vehicle ID is required',
        'any.required': 'Vehicle ID is required'
    }),
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    city: Joi.string().optional().max(100),
    state: Joi.string().optional().max(100)
});

// Update Dealer Status Validation
export const updateDealerStatusValidation = Joi.object({
    status: Joi.string().valid('active', 'inactive', 'closed').required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
        'any.only': 'Status must be one of: active, inactive, closed'
    })
});

// Update Dealer Rating Validation
export const updateDealerRatingValidation = Joi.object({
    rating: Joi.number().min(0).max(5).precision(1).required().messages({
        'number.base': 'Rating must be a number',
        'number.min': 'Rating must be at least 0',
        'number.max': 'Rating cannot exceed 5',
        'any.required': 'Rating is required'
    })
});

// Add Dealer Services Validation
export const addDealerServicesValidation = Joi.object({
    services: Joi.array().items(Joi.string().valid(
        'sales', 'service', 'parts', 'financing', 'insurance',
        'test-drive', 'home-delivery', 'charging-installation',
        'maintenance', 'repair', 'body-shop', 'rental'
    )).min(1).required().messages({
        'array.min': 'At least one service must be provided',
        'any.required': 'Services are required'
    })
});

// Remove Dealer Services Validation
export const removeDealerServicesValidation = Joi.object({
    services: Joi.array().items(Joi.string().valid(
        'sales', 'service', 'parts', 'financing', 'insurance',
        'test-drive', 'home-delivery', 'charging-installation',
        'maintenance', 'repair', 'body-shop', 'rental'
    )).min(1).required().messages({
        'array.min': 'At least one service must be provided',
        'any.required': 'Services are required'
    })
});

// Dealer ID Param Validation
export const dealerIdParamValidation = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Dealer ID is required',
        'any.required': 'Dealer ID is required'
    })
});

// Brand ID Param Validation
export const brandIdParamValidation = Joi.object({
    brandId: Joi.string().required().messages({
        'string.empty': 'Brand ID is required',
        'any.required': 'Brand ID is required'
    })
});

// Vehicle ID Param Validation
export const vehicleIdParamValidation = Joi.object({
    vehicleId: Joi.string().required().messages({
        'string.empty': 'Vehicle ID is required',
        'any.required': 'Vehicle ID is required'
    })
});

// Get Dealer Stats Validation (if any filters are needed)
export const getDealerStatsValidation = Joi.object({
    from_date: Joi.date().iso().optional(),
    to_date: Joi.date().iso().min(Joi.ref('from_date')).optional(),
    region: Joi.string().optional().max(100)
}).optional();