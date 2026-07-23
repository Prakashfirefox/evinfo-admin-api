import { Color } from "@prisma/client";

export interface CreateVariantPayload {
  slug: string;
  name: string;
  trim?: string;
  launch_year?: number;
  production_status?: string;
  segment?: string;
  description?: string;
  cover_image?: string;
  colors?: Color[];
  competitor_ids?: string[];
  model_id: string;
  status?: string;
  featured?: boolean;
}

export interface UpdateVariantPayload {
  slug?: string;
  name?: string;
  trim?: string;
  launch_year?: number;
  production_status?: string;
  segment?: string;
  description?: string;
  cover_image?: string;
  colors?: Color[];
  competitor_ids?: string[];
  model_id?: string;
  status?: string;
  featured?: boolean;
}

export interface GetAllVariantsPayload {
  search?: string;
  offset?: number;
  limit?: number;
  status?: string;
  model_id?: string;
  segment?: string;
  launch_year?: number;
  featured?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface GetVariantsByModelPayload {
  model_id: string;
  offset?: number;
  limit?: number;
  status?: string;
  segment?: string;
}

export type VariantStatus = "active" | "discontinued" | "upcoming";
