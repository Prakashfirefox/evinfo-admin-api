// src/api/routes/v1/admin/index.ts
import { Router } from "express";
import adminController from "../../controller/auth.controller";
import BlogsController from "../../controller/blogs.controller";
import BannerController from "../../controller/banner.controller";
import authenticateJWT from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import * as UserValidations from '../../middlewares/validations/user.validations';
import * as OrganizationValidations from '../../middlewares/validations/blogs.validations';
import { ROUTE } from "../../constants/index";
import MediaController from "../../controller/media.controller";

const router = Router();
router.use((req, _res, next) => {
  console.log("Admin route hit:", req.path);
  next();
});
// Media Routes
router.post(ROUTE.MEDIA_GENERATE_PRESIGNED_URL, authenticateJWT, MediaController.generatePresignedUrl);
// Authentication Routes
router.post(ROUTE.AUTH_CREATE_USER, validateRequest(UserValidations.userRegisterValidation), adminController.createUser);
router.post(ROUTE.AUTH_VERIFY_OTP, validateRequest(UserValidations.verifyOtpValidation), adminController.verifyOtp);
router.put(ROUTE.AUTH_UPDATE_USER, authenticateJWT, adminController.updateUser);
router.delete(ROUTE.AUTH_DELETE_USER, authenticateJWT, adminController.deleteUser);
router.post(ROUTE.AUTH_LOGIN, validateRequest(UserValidations.userLoginValidation), adminController.login);
router.post(ROUTE.AUTH_LOGOUT, authenticateJWT, adminController.logout);

router.get(ROUTE.AUTH_GET_USER, authenticateJWT, adminController.getUserById)
router.post(ROUTE.AUTH_GET_ALL_USER, authenticateJWT, validateRequest(UserValidations.getAllUsersValidation), adminController.getAllUsers);
router.patch(ROUTE.AUTH_UPDATE_USER_STATUS, authenticateJWT, validateRequest(UserValidations.updateUserStatus), adminController.updateUserStatus);

//Blogs Routes
router.post(ROUTE.BLOG_CREATE, authenticateJWT, validateRequest(OrganizationValidations.createOrganizationValidation), BlogsController.createBlog);
router.get(ROUTE.BLOG_GET, authenticateJWT,  BlogsController.getBlogById);
router.put(ROUTE.BLOG_UPDATE, authenticateJWT,  BlogsController.updateBlog);
router.post(ROUTE.BLOG_GET_ALL,  BlogsController.getAllBlogs);
router.delete(ROUTE.BLOG_DELETE, authenticateJWT, BlogsController.deleteBlog);
router.patch(ROUTE.BLOG_UPDATE_STATUS, authenticateJWT,  BlogsController.updateBlogStatus);
router.get(ROUTE.BLOG_GET_BY_SLUG,  BlogsController.getBlogBySlug);

//Banner Routes
router.post(ROUTE.BANNER_CREATE, authenticateJWT,  BannerController.createBanner);
router.get(ROUTE.BANNER_GET, authenticateJWT,  BannerController.getBannerById);
router.put(ROUTE.BANNER_UPDATE, authenticateJWT,  BannerController.updateBanner);
router.post(ROUTE.BANNER_GET_ALL,  BannerController.getAllBanners);
router.delete(ROUTE.BANNER_DELETE, authenticateJWT, BannerController.deleteBanner);
router.patch(ROUTE.BANNER_UPDATE_STATUS, authenticateJWT,  BannerController.updateBannerStatus);
export default router;

