import Joi from 'joi';

/**
 *User Registration Validation
 */
export const userRegisterValidation = Joi.object({
    username: Joi.string().min(3).max(150).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
    }),
    email: Joi.string().min(3).max(150).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
    }),
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
        .required()
        .messages({
            'string.pattern.base':
                'Password must contain uppercase, lowercase, number, and special character',
            'string.min': 'Password must be at least 8 characters',
            'string.empty': 'Password is required',
        }),

    first_name: Joi.string().allow('', null).max(150),
    last_name: Joi.string().allow('', null).max(150),
    is_superuser: Joi.boolean().default(false).optional(),
    is_admin: Joi.boolean().default(false).optional(),
    is_active: Joi.boolean().default(true),
}).required();

/**
 * User Login Validation
 */
export const userLoginValidation = Joi.object({
    email: Joi.string().min(3).max(150).required().messages({
        'string.empty': 'email is required',
    }),
    password: Joi.string().min(8).max(128).required().messages({
        'string.empty': 'Password is required',
    }),
}).required();

/**
 * Optional: User Update Validation
 */
export const userUpdateValidation = Joi.object({
    user_name: Joi.string().min(3).max(150).optional(),
    email: Joi.string().min(3).max(150).optional(),
    first_name: Joi.string().allow('', null).max(150),
    last_name: Joi.string().allow('', null).max(150),
    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
        .messages({
            'string.pattern.base':
                'Password must contain uppercase, lowercase, number, and special character',
        }),
    role: Joi.string().allow('', null),
    is_active: Joi.boolean(),
    is_admin: Joi.boolean(),
    is_superuser: Joi.boolean(),
    dob: Joi.string().allow('', null),
    country_code: Joi.string().allow('', null),
    gender: Joi.string().allow('', null),
    phoneNo: Joi.string().allow('', null),
    full_name: Joi.string().allow('', null)
}).required();


/**
 * OTP Verification Validation
 */
export const verifyOtpValidation = Joi.object({
    userId: Joi.string().required().messages({
        'string.empty': 'User ID is required',
    }),
    otp: Joi.string().length(6).required().messages({
        'string.empty': 'OTP is required',
        'string.length': 'OTP must be 6 characters long',
    }),
}).required();



/**
 * Optional: User Update Validation
 */
export const getAllUsersValidation = Joi.object({
    is_staff: Joi.boolean().optional(),
    is_superuser: Joi.boolean().optional(),
    offset: Joi.number(),
    limit: Joi.number(),
}).required();


export const updateUserStatus = Joi.object({
  status: Joi.string()
    .valid("active", "converted", "contacted", "not_interested", "just_enquiry")
    .required()
    .messages({
      "any.only": "Status must be one of: active, converted, contacted, not_interested, just_enquiry",
      "string.empty": "Status is required",
      "any.required": "Status is required",
    }),
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'A valid email address is required',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
}).required();

export const resetPasswordValidation = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Reset token is required',
    'any.required': 'Reset token is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'A valid email address is required',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  new_password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain uppercase, lowercase, number, and special character',
      'string.min': 'Password must be at least 8 characters',
      'string.empty': 'New password is required',
      'any.required': 'New password is required',
    }),
}).required();