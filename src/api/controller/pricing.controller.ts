import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import PricingService from "../services/pricing.service";

class PricingController {

  async createPricing(req: any, res: any) {
    try {
      const data = await PricingService.createPricing(req.validatedBody, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.PRICING_CREATED_SUCCESS, data, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getPricingById(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await PricingService.getPricingById(id);
      if (!data) throw new AppError(ERROR_MESSAGE.PRICING_NOT_FOUND, {}, 404);
      Responser.success(res, true, SUCCESS_MESSAGES.PRICING_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getPricingBySubVariant(req: any, res: any) {
    try {
      const { subVariantId } = req.validatedParams;
      const city = req.query?.city as string | undefined;
      const data = await PricingService.getPricingBySubVariant(subVariantId, city);
      Responser.success(res, true, SUCCESS_MESSAGES.PRICING_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getAllPricing(req: any, res: any) {
    try {
      const data = await PricingService.getAllPricing(req.validatedQuery || req.validatedBody || {});
      Responser.success(res, true, SUCCESS_MESSAGES.PRICING_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updatePricing(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await PricingService.updatePricing(id, req.validatedBody, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.PRICING_UPDATED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async deletePricing(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await PricingService.deletePricing(id, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.PRICING_DELETED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new PricingController();
