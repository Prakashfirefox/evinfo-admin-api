import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import SpecificationsService from "../services/specifications.service";

class SpecificationsController {

  async upsertSpecifications(req: any, res: any) {
    try {
      const data = await SpecificationsService.upsertSpecifications(req.validatedBody, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.SPECIFICATIONS_UPSERTED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getSpecificationsById(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await SpecificationsService.getSpecificationsById(id);
      if (!data) throw new AppError(ERROR_MESSAGE.SPECIFICATIONS_NOT_FOUND, {}, 404);
      Responser.success(res, true, SUCCESS_MESSAGES.SPECIFICATIONS_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async getSpecificationsBySubVariant(req: any, res: any) {
    try {
      const { subVariantId } = req.validatedParams;
      const data = await SpecificationsService.getSpecificationsBySubVariant(subVariantId);
      if (!data) throw new AppError(ERROR_MESSAGE.SPECIFICATIONS_NOT_FOUND, {}, 404);
      Responser.success(res, true, SUCCESS_MESSAGES.SPECIFICATIONS_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async updateSpecifications(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await SpecificationsService.updateSpecifications(id, req.validatedBody, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.SPECIFICATIONS_UPDATED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async deleteSpecifications(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await SpecificationsService.deleteSpecifications(id, req.authUsersDetails);
      Responser.success(res, true, SUCCESS_MESSAGES.SPECIFICATIONS_DELETED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new SpecificationsController();
