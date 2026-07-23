import Joi from 'joi';

export const createContactMessageValidation = Joi.object({
  name: Joi.string().max(120).required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  subject: Joi.string().max(200).optional().allow(''),
  message: Joi.string().max(5000).required().messages({
    'string.empty': 'Message is required',
    'any.required': 'Message is required',
  }),
});

export const getAllContactMessagesValidation = Joi.object({
  search: Joi.string().optional().allow(''),
  status: Joi.string().valid('new', 'read', 'resolved').optional(),
  offset: Joi.number().integer().min(0).optional().default(0),
  limit: Joi.number().integer().min(1).max(100).optional().default(20),
});

export const updateContactStatusValidation = Joi.object({
  status: Joi.string().valid('new', 'read', 'resolved').required().messages({
    'any.required': 'Status is required',
    'any.only': 'Status must be one of: new, read, resolved',
  }),
});

export const contactIdParamValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Contact message ID is required',
    'any.required': 'Contact message ID is required',
  }),
});
