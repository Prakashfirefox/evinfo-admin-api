// src/api/interfaces/brand.interface.ts
export interface CreateBrandPayload {
  slug: string;
  name: string;
  logo: string;
  country?: string;
  founded?: number;
  description?: string;
  website?: string;
  status?: string;
}

export interface UpdateBrandPayload {
  slug?: string;
  name?: string;
  logo?: string;
  country?: string;
  founded?: number;
  description?: string;
  website?: string;
  status?: string;
}

export interface GetAllBrandsPayload {
  search?: string;
  offset?: number;
  limit?: number;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface GetBrandVehiclesPayload {
  brand_id: string;
  offset?: number;
  limit?: number;
  status?: string;
}

export type BrandStatus = "active" | "inactive" | "archived";