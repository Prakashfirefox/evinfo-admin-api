// src/api/controller/model.controller.ts
import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import VehicleModelService from "../services/vehicleModel.service";

class VehicleModelController {

  async createModel(req: any, res: any) {
    try {
      // Use validated body from middleware
      const payload = req.validatedBody;
      const model = await VehicleModelService.createModel(payload, req.authUsersDetails);

      Responser.success(res, true, SUCCESS_MESSAGES.VEHICLE_MODEL_CREATED_SUCCESS, model, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getAllModels(req: any, res: any) {
    try {
      // Use validated body from middleware
      const payload = req.validatedBody;
      const data = await VehicleModelService.getAllModels(payload);

      Responser.success(res, true, SUCCESS_MESSAGES.VEHICLE_MODEL_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getModelById(req: any, res: any) {
    try {
      // Use validated params from middleware
      const { id } = req.validatedParams;
      
      const model = await VehicleModelService.getModelById(id);
      if (!model) throw new AppError(ERROR_MESSAGE.VEHICLE_MODEL_NOT_FOUND, {}, 400);

      Responser.success(res, true, SUCCESS_MESSAGES.VEHICLE_MODEL_FETCHED_SUCCESS, model, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateModel(req: any, res: any) {
    try {
      // Use validated params and body from middleware
      const { id } = req.validatedParams;
      const payload = req.validatedBody;

      const model = await VehicleModelService.updateModel(id, payload, req.authUsersDetails);
      
      Responser.success(res, true, SUCCESS_MESSAGES.VEHICLE_MODEL_UPDATED_SUCCESS, model, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async deleteModel(req: any, res: any) {
    try {
      // Use validated params from middleware
      const { id } = req.validatedParams;
      
      const result = await VehicleModelService.deleteModel(id, req.authUsersDetails);
      
      Responser.success(res, true, SUCCESS_MESSAGES.VEHICLE_MODEL_DELETED_SUCCESS, result, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateModelStatus(req: any, res: any) {
    try {
      // Use validated params and body from middleware
      const { id } = req.validatedParams;
      const { status } = req.validatedBody;

      await VehicleModelService.updateModelStatus(id, status, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.VEHICLE_MODEL_STATUS_UPDATED_SUCCESS, {}, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getModelsByBrand(req: any, res: any) {
    try {
      // Use validated params and body from middleware
      const { brandId } = req.validatedParams;
      const payload = {
        brand_id: brandId,
        ...(req.validatedQuery || req.validatedBody)
      };

      const models = await VehicleModelService.getModelsByBrand(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.VEHICLE_MODEL_FETCHED_SUCCESS, models, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // Public Controller Methods

  async getPublicModels(req: any, res: any) {
    try {
      const payload = req.validatedQuery || req.validatedBody;
      const data = await VehicleModelService.getPublicModels(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.VEHICLE_MODEL_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new VehicleModelController();