import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { ROUTE } from "../../../constants/index";

import AuthController from "../../../controller/auth.controller";
import BrandController from "../../../controller/brand.controller";
import ModelController from "../../../controller/model.controller";
import VariantController from "../../../controller/variant.controller";
import SubVariantController from "../../../controller/sub-variant.controller";
import ReviewController from "../../../controller/review.controller";
import DealerController from "../../../controller/dealer.controller";
import BannerController from "../../../controller/banner.controller";
import SearchController from "../../../controller/search.controller";
import BlogLinkController from "../../../controller/blog-link.controller";
import ContactController from "../../../controller/contact.controller";
import PublicAuthController from "../../../controller/public-auth.controller";
import ReviewController2 from "../../../controller/review.controller";
import authenticateJWT from "../../../middlewares/auth";

import * as UserValidations from '../../../middlewares/validations/user.validations';
import * as BrandValidations from '../../../middlewares/validations/brand.validations';
import * as VehicleModelValidations from '../../../middlewares/validations/vehicleModel.validations';
import * as VariantValidations from '../../../middlewares/validations/variant.validations';
import * as SubVariantValidations from '../../../middlewares/validations/sub-variant.validations';
import * as ReviewValidations from '../../../middlewares/validations/review.validations';
import * as DealerValidations from '../../../middlewares/validations/dealer.validations';
import * as BannerValidations from '../../../middlewares/validations/banner.validations';
import * as SearchValidations from '../../../middlewares/validations/search.validations';
import * as ContactValidations from '../../../middlewares/validations/contact.validations';
import * as PublicAuthValidations from '../../../middlewares/validations/public-auth.validations';

const router = Router();

router.use((req, _res, next) => {
  console.log("Public route hit:", req.path);
  next();
});

// ── Auth (Public) ─────────────────────────────────────────────────────────────
router.post(ROUTE.AUTH_FORGOT_PASSWORD, validateRequest({ body: UserValidations.forgotPasswordValidation }), AuthController.forgotPassword);
router.post(ROUTE.AUTH_RESET_PASSWORD, validateRequest({ body: UserValidations.resetPasswordValidation }), AuthController.resetPassword);

// ── Banners ───────────────────────────────────────────────────────────────────
router.get("/banners/active", validateRequest({ query: BannerValidations.getAllBannersValidation }), BannerController.getActiveBanners);
router.get("/banners/position/:position", validateRequest({ params: BannerValidations.bannerPositionValidation }), BannerController.getBannersByPosition);
router.get("/banners/slug/:slug", validateRequest({ params: BannerValidations.bannerSlugParamValidation }), BannerController.getBannerBySlug);

// ── Brands ────────────────────────────────────────────────────────────────────
router.get(ROUTE.PUBLIC_GET_BRANDS, validateRequest({ query: BrandValidations.getAllBrandsValidation }), BrandController.getPublicBrands);
router.get(ROUTE.BRAND_GET, validateRequest({ params: BrandValidations.brandIdParamValidation }), BrandController.getBrandById);
router.get(ROUTE.PUBLIC_GET_BRAND_BY_SLUG, validateRequest({ params: BrandValidations.brandSlugParamValidation }), BrandController.getBrandBySlug);
router.get(ROUTE.BRAND_GET_VARIANTS, validateRequest({ params: BrandValidations.brandIdParamValidation, query: BrandValidations.getBrandVehiclesValidation }), BrandController.getBrandVehicles);

// ── Models ────────────────────────────────────────────────────────────────────
router.get(ROUTE.PUBLIC_GET_MODELS, validateRequest({ query: VehicleModelValidations.getAllVehicleModelsValidation }), ModelController.getPublicModels);

// ── Variants ──────────────────────────────────────────────────────────────────
router.get(ROUTE.PUBLIC_GET_VARIANTS, validateRequest({ query: VariantValidations.getAllVariantsValidation }), VariantController.getPublicVariants);
router.get("/variants/by-ids", validateRequest({ query: VariantValidations.getVariantsByIdsValidation }), VariantController.getPublicVariantsByIds);
router.get(ROUTE.PUBLIC_GET_VARIANT, validateRequest({ params: VariantValidations.variantIdParamValidation }), VariantController.getPublicVariantById);
router.get(ROUTE.PUBLIC_GET_VARIANT_BY_SLUG, validateRequest({ params: VariantValidations.variantSlugParamValidation }), VariantController.getVariantBySlug);

// ── SubVariants ───────────────────────────────────────────────────────────────
router.get(ROUTE.PUBLIC_GET_SUB_VARIANTS, validateRequest({ query: SubVariantValidations.getAllSubVariantsValidation }), SubVariantController.getPublicSubVariants);
router.get(ROUTE.PUBLIC_SUB_VARIANT_GET_FEATURED, SubVariantController.getFeaturedSubVariants);
router.get(ROUTE.PUBLIC_SUB_VARIANT_GET_LATEST, SubVariantController.getLatestSubVariants);
router.get(ROUTE.PUBLIC_GET_SUB_VARIANT_BY_SLUG, validateRequest({ params: SubVariantValidations.subVariantSlugParamValidation }), SubVariantController.getSubVariantBySlug);
router.get(ROUTE.PUBLIC_GET_SUB_VARIANT, validateRequest({ params: SubVariantValidations.subVariantIdParamValidation }), SubVariantController.getPublicSubVariantById);
router.get(ROUTE.SUB_VARIANT_GET_BY_VARIANT, validateRequest({ params: SubVariantValidations.variantIdParamValidation, query: SubVariantValidations.getSubVariantsByVariantValidation }), SubVariantController.getSubVariantsByVariant);
router.post(ROUTE.PUBLIC_COMPARE_SUB_VARIANTS, validateRequest({ body: SubVariantValidations.compareSubVariantsValidation }), SubVariantController.compareSubVariants);

// ── Public user auth (consumer accounts) ─────────────────────────────────────
router.get("/user-auth/config", PublicAuthController.config);
router.post("/user-auth/register", validateRequest({ body: PublicAuthValidations.registerValidation }), PublicAuthController.register);
router.post("/user-auth/verify-otp", validateRequest({ body: PublicAuthValidations.verifyOtpValidation }), PublicAuthController.verifyOtp);
router.post("/user-auth/resend-otp", validateRequest({ body: PublicAuthValidations.resendOtpValidation }), PublicAuthController.resendOtp);
router.post("/user-auth/login", validateRequest({ body: PublicAuthValidations.loginValidation }), PublicAuthController.login);
router.get("/user-auth/me", authenticateJWT, PublicAuthController.me);

// Authenticated review submission by a logged-in public user
router.post("/reviews/create", authenticateJWT, validateRequest({ body: ReviewValidations.createReviewValidation }), ReviewController2.createReview);

// ── Contact form ──────────────────────────────────────────────────────────────
router.post("/contact", validateRequest({ body: ContactValidations.createContactMessageValidation }), ContactController.createMessage);

// ── Blog links (blogs related to a car/brand/model) ──────────────────────────
router.get("/blog-links/entity/:type/:entityId", BlogLinkController.getLinkedBlogs);

// ── Search & Filters ──────────────────────────────────────────────────────────
router.get(ROUTE.PUBLIC_SEARCH, validateRequest({ query: SearchValidations.searchVehiclesValidation }), SearchController.searchVehicles);
router.get(ROUTE.PUBLIC_GET_FILTERS, validateRequest({ query: SearchValidations.getFiltersValidation }), SearchController.getFilters);

// ── Reviews ───────────────────────────────────────────────────────────────────
router.get(
  ROUTE.REVIEW_GET_BY_SUB_VARIANT,
  validateRequest({ params: ReviewValidations.subVariantIdParamValidation, query: ReviewValidations.getAllReviewsValidation }),
  ReviewController.getReviewsByVehicle,
);

// ── Dealers ───────────────────────────────────────────────────────────────────
router.get(ROUTE.DEALER_GET_NEARBY, validateRequest({ query: DealerValidations.getNearbyDealersValidation }), DealerController.getNearbyDealers);
router.get(ROUTE.DEALER_GET_BY_BRAND, validateRequest({ params: DealerValidations.brandIdParamValidation }), DealerController.getDealersByBrand);

export default router;
