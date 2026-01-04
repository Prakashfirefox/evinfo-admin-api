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
}

export default new BannerController();
