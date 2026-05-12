import { NextRequest, NextResponse } from "next/server";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { dynamo } from "@/lib/dynamodb";
import { sendEmail } from "@/lib/mailer";
import { subscribeToForm } from "@/lib/convertkit";
import { buildNewsletterWelcomeEmail } from "@/lib/emailTemplates/newsletterWelcome";
import { normaliseUrl } from "@/lib/normaliseUrl";

type SubscribeSource =
  | "newsletter"
  | "newsletter-cta"
  | "capability-pdf"
  | "health-sector-waitlist";

const FORM_MAP: Record<SubscribeSource, string | undefined> = {
  newsletter: process.env.CONVERTKIT_FORM_ID_NEWSLETTER,
  "newsletter-cta": process.env.CONVERTKIT_FORM_ID_NEWSLETTER,
  "capability-pdf": process.env.CONVERTKIT_FORM_ID_CAPABILITY,
  "health-sector-waitlist": process.env.CONVERTKIT_FORM_ID_NOTIFY,
};

// Set CAPABILITY_PDF_URL in AWS Secrets Manager once the PDF is uploaded to S3/CloudFront.
// Until then, the email CTA links to the contact page instead of a broken PDF URL.
const CAPABILITY_PDF_URL =
  process.env.CAPABILITY_PDF_URL ?? "https://auxeira.com/#cta";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firstName, lastName, orgName, orgWebsite, source } = body as {
      email: string;
      firstName?: string;
      lastName?: string;
      orgName?: string;
      orgWebsite?: string;
      source: SubscribeSource;
    };

    if (!email || !firstName || !lastName || !orgName) {
      return NextResponse.json({ error: "firstName, lastName, email and orgName are required" }, { status: 400 });
    }

    // Normalise supplied URL (handles missing protocol), or infer from email domain
    const emailDomain = email.split("@")[1] ?? "";
    const resolvedWebsite = normaliseUrl(orgWebsite) || `https://${emailDomain}`;

    const id = uuidv4();
    const timestamp = new Date().toISOString();

    // 1. Store subscriber in DynamoDB
    try {
      await dynamo.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_LEADS_TABLE ?? "auxeira-leads",
          Item: {
            id, timestamp, email, source,
            firstName,
            lastName,
            orgName,
            orgWebsite: resolvedWebsite,
            grokResearchStatus: "pending",
          },
        })
      );
    } catch (dbErr) {
      console.error("DynamoDB write failed:", dbErr);
    }

    // 2. Trigger Grok org research async — enriches newsletter personalisation
    if (source === "newsletter" || source === "newsletter-cta") {
      triggerGrokSubscriberResearch({ subscriberId: id, orgName, orgWebsite: resolvedWebsite })
        .catch((err) => console.error("Grok subscriber research failed:", err));
    }

    // 3. Subscribe to ConvertKit
    try {
      const formId = FORM_MAP[source];
      if (formId && formId !== "placeholder") {
        await subscribeToForm({ formId, email, firstName, fields: { source } });
      }
    } catch (ckErr) {
      console.error("ConvertKit subscribe failed:", ckErr);
    }

    // 3. Source-specific follow-up emails
    try {
      if (source === "capability-pdf") {
        await sendEmail({
          to: email,
          subject: "Your Auxeira Capability Overview",
          html: buildCapabilityEmail({ firstName }),
        });
      } else if (source === "newsletter" || source === "newsletter-cta") {
        await sendEmail({
          to: email,
          subject: "You are subscribed to Auxeira Intelligence",
          html: buildNewsletterWelcomeEmail({ firstName }),
        });

      } else if (source === "health-sector-waitlist") {
        await sendEmail({
          to: email,
          subject: "You're on the Auxeira Health Intelligence waitlist",
          html: buildWaitlistEmail({ firstName }),
        });
      }
    } catch (sesErr) {
      console.error("SES follow-up email failed:", sesErr);
    }

    // 4. Internal notification
    try {
      const notifyAddr = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@auxeira.com";
      await sendEmail({
        to: notifyAddr,
        subject: `New subscriber [${source}] — ${firstName} ${lastName}, ${orgName}`,
        html: `<p><strong>Source:</strong> ${source}</p><p><strong>Name:</strong> ${firstName} ${lastName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Organisation:</strong> ${orgName}</p><p><strong>Website:</strong> ${resolvedWebsite}</p>`,
      });
    } catch (notifyErr) {
      console.error("Lead notification failed:", notifyErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error("Subscribe API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── Grok subscriber research ─────────────────────────────────────────────────
// Fires async on subscribe. Grok searches the web for org context; the
// structured profile is stored in DynamoDB for Claude to use at send time.

async function triggerGrokSubscriberResearch(params: {
  subscriberId: string;
  orgName: string;
  orgWebsite?: string;
}): Promise<void> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return;

  const prompt = `Research the organisation "${params.orgName}" for newsletter personalisation.
${params.orgWebsite ? `Website: ${params.orgWebsite}` : ""}

Return a JSON object with exactly these keys:
- overview: 2-3 sentence description of the organisation's mission and programmes
- evidence_maturity: their current evidence and evaluation practice (1-2 sentences)
- key_funders: known funders or funding sources (1-2 sentences)
- sector_position: their position in the sector landscape (1-2 sentences)
- newsletter_relevance: why Auxeira Intelligence is relevant to this organisation (1-2 sentences)

Respond with only the JSON object, no markdown fencing.`;

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-3",
      messages: [{ role: "user", content: prompt }],
      search_parameters: { mode: "on" },
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    console.error("Grok subscriber research error:", res.status, await res.text());
    return;
  }

  const data = await res.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const raw = data.choices?.[0]?.message?.content ?? "";

  let profile: Record<string, string> = {};
  try {
    profile = JSON.parse(raw) as Record<string, string>;
  } catch {
    console.error("Grok research: failed to parse JSON response", raw.slice(0, 200));
    return;
  }

  await dynamo.send(
    new UpdateCommand({
      TableName: process.env.DYNAMODB_LEADS_TABLE ?? "auxeira-leads",
      Key: { id: params.subscriberId },
      UpdateExpression: [
        "SET grokResearchStatus = :s",
        "orgOverview = :ov",
        "evidenceMaturity = :em",
        "keyFunders = :kf",
        "sectorPosition = :sp",
        "newsletterRelevance = :nr",
      ].join(", "),
      ExpressionAttributeValues: {
        ":s":  "complete",
        ":ov": profile.overview ?? "",
        ":em": profile.evidence_maturity ?? "",
        ":kf": profile.key_funders ?? "",
        ":sp": profile.sector_position ?? "",
        ":nr": profile.newsletter_relevance ?? "",
      },
    })
  );
}

// ─── Email templates ──────────────────────────────────────────────────────────

function buildCapabilityEmail({ firstName }: { firstName?: string }) {
  const name = firstName ? `, ${firstName}` : "";
  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#1A1A2A;background:#F5F0E8;padding:0;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" style="max-width:600px;width:100%;">
        <tr><td style="background:#0A1628;padding:32px 40px;">
          <p style="margin:0;font-size:22px;font-weight:600;color:#C9A84C;letter-spacing:4px;text-transform:uppercase;">Auxeira</p>
        </td></tr>
        <tr><td style="background:#ffffff;padding:40px;">
          <p style="font-size:16px;line-height:1.6;">Hi${name},</p>
          <p style="font-size:15px;line-height:1.7;opacity:0.8;">Here is your Auxeira Capability Overview — a 2-page summary of what we do, what we have delivered, and what a partnership looks like.</p>
          <a href="${CAPABILITY_PDF_URL}" style="display:inline-block;background:#C9A84C;color:#0A1628;padding:14px 28px;font-size:14px;font-weight:600;text-decoration:none;margin:16px 0;">Download Capability Overview →</a>
          <p style="font-size:14px;line-height:1.7;opacity:0.7;margin-top:24px;">If you'd like to talk through what Auxeira could do for your organisation, <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta"}" style="color:#C9A84C;">book a 30-minute Evidence Strategy Call</a>.</p>
        </td></tr>
        <tr><td style="background:#0A1628;padding:24px 40px;">
          <p style="margin:0;font-size:12px;color:#F5F0E8;opacity:0.4;">Auxeira · info@auxeira.com · Johannesburg, South Africa</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}



function buildWaitlistEmail({ firstName }: { firstName?: string }) {
  const name = firstName ? `, ${firstName}` : "";
  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#1A1A2A;background:#F5F0E8;padding:0;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr><td align="center">
      <table width="600" style="max-width:600px;width:100%;">
        <tr><td style="background:#0A1628;padding:32px 40px;">
          <p style="margin:0;font-size:22px;font-weight:600;color:#C9A84C;letter-spacing:4px;text-transform:uppercase;">Auxeira</p>
        </td></tr>
        <tr><td style="background:#ffffff;padding:40px;">
          <p style="font-size:16px;line-height:1.6;">Hi${name},</p>
          <p style="font-size:15px;line-height:1.7;opacity:0.8;">You're on the list. We'll be in touch as Auxeira's Health Intelligence Engine develops, and as we begin scoping the first health sector engagements.</p>
          <p style="font-size:15px;line-height:1.7;opacity:0.8;">If you'd like to talk sooner, <a href="${process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta"}" style="color:#C9A84C;">book a call</a>.</p>
        </td></tr>
        <tr><td style="background:#0A1628;padding:24px 40px;">
          <p style="margin:0;font-size:12px;color:#F5F0E8;opacity:0.4;">Auxeira · info@auxeira.com · Johannesburg, South Africa</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
