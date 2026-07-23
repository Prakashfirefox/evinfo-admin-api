// src/api/interfaces/blog-link.interface.ts

export type BlogLinkType = "sub_variant" | "brand" | "model";

export interface AddBlogLinkPayload {
  blog_id: string;
  linked_type: BlogLinkType;
  linked_id: string;
}

export interface RemoveBlogLinkPayload {
  blog_id: string;
  linked_type: BlogLinkType;
  linked_id: string;
}

export interface GetBlogLinksPayload {
  blog_id: string;
  linked_type?: BlogLinkType;
}

export interface GetLinkedBlogsPayload {
  linked_type: BlogLinkType;
  linked_id: string;
  offset?: number;
  limit?: number;
}

export interface BlogLinkResponse {
  id: string;
  blog_id: string;
  linked_type: BlogLinkType;
  linked_id: string;
  created_at: Date;
  created_by?: string | null;
  // populated fields
  blog?: any;
  linked_entity?: any;
}
