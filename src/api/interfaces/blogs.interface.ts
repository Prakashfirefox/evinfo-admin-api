// src/api/interfaces/blog.interface.ts

export enum Categories {
  EVS = "evs",
  AUTOMOBILES = "automobiles",  // Fixed typo (was AutoMoobiles)
  TECHNOLOGY = "technology",
  LIFESTYLE = "lifestyle",
  BUSINESS = "business",
  HEALTH = "health",
  TRAVEL = "travel",
  EDUCATION = "education",
  ENTERTAINMENT = "entertainment",
  FOOD = "food",
  FASHION = "fashion",
  SPORTS = "sports",
}

export enum BlogStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export interface BlogSection {
  id: string;
  heading?: string;
  content?: string;
  images?: string[];
  order?: number;
}

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface CreateBlogPayload {
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_images?: string[] | null;

  author_id?: string | null;

  categories: Categories[];
  tags?: string[] | null;

  sections?: BlogSection[] | null;

  seo?: BlogSEO | null;

  status?: BlogStatus;
  featured?: boolean;
  view_count?: number;

  published?: boolean;
  published_at?: Date | null;
}

export interface UpdateBlogPayload {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  cover_images?: string[] | null;

  author_id?: string | null;

  categories?: Categories[];
  tags?: string[] | null;

  sections?: BlogSection[] | null;

  seo?: BlogSEO | null;

  status?: BlogStatus;
  featured?: boolean;
  view_count?: number;

  published?: boolean;
  published_at?: Date | null;
}

export interface GetAllBlogsPayload {
  offset: number;
  limit: number;
  is_deleted?: boolean;
  status?: BlogStatus;  // Changed from string to BlogStatus enum
  search?: string;
  categories?: Categories[];  // Added category filter
  tags?: string[];  // Added tag filter
  from_date?: Date;  // Added date range filters
  to_date?: Date;
  author_id?: string;  // Added author filter
  featured?: boolean;  // Added featured filter
  sort_by?: 'title' | 'created_at' | 'updated_at' | 'published_at' | 'view_count';  // Added sorting
  sort_order?: 'asc' | 'desc';
}

export interface UpdateBlogStatusPayload {  // Renamed from UpdateBlogsStatus
  status: BlogStatus;
}

export interface BulkBlogOperationPayload {
  blogIds: string[];
  operation: 'publish' | 'unpublish' | 'archive' | 'feature' | 'unfeature' | 'delete';
}

export interface BlogResponse {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_images?: string[] | null;
  author_id?: string | null;
  categories: Categories[];
  tags: string[];
  sections?: BlogSection[] | null;
  seo?: BlogSEO | null;
  status: BlogStatus;
  featured: boolean;
  view_count: number;
  published: boolean;
  published_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  created_by?: string | null;
  updated_by?: string | null;
  is_deleted: boolean;
}

export interface BlogListResponse {
  rows: BlogResponse[];
  count: number;
  totalPages: number;
  currentPage: number;
}