import { Router } from "express";
import authenticateJWT from "../../../middlewares/auth";
import { validateRequest } from "../../../middlewares/validateRequest";
import { ROUTE } from "../../../constants/index";

import AuthController from "../../../controller/auth.controller";
import BlogsController from "../../../controller/blogs.controller";
import BannerController from "../../../controller/banner.controller";
import BrandController from "../../../controller/brand.controller";
import ModelController from "../../../controller/model.controller";
import VariantController from "../../../controller/variant.controller";
import SubVariantController from "../../../controller/sub-variant.controller";
import ContactController from "../../../controller/contact.controller";
import PricingController from "../../../controller/pricing.controller";
import SpecificationsController from "../../../controller/specifications.controller";
import ReviewController from "../../../controller/review.controller";
import DealerController from "../../../controller/dealer.controller";
import StatsController from "../../../controller/stats.controller";
import SearchController from "../../../controller/search.controller";
import BlogLinkController from "../../../controller/blog-link.controller";
import GalleryController from "../../../controller/gallery.controller";
import MediaController from "../../../controller/media.controller";

import * as UserValidations from '../../../middlewares/validations/user.validations';
import * as BlogValidations from '../../../middlewares/validations/blogs.validations';
import * as BannerValidations from '../../../middlewares/validations/banner.validations';
import * as BrandValidations from '../../../middlewares/validations/brand.validations';
import * as VehicleModelValidations from '../../../middlewares/validations/vehicleModel.validations';
import * as VariantValidations from '../../../middlewares/validations/variant.validations';
import * as SubVariantValidations from '../../../middlewares/validations/sub-variant.validations';
import * as ContactValidations from '../../../middlewares/validations/contact.validations';
import * as PricingValidations from '../../../middlewares/validations/pricing.validations';
import * as SpecsValidations from '../../../middlewares/validations/specifications.validations';
import * as ReviewValidations from '../../../middlewares/validations/review.validations';
import * as DealerValidations from '../../../middlewares/validations/dealer.validations';
import * as StatsValidations from '../../../middlewares/validations/stats.validations';
import * as SearchValidations from '../../../middlewares/validations/search.validations';

const router = Router();

router.use((req, _res, next) => {
  console.log("Admin route hit:", req.path);
  next();
});

// ── Media ─────────────────────────────────────────────────────────────────────
router.post(ROUTE.MEDIA_GENERATE_PRESIGNED_URL, authenticateJWT, MediaController.generatePresignedUrl);

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post(ROUTE.AUTH_CREATE_USER, validateRequest(UserValidations.userRegisterValidation), AuthController.createUser);
router.post(ROUTE.AUTH_VERIFY_OTP, validateRequest(UserValidations.verifyOtpValidation), AuthController.verifyOtp);
router.put(ROUTE.AUTH_UPDATE_USER, authenticateJWT, AuthController.updateUser);
router.delete(ROUTE.AUTH_DELETE_USER, authenticateJWT, AuthController.deleteUser);
router.post(ROUTE.AUTH_LOGIN, validateRequest(UserValidations.userLoginValidation), AuthController.login);
router.post(ROUTE.AUTH_LOGOUT, authenticateJWT, AuthController.logout);
router.get(ROUTE.AUTH_GET_USER, authenticateJWT, AuthController.getUserById);
router.post(ROUTE.AUTH_GET_ALL_USER, authenticateJWT, validateRequest(UserValidations.getAllUsersValidation), AuthController.getAllUsers);
router.patch(ROUTE.AUTH_UPDATE_USER_STATUS, authenticateJWT, validateRequest(UserValidations.updateUserStatus), AuthController.updateUserStatus);

// ── Blogs ─────────────────────────────────────────────────────────────────────
router.post(ROUTE.BLOG_CREATE, authenticateJWT, validateRequest(BlogValidations.createBlogValidation), BlogsController.createBlog);
router.get(ROUTE.BLOG_GET, authenticateJWT, BlogsController.getBlogById);
router.put(ROUTE.BLOG_UPDATE, authenticateJWT, validateRequest(BlogValidations.updateBlogValidation), BlogsController.updateBlog);
router.post(ROUTE.BLOG_GET_ALL, validateRequest(BlogValidations.getAllBlogsValidation), BlogsController.getAllBlogs);
router.delete(ROUTE.BLOG_DELETE, authenticateJWT, BlogsController.deleteBlog);
router.patch(ROUTE.BLOG_UPDATE_STATUS, authenticateJWT, validateRequest(BlogValidations.updateBlogStatusValidation), BlogsController.updateBlogStatus);
router.get(ROUTE.BLOG_GET_BY_SLUG, BlogsController.getBlogBySlug);

// ── Banners ───────────────────────────────────────────────────────────────────
router.post(ROUTE.BANNER_CREATE, authenticateJWT, validateRequest({ body: BannerValidations.createBannerValidation }), BannerController.createBanner);
router.get(ROUTE.BANNER_GET, authenticateJWT, validateRequest({ params: BannerValidations.bannerIdParamValidation }), BannerController.getBannerById);
router.put(ROUTE.BANNER_UPDATE, authenticateJWT, validateRequest({ params: BannerValidations.bannerIdParamValidation, body: BannerValidations.updateBannerValidation }), BannerController.updateBanner);
router.post(ROUTE.BANNER_GET_ALL, authenticateJWT, validateRequest({ body: BannerValidations.getAllBannersValidation }), BannerController.getAllBanners);
router.delete(ROUTE.BANNER_DELETE, authenticateJWT, validateRequest({ params: BannerValidations.bannerIdParamValidation }), BannerController.deleteBanner);
router.patch(ROUTE.BANNER_UPDATE_STATUS, authenticateJWT, validateRequest({ params: BannerValidations.bannerIdParamValidation, body: BannerValidations.updateBannerStatusValidation }), BannerController.updateBannerStatus);
router.patch("/banners/:id/priority", authenticateJWT, validateRequest({ params: BannerValidations.bannerIdParamValidation, body: BannerValidations.updateBannerPriorityValidation }), BannerController.updateBannerPriority);
router.post("/banners/bulk-status", authenticateJWT, validateRequest({ body: BannerValidations.bulkBannerStatusValidation }), BannerController.bulkUpdateBannerStatus);
router.get("/banners/position/:position", authenticateJWT, validateRequest({ params: BannerValidations.bannerPositionValidation }), BannerController.getBannersByPosition);

// ── Brands ────────────────────────────────────────────────────────────────────
router.post(ROUTE.BRAND_CREATE, authenticateJWT, validateRequest({ body: BrandValidations.createBrandValidation }), BrandController.createBrand);
router.get(ROUTE.BRAND_GET, authenticateJWT, validateRequest({ params: BrandValidations.brandIdParamValidation }), BrandController.getBrandById);
router.put(ROUTE.BRAND_UPDATE, authenticateJWT, validateRequest({ params: BrandValidations.brandIdParamValidation, body: BrandValidations.updateBrandValidation }), BrandController.updateBrand);
router.post(ROUTE.BRAND_GET_ALL, authenticateJWT, validateRequest({ body: BrandValidations.getAllBrandsValidation }), BrandController.getAllBrands);
router.delete(ROUTE.BRAND_DELETE, authenticateJWT, validateRequest({ params: BrandValidations.brandIdParamValidation }), BrandController.deleteBrand);
router.patch(ROUTE.BRAND_UPDATE_STATUS, authenticateJWT, validateRequest({ params: BrandValidations.brandIdParamValidation, body: BrandValidations.updateBrandStatusValidation }), BrandController.updateBrandStatus);
router.get(ROUTE.BRAND_GET_VARIANTS, authenticateJWT, validateRequest({ params: BrandValidations.brandIdParamValidation }), BrandController.getBrandVehicles);

// ── Vehicle Models ────────────────────────────────────────────────────────────
router.post(ROUTE.MODEL_CREATE, authenticateJWT, validateRequest({ body: VehicleModelValidations.createVehicleModelValidation }), ModelController.createModel);
router.get(ROUTE.MODEL_GET, authenticateJWT, validateRequest({ params: VehicleModelValidations.vehicleModelIdParamValidation }), ModelController.getModelById);
router.put(ROUTE.MODEL_UPDATE, authenticateJWT, validateRequest({ params: VehicleModelValidations.vehicleModelIdParamValidation, body: VehicleModelValidations.updateVehicleModelValidation }), ModelController.updateModel);
router.post(ROUTE.MODEL_GET_ALL, authenticateJWT, validateRequest({ body: VehicleModelValidations.getAllVehicleModelsValidation }), ModelController.getAllModels);
router.delete(ROUTE.MODEL_DELETE, authenticateJWT, validateRequest({ params: VehicleModelValidations.vehicleModelIdParamValidation }), ModelController.deleteModel);
router.patch(ROUTE.MODEL_UPDATE_STATUS, authenticateJWT, validateRequest({ params: VehicleModelValidations.vehicleModelIdParamValidation, body: VehicleModelValidations.updateVehicleModelStatusValidation }), ModelController.updateModelStatus);
router.get(ROUTE.MODEL_GET_BY_BRAND, authenticateJWT, validateRequest({ params: VehicleModelValidations.brandIdParamValidation }), ModelController.getModelsByBrand);

// ── Variants ──────────────────────────────────────────────────────────────────
router.post(ROUTE.VARIANT_CREATE, authenticateJWT, validateRequest({ body: VariantValidations.createVariantValidation }), VariantController.createVariant);
router.get(ROUTE.VARIANT_GET, authenticateJWT, validateRequest({ params: VariantValidations.variantIdParamValidation }), VariantController.getVariantById);
router.put(ROUTE.VARIANT_UPDATE, authenticateJWT, validateRequest({ params: VariantValidations.variantIdParamValidation, body: VariantValidations.updateVariantValidation }), VariantController.updateVariant);
router.post(ROUTE.VARIANT_GET_ALL, authenticateJWT, validateRequest({ body: VariantValidations.getAllVariantsValidation }), VariantController.getAllVariants);
router.delete(ROUTE.VARIANT_DELETE, authenticateJWT, validateRequest({ params: VariantValidations.variantIdParamValidation }), VariantController.deleteVariant);
router.patch(ROUTE.VARIANT_UPDATE_STATUS, authenticateJWT, validateRequest({ params: VariantValidations.variantIdParamValidation, body: VariantValidations.updateVariantStatusValidation }), VariantController.updateVariantStatus);
router.get(ROUTE.VARIANT_GET_BY_MODEL, authenticateJWT, validateRequest({ params: VariantValidations.modelIdParamValidation }), VariantController.getVariantsByModel);

// ── SubVariants ───────────────────────────────────────────────────────────────
router.post(ROUTE.SUB_VARIANT_CREATE, authenticateJWT, validateRequest({ body: SubVariantValidations.createSubVariantValidation }), SubVariantController.createSubVariant);
router.get(ROUTE.SUB_VARIANT_GET, authenticateJWT, validateRequest({ params: SubVariantValidations.subVariantIdParamValidation }), SubVariantController.getSubVariantById);
router.put(ROUTE.SUB_VARIANT_UPDATE, authenticateJWT, validateRequest({ params: SubVariantValidations.subVariantIdParamValidation, body: SubVariantValidations.updateSubVariantValidation }), SubVariantController.updateSubVariant);
router.post(ROUTE.SUB_VARIANT_GET_ALL, authenticateJWT, validateRequest({ body: SubVariantValidations.getAllSubVariantsValidation }), SubVariantController.getAllSubVariants);
router.delete(ROUTE.SUB_VARIANT_DELETE, authenticateJWT, validateRequest({ params: SubVariantValidations.subVariantIdParamValidation }), SubVariantController.deleteSubVariant);
router.patch(ROUTE.SUB_VARIANT_UPDATE_STATUS, authenticateJWT, validateRequest({ params: SubVariantValidations.subVariantIdParamValidation, body: SubVariantValidations.updateSubVariantStatusValidation }), SubVariantController.updateSubVariantStatus);
router.patch(ROUTE.SUB_VARIANT_BULK_UPDATE_STATUS, authenticateJWT, validateRequest({ body: SubVariantValidations.bulkUpdateSubVariantStatusValidation }), SubVariantController.bulkUpdateSubVariantStatus);
router.get(ROUTE.SUB_VARIANT_GET_BY_VARIANT, authenticateJWT, validateRequest({ params: SubVariantValidations.variantIdParamValidation, query: SubVariantValidations.getSubVariantsByVariantValidation }), SubVariantController.getSubVariantsByVariant);

// ── Pricing ───────────────────────────────────────────────────────────────────
router.post(ROUTE.PRICING_CREATE, authenticateJWT, validateRequest({ body: PricingValidations.createPricingValidation }), PricingController.createPricing);
router.get(ROUTE.PRICING_GET, authenticateJWT, validateRequest({ params: PricingValidations.pricingIdParamValidation }), PricingController.getPricingById);
router.get(ROUTE.PRICING_GET_BY_SUB_VARIANT, authenticateJWT, validateRequest({ params: PricingValidations.subVariantIdParamValidation }), PricingController.getPricingBySubVariant);
router.get(ROUTE.PRICING_GET_ALL, authenticateJWT, validateRequest({ query: PricingValidations.getPricingValidation }), PricingController.getAllPricing);
router.put(ROUTE.PRICING_UPDATE, authenticateJWT, validateRequest({ params: PricingValidations.pricingIdParamValidation, body: PricingValidations.updatePricingValidation }), PricingController.updatePricing);
router.delete(ROUTE.PRICING_DELETE, authenticateJWT, validateRequest({ params: PricingValidations.pricingIdParamValidation }), PricingController.deletePricing);

// ── Specifications ────────────────────────────────────────────────────────────
router.post(ROUTE.SPECS_UPSERT, authenticateJWT, validateRequest({ body: SpecsValidations.upsertSpecificationsValidation }), SpecificationsController.upsertSpecifications);
router.get(ROUTE.SPECS_GET, authenticateJWT, validateRequest({ params: SpecsValidations.specsIdParamValidation }), SpecificationsController.getSpecificationsById);
router.get(ROUTE.SPECS_GET_BY_SUB_VARIANT, authenticateJWT, validateRequest({ params: SpecsValidations.subVariantIdParamValidation }), SpecificationsController.getSpecificationsBySubVariant);
router.put(ROUTE.SPECS_UPDATE, authenticateJWT, validateRequest({ params: SpecsValidations.specsIdParamValidation, body: SpecsValidations.updateSpecificationsValidation }), SpecificationsController.updateSpecifications);
router.delete(ROUTE.SPECS_DELETE, authenticateJWT, validateRequest({ params: SpecsValidations.specsIdParamValidation }), SpecificationsController.deleteSpecifications);

// ── Reviews ───────────────────────────────────────────────────────────────────
router.post(ROUTE.REVIEW_CREATE, authenticateJWT, validateRequest({ body: ReviewValidations.createReviewValidation }), ReviewController.createReview);
router.get(ROUTE.REVIEW_GET, authenticateJWT, validateRequest({ params: ReviewValidations.reviewIdParamValidation }), ReviewController.getReviewById);
router.put(ROUTE.REVIEW_UPDATE, authenticateJWT, validateRequest({ params: ReviewValidations.reviewIdParamValidation, body: ReviewValidations.updateReviewValidation }), ReviewController.updateReview);
router.post(ROUTE.REVIEW_GET_ALL, authenticateJWT, validateRequest({ body: ReviewValidations.getAllReviewsValidation }), ReviewController.getAllReviews);
router.delete(ROUTE.REVIEW_DELETE, authenticateJWT, validateRequest({ params: ReviewValidations.reviewIdParamValidation }), ReviewController.deleteReview);
router.patch(ROUTE.REVIEW_UPDATE_STATUS, authenticateJWT, validateRequest({ params: ReviewValidations.reviewIdParamValidation, body: ReviewValidations.updateReviewStatusValidation }), ReviewController.updateReviewStatus);
router.get(ROUTE.REVIEW_GET_BY_SUB_VARIANT, validateRequest({ params: ReviewValidations.subVariantIdParamValidation, query: ReviewValidations.getAllReviewsValidation }), ReviewController.getReviewsByVehicle);
router.patch(ROUTE.REVIEW_MARK_HELPFUL, authenticateJWT, validateRequest({ params: ReviewValidations.reviewIdParamValidation, body: ReviewValidations.markReviewHelpfulValidation }), ReviewController.markReviewHelpful);
router.get("/reviews/pending", authenticateJWT, ReviewController.getPendingReviews);
router.get("/reviews/user/:userId", authenticateJWT, validateRequest({ params: ReviewValidations.userIdParamValidation }), ReviewController.getUserReviews);

// ── Dealers ───────────────────────────────────────────────────────────────────
router.post(ROUTE.DEALER_CREATE, authenticateJWT, validateRequest({ body: DealerValidations.createDealerValidation }), DealerController.createDealer);
router.get(ROUTE.DEALER_GET, authenticateJWT, validateRequest({ params: DealerValidations.dealerIdParamValidation }), DealerController.getDealerById);
router.put(ROUTE.DEALER_UPDATE, authenticateJWT, validateRequest({ params: DealerValidations.dealerIdParamValidation, body: DealerValidations.updateDealerValidation }), DealerController.updateDealer);
router.post(ROUTE.DEALER_GET_ALL, authenticateJWT, validateRequest({ body: DealerValidations.getAllDealersValidation }), DealerController.getAllDealers);
router.delete(ROUTE.DEALER_DELETE, authenticateJWT, validateRequest({ params: DealerValidations.dealerIdParamValidation }), DealerController.deleteDealer);
router.patch(ROUTE.DEALER_UPDATE_STATUS, authenticateJWT, validateRequest({ params: DealerValidations.dealerIdParamValidation, body: DealerValidations.updateDealerStatusValidation }), DealerController.updateDealerStatus);
router.patch("/dealers/:id/rating", authenticateJWT, validateRequest({ params: DealerValidations.dealerIdParamValidation, body: DealerValidations.updateDealerRatingValidation }), DealerController.updateDealerRating);
router.post(ROUTE.DEALER_GET_NEARBY, validateRequest({ body: DealerValidations.getNearbyDealersValidation }), DealerController.getNearbyDealers);
router.get(ROUTE.DEALER_GET_BY_BRAND, authenticateJWT, validateRequest({ params: DealerValidations.brandIdParamValidation }), DealerController.getDealersByBrand);
router.get("/dealers/:id/services", authenticateJWT, validateRequest({ params: DealerValidations.dealerIdParamValidation }), DealerController.getDealerServices);
router.post("/dealers/:id/services/add", authenticateJWT, validateRequest({ params: DealerValidations.dealerIdParamValidation, body: DealerValidations.addDealerServicesValidation }), DealerController.addDealerServices);
router.post("/dealers/:id/services/remove", authenticateJWT, validateRequest({ params: DealerValidations.dealerIdParamValidation, body: DealerValidations.removeDealerServicesValidation }), DealerController.removeDealerServices);
router.get("/dealers/stats/overview", authenticateJWT, DealerController.getDealerStats);

// ── Stats ─────────────────────────────────────────────────────────────────────
router.get(ROUTE.STATS_GET_OVERVIEW, authenticateJWT, validateRequest({ query: StatsValidations.getOverviewStatsValidation }), StatsController.getOverviewStats);
router.get(ROUTE.STATS_GET_BRANDS, authenticateJWT, validateRequest({ query: StatsValidations.getBrandsStatsValidation }), StatsController.getBrandsStats);
router.get(ROUTE.STATS_GET_POPULAR_VARIANTS, StatsController.getPopularVehicles);
router.get("/stats/brand/:brandId", authenticateJWT, validateRequest({ params: StatsValidations.brandIdParamValidation, query: StatsValidations.dateRangeValidation }), StatsController.getBrandDetailStats);
router.get("/stats/model/:modelId", authenticateJWT, validateRequest({ params: StatsValidations.modelIdParamValidation, query: StatsValidations.dateRangeValidation }), StatsController.getModelDetailStats);
router.get("/stats/reviews", authenticateJWT, validateRequest({ query: StatsValidations.dateRangeValidation }), StatsController.getReviewStats);
router.get("/stats/dealers", authenticateJWT, validateRequest({ query: StatsValidations.dateRangeValidation }), StatsController.getDealerStats);
router.get("/stats/users", authenticateJWT, validateRequest({ query: StatsValidations.dateRangeValidation }), StatsController.getUserStats);
router.get(ROUTE.STATS_GET_DASHBOARD, authenticateJWT, StatsController.getDashboardStats);

// ── Blog Links ────────────────────────────────────────────────────────────────
// ── Contact enquiries ─────────────────────────────────────────────────────────
router.get("/contact/get-all", authenticateJWT, validateRequest({ query: ContactValidations.getAllContactMessagesValidation }), ContactController.getAllMessages);
router.patch("/contact/:id/status", authenticateJWT, validateRequest({ params: ContactValidations.contactIdParamValidation, body: ContactValidations.updateContactStatusValidation }), ContactController.updateStatus);
router.delete("/contact/:id", authenticateJWT, validateRequest({ params: ContactValidations.contactIdParamValidation }), ContactController.deleteMessage);

router.post("/blog-links/add", authenticateJWT, BlogLinkController.addLink);
router.post("/blog-links/remove", authenticateJWT, BlogLinkController.removeLink);
router.get("/blog-links/blog/:blogId", authenticateJWT, BlogLinkController.getBlogLinks);
router.get("/blog-links/entity/:type/:entityId", BlogLinkController.getLinkedBlogs);

// ── Gallery ───────────────────────────────────────────────────────────────────
router.post("/gallery/add", authenticateJWT, GalleryController.addItem);
router.get("/gallery/:entityType/:entityId", authenticateJWT, GalleryController.getItems);
router.patch("/gallery/:id", authenticateJWT, GalleryController.updateItem);
router.delete("/gallery/:id", authenticateJWT, GalleryController.deleteItem);
router.post("/gallery/reorder", authenticateJWT, GalleryController.reorderItems);

export default router;
