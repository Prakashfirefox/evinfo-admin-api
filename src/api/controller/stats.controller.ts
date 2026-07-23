// src/api/controller/stats.controller.ts
import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import StatsService from "../services/stats.service";
import * as StatsValidations from "../middlewares/validations/stats.validations";

class StatsController {

  async getOverviewStats(req: any, res: any) {
    try {
      const payload = req.validatedQuery || { include_history: false, days: 30 };
      const stats = await StatsService.getOverviewStats(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.STATS_OVERVIEW_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getBrandsStats(req: any, res: any) {
    try {
      const payload = req.validatedQuery || { limit: 20, sort_by: 'vehicles', sort_order: 'desc' };
      const stats = await StatsService.getBrandsStats(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.STATS_BRANDS_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getPopularVehicles(req: any, res: any) {
    try {
      const payload = req.validatedQuery || { limit: 10, period: 'all' };
      const vehicles = await StatsService.getPopularVehicles(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.STATS_POPULAR_VEHICLES_FETCHED_SUCCESS, vehicles, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getVehicleStats(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const payload = {
        id,
        ...req.validatedQuery
      };

      const stats = await StatsService.getSubVariantStats(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.STATS_VEHICLE_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getBrandDetailStats(req: any, res: any) {
    try {
      const { brandId } = req.validatedParams;
      const payload = req.validatedQuery || {};

      const stats = await StatsService.getBrandDetailStats(brandId, payload);
      Responser.success(res, true, SUCCESS_MESSAGES.STATS_BRAND_DETAIL_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getModelDetailStats(req: any, res: any) {
    try {
      const { modelId } = req.validatedParams;
      const payload = req.validatedQuery || {};

      const stats = await StatsService.getModelDetailStats(modelId, payload);
      Responser.success(res, true, SUCCESS_MESSAGES.STATS_MODEL_DETAIL_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getReviewStats(req: any, res: any) {
    try {
      const payload = req.validatedQuery || {};
      const stats = await StatsService.getReviewStats(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.STATS_REVIEWS_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getDealerStats(req: any, res: any) {
    try {
      const payload = req.validatedQuery || {};
      const stats = await StatsService.getDealerStats(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.STATS_DEALERS_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getUserStats(req: any, res: any) {
    try {
      const payload = req.validatedQuery || {};
      const stats = await StatsService.getUserStats(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.STATS_USERS_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getDashboardStats(req: any, res: any) {
    try {
      const stats = await StatsService.getDashboardStats();
      Responser.success(res, true, SUCCESS_MESSAGES.STATS_DASHBOARD_FETCHED_SUCCESS, stats, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new StatsController();