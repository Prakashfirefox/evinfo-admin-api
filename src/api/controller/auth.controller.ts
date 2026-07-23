// src/api/controller/admin/auth.controller.ts
import AppError from "../core/error-handler";
import Responser from "../core/responser";
import { ERROR_MESSAGE, SUCCESS_MESSAGES } from "../constants/index";
import AuthServices from "../services/auth.service";
import * as UserInterfaces from "../interfaces/auth.interface";
import { sendMail } from "../core/mailer";
import { urlsafeBase64Encode, forceBytes } from '../utils/encoding';
import config from "../../config/config";;
import { generateInviteLink } from '../utils/inviteLinkGenerator';
import { generateHTMLForOtpEmail } from "../core/htmlGenerator";
import { capitalizeFirst, toLower } from "../utils/stringUtils";

class AuthController {
  // Super Admin Login
  async login(req: any, res: any) {
    try {
      const { email, password } = req.body as UserInterfaces.LoginPayload;
      if (!email || !password)
        throw new AppError(
          ERROR_MESSAGE.EMAIL_PASSWORD_REQUIRED,
          {
            data: ERROR_MESSAGE.EMAIL_PASSWORD_REQUIRED,
          },
          400
        );
      const { access_token, refresh_token, user } = await AuthServices.login(email, password);
      const { ...userData } = user;
      Responser.success(res, true, SUCCESS_MESSAGES.LOGININ_SUCCESS, {
        access_token,
        refresh_token,
        role: "global_admin",
        user: userData,
      }, 200)
    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }

  // Logout
  async logout(req: any, res: any) {
    try {
      const userId = req.authUsersDetails.id;
      if (!userId)
        throw new AppError(
          ERROR_MESSAGE.INVALID_USER_DETAILS,
          {
            data: ERROR_MESSAGE.INVALID_USER_DETAILS,
          },
          400
        );
      await AuthServices.logout(userId);
      Responser.success(res, true, SUCCESS_MESSAGES.LOGOUT_SUCCESS, {}, 200)
    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }

  // 🔹 Organizations
  // async getAllOrganizations(req: any, res: any) {
  //   try {
  //     const data = await AuthServices.getAllOrganizations();
  //     return res
  //       .status(200)
  //       .json({ status: 200, message: "Organizations fetched successfully", data });
  //   } catch (error: any) {
  //     Responser.error(res, false, error);
  //   }
  // }



  // Users
  async getAllUsers(req: any, res: any) {
    try {
      const payload = req.body as UserInterfaces.GetAllUserPayload;
      const data = await AuthServices.getAllUsers(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.USERS_FETCHED_SUCCESS, { data }, 200)
    } catch (error: any) {
      console.log(error)
      Responser.error(res, false, error);
    }
  }

  async createUser(req: any, res: any) {
    try {
      const { user_name, email, password, first_name, last_name, is_admin } = req.body as UserInterfaces.CreateUserPayload;

      if (!user_name || !email || !password) {
        throw new AppError(
          ERROR_MESSAGE.UNAME_EMAIL_PASS_REQUIRED,
          { data: ERROR_MESSAGE.UNAME_EMAIL_PASS_REQUIRED },
          400
        );
      }

      const existingEmail = await AuthServices.getUserByEmail(email);
      if (existingEmail) {
        throw new AppError(ERROR_MESSAGE.EMAIL_ALREADY_USED, { data: ERROR_MESSAGE.EMAIL_ALREADY_USED }, 409);
      }

      const existingUserName = await AuthServices.getUserByUserName(user_name);
      if (existingUserName) {
        throw new AppError(ERROR_MESSAGE.USERNAME_ALREADY_USED, { data: ERROR_MESSAGE.USERNAME_ALREADY_USED }, 409);
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

      // Save user with OTP (not verified yet)
      const user = await AuthServices.createUserWithOTP(
        { user_name, email, password, first_name, last_name, is_admin, otp },
        req.authUsersDetails
      );
      const full_name = `${first_name || ""} ${last_name || ""}`.trim();
      const htmlContent = await generateHTMLForOtpEmail(full_name, otp);

      // Send OTP via email
      await sendMail({
        email: 'user@example.com',
        subject: 'Your OTP for BIZManager',
        htmlContent,
        provider: 'gmail', // or 'sendgrid'
      });

      Responser.success(res, true, 'User created successfully. OTP sent to email.', { user_id: user.id }, 200);

    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }

  async getUserById(req: any, res: any) {
    try {
      const { id } = req.params;
      if (!id)
        throw new AppError(
          ERROR_MESSAGE.USER_ID_REQ,
          {
            data: ERROR_MESSAGE.USER_ID_REQ,
          },
          400
        );
      const user = await AuthServices.getUserById(id);
      if (!user) {
        throw new AppError(
          ERROR_MESSAGE.USER_NOT_FOUND,
          {
            data: ERROR_MESSAGE.USER_NOT_FOUND,
          },
          400
        );
      }
      // Remove sensitive/unwanted fields from user object
      const { password, refresh_token, is_superuser, is_admin, ...safeUser } = user;
      // Optional: Remove additional fields you don't want to expose
      // const { last_login, date_joined, is_deleted, ...safeUser } = user;
      Responser.success(res, true, SUCCESS_MESSAGES.GET_USER_SUCCESS, { user: safeUser }, 200);

    } catch (error) {
      Responser.error(res, false, error);
    }
  }

async verifyOtp (req: any, res: any) {
  try {
    const { userId, otp } = req.body as UserInterfaces.verifyOtpPayload;

    const response = await AuthServices.verifyOtpService(userId, otp);

    Responser.success(
      res,
      response,
      "Email verified successfully",
      null,
      200
    );
  } catch (error: any) {
    Responser.error(res, false, error);
  }
};
  //Update User
  async updateUser(req: any, res: any) {
    try {
      const { id } = req.params;
      const { user_name, email, full_name, first_name, last_name, dob, gender, country_code, phone_no, password } = req.body as UserInterfaces.UpdateUserPayload;

      if (!id) {
        throw new AppError(
          ERROR_MESSAGE.USER_ID_REQ,
          {
            data: ERROR_MESSAGE.USER_ID_REQ,
          },
          400
        );
      }

      let updateData: UserInterfaces.UpdateUserDTO = {};

      // Add fields to updateData only if they are provided
      if (user_name) updateData.user_name = user_name;
      if (email) updateData.email = email;
      if (full_name) updateData.full_name = full_name;
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (dob) updateData.dob = dob;
      if (gender) updateData.gender = gender;
      if (country_code) updateData.country_code = country_code;
      if (phone_no) updateData.phone_no = phone_no;
      if (password) updateData.full_name = password;
      // Check if there's any data to update
      if (Object.keys(updateData).length === 0) {
        throw new AppError(
          ERROR_MESSAGE.NO_VALID_FIELDS,
          {
            data: ERROR_MESSAGE.NO_VALID_FIELDS,
          },
          400
        );
      }
      const updatedUserData = await AuthServices.updateUser(id, updateData, req.authUsersDetails);
      if (!updatedUserData) {
        throw new AppError(
          ERROR_MESSAGE.USER_UPDATE_ERROR,
          {
            data: ERROR_MESSAGE.USER_UPDATE_ERROR,
          },
          400
        );
      }
      Responser.success(res, true, SUCCESS_MESSAGES.USER_UPDATED_SEUCCESS, { user: updatedUserData }, 200);
    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }

  //Delete User
  async deleteUser(req: any, res: any) {
    try {
      console.log("Delete User Request Params:", req.params);
      const { id } = req.params;
      if (!id)
        throw new AppError(
          ERROR_MESSAGE.USER_ID_REQ,
          {
            data: ERROR_MESSAGE.USER_ID_REQ,
          },
          400
        );
        console.log("Authenticated User Details:", req.authUsersDetails);
      const deleteUser = await AuthServices.deleteUser(id, req.authUsersDetails);

      Responser.success(res, true, SUCCESS_MESSAGES.USER_DELETED_SUCCESS, { deleteUser }, 200);
    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }

  // async getGlobalStats(req: any, res: any) {
  //   try {
  //     const data = await AuthServices.getGlobalStats();
  //     return res
  //       .status(200)
  //       .json({ status: 200, message: "Stats fetched successfully", data });
  //   } catch (error: any) {
  //     console.error("Error fetching stats:", error);
  //     Responser.error(res, false, error);
  //   }
  // }
  async forgotPassword(req: any, res: any) {
    try {
      const { email } = req.body as UserInterfaces.ForgotPasswordPayload;
      await AuthServices.forgotPassword(email);
      // Always return 200 — never reveal whether the email exists
      Responser.success(res, true, SUCCESS_MESSAGES.FORGOT_PASSWORD_EMAIL_SENT, {}, 200);
    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }

  async resetPassword(req: any, res: any) {
    try {
      const { token, email, new_password } = req.body as UserInterfaces.ResetPasswordPayload;
      await AuthServices.resetPassword(email, token, new_password);
      Responser.success(res, true, SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS, {}, 200);
    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }

  //update User Status
  async updateUserStatus(req: any, res: any) {
    try {
      const { id } = req.params
      if (!id)
        throw new AppError(
          ERROR_MESSAGE.USER_ID_REQ,
          {
            data: ERROR_MESSAGE.USER_ID_REQ,
          },
          400
        );
      const { status } = req.body as UserInterfaces.UpdateUserStatus
      const result = await AuthServices.updateUserStatus(id, status, req.authUsersDetails);
      if (result) {
        Responser.success(res, true, SUCCESS_MESSAGES.USER_STATUS_UPDATED_SUCCESS, {}, 200);
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      Responser.error(res, false, error);
    }
  }



  // //update User Status
  // async getUserStatusCounts(req: any, res: any) {
  //   try {
  //     const result = await AuthServices.getGlobalStats();
  //     Responser.success(res, true, SUCCESS_MESSAGES.USER_STATUS_FETCHED_SUCCESS, result, 200);
  //   } catch (error: any) {
  //     console.error("❌ Error fetching stats:", error);
  //     Responser.error(res, false, error);
  //   }
  // }

  // async inviteUser(req: any, res: any) {
  //   try {
  //     const { id } = req.params;
  //     if (!id)
  //       throw new AppError(
  //         ERROR_MESSAGE.USER_ID_REQ,
  //         {
  //           data: ERROR_MESSAGE.USER_ID_REQ,
  //         },
  //         400
  //       );
  //     const user = await AuthServices.getUserById(id);
  //     if (!user) {
  //       throw new AppError(
  //         ERROR_MESSAGE.USER_NOT_FOUND,
  //         {
  //           data: ERROR_MESSAGE.USER_NOT_FOUND,
  //         },
  //         400
  //       );
  //     }
  //     console.log("User to be invited:", user);
  //     if (!user.organization_id) {
  //       const organizationResult = await OrganizationsService.createDefaultOrganizationForUser(user, req.authUsersDetails);
  //       if (organizationResult) {
  //         user.organization_id = organizationResult.id;
  //         await AuthServices.updateOrganizationId(user.id, { organization_id: organizationResult.id }, req.authUsersDetails);
  //       }
  //     }
  //     const result = await AuthServices.inviteUser(parseInt(id), req.authUsersDetails);
  //     // Generate invite link and send email
  //     if (result) {
  //       try {
  //         const invite_link = await generateInviteLink(result);
  //         const framework_title = 'General';
  //         const subject = "Invitation to Join the Team";
  //         const htmlContent = await generateHTMLForInviteEmail(capitalizeFirst(user?.full_name || ''), invite_link);
  //         const mailOptions = {
  //           email: user.email,
  //           subject: subject,
  //           htmlContent: htmlContent
  //         };
  //         await sendGridMail(mailOptions);
  //         console.log("✅ Invitation email sent successfully to:", result.email);

  //       } catch (emailError) {
  //         console.error("❌ Error sending invitation email:", emailError);
  //         // Don't throw error, just log it since the user was already created
  //       }
  //     }
  //     Responser.success(res, true, "User invited successfully", result, 200);
  //   } catch (error: any) {
  //     console.error("❌ Error inviting user:", error);
  //     Responser.error(res, false, error);
  //   }


  // }


}


export default new AuthController();
