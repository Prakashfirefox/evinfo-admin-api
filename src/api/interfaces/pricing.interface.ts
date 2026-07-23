import { FinancingInfo } from "@prisma/client";

export interface CreatePricingPayload {
  sub_variant_id: string;
  city?: string;
  state?: string;
  ex_showroom_price: number;
  on_road_price?: number;
  insurance?: number;
  registration?: number;
  tcs_tax?: number;
  financing?: FinancingInfo;
  is_active?: boolean;
}

export interface UpdatePricingPayload {
  city?: string;
  state?: string;
  ex_showroom_price?: number;
  on_road_price?: number;
  insurance?: number;
  registration?: number;
  tcs_tax?: number;
  financing?: FinancingInfo;
  is_active?: boolean;
}

export interface GetPricingPayload {
  sub_variant_id?: string;
  city?: string;
  state?: string;
  is_active?: boolean;
  offset?: number;
  limit?: number;
}
