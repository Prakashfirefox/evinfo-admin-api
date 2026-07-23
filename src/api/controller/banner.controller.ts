import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import BannerService from "../services/banner.service";
import * as BannerInterfaces from "../interfaces/banner.interface";

class BannerController {

  async createBanner(req: any, res: any) {
    try {
      const payload = req.body as BannerInterfaces.CreateBannerPayload;
      const banner = await BannerService.createBanner(payload, req.authUsersDetails);

      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_CREATED_SUCCESS, banner, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getAllBanners(req: any, res: any) {
    try {
      const payload = req.body as BannerInterfaces.GetAllBannersPayload;
      const data = await BannerService.getAllBanners(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getBannerById(req: any, res: any) {
    try {
      const { id } = req.params;
      if (!id) throw new AppError(ERROR_MESSAGE.BANNER_ID_REQ, {}, 400);

      const banner = await BannerService.getBannerById(id);
      if (!banner) throw new AppError(ERROR_MESSAGE.BANNER_NOT_FOUND, {}, 400);

      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_FETCHED_SUCCESS, banner, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateBanner(req: any, res: any) {
    try {
      const { id } = req.params;
      const payload = req.body as BannerInterfaces.UpdateBannerPayload;

      if (!id) throw new AppError(ERROR_MESSAGE.BANNER_ID_REQ, {}, 400);

      const banner = await BannerService.updateBanner(id, payload, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_UPDATED_SUCCESS, banner, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async deleteBanner(req: any, res: any) {
    try {
      const { id } = req.params;
      if (!id) throw new AppError(ERROR_MESSAGE.BANNER_ID_REQ, {}, 400);

      const result = await BannerService.deleteBanner(id, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_DELETED_SUCCESS, result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateBannerStatus(req: any, res: any) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) throw new AppError(ERROR_MESSAGE.BANNER_ID_REQ, {}, 400);

      await BannerService.updateBannerStatus(id, status, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_STATUS_UPDATED_SUCCESS, {}, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
  async updateBannerPriority(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const { priority } = req.validatedBody;

      if (!id) throw new AppError(ERROR_MESSAGE.BANNER_ID_REQ, {}, 400);
      if (priority === undefined) throw new AppError(ERROR_MESSAGE.BANNER_PRIORITY_REQ, {}, 400);

      const banner = await BannerService.updateBannerPriority(id, priority, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_PRIORITY_UPDATED_SUCCESS, banner, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // NEW METHOD: Bulk update banner status
  async bulkUpdateBannerStatus(req: any, res: any) {
    try {
      const { banner_ids, status } = req.validatedBody;

      if (!banner_ids || banner_ids.length === 0) throw new AppError(ERROR_MESSAGE.BANNER_IDS_REQ, {}, 400);
      if (!status) throw new AppError(ERROR_MESSAGE.BANNER_STATUS_REQ, {}, 400);

      const result = await BannerService.bulkUpdateBannerStatus(banner_ids, status, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_BULK_STATUS_UPDATED_SUCCESS, result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // NEW METHOD: Get banners by position
  async getBannersByPosition(req: any, res: any) {
    try {
      const { position } = req.validatedParams;
      const payload = req.validatedBody || {};

      if (!position) throw new AppError(ERROR_MESSAGE.BANNER_POSITION_REQ, {}, 400);

      const banners = await BannerService.getBannersByPosition(position, payload);
      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_FETCHED_SUCCESS, banners, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // NEW METHOD: Get active banners (for public routes)
  async getActiveBanners(req: any, res: any) {
    try {
      const payload = req.validatedQuery || req.validatedBody || {};
      const banners = await BannerService.getActiveBanners(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_FETCHED_SUCCESS, banners, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // NEW METHOD: Get banner by slug
  async getBannerBySlug(req: any, res: any) {
    try {
      const { slug } = req.validatedParams;

      if (!slug) throw new AppError(ERROR_MESSAGE.BANNER_SLUG_REQ, {}, 400);

      const banner = await BannerService.getBannerBySlug(slug);
      if (!banner) throw new AppError(ERROR_MESSAGE.BANNER_NOT_FOUND, {}, 400);

      Responser.success(res, true, SUCCESS_MESSAGES.BANNER_FETCHED_SUCCESS, banner, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}


export default new BannerController();
