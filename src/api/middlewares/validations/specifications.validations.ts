import Joi from 'joi';

const performanceValidation = Joi.object({
  acceleration: Joi.string().optional().allow(''),
  top_speed: Joi.string().optional().allow(''),
  power: Joi.string().optional().allow(''),
  torque: Joi.string().optional().allow(''),
  fuel_efficiency: Joi.string().optional().allow(''),
  traction_control: Joi.boolean().optional(),
  launch_control: Joi.boolean().optional(),
});

const chargingValidation = Joi.object({
  ac: Joi.string().optional().allow(''),
  dc: Joi.string().optional().allow(''),
  time_10to80: Joi.string().optional().allow(''),
  time_0to100: Joi.string().optional().allow(''),
  connector_type: Joi.string().optional().allow(''),
  port_location: Joi.string().optional().allow(''),
});

const batteryValidation = Joi.object({
  capacity: Joi.string().optional().allow(''),
  type: Joi.string().optional().allow(''),
  voltage: Joi.string().optional().allow(''),
  range: Joi.string().optional().allow(''),
  range_city: Joi.string().optional().allow(''),
  range_highway: Joi.string().optional().allow(''),
  efficiency: Joi.string().optional().allow(''),
  charging: chargingValidation.optional(),
});

const dimensionsValidation = Joi.object({
  length: Joi.string().optional().allow(''),
  width: Joi.string().optional().allow(''),
  height: Joi.string().optional().allow(''),
  wheelbase: Joi.string().optional().allow(''),
  ground_clearance: Joi.string().optional().allow(''),
  kerb_weight: Joi.string().optional().allow(''),
  gross_weight: Joi.string().optional().allow(''),
  turning_radius: Joi.string().optional().allow(''),
  boot_space: Joi.string().optional().allow(''),
  fuel_tank: Joi.string().optional().allow(''),
});

const interiorValidation = Joi.object({
  seating: Joi.number().integer().min(1).max(10).optional(),
  seating_material: Joi.string().optional().allow(''),
  upholstery: Joi.string().optional().allow(''),
  dashboard: Joi.string().optional().allow(''),
  infotainment: Joi.string().optional().allow(''),
  screen_size: Joi.string().optional().allow(''),
  instrument_cluster: Joi.string().optional().allow(''),
  headroom_front: Joi.string().optional().allow(''),
  headroom_rear: Joi.string().optional().allow(''),
  legroom_front: Joi.string().optional().allow(''),
  legroom_rear: Joi.string().optional().allow(''),
  cargo_volume: Joi.string().optional().allow(''),
  cargo_max: Joi.string().optional().allow(''),
});

const safetyValidation = Joi.object({
  ncap_rating: Joi.string().optional().allow(''),
  airbags: Joi.number().integer().min(0).optional(),
  abs: Joi.boolean().optional(),
  ebd: Joi.boolean().optional(),
  esc: Joi.boolean().optional(),
  tcs: Joi.boolean().optional(),
  blind_spot: Joi.boolean().optional(),
  lane_assist: Joi.boolean().optional(),
  adaptive_cruise: Joi.boolean().optional(),
  parking_sensors: Joi.alternatives().try(Joi.boolean(), Joi.string().optional().allow('')).optional(),
  reverse_camera: Joi.boolean().optional(),
  camera_360: Joi.boolean().optional(),
  autonomous_level: Joi.string().optional().allow(''),
});

const wheelsValidation = Joi.object({
  front: Joi.string().optional().allow(''),
  rear: Joi.string().optional().allow(''),
  wheel_type: Joi.string().optional().allow(''),
  spare: Joi.string().optional().allow(''),
  pressure_monitoring: Joi.boolean().optional(),
});

const featuresValidation = Joi.object({
  exterior: Joi.array().items(Joi.string()).optional().default([]),
  interior: Joi.array().items(Joi.string()).optional().default([]),
  comfort: Joi.array().items(Joi.string()).optional().default([]),
  entertainment: Joi.array().items(Joi.string()).optional().default([]),
  connectivity: Joi.array().items(Joi.string()).optional().default([]),
  convenience: Joi.array().items(Joi.string()).optional().default([]),
  safety_features: Joi.array().items(Joi.string()).optional().default([]),
  adas_features: Joi.array().items(Joi.string()).optional().default([]),
});

export const upsertSpecificationsValidation = Joi.object({
  sub_variant_id: Joi.string().required().messages({
    'string.empty': 'Sub-variant ID is required',
    'any.required': 'Sub-variant ID is required',
  }),
  performance: performanceValidation.optional(),
  battery: batteryValidation.optional(),
  dimensions: dimensionsValidation.optional(),
  interior: interiorValidation.optional(),
  safety: safetyValidation.optional(),
  wheels: wheelsValidation.optional(),
  features: featuresValidation.optional(),
});

export const updateSpecificationsValidation = Joi.object({
  performance: performanceValidation.optional(),
  battery: batteryValidation.optional(),
  dimensions: dimensionsValidation.optional(),
  interior: interiorValidation.optional(),
  safety: safetyValidation.optional(),
  wheels: wheelsValidation.optional(),
  features: featuresValidation.optional(),
}).min(1).messages({ 'object.min': 'At least one specification section must be provided' });

export const specsIdParamValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'Specifications ID is required',
    'any.required': 'Specifications ID is required',
  }),
});

export const subVariantIdParamValidation = Joi.object({
  subVariantId: Joi.string().required().messages({
    'string.empty': 'Sub-variant ID is required',
    'any.required': 'Sub-variant ID is required',
  }),
});
