// src/api/controller/review.controller.ts
import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import ReviewService from "../services/review.service";

class ReviewController {

  async createReview(req: any, res: any) {
    try {
      const payload = req.validatedBody;
      // Add user_id from authenticated user
      payload.user_id = req.authUsersDetails.id;
      
      const review = await ReviewService.createReview(payload, req.authUsersDetails);

      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_CREATED_SUCCESS, review, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getAllReviews(req: any, res: any) {
    try {
      const payload = req.validatedBody;
      const data = await ReviewService.getAllReviews(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getReviewById(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      
      const review = await ReviewService.getReviewById(id);
      if (!review) throw new AppError(ERROR_MESSAGE.REVIEW_NOT_FOUND, {}, 400);

      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_FETCHED_SUCCESS, review, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateReview(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const payload = req.validatedBody;

      // Check if review belongs to user or user is admin
      const existingReview = await ReviewService.getReviewById(id);
      if (!existingReview) throw new AppError(ERROR_MESSAGE.REVIEW_NOT_FOUND, {}, 400);
      
      if (existingReview.user_id !== req.authUsersDetails.id && !req.authUsersDetails.is_admin) {
        throw new AppError(ERROR_MESSAGE.UNAUTHORIZED_REVIEW_UPDATE, {}, 403);
      }

      const review = await ReviewService.updateReview(id, payload, req.authUsersDetails);
      
      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_UPDATED_SUCCESS, review, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async deleteReview(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      
      // Check if review belongs to user or user is admin
      const existingReview = await ReviewService.getReviewById(id);
      if (!existingReview) throw new AppError(ERROR_MESSAGE.REVIEW_NOT_FOUND, {}, 400);
      
      if (existingReview.user_id !== req.authUsersDetails.id && !req.authUsersDetails.is_admin) {
        throw new AppError(ERROR_MESSAGE.UNAUTHORIZED_REVIEW_DELETE, {}, 403);
      }

      const result = await ReviewService.deleteReview(id, req.authUsersDetails);
      
      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_DELETED_SUCCESS, result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateReviewStatus(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const { status } = req.validatedBody;

      // Only admin can update review status
      if (!req.authUsersDetails.is_admin) {
        throw new AppError(ERROR_MESSAGE.UNAUTHORIZED_ACCESS, {}, 403);
      }

      await ReviewService.updateReviewStatus(id, status, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_STATUS_UPDATED_SUCCESS, {}, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getReviewsByVehicle(req: any, res: any) {
    try {
      const { subVariantId } = req.validatedParams;
      const reviews = await ReviewService.getReviewsBySubVariant(subVariantId, {
        ...(req.validatedQuery || req.validatedBody),
        status: 'approved'
      });
      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_FETCHED_SUCCESS, reviews, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async markReviewHelpful(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const { action = 'increment' } = req.validatedBody;

      const result = await ReviewService.markReviewHelpful(id, action, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_HELPFUL_UPDATED_SUCCESS, result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // Admin endpoints
  async getPendingReviews(req: any, res: any) {
    try {
      const payload = {
        ...req.validatedBody,
        status: 'pending'
      };
      const data = await ReviewService.getAllReviews(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getUserReviews(req: any, res: any) {
    try {
      const { userId } = req.validatedParams;
      const reviews = await ReviewService.getUserReviews(userId, req.validatedBody || {});
      Responser.success(res, true, SUCCESS_MESSAGES.REVIEW_FETCHED_SUCCESS, reviews, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new ReviewController();