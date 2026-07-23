// src/api/utils/sms.util.ts — minimal SMS sender (Twilio via REST, no SDK dep)
import config from "../../config/config";

/**
 * Send an SMS. With SMS_PROVIDER=twilio and credentials set, sends via Twilio's
 * REST API. Otherwise logs the message to the server console so the OTP flow
 * still works in development without a paid SMS account.
 */
export async function sendSms(to: string, body: string): Promise<{ sent: boolean; provider: string }> {
  if (config.SMS_PROVIDER === "twilio" && config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN && config.TWILIO_FROM) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${config.TWILIO_ACCOUNT_SID}/Messages.json`;
      const auth = Buffer.from(`${config.TWILIO_ACCOUNT_SID}:${config.TWILIO_AUTH_TOKEN}`).toString("base64");
      const params = new URLSearchParams({ To: to, From: config.TWILIO_FROM, Body: body });
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("Twilio SMS failed:", err);
        return { sent: false, provider: "twilio" };
      }
      return { sent: true, provider: "twilio" };
    } catch (e: any) {
      console.error("Twilio SMS error:", e.message);
      return { sent: false, provider: "twilio" };
    }
  }

  // Dev fallback — surface the OTP in the server log
  console.log(`\n📱 [SMS → ${to}] ${body}\n`);
  return { sent: true, provider: "console" };
}
