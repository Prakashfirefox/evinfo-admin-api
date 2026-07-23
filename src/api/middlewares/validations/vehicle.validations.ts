// src/api/middlewares/validations/vehicle.validations.ts
import Joi from 'joi';

// Embedded type validations
const performanceSpecsValidation = Joi.object({
    acceleration: Joi.string().optional().allow(''),
    topSpeed: Joi.string().optional().allow(''),
    power: Joi.string().optional().allow(''),
    torque: Joi.string().optional().allow(''),
    drivetrain: Joi.string().optional().allow(''),
    transmission: Joi.string().optional().allow(''),
    tractionControl: Joi.boolean().optional(),
    launchControl: Joi.boolean().optional()
});

const chargingSpecsValidation = Joi.object({
    ac: Joi.string().optional().allow(''),
    dc: Joi.string().optional().allow(''),
    time10to80: Joi.string().optional().allow(''),
    time0to100: Joi.string().optional().allow(''),
    connector: Joi.string().optional().allow(''),
    portLocation: Joi.string().optional().allow('')
});

const batterySpecsValidation = Joi.object({
    capacity: Joi.string().optional().allow(''),
    type: Joi.string().optional().allow(''),
    voltage: Joi.string().optional().allow(''),
    range: Joi.string().optional().allow(''),
    rangeCity: Joi.string().optional().allow(''),
    rangeHighway: Joi.string().optional().allow(''),
    efficiency: Joi.string().optional().allow(''),
    charging: chargingSpecsValidation.optional()
});

const dimensionSpecsValidation = Joi.object({
    length: Joi.string().optional().allow(''),
    width: Joi.string().optional().allow(''),
    height: Joi.string().optional().allow(''),
    wheelbase: Joi.string().optional().allow(''),
    groundClearance: Joi.string().optional().allow(''),
    weight: Joi.string().optional().allow(''),
    weightDistribution: Joi.string().optional().allow(''),
    turningRadius: Joi.string().optional().allow('')
});

const interiorSpecsValidation = Joi.object({
    seating: Joi.string().optional().allow(''),
    seatingMaterial: Joi.string().optional().allow(''),
    upholstery: Joi.string().optional().allow(''),
    dashboard: Joi.string().optional().allow(''),
    infotainment: Joi.string().optional().allow(''),
    instrumentCluster: Joi.string().optional().allow(''),
    headroomFront: Joi.string().optional().allow(''),
    headroomRear: Joi.string().optional().allow(''),
    legroomFront: Joi.string().optional().allow(''),
    legroomRear: Joi.string().optional().allow(''),
    cargo: Joi.string().optional().allow(''),
    cargoMax: Joi.string().optional().allow('')
});

const safetySpecsValidation = Joi.object({
    rating: Joi.string().optional().allow(''),
    airbags: Joi.number().integer().optional(),
    abs: Joi.boolean().optional(),
    esc: Joi.boolean().optional(),
    tcs: Joi.boolean().optional(),
    blindSpot: Joi.boolean().optional(),
    laneAssist: Joi.boolean().optional(),
    adaptiveCruise: Joi.boolean().optional(),
    parkingSensors: Joi.boolean().optional(),
    camera360: Joi.boolean().optional(),
    autonomousLevel: Joi.string().optional().allow('')
});

const wheelSpecsValidation = Joi.object({
    front: Joi.string().optional().allow(''),
    rear: Joi.string().optional().allow(''),
    type: Joi.string().optional().allow(''),
    spare: Joi.string().optional().allow(''),
    pressureMonitoring: Joi.boolean().optional()
});

const featureSpecsValidation = Joi.object({
    exterior: Joi.array().items(Joi.string()).optional(),
    interior: Joi.array().items(Joi.string()).optional(),
    comfort: Joi.array().items(Joi.string()).optional(),
    entertainment: Joi.array().items(Joi.string()).optional(),
    connectivity: Joi.array().items(Joi.string()).optional(),
    convenience: Joi.array().items(Joi.string()).optional()
});

const vehicleSpecificationsValidation = Joi.object({
    performance: performanceSpecsValidation.optional(),
    battery: batterySpecsValidation.optional(),
    dimensions: dimensionSpecsValidation.optional(),
    interior: interiorSpecsValidation.optional(),
    safety: safetySpecsValidation.optional(),
    wheels: wheelSpecsValidation.optional(),
    features: featureSpecsValidation.optional()
});

const colorValidation = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    code: Joi.string().required(),
    image: Joi.string().optional().allow(''),
    price: Joi.number().optional(),
    type: Joi.string().valid('standard', 'metallic', 'pearlescent', 'multi-coat', 'solid', 'matte', 'satin').optional(),
    isAvailable: Joi.boolean().optional().default(true)
});

const financingInfoValidation = Joi.object({
    emi: Joi.string().optional().allow(''),
    downPayment: Joi.string().optional().allow(''),
    tenure: Joi.string().optional().allow(''),
    interest: Joi.number().optional()
});

const vehiclePricingValidation = Joi.object({
    basePrice: Joi.number().optional(),
    onRoadPrice: Joi.number().optional(),
    insurance: Joi.number().optional(),
    registration: Joi.number().optional(),
    tax: Joi.number().optional(),
    financing: financingInfoValidation.optional()
});

const vehicleImagesValidation = Joi.object({
    exterior: Joi.array().items(Joi.string()).optional(),
    interior: Joi.array().items(Joi.string()).optional(),
    gallery: Joi.array().items(Joi.string()).optional(),
    colors: Joi.array().items(Joi.string()).optional(),
    details: Joi.array().items(Joi.string()).optional()
});

const vehicleRatingsValidation = Joi.object({
    overall: Joi.number().min(0).max(5).optional(),
    performance: Joi.number().min(0).max(5).optional(),
    comfort: Joi.number().min(0).max(5).optional(),
    features: Joi.number().min(0).max(5).optional(),
    safety: Joi.number().min(0).max(5).optional(),
    value: Joi.number().min(0).max(5).optional(),
    userRating: Joi.number().min(0).max(5).optional(),
    expertRating: Joi.number().min(0).max(5).optional(),
    reviewCount: Joi.number().integer().optional().default(0)
});

const timelineEventValidation = Joi.object({
    year: Joi.number().integer().required(),
    event: Joi.string().required(),
    description: Joi.string().optional().allow('')
});

const ownershipInfoValidation = Joi.object({
    warranty: Joi.string().optional().allow(''),
    service: Joi.string().optional().allow(''),
    maintenance: Joi.string().optional().allow(''),
    batteryWarranty: Joi.string().optional().allow(''),
    roadside: Joi.boolean().optional(),
    serviceCenters: Joi.number().integer().optional()
});

// Create Vehicle Validation
export const createVehicleValidation = Joi.object({
    slug: Joi.string().required().messages({
        'string.empty': 'Slug is required',
        'any.required': 'Slug is required'
    }),
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required'
    }),
    brand_id: Joi.string().required().messages({
        'string.empty': 'Brand ID is required',
        'any.required': 'Brand ID is required'
    }),
    model_id: Joi.string().required().messages({
        'string.empty': 'Model ID is required',
        'any.required': 'Model ID is required'
    }),
    variant_id: Joi.string().required().messages({
        'string.empty': 'Variant ID is required',
        'any.required': 'Variant ID is required'
    }),
    competitor_ids: Joi.array().items(Joi.string()).optional(),
    specifications: vehicleSpecificationsValidation.optional(),
    colors: Joi.array().items(colorValidation).optional(),
    pricing: vehiclePricingValidation.optional(),
    images: vehicleImagesValidation.optional(),
    ratings: vehicleRatingsValidation.optional(),
    timeline: Joi.array().items(timelineEventValidation).optional(),
    ownership: ownershipInfoValidation.optional(),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional().default('active'),
    featured: Joi.boolean().optional().default(false)
});

// Update Vehicle Validation
export const updateVehicleValidation = Joi.object({
    slug: Joi.string().optional(),
    name: Joi.string().optional(),
    brand_id: Joi.string().optional(),
    model_id: Joi.string().optional(),
    variant_id: Joi.string().optional(),
    competitor_ids: Joi.array().items(Joi.string()).optional(),
    specifications: vehicleSpecificationsValidation.optional(),
    colors: Joi.array().items(colorValidation).optional(),
    pricing: vehiclePricingValidation.optional(),
    images: vehicleImagesValidation.optional(),
    ratings: vehicleRatingsValidation.optional(),
    timeline: Joi.array().items(timelineEventValidation).optional(),
    ownership: ownershipInfoValidation.optional(),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional(),
    featured: Joi.boolean().optional(),
    view_count: Joi.number().integer().optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Get All Vehicles Validation
export const getAllVehiclesValidation = Joi.object({
    search: Joi.string().optional().allow(''),
    offset: Joi.number().integer().min(0).optional().default(0),
    limit: Joi.number().integer().min(1).max(100).optional().default(10),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').optional(),
    brand_id: Joi.string().optional(),
    model_id: Joi.string().optional(),
    variant_id: Joi.string().optional(),
    featured: Joi.boolean().optional(),
    min_price: Joi.number().optional(),
    max_price: Joi.number().optional(),
    sort_by: Joi.string().valid('name', 'created_at', 'updated_at', 'status', 'view_count').optional().default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').optional().default('desc')
});

// Update Vehicle Status Validation
export const updateVehicleStatusValidation = Joi.object({
    status: Joi.string().valid('active', 'discontinued', 'upcoming').required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
        'any.only': 'Status must be one of: active, discontinued, upcoming'
    })
});

// Vehicle ID Param Validation
export const vehicleIdParamValidation = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Vehicle ID is required',
        'any.required': 'Vehicle ID is required'
    })
});

// Vehicle Slug Param Validation
export const vehicleSlugParamValidation = Joi.object({
    slug: Joi.string().required().messages({
        'string.empty': 'Vehicle slug is required',
        'any.required': 'Vehicle slug is required'
    })
});

// Compare Vehicles Validation
export const compareVehiclesValidation = Joi.object({
    vehicle_ids: Joi.array().items(Joi.string()).min(2).max(4).required().messages({
        'array.min': 'At least 2 vehicles are required for comparison',
        'array.max': 'Cannot compare more than 4 vehicles at once',
        'any.required': 'Vehicle IDs are required'
    })
});

// Bulk Create Vehicles Validation
export const bulkCreateVehiclesValidation = Joi.object({
    vehicles: Joi.array().items(createVehicleValidation).min(1).max(50).required().messages({
        'array.min': 'At least 1 vehicle is required',
        'array.max': 'Cannot create more than 50 vehicles at once'
    })
});

// Bulk Update Status Validation
export const bulkUpdateStatusValidation = Joi.object({
    vehicle_ids: Joi.array().items(Joi.string()).min(1).required().messages({
        'array.min': 'At least 1 vehicle ID is required'
    }),
    status: Joi.string().valid('active', 'discontinued', 'upcoming').required()
});