import { OwnershipInfo } from "@prisma/client";

export interface CreateSubVariantPayload {
  slug: string;
  name: string;
  variant_id: string;
  fuel_type: FuelType;
  transmission: TransmissionType;
  engine?: string;
  drivetrain?: DrivetrainType;
  ownership?: OwnershipInfo;
  status?: SubVariantStatus;
}

export interface UpdateSubVariantPayload {
  slug?: string;
  name?: string;
  variant_id?: string;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  engine?: string;
  drivetrain?: DrivetrainType;
  ownership?: OwnershipInfo;
  status?: SubVariantStatus;
}

export interface GetAllSubVariantsPayload {
  search?: string;
  offset?: number;
  limit?: number;
  status?: SubVariantStatus;
  variant_id?: string;
  model_id?: string;
  brand_id?: string;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CompareSubVariantsPayload {
  sub_variant_ids: string[];
}

export interface BulkUpdateSubVariantStatusPayload {
  sub_variant_ids: string[];
  status: SubVariantStatus;
}

export type FuelType = "Petrol" | "Diesel" | "EV" | "Hybrid" | "CNG" | "PHEV";
export type TransmissionType = "Manual" | "Automatic" | "CVT" | "AMT" | "DCT";
export type DrivetrainType = "FWD" | "RWD" | "AWD" | "4WD" | "4x4";
export type SubVariantStatus = "active" | "discontinued" | "upcoming";
