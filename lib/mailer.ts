// ZeptoMail transactional email — REST API, no SDK dependency.
// Docs: https://www.zoho.com/zeptomail/help/api/email-sending.html

import { getEnv } from "@/lib/config";

const ZEPTO_API_URL = "https://api.zeptomail.com/v1.1/email";
const FROM_ADDRESS = "info@auxeira.com";
const FROM_NAME = "Lante at Auxeira";

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}): Promise<void> {
  const token = await getEnv("ZEPTOMAIL_TOKEN");
  console.log("[mailer] ZEPTOMAIL_TOKEN present:", !!token, "| to:", opts.to, "| subject:", opts.subject);
  if (!token) {
    console.warn("[mailer] ZEPTOMAIL_TOKEN not set — email skipped");
    return;
  }

  const recipients = Array.isArray(opts.to) ? opts.to : [opts.to];
  const replyTo = opts.replyTo ?? FROM_ADDRESS;

  const body = {
    from: { address: FROM_ADDRESS, name: FROM_NAME },
    to: recipients.map((address) => ({ email_address: { address } })),
    reply_to: [{ address: replyTo }],
    subject: opts.subject,
    htmlbody: opts.html,
    ...(opts.text ? { textbody: opts.text } : {}),
    track_opens: true,
    track_clicks: false,
  };

  const res = await fetch(ZEPTO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${token}`,
    },
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  if (!res.ok) {
    console.error("[mailer] ZeptoMail error:", res.status, responseText);
    throw new Error(`ZeptoMail error ${res.status}: ${responseText}`);
  }
  console.log("[mailer] ZeptoMail accepted:", res.status, responseText.slice(0, 120));
}
