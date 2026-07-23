// src/api/interfaces/vehicleModel.interface.ts
export interface TimelineEventPayload {
  year: number;
  event: string;
  description?: string;
}
export interface CreateVehicleModelPayload {
  slug: string;
  name: string;
  generation?: string;
  body_type?: string;
  production_years?: string;
  platform?: string;
  brand_id: string;
  status?: string;
}

export interface UpdateVehicleModelPayload {
  slug?: string;
  name?: string;
  generation?: string;
  body_type?: string;
  production_years?: string;
  platform?: string;
  brand_id?: string;
  status?: string;
}

export interface GetAllVehicleModelsPayload {
  search?: string;
  offset?: number;
  limit?: number;
  status?: string;
  brand_id?: string;
  body_type?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface GetModelsByBrandPayload {
  brand_id: string;
  offset?: number;
  limit?: number;
  status?: string;
}

export type VehicleModelStatus = "active" | "discontinued" | "upcoming";