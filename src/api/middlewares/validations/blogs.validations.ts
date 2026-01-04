import Joi from "joi";

export const createOrganizationValidation = Joi.object({
  // Basic
  name: Joi.string().required().messages({
    "string.empty": "Organization name is required",
  }),
  full_name: Joi.string().allow("", null),
  owner_id: Joi.string().allow("", null),

  // Compliance
  GST_no: Joi.string().allow("", null),
  pan_no: Joi.string().allow("", null),
  fssai_no: Joi.string().allow("", null),

  // Contact
  email: Joi.string().email().allow("", null),
  country_code: Joi.string().allow("", null),
  phone_no: Joi.string().allow("", null),
  alternate_phone: Joi.string().allow("", null),
  landline_no: Joi.string().allow("", null),

  // Address
  address_line_1: Joi.string().allow("", null),
  address_line_2: Joi.string().allow("", null),
  city: Joi.string().allow("", null),
  state: Joi.string().allow("", null),
  country: Joi.string().allow("", null),
  zip_code: Joi.string().allow("", null),
  latitude: Joi.number().allow(null),
  longitude: Joi.number().allow(null),

  // Store Info
  logo_url: Joi.string().allow("", null),
  business_type: Joi.string().allow("", null),
  opening_time: Joi.string().allow("", null),
  closing_time: Joi.string().allow("", null),
  weekly_off: Joi.string().allow("", null),
  is_active: Joi.boolean().default(true),

  // Billing
  invoice_prefix: Joi.string().allow("", null),
  store_code: Joi.string().allow("", null),

  // Payment
  upi_id: Joi.string().allow("", null),
  bank_account_no: Joi.string().allow("", null),
  bank_ifsc: Joi.string().allow("", null),

  // Delivery
  delivery_available: Joi.boolean().default(false),
  min_order_amount: Joi.number().default(0),
  delivery_radius: Joi.number().allow(null),
}).required();
