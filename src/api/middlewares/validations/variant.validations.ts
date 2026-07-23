import Joi from 'joi';

const colorValidation = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  hex_code: Joi.string().required(),
  image_url: Joi.string().optional().allow(''),
  price_delta: Joi.number().optional().allow(null),
  type: Joi.string().valid('standard', 'metallic', 'pearlescent', 'matte', 'satin').optional(),
  is_available: Joi.boolean().optional().default(true),
});

export const createVariantValidation = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).required().messages({
    'string.empty': 'Slug is required',
    'any.required': 'Slug is required',
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
  }),
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  trim: Joi.string().optional().allow(''),
  launch_year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 2).optional(),
  production_status: Joi.string().valid('in-production', 'discontinued', 'upcoming').optional(),
  segment: Joi.string().valid('Budget', 'Mid', 'Premium', 'Luxury').optional().allow(''),
  description: Joi.string().max(2000).optional().allow('', null),
  cover_image: Joi.string().uri().optional().allow('', null),
  colors: Joi.array().items(colorValidation).optional().default([]),
  competitor_ids: Joi.array().items(Joi.string()).optional().default([]),
  model_id: Joi.string().required().messages({
    'string.empty': 'Model ID is required',
    'any.required': 'Model ID is required',
  }),
  status: Joi.string().valid('active', 'discontinued', 'upcoming').optional().default('active'),
  featured: Joi.boolean().optional().default(false),
});

export const updateVariantValidation = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).optional(),
  name: Joi.string().optional(),
  trim: Joi.string().optional().allow(''),
  launch_year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 2).optional(),
  production_status: Joi.string().valid('in-production', 'discontinued', 'upcoming').optional(),
  segment: Joi.string().valid('Budget', 'Mid', 'Premium', 'Luxury').optional().allow(''),
  description: Joi.string().max(2000).optional().allow('', null),
  cover_image: Joi.string().uri().optional().allow('', null),
  colors: Joi.array().items(colorValidation).optional(),
  competitor_ids: Joi.array().items(Joi.string()).optional(),
  model_id: Joi.string().optional(),
  status: Joi.string().valid('active', 'discontinued', 'upcoming').optional(),
  featured: Joi.boolean().optional(),
}).min(1).messages({ 'object.min': 'At least one field must be provided for update' });

export const getAllVariantsValidation = Joi.object({
  search: Joi.string().optional().allow(''),
  offset: Joi.number().integer().min(0).optional().default(0),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  status: Joi.string().valid('active', 'discontinued', 'upcoming').optional(),
  model_id: Joi.string().optional(),
  segment: Joi.string().optional(),
  launch_year: Joi.number().integer().optional(),
  featured: Joi.boolean().optional(),
  sort_by: Joi.string().valid('name', 'launch_year', 'created_at', 'updated_at', 'view_count').optional().default('name'),
  sort_order: Joi.string().valid('asc', 'desc').optional().default('asc'),
});

export const getVariantsByModelValidation = Joi.object({
  offset: Joi.number().integer().min(0).optional().default(0),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  status: Joi.string().valid('active', 'discontinued', 'upcoming').optional(),
  segment: Joi.string().optional(),
  featured: Joi.boolean().optional(),
});

export const updateVariantStatusValidation = Joi.object({
  status: Joi.string().valid('active', 'discontinued', 'upcoming').required().messages({
    'string.empty': 'Status is required',
    'any.required': 'Status is required',
    'any.only': 'Status must be one of: active, discontinued, upcoming',
  }),
});

export const getVariantsByIdsValidation = Joi.object({
  ids: Joi.string().required().messages({
    'string.empty': 'ids is required (comma-separated variant ids)',
    'any.required': 'ids is required (comma-separated variant ids)',
  }),
});

export const variantIdParamValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Variant ID is required',
    'any.required': 'Variant ID is required',
  }),
});

export const modelIdParamValidation = Joi.object({
  modelId: Joi.string().required().messages({
    'string.empty': 'Model ID is required',
    'any.required': 'Model ID is required',
  }),
});

export const variantSlugParamValidation = Joi.object({
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).required().messages({
    'string.empty': 'Variant slug is required',
    'any.required': 'Variant slug is required',
    'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
  }),
});
