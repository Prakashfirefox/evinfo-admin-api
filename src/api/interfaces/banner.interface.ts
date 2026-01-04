export enum BannerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface CreateBannerPayload {
  title: string;
  slug: string;
  image_url: string;
  redirect_url?: string | null;
  position?: string | null; // HOME_TOP, HOME_MIDDLE etc
  priority?: number;
  start_date?: Date | null;
  end_date?: Date | null;
  status?: BannerStatus;
}

export interface UpdateBannerPayload {
  title?: string;
  slug?: string;
  image_url?: string;
  redirect_url?: string | null;
  position?: string | null;
  priority?: number;
  start_date?: Date | null;
  end_date?: Date | null;
  status?: BannerStatus;
}

export interface GetAllBannersPayload {
  search?: string;
  offset?: number;
  limit?: number;
  status?: BannerStatus;
}

export interface UpdateBannerStatusPayload {
  status: BannerStatus;
}
