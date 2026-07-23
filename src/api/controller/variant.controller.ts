// src/api/controller/variant.controller.ts
import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import VariantService from "../services/variant.service";

class VariantController {

  async createVariant(req: any, res: any) {
    try {
      const payload = req.validatedBody;
      const variant = await VariantService.createVariant(payload, req.authUsersDetails);

      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_CREATED_SUCCESS, variant, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getAllVariants(req: any, res: any) {
    try {
      const payload = req.validatedBody;
      const data = await VariantService.getAllVariants(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getVariantById(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      
      const variant = await VariantService.getVariantById(id);
      if (!variant) throw new AppError(ERROR_MESSAGE.VARIANT_NOT_FOUND, {}, 400);

      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_FETCHED_SUCCESS, variant, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateVariant(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const payload = req.validatedBody;

      const variant = await VariantService.updateVariant(id, payload, req.authUsersDetails);
      
      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_UPDATED_SUCCESS, variant, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async deleteVariant(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      
      const result = await VariantService.deleteVariant(id, req.authUsersDetails);
      
      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_DELETED_SUCCESS, result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateVariantStatus(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const { status } = req.validatedBody;

      await VariantService.updateVariantStatus(id, status, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_STATUS_UPDATED_SUCCESS, {}, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getVariantsByModel(req: any, res: any) {
    try {
      const { modelId } = req.validatedParams;
      const payload = {
        model_id: modelId,
        ...(req.validatedQuery || req.validatedBody)
      };

      const variants = await VariantService.getVariantsByModel(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_FETCHED_SUCCESS, variants, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // Public Methods
  async getPublicVariants(req: any, res: any) {
    try {
      const payload = req.validatedQuery || req.validatedBody;
      const data = await VariantService.getPublicVariants(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {

      Responser.error(res, false, error);
    }
  }

  async getPublicVariantById(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const variant = await VariantService.getPublicVariantById(id);
      if (!variant) throw new AppError(ERROR_MESSAGE.VARIANT_NOT_FOUND, {}, 400);
      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_FETCHED_SUCCESS, variant, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // GET /variants/by-ids?ids=a,b,c — competitor cards for a detail page
  async getPublicVariantsByIds(req: any, res: any) {
    try {
      const ids = String(req.validatedQuery.ids || "")
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, 12);
      const data = await VariantService.getPublicVariantsByIds(ids);
      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getVariantBySlug(req: any, res: any) {
    try {
      const { slug } = req.validatedParams;
      const variant = await VariantService.getVariantBySlug(slug);
      if (!variant) throw new AppError(ERROR_MESSAGE.VARIANT_NOT_FOUND, {}, 400);
      Responser.success(res, true, SUCCESS_MESSAGES.VARIANT_FETCHED_SUCCESS, variant, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }


}

export default new VariantController();