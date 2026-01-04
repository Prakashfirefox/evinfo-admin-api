export interface CreateBlogPayload {
  title: string;
  slug: string;
  excerpt?: string;
  cover_images?: string[];

  author_id?: string;

  categories: Categories[];  // enum array
  tags?: string[];

  sections?: BlogSection[];

  seo?: BlogSEO;

  status?: BlogStatus;
  featured?: boolean;
  view_count?: number;

  published?: boolean;
  published_at?: Date;
}

export interface BlogSection {
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

export enum BlogStatus {
  draft = "draft",
  published = "published",
  archived = "archived",
}

export enum Categories {
  evs = "evs",
  AutoMoobiles = "AutoMoobiles",
  Technology = "Technology",
  Lifestyle = "Lifestyle",
  Business = "Business",
  Health = "Health",
  Travel = "Travel",
  Education = "Education",
  Entertainment = "Entertainment",
  Food = "Food",
  Fashion = "Fashion",
  Sports = "Sports",
}

export interface UpdateBlogPayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  cover_images?: string[];

  author_id?: string;

  categories?: Categories[];
  tags?: string[];

  sections?: BlogSection[];

  seo?: BlogSEO;

  status?: BlogStatus;
  featured?: boolean;
  view_count?: number;

  published?: boolean;
  published_at?: Date;
}

export interface GetAllBlogsPayload{
    offset: number,
    limit: number,
    is_deleted?:boolean,
    status?: string;
    search?: string;
}



export interface UpdateBlogsStatus{ 
  status: BlogStatus;
}
