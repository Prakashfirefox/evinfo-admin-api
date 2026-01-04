
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
  // AUTH Success Messages
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

  //Organization Success Messages
  CREATE_BLOG_SUCCESS = "Blog created successfully",
  BLOG_UPDATED_SUCCESS = "Blog updated successfully",
  BLOG_DELETED_SUCCESS = "Blog deleted successfully",
  BLOGS_FETCHED_SUCCESS = "Blogs fetched successfully",
  BLOG_STATUS_UPDATED_SUCCESS = "Blog status updated successfully",
  BANNER_CREATED_SUCCESS = "Banner created successfully",
  BANNER_UPDATED_SUCCESS = "Banner updated successfully",
  BANNER_DELETED_SUCCESS = "Banner deleted successfully",
  BANNER_FETCHED_SUCCESS = "Banner fetched successfully",
  BANNER_LIST_FETCHED_SUCCESS = "Banners fetched successfully",
  BANNER_STATUS_UPDATED_SUCCESS = "Banner status updated successfully",
  UPLOAD_URL_CREATED= "Upload URL generated successfully",
}

export enum ERROR_MESSAGE {
  //Auth Error Messages
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

  //Organization Error Messages
  BLOG_NAME_REQUIRED = "Blogs name is required",
  BLOG_ALREADY_EXISTS = "Blogs with this name already exists",
  BLOG_NOT_FOUND = "Blogs not found",
  BLOG_ID_REQ = "Blogs ID is required",
  BLOG_TITLE_ALREADY_USED = "Blogs title already in use",
  BLOG_SLUG_ALREADY_USED = "Blogs slug already in use",
  BLOG_UPDATE_ERROR = "update Blogs error",

  //Banner Error Messages
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
}

export const SIGN_TYPE = "RSA";

export enum ROUTE {

  // Media Routes
  MEDIA_GENERATE_PRESIGNED_URL = "/media/presign",
  
  // AUTH Routes
  AUTH_CREATE_USER = "/auth/users/create-user",
  AUTH_VERIFY_OTP = "/auth/users/verify-otp",
  AUTH_UPDATE_USER = "/auth/users/:id",

  AUTH_LOGIN = "/auth/login",
  AUTH_LOGOUT = "/auth/logout",


  AUTH_GET_USER = "/auth/users/:id",
  AUTH_GET_ALL_USER = "/auth/users/get-all-users",
  AUTH_DELETE_USER = "/auth/users/:id",
  AUTH_UPDATE_USER_STATUS = "/auth/users/:id/status",
  AUTH_GET_LEAD_USER_STATUS_COUNTS = "/auth/users/status-counts",
  AUTH_INVITE_USER = "/auth/users/:id/invite",

 // Blogs Routes
  BLOG_CREATE = "/blogs/create-blog",
  BLOG_UPDATE = "/blogs/:id/update-blog",
  BLOG_GET = "/blogs/:id",
  BLOG_GET_ALL = "/blogs/get-all-blogs",
  BLOG_DELETE = "/blogs/:id",
  BLOG_UPDATE_STATUS = "/blogs/:id/status",

  //Banner Routes
  BANNER_CREATE = "/banners/create-banner",
  BANNER_UPDATE = "/banners/:id/update-banner",
  BANNER_GET = "/banners/:id",
  BANNER_GET_ALL = "/banners/get-all-banners",
  BANNER_DELETE = "/banners/:id",
  BANNER_UPDATE_STATUS = "/banners/:id/status",
}


