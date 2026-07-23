// src/api/interfaces/gallery.interface.ts

export type GalleryEntityType = "variant" | "model" | "sub_variant";
export type GalleryMediaType = "image" | "video";
export type GalleryCategory =
  | "exterior" | "interior" | "top_view" | "side_view"
  | "front_view" | "rear_view" | "360" | "other"
  | "review" | "promo" | "walkaround";

export interface CreateGalleryItemPayload {
  entity_type: GalleryEntityType;
  entity_id: string;
  media_type: GalleryMediaType;
  category: GalleryCategory;
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  order?: number;
  is_primary?: boolean;
}

export interface UpdateGalleryItemPayload {
  category?: GalleryCategory;
  title?: string;
  description?: string;
  order?: number;
  is_primary?: boolean;
}

export interface GetGalleryPayload {
  entity_type: GalleryEntityType;
  entity_id: string;
  media_type?: GalleryMediaType;
  category?: GalleryCategory;
}

export interface ReorderPayload {
  items: { id: string; order: number }[];
}
