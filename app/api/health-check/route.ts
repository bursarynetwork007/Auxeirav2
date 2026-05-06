import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { dynamo } from "@/lib/dynamodb";
import { sendEmail } from "@/lib/mailer";
import { subscribeToForm } from "@/lib/convertkit";
import {
  calculateScore,
  getScoreBand,
  getTierRecommendation,
  getTopGaps,
  type HealthCheckAnswers,
} from "@/lib/healthCheckScoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, score, firstName, email } = body as {
      answers: HealthCheckAnswers;
      score: number;
      firstName?: string;
      email: string;
    };

    if (!email || !answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const scoreBand = getScoreBand(score);
    const tierRec = getTierRecommendation(answers);
    const topGaps = getTopGaps(answers);

    // 1. Store in DynamoDB
    try {
      await dynamo.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
          Item: {
            id,
            timestamp,
            email,
            firstName: firstName ?? "",
            answers,
            score,
            scoreBand: scoreBand.label,
            tierRecommendation: tierRec.tier,
            topGaps,
          },
        })
      );
    } catch (dbErr) {
      console.error("DynamoDB write failed:", dbErr);
      // Continue, don't block the user
    }

    // 2. Subscribe to ConvertKit (health-check form)
    try {
      const formId = process.env.CONVERTKIT_FORM_ID_CAPABILITY;
      if (formId && formId !== "placeholder") {
        await subscribeToForm({
          formId,
          email,
          firstName,
          fields: {
            score: String(score),
            score_band: scoreBand.label,
            tier_recommendation: String(tierRec.tier),
            top_gap_1: topGaps[0] ?? "",
            top_gap_2: topGaps[1] ?? "",
          },
        });
      }
    } catch (ckErr) {
      console.error("ConvertKit subscribe failed:", ckErr);
    }

    // 3. Send results email to respondent via SES
    try {
      const resultsHtml = buildResultsEmail({
        firstName,
        score,
        scoreBand,
        tierRec,
        topGaps,
      });
      await sendEmail({
        to: email,
        subject: `Your Auxeira Evidence Health Check, Score: ${score}/100`,
        html: resultsHtml,
      });
    } catch (sesErr) {
      console.error("SES results email failed:", sesErr);
    }

    // 4. Notify Auxeira internally
    try {
      const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@auxeira.com";
      await sendEmail({
        to: notifyEmail,
        subject: `New Health Check Lead, Score ${score}/100, ${email}`,
        html: buildLeadNotificationEmail({ email, firstName, score, answers, scoreBand, tierRec, topGaps }),
      });
    } catch (notifyErr) {
      console.error("Lead notification email failed:", notifyErr);
    }

    return NextResponse.json({ success: true, score, id });
  } catch (err) {
    console.error("Health check API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────

function buildResultsEmail({
  firstName,
  score,
  scoreBand,
  tierRec,
  topGaps,
}: {
  firstName?: string;
  score: number;
  scoreBand: ReturnType<typeof getScoreBand>;
  tierRec: ReturnType<typeof getTierRecommendation>;
  topGaps: string[];
}) {
  const name = firstName ? `, ${firstName}` : "";
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'DM Sans',Arial,sans-serif;color:#1A1A2A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:#0A1628;padding:32px 40px;">
          <p style="margin:0;font-size:22px;font-weight:600;color:#C9A84C;letter-spacing:4px;text-transform:uppercase;">Auxeira</p>
        </td></tr>
        <!-- Score -->
        <tr><td style="background:#0A1628;padding:0 40px 40px;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;">Your Evidence Health Score</p>
          <p style="margin:0;font-size:64px;font-weight:700;color:#C9A84C;line-height:1;">${score}<span style="font-size:24px;color:#F5F0E8;opacity:0.4;">/100</span></p>
          <p style="margin:8px 0 0;font-size:18px;color:#F5F0E8;font-weight:500;">${scoreBand.label}</p>
          <p style="margin:4px 0 0;font-size:14px;color:#F5F0E8;opacity:0.6;">${scoreBand.description}</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="background:#ffffff;padding:40px;">
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#1A1A2A;">Hi${name},</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#1A1A2A;opacity:0.8;">Here is your full Evidence Impact Report, your score, your two biggest gaps, and a recommended next step.</p>

          ${topGaps.length > 0 ? `
          <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;font-weight:600;">Your Two Biggest Gaps</p>
          ${topGaps.map(gap => `
          <div style="border:1px solid #C9A84C;border-left:3px solid #C9A84C;padding:14px 16px;margin-bottom:10px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#1A1A2A;">${gap}</p>
          </div>`).join("")}
          <br>` : ""}

          <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;font-weight:600;">Recommended Starting Point</p>
          <div style="background:#0A1628;padding:20px 24px;margin-bottom:32px;">
            <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#F5F0E8;">${tierRec.label}</p>
            <p style="margin:0;font-size:13px;color:#F5F0E8;opacity:0.6;">${tierRec.description}</p>
          </div>

          <a href="${calendlyUrl}" style="display:inline-block;background:#C9A84C;color:#0A1628;padding:14px 28px;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:1px;">${scoreBand.ctaText}</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#0A1628;padding:24px 40px;">
          <p style="margin:0;font-size:12px;color:#F5F0E8;opacity:0.4;">Auxeira · info@auxeira.com · Johannesburg, South Africa</p>
          <p style="margin:8px 0 0;font-size:11px;color:#F5F0E8;opacity:0.3;">You received this because you completed the Auxeira Evidence Health Check. <a href="#" style="color:#C9A84C;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildLeadNotificationEmail({
  email,
  firstName,
  score,
  answers,
  scoreBand,
  tierRec,
  topGaps,
}: {
  email: string;
  firstName?: string;
  score: number;
  answers: HealthCheckAnswers;
  scoreBand: ReturnType<typeof getScoreBand>;
  tierRec: ReturnType<typeof getTierRecommendation>;
  topGaps: string[];
}) {
  const answerRows = Object.entries(answers)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">${k}</td><td style="padding:6px 12px;font-size:13px;color:#1A1A2A;border-bottom:1px solid #eee;">${v}</td></tr>`)
    .join("");

  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#1A1A2A;padding:32px;">
  <h2 style="color:#0A1628;">New Health Check Lead</h2>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Name:</strong> ${firstName ?? ","}</p>
  <p><strong>Score:</strong> ${score}/100, ${scoreBand.label}</p>
  <p><strong>Tier Recommendation:</strong> ${tierRec.label}</p>
  <p><strong>Top Gaps:</strong></p>
  <ul>${topGaps.map(g => `<li>${g}</li>`).join("")}</ul>
  <h3>Full Answers</h3>
  <table style="border-collapse:collapse;width:100%;max-width:500px;">
    <thead><tr><th style="text-align:left;padding:6px 12px;background:#f5f5f5;">Question</th><th style="text-align:left;padding:6px 12px;background:#f5f5f5;">Answer</th></tr></thead>
    <tbody>${answerRows}</tbody>
  </table>
</body></html>`;
}
