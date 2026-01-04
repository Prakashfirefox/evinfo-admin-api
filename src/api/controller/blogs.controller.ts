// src/api/controller/admin/auth.controller.ts
import AppError from "../core/error-handler";
import Responser from "../core/responser";
import { ERROR_MESSAGE, SUCCESS_MESSAGES } from "../constants/index";
import AuthServices from "../services/auth.service";
import BlogsServices from "../services/blogs.service";
import * as BlogsInterfaces from "../interfaces/blogs.interface";
import * as OrganizationInterfaces from "../interfaces/blogs.interface";

class BlogsController {


  // Users
  async getAllBlogs(req: any, res: any) {
    try {
      const payload = req.body as BlogsInterfaces.GetAllBlogsPayload;
      const data = await BlogsServices.getAllBlogs(payload);
      Responser.success(res, true, SUCCESS_MESSAGES.BLOGS_FETCHED_SUCCESS, { data }, 200)
    } catch (error: any) {
      console.log(error)
      Responser.error(res, false, error);
    }
  }

  async createBlog(req: any, res: any) {
    try {
      const payload = req.body as BlogsInterfaces.CreateBlogPayload;

      // STEP 1 ➜ Create Organization
      const organization = await BlogsServices.createBlog(payload, req.authUsersDetails);

      // Response
      Responser.success(
        res,
        true,
        SUCCESS_MESSAGES.CREATE_BLOG_SUCCESS,
        {
          organization_id: organization.id,
          organization_name: organization.name
        },
        201
      );

    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }


  async getBlogById(req: any, res: any) {
    try {
      const { id } = req.params;
      console.log("Get Organization by ID :",id);
      if (!id)
        throw new AppError(
          ERROR_MESSAGE.BLOG_ID_REQ,
          {
            data: ERROR_MESSAGE.BLOG_ID_REQ,
          },
          400
        );
      const Blog = await BlogsServices.getBlogById(id);
      if (!Blog) {
        throw new AppError(
          ERROR_MESSAGE.BLOG_NOT_FOUND,
          {
            data: ERROR_MESSAGE.BLOG_NOT_FOUND,
          },
          400
        );
      }
      // Remove sensitive/unwanted fields from user object
      
      // Optional: Remove additional fields you don't want to expose
      // const { last_login, date_joined, is_deleted, ...safeUser } = user;
      Responser.success(res, true, SUCCESS_MESSAGES.BLOGS_FETCHED_SUCCESS, { Blog}, 200);

    } catch (error) {
      Responser.error(res, false, error);
    }
  }


  //Update User
  async updateBlog(req: any, res: any) {
    try {
      const { id } = req.params;
      const payload = req.body as BlogsInterfaces.UpdateBlogPayload;

      if (!id) {
        throw new AppError(
          ERROR_MESSAGE.BLOG_ID_REQ,
          {
            data: ERROR_MESSAGE.BLOG_ID_REQ,
          },
          400
        );
      }
      //jhjh
    
      const updatedBlogData = await BlogsServices.updateBlog(id, payload, req.authUsersDetails);
      if (!updatedBlogData) {
        throw new AppError(
          ERROR_MESSAGE.BLOG_NOT_FOUND,
          {
            data: ERROR_MESSAGE.BLOG_NOT_FOUND,
          },
          400
        );
      }
      Responser.success(res, true, SUCCESS_MESSAGES.BLOG_UPDATED_SUCCESS, { updatedBlogData }, 200);
    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }

  //Delete User
  async deleteBlog(req: any, res: any) {
    try {
      const { id } = req.params;
      if (!id)
        throw new AppError(
          ERROR_MESSAGE.BLOG_ID_REQ,
          {
            data: ERROR_MESSAGE.BLOG_ID_REQ,
          },
          400
        );
      const deletedOrg = await BlogsServices.deleteBlog(id, req.authUsersDetails);


      Responser.success(res, true, SUCCESS_MESSAGES.BLOG_DELETED_SUCCESS, { deletedOrg }, 200);
    } catch (error: any) {
      Responser.error(res, false, error);
    }
  }
  //Update Organization Status
  async updateBlogStatus(req: any, res: any) {
    try {
      const { id } = req.params
      if (!id)
        throw new AppError(
          ERROR_MESSAGE.BLOG_ID_REQ,
          {
            data: ERROR_MESSAGE.BLOG_ID_REQ,
          },
          400
        );
      const { status } = req.body as BlogsInterfaces.UpdateBlogsStatus
      const result = await BlogsServices.updateBlogStatus(id, status, req.authUsersDetails);
      if (result) {
        Responser.success(res, true, SUCCESS_MESSAGES.BLOG_STATUS_UPDATED_SUCCESS, {}, 200);
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      Responser.error(res, false, error);
    }
  }





}


export default new BlogsController();
