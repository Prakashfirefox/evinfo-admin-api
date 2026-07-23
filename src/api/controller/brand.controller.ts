// src/api/controller/brand.controller.ts
import Responser from '../core/responser';
import AppError from '../core/error-handler';
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from '../constants';
import BrandService from '../services/brand.service';
import * as BrandInterfaces from '../interfaces/brand.interface';

class BrandController {
  async createBrand(req: any, res: any) {
    try {
      const payload = req.body as BrandInterfaces.CreateBrandPayload;
      const brand = await BrandService.createBrand(payload, req.authUsersDetails);

      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_CREATED_SUCCESS, brand, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getAllBrands(req: any, res: any) {
    try {
      const payload = req.body as BrandInterfaces.GetAllBrandsPayload;
      const data = await BrandService.getAllBrands(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getBrandById(req: any, res: any) {
    try {
      const { id } = req.params;
      if (!id) throw new AppError(ERROR_MESSAGE.BRAND_ID_REQ, {}, 400);

      const brand = await BrandService.getBrandById(id);
      if (!brand) throw new AppError(ERROR_MESSAGE.BRAND_NOT_FOUND, {}, 400);

      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_FETCHED_SUCCESS, brand, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateBrand(req: any, res: any) {
    try {
      const { id } = req.params;
      const payload = req.body as BrandInterfaces.UpdateBrandPayload;

      if (!id) throw new AppError(ERROR_MESSAGE.BRAND_ID_REQ, {}, 400);

      const brand = await BrandService.updateBrand(id, payload, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_UPDATED_SUCCESS, brand, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async deleteBrand(req: any, res: any) {
    try {
      const { id } = req.params;
      if (!id) throw new AppError(ERROR_MESSAGE.BRAND_ID_REQ, {}, 400);

      const result = await BrandService.deleteBrand(id, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_DELETED_SUCCESS, result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateBrandStatus(req: any, res: any) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id) throw new AppError(ERROR_MESSAGE.BRAND_ID_REQ, {}, 400);
      if (!status) throw new AppError(ERROR_MESSAGE.BRAND_STATUS_REQ, {}, 400);

      await BrandService.updateBrandStatus(id, status, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_STATUS_UPDATED_SUCCESS, {}, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getBrandBySlug(req: any, res: any) {
    try {
      const { slug } = req.validatedParams;
      if (!slug) throw new AppError(ERROR_MESSAGE.BRAND_SLUG_REQ, {}, 400);

      const brand = await BrandService.getBrandBySlug(slug);
      if (!brand) throw new AppError(ERROR_MESSAGE.BRAND_NOT_FOUND, {}, 400);

      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_FETCHED_SUCCESS, brand, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getBrandVehicles(req: any, res: any) {
    try {
      const { id } = req.params;
      const payload: BrandInterfaces.GetBrandVehiclesPayload = {
        brand_id: id,
        ...(req.validatedQuery || req.body),
      };

      if (!id) throw new AppError(ERROR_MESSAGE.BRAND_ID_REQ, {}, 400);

      const vehicles = await BrandService.getBrandVehicles(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_VEHICLES_FETCHED_SUCCESS, vehicles, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getPublicBrands(req: any, res: any) {
    try {
      // Use validatedQuery from your middleware, or fall back to req.query
      const payload = req.validatedQuery || (req.query as BrandInterfaces.GetAllBrandsPayload);
      const data = await BrandService.getPublicBrands(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.BRAND_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new BrandController();
