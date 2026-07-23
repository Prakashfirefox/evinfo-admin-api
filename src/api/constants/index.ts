export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum TRANS_TYPE {
  UNKNOWN = "unknown",
}

export enum SUCCESS_MESSAGES {
  // Auth
  ADD_USER_SUCCESS = "User added successfully.",
  USER_SUCCESS = "User created successfully",
  LOGININ_SUCCESS = "Login successful",
  LOGOUT_SUCCESS = "Logged out successfully",
  GET_USER_SUCCESS = "User fetched successfully",
  USER_UPDATED_SEUCCESS = "User updated successfully",
  USER_DELETED_SUCCESS = "User deleted successfully",
  USERS_FETCHED_SUCCESS = "Users fetched successfully",
  USER_STATUS_FETCHED_SUCCESS = "User status counts fetched successfully",
  USER_STATUS_UPDATED_SUCCESS = "User status updated successfully",
  FORGOT_PASSWORD_EMAIL_SENT = "If that email exists, a password reset link has been sent",
  PASSWORD_RESET_SUCCESS = "Password has been reset successfully",

  // Blog
  CREATE_BLOG_SUCCESS = "Blog created successfully",
  BLOG_UPDATED_SUCCESS = "Blog updated successfully",
  BLOG_DELETED_SUCCESS = "Blog deleted successfully",
  BLOGS_FETCHED_SUCCESS = "Blogs fetched successfully",
  BLOG_STATUS_UPDATED_SUCCESS = "Blog status updated successfully",

  // Banner
  BANNER_CREATED_SUCCESS = "Banner created successfully",
  BANNER_UPDATED_SUCCESS = "Banner updated successfully",
  BANNER_DELETED_SUCCESS = "Banner deleted successfully",
  BANNER_FETCHED_SUCCESS = "Banner fetched successfully",
  BANNER_LIST_FETCHED_SUCCESS = "Banners fetched successfully",
  BANNER_STATUS_UPDATED_SUCCESS = "Banner status updated successfully",
  BANNER_PRIORITY_UPDATED_SUCCESS = "Banner priority updated successfully",
  BANNER_BULK_STATUS_UPDATED_SUCCESS = "Banner statuses updated successfully",
  UPLOAD_URL_CREATED = "Upload URL generated successfully",

  // Brand
  BRAND_CREATED_SUCCESS = "Brand created successfully",
  BRAND_FETCHED_SUCCESS = "Brand fetched successfully",
  BRAND_UPDATED_SUCCESS = "Brand updated successfully",
  BRAND_DELETED_SUCCESS = "Brand deleted successfully",
  BRAND_STATUS_UPDATED_SUCCESS = "Brand status updated successfully",
  BRAND_VEHICLES_FETCHED_SUCCESS = "Brand vehicles fetched successfully",

  // Vehicle Model
  VEHICLE_MODEL_CREATED_SUCCESS = "Vehicle model created successfully",
  VEHICLE_MODEL_FETCHED_SUCCESS = "Vehicle model fetched successfully",
  VEHICLE_MODEL_UPDATED_SUCCESS = "Vehicle model updated successfully",
  VEHICLE_MODEL_DELETED_SUCCESS = "Vehicle model deleted successfully",
  VEHICLE_MODEL_STATUS_UPDATED_SUCCESS = "Vehicle model status updated successfully",

  // Variant
  VARIANT_CREATED_SUCCESS = "Variant created successfully",
  VARIANT_FETCHED_SUCCESS = "Variant fetched successfully",
  VARIANT_UPDATED_SUCCESS = "Variant updated successfully",
  VARIANT_DELETED_SUCCESS = "Variant deleted successfully",
  VARIANT_STATUS_UPDATED_SUCCESS = "Variant status updated successfully",

  // SubVariant
  CONTACT_MESSAGE_SENT_SUCCESS = "Message sent successfully — we will get back to you soon",
  CONTACT_MESSAGES_FETCHED_SUCCESS = "Contact messages fetched successfully",
  CONTACT_MESSAGE_UPDATED_SUCCESS = "Contact message updated successfully",
  CONTACT_MESSAGE_DELETED_SUCCESS = "Contact message deleted successfully",
  SUB_VARIANT_CREATED_SUCCESS = "Sub-variant created successfully",
  SUB_VARIANT_FETCHED_SUCCESS = "Sub-variant fetched successfully",
  SUB_VARIANT_UPDATED_SUCCESS = "Sub-variant updated successfully",
  SUB_VARIANT_DELETED_SUCCESS = "Sub-variant deleted successfully",
  SUB_VARIANT_STATUS_UPDATED_SUCCESS = "Sub-variant status updated successfully",
  SUB_VARIANT_BULK_STATUS_UPDATED_SUCCESS = "Sub-variant statuses updated successfully",
  SUB_VARIANT_COMPARISON_SUCCESS = "Sub-variants compared successfully",

  // Pricing
  PRICING_CREATED_SUCCESS = "Pricing created successfully",
  PRICING_FETCHED_SUCCESS = "Pricing fetched successfully",
  PRICING_UPDATED_SUCCESS = "Pricing updated successfully",
  PRICING_DELETED_SUCCESS = "Pricing deleted successfully",

  // Specifications
  SPECIFICATIONS_UPSERTED_SUCCESS = "Specifications saved successfully",
  SPECIFICATIONS_FETCHED_SUCCESS = "Specifications fetched successfully",
  SPECIFICATIONS_UPDATED_SUCCESS = "Specifications updated successfully",
  SPECIFICATIONS_DELETED_SUCCESS = "Specifications deleted successfully",

  // Review
  REVIEW_CREATED_SUCCESS = "Review created successfully",
  REVIEW_FETCHED_SUCCESS = "Review fetched successfully",
  REVIEW_UPDATED_SUCCESS = "Review updated successfully",
  REVIEW_DELETED_SUCCESS = "Review deleted successfully",
  REVIEW_STATUS_UPDATED_SUCCESS = "Review status updated successfully",
  REVIEW_HELPFUL_UPDATED_SUCCESS = "Review helpful count updated successfully",

  // Dealer
  DEALER_CREATED_SUCCESS = "Dealer created successfully",
  DEALER_FETCHED_SUCCESS = "Dealer fetched successfully",
  DEALER_UPDATED_SUCCESS = "Dealer updated successfully",
  DEALER_DELETED_SUCCESS = "Dealer deleted successfully",
  DEALER_STATUS_UPDATED_SUCCESS = "Dealer status updated successfully",
  DEALER_RATING_UPDATED_SUCCESS = "Dealer rating updated successfully",
  DEALER_SERVICES_FETCHED_SUCCESS = "Dealer services fetched successfully",
  DEALER_SERVICES_UPDATED_SUCCESS = "Dealer services updated successfully",
  DEALER_STATS_FETCHED_SUCCESS = "Dealer statistics fetched successfully",

  // Stats
  STATS_OVERVIEW_FETCHED_SUCCESS = "Overview statistics fetched successfully",
  STATS_BRANDS_FETCHED_SUCCESS = "Brand statistics fetched successfully",
  STATS_POPULAR_VEHICLES_FETCHED_SUCCESS = "Popular vehicles fetched successfully",
  STATS_VEHICLE_FETCHED_SUCCESS = "Vehicle statistics fetched successfully",
  STATS_BRAND_DETAIL_FETCHED_SUCCESS = "Brand detail statistics fetched successfully",
  STATS_MODEL_DETAIL_FETCHED_SUCCESS = "Model detail statistics fetched successfully",
  STATS_REVIEWS_FETCHED_SUCCESS = "Review statistics fetched successfully",
  STATS_DEALERS_FETCHED_SUCCESS = "Dealer statistics fetched successfully",
  STATS_USERS_FETCHED_SUCCESS = "User statistics fetched successfully",
  STATS_DASHBOARD_FETCHED_SUCCESS = "Dashboard statistics fetched successfully",

  // Search
  SEARCH_COMPLETED_SUCCESS = "Search completed successfully",
  FILTERS_FETCHED_SUCCESS = "Filters fetched successfully",
  COMPARISON_COMPLETED_SUCCESS = "Comparison completed successfully",
  AUTO_COMPLETE_SUCCESS = "Autocomplete suggestions fetched successfully",
  TRENDING_VEHICLES_FETCHED_SUCCESS = "Trending vehicles fetched successfully",
}

export enum ERROR_MESSAGE {
  // Auth
  EMAIL_PASSWORD_REQUIRED = "Email and password are required",
  LOGIN_SUCCESS = "Login successful",
  FORBIDDEN = "APP is not accessible",
  GENERAL_ERROR = "Error",
  USER_NOT_FOUND = "User not found",
  INVALID_CREDENTIALS = "Invalid credentials",
  ACCESS_RESTRICTED = "Access restricted to super admins",
  EMAIL_ALREADY_USED = "Email already in use",
  USERNAME_ALREADY_USED = "Username already used",
  UNAME_EMAIL_PASS_REQUIRED = "Username, email, password is required",
  INVALID_USER_DETAILS = "Invalid user token",
  USER_ID_REQ = "User ID is required",
  NO_VALID_FIELDS = "No valid fields provided for update",
  USER_UPDATE_ERROR = "update user error",
  INVITE_EMAIL_ALREADY_USED = "Invite Email already in use",
  PASSWORD_RESET_TOKEN_INVALID = "Invalid or expired password reset link",
  PASSWORD_RESET_TOKEN_EXPIRED = "Password reset link has expired",

  // Blog
  BLOG_NAME_REQUIRED = "Blogs name is required",
  BLOG_ALREADY_EXISTS = "Blogs with this name already exists",
  BLOG_NOT_FOUND = "Blogs not found",
  CONTACT_MESSAGE_NOT_FOUND = "Contact message not found",
  BLOG_ID_REQ = "Blogs ID is required",
  BLOG_TITLE_ALREADY_USED = "Blogs title already in use",
  BLOG_SLUG_ALREADY_USED = "Blogs slug already in use",
  BLOG_UPDATE_ERROR = "update Blogs error",

  // Banner
  BANNER_ID_REQ = "Banner ID is required",
  INVALID_BANNER_ID = "Invalid banner ID",
  BANNER_NOT_FOUND = "Banner not found",
  BANNER_SLUG_ALREADY_USED = "Banner slug already in use",
  BANNER_TITLE_ALREADY_USED = "Banner title already in use",
  BANNER_ALREADY_EXISTS = "Banner with same title or slug already exists",
  INVALID_BANNER_STATUS = "Invalid banner status",
  INVALID_BANNER_DATE_RANGE = "End date must be greater than start date",
  BANNER_IMAGE_REQUIRED = "Banner image is required",
  INVALID_BANNER_IMAGE_URL = "Invalid banner image URL",
  BANNER_PERMISSION_DENIED = "You do not have permission to manage banners",
  BANNER_CREATE_FAILED = "Failed to create banner",
  BANNER_UPDATE_FAILED = "Failed to update banner",
  BANNER_DELETE_FAILED = "Failed to delete banner",
  BANNER_FETCH_FAILED = "Failed to fetch banner data",
  FILE_NAME_REQUIRED = "File name is required",
  BANNER_PRIORITY_REQ = "Banner priority is required",
  BANNER_IDS_REQ = "Banner IDs are required",
  BANNER_POSITION_REQ = "Banner position is required",
  BANNER_SLUG_REQ = "Banner slug is required",
  BANNER_STATUS_REQ = "Banner status is required",

  // Brand
  BRAND_ID_REQ = "Brand ID is required",
  BRAND_NOT_FOUND = "Brand not found",
  BRAND_STATUS_REQ = "Brand status is required",
  BRAND_SLUG_ALREADY_USED = "Brand slug already used",
  BRAND_NAME_ALREADY_USED = "Brand name already used",
  BRAND_ALREADY_EXISTS = "Brand already exists",
  BRAND_HAS_ASSOCIATIONS = "Brand has associated models and cannot be deleted",
  BRAND_SLUG_REQ = "Brand slug is required",

  // Vehicle Model
  VEHICLE_MODEL_ID_REQ = "Vehicle model ID is required",
  VEHICLE_MODEL_NOT_FOUND = "Vehicle model not found",
  VEHICLE_MODEL_STATUS_REQ = "Vehicle model status is required",
  VEHICLE_MODEL_SLUG_ALREADY_USED = "Vehicle model slug already used",
  VEHICLE_MODEL_NAME_ALREADY_USED_IN_BRAND = "Vehicle model name already used in this brand",
  VEHICLE_MODEL_ALREADY_EXISTS = "Vehicle model already exists",
  VEHICLE_MODEL_HAS_ASSOCIATIONS = "Vehicle model has associated variants and cannot be deleted",

  // Variant
  VARIANT_ID_REQ = "Variant ID is required",
  VARIANT_NOT_FOUND = "Variant not found",
  VARIANT_STATUS_REQ = "Variant status is required",
  VARIANT_SLUG_ALREADY_USED = "Variant slug already used",
  VARIANT_NAME_ALREADY_USED_IN_MODEL = "Variant name already used in this model",
  VARIANT_ALREADY_EXISTS = "Variant already exists",
  VARIANT_HAS_ASSOCIATIONS = "Variant has associated sub-variants and cannot be deleted",

  // SubVariant
  SUB_VARIANT_ID_REQ = "Sub-variant ID is required",
  SUB_VARIANT_NOT_FOUND = "Sub-variant not found",
  SUB_VARIANT_STATUS_REQ = "Sub-variant status is required",
  SUB_VARIANT_SLUG_ALREADY_USED = "Sub-variant slug already in use",
  SUB_VARIANT_ALREADY_EXISTS = "A sub-variant with this fuel type and transmission already exists for this variant",
  SUB_VARIANT_HAS_REVIEWS = "Sub-variant has associated reviews and cannot be deleted",
  SOME_SUB_VARIANTS_NOT_FOUND = "One or more sub-variants were not found",

  // Pricing
  PRICING_NOT_FOUND = "Pricing record not found",
  PRICING_ALREADY_EXISTS = "Pricing for this city already exists for the sub-variant",

  // Specifications
  SPECIFICATIONS_NOT_FOUND = "Specifications not found",

  // Review
  REVIEW_ID_REQ = "Review ID is required",
  REVIEW_NOT_FOUND = "Review not found",
  REVIEW_STATUS_REQ = "Review status is required",
  REVIEW_ALREADY_EXISTS = "You have already reviewed this sub-variant",
  UNAUTHORIZED_REVIEW_UPDATE = "You can only update your own reviews",
  UNAUTHORIZED_REVIEW_DELETE = "You can only delete your own reviews",
  UNAUTHORIZED_ACCESS = "You do not have permission to perform this action",

  // Dealer
  DEALER_ID_REQ = "Dealer ID is required",
  DEALER_NOT_FOUND = "Dealer not found",
  DEALER_STATUS_REQ = "Dealer status is required",
  DEALER_ALREADY_EXISTS = "A dealer with this name already exists in this city",
  INVALID_BRAND_IDS = "One or more brand IDs are invalid",

  // Stats
  STATS_INVALID_PERIOD = "Invalid period specified",
  STATS_INVALID_DATE_RANGE = "Invalid date range specified",

  // Search
  INVALID_COMPARISON_FIELDS = "Invalid comparison fields specified",
  SEARCH_QUERY_REQUIRED = "Search query is required",

}

export const SIGN_TYPE = "RSA";

export enum ROUTE {
  // Media
  MEDIA_GENERATE_PRESIGNED_URL = "/media/presign",

  // Auth
  AUTH_CREATE_USER = "/auth/users/create-user",
  AUTH_VERIFY_OTP = "/auth/users/verify-otp",
  AUTH_UPDATE_USER = "/auth/users/:id",
  AUTH_LOGIN = "/auth/login",
  AUTH_LOGOUT = "/auth/logout",
  AUTH_GET_USER = "/auth/users/:id",
  AUTH_GET_ALL_USER = "/auth/users/get-all-users",
  AUTH_DELETE_USER = "/auth/users/:id",
  AUTH_UPDATE_USER_STATUS = "/auth/users/:id/status",
  AUTH_FORGOT_PASSWORD = "/auth/forgot-password",
  AUTH_RESET_PASSWORD = "/auth/reset-password",

  // Blog
  BLOG_CREATE = "/blogs/create-blog",
  BLOG_UPDATE = "/blogs/:id/update-blog",
  BLOG_GET = "/blogs/:id",
  BLOG_GET_ALL = "/blogs/get-all-blogs",
  BLOG_DELETE = "/blogs/:id",
  BLOG_UPDATE_STATUS = "/blogs/:id/status",
  BLOG_GET_BY_SLUG = "/blogs/slug/:slug",

  // Banner
  BANNER_CREATE = "/banners/create-banner",
  BANNER_UPDATE = "/banners/:id/update-banner",
  BANNER_GET = "/banners/:id",
  BANNER_GET_ALL = "/banners/get-all-banners",
  BANNER_DELETE = "/banners/:id",
  BANNER_UPDATE_STATUS = "/banners/:id/status",

  // Brand
  BRAND_CREATE = "/brands/create-brand",
  BRAND_UPDATE = "/brands/:id/update-brand",
  BRAND_GET = "/brands/:id",
  BRAND_GET_ALL = "/brands/get-all-brands",
  BRAND_DELETE = "/brands/:id",
  BRAND_UPDATE_STATUS = "/brands/:id/status",
  BRAND_GET_VARIANTS = "/brands/:id/variants",
  PUBLIC_GET_BRANDS = "/brands/get-all",
  PUBLIC_GET_BRAND_BY_SLUG = "/brands/slug/:slug",

  // Vehicle Model
  MODEL_CREATE = "/models/create-model",
  MODEL_UPDATE = "/models/:id/update-model",
  MODEL_GET = "/models/:id",
  MODEL_GET_ALL = "/models/get-all-models",
  MODEL_DELETE = "/models/:id",
  MODEL_UPDATE_STATUS = "/models/:id/status",
  MODEL_GET_BY_BRAND = "/models/brand/:brandId",
  PUBLIC_GET_MODELS = "/models/get-all",

  // Variant
  VARIANT_CREATE = "/variants/create-variant",
  VARIANT_UPDATE = "/variants/:id/update-variant",
  VARIANT_GET = "/variants/:id",
  VARIANT_GET_ALL = "/variants/get-all-variants",
  VARIANT_DELETE = "/variants/:id",
  VARIANT_UPDATE_STATUS = "/variants/:id/status",
  VARIANT_GET_BY_MODEL = "/variants/model/:modelId",
  PUBLIC_GET_VARIANTS = "/variants/get-all",
  PUBLIC_GET_VARIANT = "/variants/:id",
  PUBLIC_GET_VARIANT_BY_SLUG = "/variants/slug/:slug",

  // SubVariant
  SUB_VARIANT_CREATE = "/sub-variants/create",
  SUB_VARIANT_UPDATE = "/sub-variants/:id/update",
  SUB_VARIANT_GET = "/sub-variants/:id",
  SUB_VARIANT_GET_ALL = "/sub-variants/get-all",
  SUB_VARIANT_DELETE = "/sub-variants/:id",
  SUB_VARIANT_UPDATE_STATUS = "/sub-variants/:id/status",
  SUB_VARIANT_BULK_UPDATE_STATUS = "/sub-variants/bulk-update-status",
  SUB_VARIANT_GET_BY_VARIANT = "/sub-variants/variant/:variantId",
  PUBLIC_GET_SUB_VARIANTS = "/sub-variants/get-all",
  PUBLIC_GET_SUB_VARIANT = "/sub-variants/:id",
  PUBLIC_GET_SUB_VARIANT_BY_SLUG = "/sub-variants/slug/:slug",
  PUBLIC_SUB_VARIANT_GET_FEATURED = "/sub-variants/get-featured",
  PUBLIC_SUB_VARIANT_GET_LATEST = "/sub-variants/get-latest",
  PUBLIC_COMPARE_SUB_VARIANTS = "/compare/sub-variants",

  // Pricing
  PRICING_CREATE = "/pricing/create",
  PRICING_GET = "/pricing/:id",
  PRICING_GET_BY_SUB_VARIANT = "/pricing/sub-variant/:subVariantId",
  PRICING_GET_ALL = "/pricing/get-all",
  PRICING_UPDATE = "/pricing/:id/update",
  PRICING_DELETE = "/pricing/:id",

  // Specifications
  SPECS_UPSERT = "/specifications/upsert",
  SPECS_GET = "/specifications/:id",
  SPECS_GET_BY_SUB_VARIANT = "/specifications/sub-variant/:subVariantId",
  SPECS_UPDATE = "/specifications/:id/update",
  SPECS_DELETE = "/specifications/:id",

  // Review
  REVIEW_CREATE = "/reviews/create-review",
  REVIEW_UPDATE = "/reviews/:id/update-review",
  REVIEW_GET = "/reviews/:id",
  REVIEW_GET_ALL = "/reviews/get-all-reviews",
  REVIEW_DELETE = "/reviews/:id",
  REVIEW_UPDATE_STATUS = "/reviews/:id/status",
  REVIEW_GET_BY_SUB_VARIANT = "/reviews/sub-variant/:subVariantId",
  REVIEW_MARK_HELPFUL = "/reviews/:id/mark-helpful",

  // Dealer
  DEALER_CREATE = "/dealers/create-dealer",
  DEALER_UPDATE = "/dealers/:id/update-dealer",
  DEALER_GET = "/dealers/:id",
  DEALER_GET_ALL = "/dealers/get-all-dealers",
  DEALER_DELETE = "/dealers/:id",
  DEALER_UPDATE_STATUS = "/dealers/:id/status",
  DEALER_GET_NEARBY = "/dealers/get-nearby",
  DEALER_GET_BY_BRAND = "/dealers/brand/:brandId",

  // Stats
  STATS_GET_OVERVIEW = "/stats/get-overview",
  STATS_GET_BRANDS = "/stats/get-brands-stats",
  STATS_GET_POPULAR_VARIANTS = "/stats/get-popular-variants",
  STATS_GET_DASHBOARD = "/stats/dashboard",

  // Search
  PUBLIC_SEARCH = "/search",
  PUBLIC_GET_FILTERS = "/filters/get-all",

}
