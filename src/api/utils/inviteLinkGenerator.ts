import { generateToken } from "./tokenGenerator";
import config from '../../config/config';
import { Base64 } from "js-base64";
const encode = encodeURIComponent;

export function generateInviteLink(invite: any): string {
  // uidb64
  const uidb64 = Base64.encode(String(invite.id));

  // token
  const token = generateToken(invite, config.ENCRYPTION_KEY);

  // base URL
  const baseUrl = `${config.WEBSITE_URL}/accept-invite/${uidb64}/${token}`;

  // query params
  const query = `?full_name=${encode(invite.full_name)}&email=${encode(
    invite.email
  )}&business_unit=${encode(invite.business_unit?.name ?? "")}&role=${encode(
    invite.role?.name ?? ""
  )}`;

  return baseUrl + query;
}
