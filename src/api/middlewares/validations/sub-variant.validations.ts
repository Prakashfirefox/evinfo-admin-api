import Joi from 'joi';

const FUEL_TYPES = ['Petrol', 'Diesel', 'EV', 'Hybrid', 'CNG', 'PHEV'];
const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', 'AMT', 'DCT'];
const DRIVETRAINS = ['FWD', 'RWD', 'AWD', '4WD', '4x4'];
const STATUSES = ['active', 'discontinued', 'upcoming'];

const ownershipValidation = Joi.object({
  warranty: Joi.string().optional().allow(''),
  battery_warranty: Joi.string().optional().allow(''),
  service_interval: Joi.string().optional().allow(''),
  maintenance_cost: Joi.string().optional().allow(''),
  roadside_assist: Joi.boolean().optional(),
  service_centers: Joi.number().integer().min(0).optional(),
});

export const createSubVariantValidation = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).required().messages({
    'string.empty': 'Slug is required',
    'any.required': 'Slug is required',
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  variant_id: Joi.string().required().messages({
    'string.empty': 'Variant ID is required',
    'any.required': 'Variant ID is required',
  }),
  fuel_type: Joi.string().valid(...FUEL_TYPES).required().messages({
    'any.required': 'Fuel type is required',
    'any.only': `Fuel type must be one of: ${FUEL_TYPES.join(', ')}`,
  }),
  transmission: Joi.string().valid(...TRANSMISSIONS).required().messages({
    'any.required': 'Transmission is required',
    'any.only': `Transmission must be one of: ${TRANSMISSIONS.join(', ')}`,
  }),
  engine: Joi.string().optional().allow(''),
  drivetrain: Joi.string().valid(...DRIVETRAINS).optional(),
  ownership: ownershipValidation.optional(),
  status: Joi.string().valid(...STATUSES).optional().default('active'),
});

export const updateSubVariantValidation = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).optional(),
  name: Joi.string().optional(),
  variant_id: Joi.string().optional(),
  fuel_type: Joi.string().valid(...FUEL_TYPES).optional(),
  transmission: Joi.string().valid(...TRANSMISSIONS).optional(),
  engine: Joi.string().optional().allow(''),
  drivetrain: Joi.string().valid(...DRIVETRAINS).optional(),
  ownership: ownershipValidation.optional(),
  status: Joi.string().valid(...STATUSES).optional(),
}).min(1).messages({ 'object.min': 'At least one field must be provided for update' });

export const getAllSubVariantsValidation = Joi.object({
  search: Joi.string().optional().allow(''),
  offset: Joi.number().integer().min(0).optional().default(0),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  status: Joi.string().valid(...STATUSES).optional(),
  variant_id: Joi.string().optional(),
  model_id: Joi.string().optional(),
  brand_id: Joi.string().optional(),
  fuel_type: Joi.string().valid(...FUEL_TYPES).optional(),
  transmission: Joi.string().valid(...TRANSMISSIONS).optional(),
  min_price: Joi.number().min(0).optional(),
  max_price: Joi.number().min(0).optional(),
  sort_by: Joi.string().valid('name', 'created_at', 'updated_at', 'view_count', 'status').optional().default('created_at'),
  sort_order: Joi.string().valid('asc', 'desc').optional().default('desc'),
});

export const getSubVariantsByVariantValidation = Joi.object({
  offset: Joi.number().integer().min(0).optional().default(0),
  limit: Joi.number().integer().min(1).max(100).optional().default(50),
  status: Joi.string().valid(...STATUSES).optional(),
  fuel_type: Joi.string().valid(...FUEL_TYPES).optional(),
  transmission: Joi.string().valid(...TRANSMISSIONS).optional(),
});

export const updateSubVariantStatusValidation = Joi.object({
  status: Joi.string().valid(...STATUSES).required().messages({
    'string.empty': 'Status is required',
    'any.required': 'Status is required',
    'any.only': `Status must be one of: ${STATUSES.join(', ')}`,
  }),
});

export const bulkUpdateSubVariantStatusValidation = Joi.object({
  sub_variant_ids: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least 1 sub-variant ID is required',
    'any.required': 'Sub-variant IDs are required',
  }),
  status: Joi.string().valid(...STATUSES).required(),
});

export const compareSubVariantsValidation = Joi.object({
  sub_variant_ids: Joi.array().items(Joi.string()).min(2).max(4).required().messages({
    'array.min': 'At least 2 sub-variants are required for comparison',
    'array.max': 'Cannot compare more than 4 sub-variants at once',
    'any.required': 'Sub-variant IDs are required',
  }),
});

export const subVariantIdParamValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Sub-variant ID is required',
    'any.required': 'Sub-variant ID is required',
  }),
});

export const subVariantSlugParamValidation = Joi.object({
  slug: Joi.string().required().messages({
    'string.empty': 'Sub-variant slug is required',
    'any.required': 'Sub-variant slug is required',
  }),
});

export const variantIdParamValidation = Joi.object({
  variantId: Joi.string().required().messages({
    'string.empty': 'Variant ID is required',
    'any.required': 'Variant ID is required',
  }),
});
