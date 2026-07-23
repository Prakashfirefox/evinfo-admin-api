// src/api/controller/search.controller.ts
import Responser from "../core/responser";
import { SUCCESS_MESSAGES } from "../constants";
import SearchService from "../services/search.service";

class SearchController {

  async searchVehicles(req: any, res: any) {
    try {
      const payload = req.validatedQuery || req.validatedBody;
      const results = await SearchService.searchVehicles(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.SEARCH_COMPLETED_SUCCESS, results, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getFilters(req: any, res: any) {
    try {
      const payload = req.validatedQuery || req.validatedBody || { include_counts: true, category: 'all' };
      const filters = await SearchService.getFilters(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.FILTERS_FETCHED_SUCCESS, filters, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async autoComplete(req: any, res: any) {
    try {
      const payload = req.validatedBody;
      const suggestions = await SearchService.autoComplete(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.AUTO_COMPLETE_SUCCESS, suggestions, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getTrendingVehicles(req: any, res: any) {
    try {
      const trending = await SearchService.getTrendingVehicles();

      Responser.success(res, true, SUCCESS_MESSAGES.TRENDING_VEHICLES_FETCHED_SUCCESS, trending, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new SearchController();
