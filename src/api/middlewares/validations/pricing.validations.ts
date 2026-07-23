import Joi from 'joi';

const financingValidation = Joi.object({
  emi: Joi.string().optional().allow(''),
  down_payment: Joi.string().optional().allow(''),
  tenure: Joi.string().optional().allow(''),
  interest: Joi.number().min(0).max(100).optional(),
});

export const createPricingValidation = Joi.object({
  sub_variant_id: Joi.string().required().messages({
    'string.empty': 'Sub-variant ID is required',
    'any.required': 'Sub-variant ID is required',
  }),
  city: Joi.string().optional().allow(null, ''),
  state: Joi.string().optional().allow(''),
  ex_showroom_price: Joi.number().min(0).required().messages({
    'number.base': 'Ex-showroom price must be a number',
    'any.required': 'Ex-showroom price is required',
  }),
  on_road_price: Joi.number().min(0).optional(),
  insurance: Joi.number().min(0).optional(),
  registration: Joi.number().min(0).optional(),
  tcs_tax: Joi.number().min(0).optional(),
  financing: financingValidation.optional(),
  is_active: Joi.boolean().optional().default(true),
});

export const updatePricingValidation = Joi.object({
  city: Joi.string().optional().allow(null, ''),
  state: Joi.string().optional().allow(''),
  ex_showroom_price: Joi.number().min(0).optional(),
  on_road_price: Joi.number().min(0).optional(),
  insurance: Joi.number().min(0).optional(),
  registration: Joi.number().min(0).optional(),
  tcs_tax: Joi.number().min(0).optional(),
  financing: financingValidation.optional(),
  is_active: Joi.boolean().optional(),
}).min(1).messages({ 'object.min': 'At least one field must be provided for update' });

export const getPricingValidation = Joi.object({
  sub_variant_id: Joi.string().optional(),
  city: Joi.string().optional().allow(''),
  state: Joi.string().optional().allow(''),
  is_active: Joi.boolean().optional(),
  offset: Joi.number().integer().min(0).optional().default(0),
  limit: Joi.number().integer().min(1).max(100).optional().default(20),
});

export const pricingIdParamValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Pricing ID is required',
    'any.required': 'Pricing ID is required',
  }),
});

export const subVariantIdParamValidation = Joi.object({
  subVariantId: Joi.string().required().messages({
    'string.empty': 'Sub-variant ID is required',
    'any.required': 'Sub-variant ID is required',
  }),
});
