import Joi from 'joi';

export const createReviewValidation = Joi.object({
  sub_variant_id: Joi.string().required().messages({
    'string.empty': 'Sub-variant ID is required',
    'any.required': 'Sub-variant ID is required',
  }),
  rating: Joi.number().min(0).max(5).precision(1).required().messages({
    'number.base': 'Rating must be a number',
    'number.min': 'Rating must be at least 0',
    'number.max': 'Rating cannot exceed 5',
    'any.required': 'Rating is required',
  }),
  title: Joi.string().max(200).optional().allow('').messages({
    'string.max': 'Title cannot exceed 200 characters',
  }),
  content: Joi.string().max(2000).optional().allow('').messages({
    'string.max': 'Review content cannot exceed 2000 characters',
  }),
  pros: Joi.array().items(Joi.string().max(100)).max(20).optional().default([]).messages({
    'array.max': 'Cannot have more than 20 pros',
    'string.max': 'Each pro cannot exceed 100 characters',
  }),
  cons: Joi.array().items(Joi.string().max(100)).max(20).optional().default([]).messages({
    'array.max': 'Cannot have more than 20 cons',
    'string.max': 'Each con cannot exceed 100 characters',
  }),
});

export const updateReviewValidation = Joi.object({
  rating: Joi.number().min(0).max(5).precision(1).optional(),
  title: Joi.string().max(200).optional().allow(''),
  content: Joi.string().max(2000).optional().allow(''),
  pros: Joi.array().items(Joi.string().max(100)).max(20).optional(),
  cons: Joi.array().items(Joi.string().max(100)).max(20).optional(),
}).min(1).messages({ 'object.min': 'At least one field must be provided for update' });

export const getAllReviewsValidation = Joi.object({
  search: Joi.string().optional().allow(''),
  offset: Joi.number().integer().min(0).optional().default(0),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
  sub_variant_id: Joi.string().optional(),
  user_id: Joi.string().optional(),
  min_rating: Joi.number().min(0).max(5).optional(),
  max_rating: Joi.number().min(0).max(5).optional(),
  sort_by: Joi.string().valid('created_at', 'rating', 'helpful_count', 'updated_at').optional().default('created_at'),
  sort_order: Joi.string().valid('asc', 'desc').optional().default('desc'),
});

export const updateReviewStatusValidation = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required().messages({
    'string.empty': 'Status is required',
    'any.required': 'Status is required',
    'any.only': 'Status must be one of: pending, approved, rejected',
  }),
});

export const markReviewHelpfulValidation = Joi.object({
  action: Joi.string().valid('increment', 'decrement').optional().default('increment'),
});

export const reviewIdParamValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Review ID is required',
    'any.required': 'Review ID is required',
  }),
});

export const subVariantIdParamValidation = Joi.object({
  subVariantId: Joi.string().required().messages({
    'string.empty': 'Sub-variant ID is required',
    'any.required': 'Sub-variant ID is required',
  }),
});

export const userIdParamValidation = Joi.object({
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
    'any.required': 'User ID is required',
  }),
});
