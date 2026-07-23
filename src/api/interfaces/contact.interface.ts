// src/api/interfaces/contact.interface.ts
export interface CreateContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface GetAllContactMessagesPayload {
  search?: string;
  status?: string;
  offset?: number;
  limit?: number;
}

export type ContactMessageStatus = "new" | "read" | "resolved";
