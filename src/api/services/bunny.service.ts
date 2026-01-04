// src/services/bunny.service.ts
import crypto from "crypto";
import path from "path";

const STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE!;
const ACCESS_KEY = process.env.BUNNY_STORAGE_KEY!;
const REGION = process.env.BUNNY_REGION || "";
const BASE_HOST = "storage.bunnycdn.com";
const HOST = REGION ? `${REGION}.${BASE_HOST}` : BASE_HOST;
const PULL_ZONE = process.env.BUNNY_PULL_ZONE!;

export class BunnyService {
  static generateUploadDetails(
    originalName: string,
    folder = "uploads"
  ) {
    const ext = path.extname(originalName);
    const fileName = `${crypto.randomUUID()}${ext}`;
    const filePath = `${folder}/${fileName}`;

    return {
      uploadUrl: `https://${HOST}/${STORAGE_ZONE}/${filePath}`,
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": "application/octet-stream",
      },
      publicUrl: `${PULL_ZONE}/${filePath}`,
      filePath,
    };
  }
}
