export interface CreateReviewPayload {
  sub_variant_id: string;
  rating: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
}

export interface GetAllReviewsPayload {
  search?: string;
  offset?: number;
  limit?: number;
  status?: string;
  sub_variant_id?: string;
  user_id?: string;
  min_rating?: number;
  max_rating?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface UpdateReviewStatusPayload {
  status: 'pending' | 'approved' | 'rejected';
}

export interface MarkReviewHelpfulPayload {
  action?: 'increment' | 'decrement';
}

export type ReviewStatus = "pending" | "approved" | "rejected";
