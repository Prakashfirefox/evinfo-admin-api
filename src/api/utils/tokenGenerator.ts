import crypto from "crypto";
import { Base64 } from "js-base64";


export function generateToken(userId : string, secret : string): string {
  const timestamp = Math.floor(Date.now() / 1000); // seconds

  const data = `${userId}:${timestamp}`;

  const hash = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");

  const token = `${userId}:${timestamp}:${hash}`;

  return Buffer.from(token).toString("base64url");
}

export function validateToken(token :string, secret : string, timeoutSeconds:  number): { valid: boolean; userId?: string; reason?: string }   {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [userId, timestampStr, hash] = decoded.split(":");

    const timestamp = parseInt(timestampStr, 10);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (now - timestamp > timeoutSeconds) {
      return { valid: false, reason: "expired" };
    }

    const data = `${userId}:${timestamp}`;
    const expectedHash = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("hex");

    if (expectedHash !== hash) {
      return { valid: false, reason: "invalid_signature" };
    }

    return { valid: true, userId };
  } catch (e) {
    return { valid: false, reason: "invalid_format" };
  }
}
