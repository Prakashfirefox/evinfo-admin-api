// src/api/controller/media.controller.ts
import AppError from "../core/error-handler";
import Responser from "../core/responser";
import { ERROR_MESSAGE, SUCCESS_MESSAGES } from "../constants";
import { BunnyService } from "../services/bunny.service";

class MediaController {
  /**
   * Generate Bunny upload details
   * POST /api/media/presign
   */
  async generatePresignedUrl(req: any, res: any) {
    try {
      const { fileName, folder } = req.body;

      if (!fileName) {
        throw new AppError(
          ERROR_MESSAGE.FILE_NAME_REQUIRED || "File name is required",
          { data: "fileName is required" },
          400
        );
      }

      const uploadData = BunnyService.generateUploadDetails(
        fileName,
        folder || "uploads"
      );

      return Responser.success(
        res,
        true,
        SUCCESS_MESSAGES.UPLOAD_URL_CREATED || "Upload URL generated successfully",
        uploadData,
        200
      );
    } catch (error: any) {
      return Responser.error(res, false, error);
    }
  }
}

export default new MediaController();
