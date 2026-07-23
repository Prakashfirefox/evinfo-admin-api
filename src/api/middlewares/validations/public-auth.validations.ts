import Joi from 'joi';

export const registerValidation = Joi.object({
  full_name: Joi.string().min(2).max(120).required().messages({
    'string.empty': 'Full name is required',
    'any.required': 'Full name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Enter a valid email address',
    'any.required': 'Email is required',
  }),
  phone_no: Joi.string().pattern(/^[0-9]{7,15}$/).optional().allow('').messages({
    'string.pattern.base': 'Enter a valid phone number',
  }),
  country_code: Joi.string().max(6).optional().allow(''),
  password: Joi.string().min(6).max(64).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const verifyOtpValidation = Joi.object({
  userId: Joi.string().required(),
  emailOtp: Joi.string().optional().allow(''),
  phoneOtp: Joi.string().optional().allow(''),
});

export const resendOtpValidation = Joi.object({
  userId: Joi.string().required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
