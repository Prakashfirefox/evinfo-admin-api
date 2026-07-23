import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import SubVariantService from "../services/sub-variant.service";

class SubVariantController {

  async createSubVariant(req: any, res: any) {
    try {
      const data = await SubVariantService.createSubVariant(req.validatedBody, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_CREATED_SUCCESS, data, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getAllSubVariants(req: any, res: any) {
    try {
      const data = await SubVariantService.getAllSubVariants(req.validatedBody);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getSubVariantById(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await SubVariantService.getSubVariantById(id);
      if (!data) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 404);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getSubVariantBySlug(req: any, res: any) {
    try {
      const { slug } = req.validatedParams;
      const data = await SubVariantService.getSubVariantBySlug(slug);
      if (!data) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 404);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getSubVariantsByVariant(req: any, res: any) {
    try {
      const { variantId } = req.validatedParams;
      const data = await SubVariantService.getSubVariantsByVariant(variantId, req.validatedQuery || {});
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateSubVariant(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await SubVariantService.updateSubVariant(id, req.validatedBody, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_UPDATED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async deleteSubVariant(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await SubVariantService.deleteSubVariant(id, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_DELETED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateSubVariantStatus(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const { status } = req.validatedBody;
      await SubVariantService.updateSubVariantStatus(id, status, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_STATUS_UPDATED_SUCCESS, {}, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async bulkUpdateSubVariantStatus(req: any, res: any) {
    try {
      const data = await SubVariantService.bulkUpdateSubVariantStatus(req.validatedBody, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_BULK_STATUS_UPDATED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async compareSubVariants(req: any, res: any) {
    try {
      const data = await SubVariantService.compareSubVariants(req.validatedBody);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_COMPARISON_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getFeaturedSubVariants(req: any, res: any) {
    try {
      const data = await SubVariantService.getFeaturedSubVariants();
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getLatestSubVariants(req: any, res: any) {
    try {
      const data = await SubVariantService.getLatestSubVariants();
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // ── Public ──────────────────────────────────────────────────────────────────

  async getPublicSubVariants(req: any, res: any) {
    try {
      const payload = req.validatedQuery || req.validatedBody;
      const data = await SubVariantService.getPublicSubVariants(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getPublicSubVariantById(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await SubVariantService.getPublicSubVariantById(id);
      if (!data) throw new AppError(ERROR_MESSAGE.SUB_VARIANT_NOT_FOUND, {}, 404);
      Responser.success(res, true, SUCCESS_MESSAGES.SUB_VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new SubVariantController();
