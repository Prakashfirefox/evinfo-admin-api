// src/api/controller/public-auth.controller.ts
import Responser from "../core/responser";
import PublicAuthService from "../services/public-auth.service";

class PublicAuthController {
  async config(_req: any, res: any) {
    Responser.success(res, true, "Auth config", PublicAuthService.getVerifyConfig(), 200);
  }

  async register(req: any, res: any) {
    try {
      const data = await PublicAuthService.register(req.validatedBody);
      Responser.success(res, true, "Verification code sent", data, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async verifyOtp(req: any, res: any) {
    try {
      const { userId, emailOtp, phoneOtp } = req.validatedBody;
      const data = await PublicAuthService.verifyOtp(userId, emailOtp, phoneOtp);
      Responser.success(res, true, "Account verified", data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async resendOtp(req: any, res: any) {
    try {
      const data = await PublicAuthService.resendOtp(req.validatedBody.userId);
      Responser.success(res, true, "Verification code resent", data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async login(req: any, res: any) {
    try {
      const { email, password } = req.validatedBody;
      const data = await PublicAuthService.login(email, password);
      Responser.success(res, true, "Signed in", data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  async me(req: any, res: any) {
    try {
      const data = await PublicAuthService.me(req.authUsersDetails.id);
      Responser.success(res, true, "Profile", data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new PublicAuthController();
