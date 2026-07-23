// src/api/services/contact.service.ts
import prisma from "../../db/client";
import AppError from "../core/error-handler";
import { ERROR_MESSAGE } from "../constants";
import * as ContactInterfaces from "../interfaces/contact.interface";

class ContactService {

  async createMessage(data: ContactInterfaces.CreateContactMessagePayload) {
    return prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
        status: "new",
      },
    });
  }

  async getAllMessages(payload: ContactInterfaces.GetAllContactMessagesPayload) {
    const { search, status, offset = 0, limit = 20 } = payload;

    const where: any = { is_deleted: false };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [rows, count, newCount] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.count({ where: { is_deleted: false, status: "new" } }),
    ]);

    return { rows, count, newCount };
  }

  async updateStatus(id: string, status: ContactInterfaces.ContactMessageStatus) {
    const msg = await prisma.contactMessage.findFirst({ where: { id, is_deleted: false } });
    if (!msg) throw new AppError(ERROR_MESSAGE.CONTACT_MESSAGE_NOT_FOUND, {}, 404);

    return prisma.contactMessage.update({
      where: { id },
      data: { status, updated_at: new Date() },
    });
  }

  async deleteMessage(id: string) {
    const msg = await prisma.contactMessage.findFirst({ where: { id, is_deleted: false } });
    if (!msg) throw new AppError(ERROR_MESSAGE.CONTACT_MESSAGE_NOT_FOUND, {}, 404);

    await prisma.contactMessage.update({
      where: { id },
      data: { is_deleted: true, updated_at: new Date() },
    });
    return { id, deletedAt: new Date() };
  }
}

export default new ContactService();
