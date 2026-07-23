// src/api/middlewares/validations/blog.validations.ts
import Joi from 'joi';
import { BlogStatus, Categories } from '../../interfaces/blogs.interface';

// Blog Section Validation
const blogSectionValidation = Joi.object({
    heading: Joi.string().optional().allow('').max(500).messages({
        'string.max': 'Section heading cannot exceed 500 characters'
    }),
    content: Joi.string().optional().allow('').max(10000).messages({
        'string.max': 'Section content cannot exceed 10000 characters'
    }),
    images: Joi.array().items(Joi.string().uri()).optional().messages({
        'string.uri': 'Each image must be a valid URL'
    }),
    order: Joi.number().integer().min(0).optional().messages({
        'number.base': 'Order must be a number',
        'number.integer': 'Order must be an integer',
        'number.min': 'Order cannot be negative'
    })
});

// Blog SEO Validation
const blogSEOValidation = Joi.object({
    metaTitle: Joi.string().optional().allow('').max(200).messages({
        'string.max': 'Meta title cannot exceed 200 characters'
    }),
    metaDescription: Joi.string().optional().allow('').max(500).messages({
        'string.max': 'Meta description cannot exceed 500 characters'
    }),
    keywords: Joi.array().items(Joi.string().max(50)).max(20).optional().messages({
        'array.max': 'Cannot have more than 20 keywords',
        'string.max': 'Each keyword cannot exceed 50 characters'
    })
});

// Create Blog Validation
export const createBlogValidation = Joi.object({
    title: Joi.string().required().max(500).messages({
        'string.empty': 'Blog title is required',
        'any.required': 'Blog title is required',
        'string.max': 'Blog title cannot exceed 500 characters'
    }),

    slug: Joi.string().required().pattern(/^[a-z0-9-]+$/).max(500).messages({
        'string.empty': 'Blog slug is required',
        'any.required': 'Blog slug is required',
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
        'string.max': 'Slug cannot exceed 500 characters'
    }),

    excerpt: Joi.string().optional().allow('').max(1000).messages({
        'string.max': 'Excerpt cannot exceed 1000 characters'
    }),

    cover_images: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
        'array.max': 'Cannot have more than 10 cover images',
        'string.uri': 'Each cover image must be a valid URL'
    }),

    author_id: Joi.string().optional().messages({
        'string.base': 'Author ID must be a string'
    }),

    categories: Joi.array().items(
        Joi.string().valid(...Object.values(Categories))
    ).min(1).required().messages({
        'array.min': 'At least one category is required',
        'any.required': 'Categories are required',
        'any.only': `Category must be one of: ${Object.values(Categories).join(', ')}`
    }),

    tags: Joi.array().items(
        Joi.string().max(50).pattern(/^[a-zA-Z0-9-]+$/)
    ).max(30).optional().messages({
        'array.max': 'Cannot have more than 30 tags',
        'string.max': 'Each tag cannot exceed 50 characters',
        'string.pattern.base': 'Tags can only contain letters, numbers, and hyphens'
    }),

    sections: Joi.array().items(blogSectionValidation).max(50).optional().messages({
        'array.max': 'Cannot have more than 50 sections'
    }),

    seo: blogSEOValidation.optional(),

    status: Joi.string().valid(...Object.values(BlogStatus)).optional().default(BlogStatus.DRAFT).messages({
        'any.only': `Status must be one of: ${Object.values(BlogStatus).join(', ')}`
    }),

    featured: Joi.boolean().optional().default(false),

    view_count: Joi.number().integer().min(0).optional().default(0).messages({
        'number.base': 'View count must be a number',
        'number.integer': 'View count must be an integer',
        'number.min': 'View count cannot be negative'
    }),

    published: Joi.boolean().optional().default(false),

    published_at: Joi.date().iso().optional().allow(null).messages({
        'date.base': 'Published date must be a valid date',
        'date.iso': 'Published date must be in ISO format'
    }).when('published', {
        is: true,
        then: Joi.date().iso().required().messages({
            'any.required': 'Published date is required when published is true'
        })
    })
});

// Update Blog Validation
export const updateBlogValidation = Joi.object({
    title: Joi.string().max(500).optional().messages({
        'string.max': 'Blog title cannot exceed 500 characters'
    }),

    slug: Joi.string().pattern(/^[a-z0-9-]+$/).max(500).optional().messages({
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
        'string.max': 'Slug cannot exceed 500 characters'
    }),

    excerpt: Joi.string().allow('').max(1000).optional().messages({
        'string.max': 'Excerpt cannot exceed 1000 characters'
    }),

    cover_images: Joi.array().items(Joi.string().uri()).max(10).optional().messages({
        'array.max': 'Cannot have more than 10 cover images',
        'string.uri': 'Each cover image must be a valid URL'
    }),

    author_id: Joi.string().optional(),

    categories: Joi.array().items(
        Joi.string().valid(...Object.values(Categories))
    ).min(1).optional().messages({
        'array.min': 'At least one category is required',
        'any.only': `Category must be one of: ${Object.values(Categories).join(', ')}`
    }),

    tags: Joi.array().items(
        Joi.string().max(50).pattern(/^[a-zA-Z0-9-]+$/)
    ).max(30).optional().messages({
        'array.max': 'Cannot have more than 30 tags',
        'string.max': 'Each tag cannot exceed 50 characters',
        'string.pattern.base': 'Tags can only contain letters, numbers, and hyphens'
    }),

    sections: Joi.array().items(blogSectionValidation).max(50).optional().messages({
        'array.max': 'Cannot have more than 50 sections'
    }),

    seo: blogSEOValidation.optional(),

    status: Joi.string().valid(...Object.values(BlogStatus)).optional().messages({
        'any.only': `Status must be one of: ${Object.values(BlogStatus).join(', ')}`
    }),

    featured: Joi.boolean().optional(),

    view_count: Joi.number().integer().min(0).optional().messages({
        'number.base': 'View count must be a number',
        'number.integer': 'View count must be an integer',
        'number.min': 'View count cannot be negative'
    }),

    published: Joi.boolean().optional(),

    published_at: Joi.date().iso().optional().allow(null).messages({
        'date.base': 'Published date must be a valid date',
        'date.iso': 'Published date must be in ISO format'
    }).when('published', {
        is: true,
        then: Joi.date().iso().required().messages({
            'any.required': 'Published date is required when published is true'
        })
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Get All Blogs Validation
export const getAllBlogsValidation = Joi.object({
    search: Joi.string().optional().allow('').max(100).messages({
        'string.max': 'Search term cannot exceed 100 characters'
    }),

    offset: Joi.number().integer().min(0).optional().default(0).messages({
        'number.base': 'Offset must be a number',
        'number.integer': 'Offset must be an integer',
        'number.min': 'Offset cannot be negative'
    }),

    limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit cannot exceed 100'
    }),

    categories: Joi.array().items(
        Joi.string().valid(...Object.values(Categories))
    ).optional().messages({
        'any.only': `Category must be one of: ${Object.values(Categories).join(', ')}`
    }),

    tags: Joi.array().items(Joi.string()).optional(),

    status: Joi.string().valid(...Object.values(BlogStatus)).optional().messages({
        'any.only': `Status must be one of: ${Object.values(BlogStatus).join(', ')}`
    }),

    featured: Joi.boolean().optional(),

    published: Joi.boolean().optional(),

    author_id: Joi.string().optional(),

    from_date: Joi.date().iso().optional().messages({
        'date.base': 'From date must be a valid date',
        'date.iso': 'From date must be in ISO format'
    }),

    to_date: Joi.date().iso().min(Joi.ref('from_date')).optional().messages({
        'date.base': 'To date must be a valid date',
        'date.iso': 'To date must be in ISO format',
        'date.min': 'To date must be after from date'
    }),

    sort_by: Joi.string().valid(
        'title', 'created_at', 'updated_at', 'status',
        'view_count', 'published_at', 'featured'
    ).optional().default('created_at').messages({
        'any.only': 'Sort by must be one of: title, created_at, updated_at, status, view_count, published_at, featured'
    }),

    sort_order: Joi.string().valid('asc', 'desc').optional().default('desc').messages({
        'any.only': 'Sort order must be either asc or desc'
    })
});

// Update Blog Status Validation
export const updateBlogStatusValidation = Joi.object({
    status: Joi.string().valid(...Object.values(BlogStatus)).required().messages({
        'string.empty': 'Status is required',
        'any.required': 'Status is required',
        'any.only': `Status must be one of: ${Object.values(BlogStatus).join(', ')}`
    })
});

// Blog ID Param Validation
export const blogIdParamValidation = Joi.object({
    id: Joi.string().required().messages({
        'string.empty': 'Blog ID is required',
        'any.required': 'Blog ID is required'
    })
});

// Blog Slug Param Validation
export const blogSlugParamValidation = Joi.object({
    slug: Joi.string().required().pattern(/^[a-z0-9-]+$/).messages({
        'string.empty': 'Blog slug is required',
        'any.required': 'Blog slug is required',
        'string.pattern.base': 'Invalid blog slug format'
    })
});

// Bulk Blog Operations Validation
export const bulkBlogOperationValidation = Joi.object({
    blogIds: Joi.array().items(Joi.string()).min(1).max(50).required().messages({
        'array.min': 'At least one blog ID is required',
        'array.max': 'Cannot process more than 50 blogs at once',
        'any.required': 'Blog IDs are required'
    }),

    operation: Joi.string().valid('publish', 'unpublish', 'archive', 'feature', 'unfeature').required().messages({
        'string.empty': 'Operation is required',
        'any.required': 'Operation is required',
        'any.only': 'Operation must be one of: publish, unpublish, archive, feature, unfeature'
    })
});

// Blog Categories Validation
export const blogCategoriesValidation = Joi.object({
    categories: Joi.array().items(
        Joi.string().valid(...Object.values(Categories))
    ).min(1).required().messages({
        'array.min': 'At least one category is required',
        'any.required': 'Categories are required',
        'any.only': `Category must be one of: ${Object.values(Categories).join(', ')}`
    })
});

// Blog Tags Validation
export const blogTagsValidation = Joi.object({
    tags: Joi.array().items(
        Joi.string().max(50).pattern(/^[a-zA-Z0-9-]+$/)
    ).max(30).required().messages({
        'array.max': 'Cannot have more than 30 tags',
        'any.required': 'Tags are required',
        'string.max': 'Each tag cannot exceed 50 characters',
        'string.pattern.base': 'Tags can only contain letters, numbers, and hyphens'
    })
});

// Blog SEO Update Validation
export const updateBlogSEOValidation = Joi.object({
    seo: blogSEOValidation.required().messages({
        'any.required': 'SEO data is required'
    })
});