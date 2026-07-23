// src/api/controller/dealer.controller.ts
import Responser from "../core/responser";
import AppError from "../core/error-handler";
import { SUCCESS_MESSAGES, ERROR_MESSAGE } from "../constants";
import DealerService from "../services/dealer.service";

class DealerController {

    async createDealer(req: any, res: any) {
        try {
            const payload = req.validatedBody;
            const dealer = await DealerService.createDealer(payload, req.authUsersDetails);

            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_CREATED_SUCCESS, dealer, 201);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async getAllDealers(req: any, res: any) {
        try {
            const payload = req.validatedBody;
            const data = await DealerService.getAllDealers(payload);

            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_FETCHED_SUCCESS, data, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async getDealerById(req: any, res: any) {
        try {
            const { id } = req.validatedParams;

            const dealer = await DealerService.getDealerById(id);
            if (!dealer) throw new AppError(ERROR_MESSAGE.DEALER_NOT_FOUND, {}, 400);

            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_FETCHED_SUCCESS, dealer, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async updateDealer(req: any, res: any) {
        try {
            const { id } = req.validatedParams;
            const payload = req.validatedBody;

            const dealer = await DealerService.updateDealer(id, payload, req.authUsersDetails);

            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_UPDATED_SUCCESS, dealer, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async deleteDealer(req: any, res: any) {
        try {
            const { id } = req.validatedParams;

            const result = await DealerService.deleteDealer(id, req.authUsersDetails);

            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_DELETED_SUCCESS, result, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async updateDealerStatus(req: any, res: any) {
        try {
            const { id } = req.validatedParams;
            const { status } = req.validatedBody;

            await DealerService.updateDealerStatus(id, status, req.authUsersDetails);
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_STATUS_UPDATED_SUCCESS, {}, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async updateDealerRating(req: any, res: any) {
        try {
            const { id } = req.validatedParams;
            const { rating } = req.validatedBody;

            const updatedDealer = await DealerService.updateDealerRating(id, rating, req.authUsersDetails);
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_RATING_UPDATED_SUCCESS, updatedDealer, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async getNearbyDealers(req: any, res: any) {
        try {
            const payload = req.validatedQuery || req.validatedBody;

            const dealers = await DealerService.getNearbyDealers(payload);
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_FETCHED_SUCCESS, dealers, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async getDealersByVehicle(req: any, res: any) {
        try {
            const { vehicleId } = req.validatedParams;
            const payload = {
                vehicle_id: vehicleId,
                ...(req.validatedQuery || req.validatedBody)
            };

            const dealers = await DealerService.getDealersByVehicle(payload);
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_FETCHED_SUCCESS, dealers, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async getDealersByBrand(req: any, res: any) {
        try {
            const { brandId } = req.validatedParams;
            const payload = {
                brand_id: brandId,
                ...req.validatedBody
            };

            const dealers = await DealerService.getAllDealers(payload);
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_FETCHED_SUCCESS, dealers, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async getDealerServices(req: any, res: any) {
        try {
            const { id } = req.validatedParams;

            const services = await DealerService.getDealerServices(id);
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_SERVICES_FETCHED_SUCCESS, services, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async addDealerServices(req: any, res: any) {
        try {
            const { id } = req.validatedParams;
            const { services } = req.validatedBody;

            const updatedDealer = await DealerService.addDealerServices(id, services, req.authUsersDetails);
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_SERVICES_UPDATED_SUCCESS, updatedDealer, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async removeDealerServices(req: any, res: any) {
        try {
            const { id } = req.validatedParams;
            const { services } = req.validatedBody;

            const updatedDealer = await DealerService.removeDealerServices(id, services, req.authUsersDetails);
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_SERVICES_UPDATED_SUCCESS, updatedDealer, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

    async getDealerStats(req: any, res: any) {
        try {
            const stats = await DealerService.getDealerStats();
            Responser.success(res, true, SUCCESS_MESSAGES.DEALER_STATS_FETCHED_SUCCESS, stats, 200);
        } catch (error) {
            Responser.error(res, false, error);
        }
    }

   
}

export default new DealerController();