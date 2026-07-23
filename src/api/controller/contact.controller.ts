// src/api/controller/contact.controller.ts
import Responser from "../core/responser";
import { SUCCESS_MESSAGES } from "../constants";
import ContactService from "../services/contact.service";

class ContactController {

  // POST /public/contact
  async createMessage(req: any, res: any) {
    try {
      const data = await ContactService.createMessage(req.validatedBody);
      Responser.success(res, true, SUCCESS_MESSAGES.CONTACT_MESSAGE_SENT_SUCCESS, { id: data.id }, 201);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // GET /admin/contact/get-all
  async getAllMessages(req: any, res: any) {
    try {
      const data = await ContactService.getAllMessages(req.validatedQuery || {});
      Responser.success(res, true, SUCCESS_MESSAGES.CONTACT_MESSAGES_FETCHED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // PATCH /admin/contact/:id/status
  async updateStatus(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const { status } = req.validatedBody;
      const data = await ContactService.updateStatus(id, status);
      Responser.success(res, true, SUCCESS_MESSAGES.CONTACT_MESSAGE_UPDATED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }

  // DELETE /admin/contact/:id
  async deleteMessage(req: any, res: any) {
    try {
      const { id } = req.validatedParams;
      const data = await ContactService.deleteMessage(id);
      Responser.success(res, true, SUCCESS_MESSAGES.CONTACT_MESSAGE_DELETED_SUCCESS, data, 200);
    } catch (error) {
      Responser.error(res, false, error);
    }
  }
}

export default new ContactController();
