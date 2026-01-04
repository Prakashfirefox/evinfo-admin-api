// src/api/utils/crypto.util.ts
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY! || "my32byteencryptionkey1234567890"; // must be 32 bytes
const IV_LENGTH = 16; // AES IV length in bytes
console.log(Buffer.from(process.env.ENCRYPTION_KEY!).length);

/**
 * Encrypt a text string using AES-256-CBC.
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  const ivBase64 = iv.toString("base64");
  return `${ivBase64}:${encrypted}`;
}

/**
 * Decrypt a previously encrypted text using AES-256-CBC.
 */
export function decrypt(encryptedData: string): string {
  const [ivBase64, encryptedText] = encryptedData.split(":");
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
