import { NextRequest, NextResponse } from "next/server";
import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { dynamo } from "@/lib/dynamodb";
import { sendEmail } from "@/lib/mailer";
import { subscribeToForm } from "@/lib/convertkit";
import {
  getScoreBand,
  getTierRecommendation,
  getTopGaps,
  getPrimaryGapLabel,
  type HealthCheckAnswers,
} from "@/lib/healthCheckScoring";

// ── Types ─────────────────────────────────────────────────────────────────────

interface HealthCheckBody {
  answers: HealthCheckAnswers;
  score: number;
  firstName: string;
  lastName?: string;
  orgName: string;
  jobTitle?: string;
  email: string;
  orgUrl?: string;
  orgSize?: string;
}

// ── Manus research task ───────────────────────────────────────────────────────

async function triggerManusResearch(params: {
  submissionId: string;
  orgName: string;
  orgUrl?: string;
  primaryGap: string;
  score: number;
}): Promise<string | null> {
  const endpoint = process.env.MANUS_API_ENDPOINT;
  const apiKey = process.env.MANUS_API_KEY;

  if (!endpoint || endpoint === "your_endpoint" || !apiKey) {
    console.warn("Manus API not configured — skipping research task");
    return null;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        task: `Research the organisation "${params.orgName}" for an Evidence Risk Report.
Website: ${params.orgUrl ?? "unknown"}
Primary evidence gap: ${params.primaryGap}
Evidence Health Score: ${params.score}/100

Provide:
1. Organisation overview (mission, programmes, scale, geography)
2. Current evidence and evaluation landscape
3. Key funders and decision-maker audience
4. Sector competitive context
5. Specific risks related to the primary gap: ${params.primaryGap}
6. 3-year funding risk estimate based on evidence gaps

Return structured JSON with keys: overview, evidence_landscape, funders, sector_context, gap_risks, funding_risk_estimate`,
        metadata: {
          submission_id: params.submissionId,
          webhook_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/webhooks/manus`,
        },
      }),
    });

    if (!res.ok) {
      console.error("Manus API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json() as Record<string, unknown>;
    // Field name confirmed once Manus docs are available
    return (data.task_id ?? data.id ?? data.taskId) as string | null;
  } catch (err) {
    console.error("Manus trigger failed:", err);
    return null;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HealthCheckBody;
    const {
      answers, score,
      firstName, lastName, orgName, jobTitle, email, orgUrl, orgSize,
    } = body;

    if (!email || !answers || !firstName || !orgName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const scoreBand = getScoreBand(score);
    const tierRec = getTierRecommendation(answers);
    const topGaps = getTopGaps(answers);
    const primaryGap = getPrimaryGapLabel(answers);

    // 1. Store submission
    try {
      await dynamo.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
          Item: {
            id,
            timestamp,
            email,
            firstName,
            lastName: lastName ?? "",
            orgName,
            jobTitle: jobTitle ?? "",
            orgUrl: orgUrl ?? "",
            orgSize: orgSize ?? "",
            answers,
            score,
            scoreBand: scoreBand.label,
            tierRecommendation: tierRec.tier,
            topGaps,
            primaryGap,
            manusTaskId: null,
            reportStatus: "pending",
          },
        })
      );
    } catch (dbErr) {
      console.error("DynamoDB write failed:", dbErr);
    }

    // 2. Trigger Manus research (async — result delivered via webhook)
    const manusTaskId = await triggerManusResearch({
      submissionId: id,
      orgName,
      orgUrl,
      primaryGap,
      score,
    });

    if (manusTaskId) {
      try {
        await dynamo.send(
          new UpdateCommand({
            TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
            Key: { id },
            UpdateExpression: "SET manusTaskId = :tid, reportStatus = :s",
            ExpressionAttributeValues: { ":tid": manusTaskId, ":s": "researching" },
          })
        );
      } catch (dbErr) {
        console.error("DynamoDB task_id update failed:", dbErr);
      }
    }

    // 3. ConvertKit subscribe
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
            org_name: orgName,
          },
        });
      }
    } catch (ckErr) {
      console.error("ConvertKit subscribe failed:", ckErr);
    }

    // 4. Acknowledgement email to respondent
    try {
      await sendEmail({
        to: email,
        subject: "Your Auxeira Evidence Risk Report is being prepared",
        html: buildAckEmail({ firstName, orgName, primaryGap, score, scoreBand }),
      });
    } catch (emailErr) {
      console.error("Ack email failed:", emailErr);
    }

    // 5. Internal lead notification
    try {
      const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@auxeira.com";
      await sendEmail({
        to: notifyEmail,
        subject: `New Health Check: ${orgName} — Score ${score}/100`,
        html: buildLeadNotificationEmail({
          email, firstName, lastName, orgName, jobTitle, orgUrl, orgSize,
          score, answers, scoreBand, tierRec, topGaps, primaryGap, manusTaskId,
        }),
      });
    } catch (notifyErr) {
      console.error("Lead notification failed:", notifyErr);
    }

    return NextResponse.json({ success: true, score, id, primaryGap, manusTaskId });
  } catch (err) {
    console.error("Health check API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── Email templates ───────────────────────────────────────────────────────────

function buildAckEmail({
  firstName,
  orgName,
  primaryGap,
  score,
  scoreBand,
}: {
  firstName: string;
  orgName: string;
  primaryGap: string;
  score: number;
  scoreBand: ReturnType<typeof getScoreBand>;
}) {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'DM Sans',Arial,sans-serif;color:#1A1A2A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#0A1628;padding:32px 40px;">
          <p style="margin:0;font-size:22px;font-weight:600;color:#C9A84C;letter-spacing:4px;text-transform:uppercase;">Auxeira</p>
        </td></tr>
        <tr><td style="background:#0A1628;padding:0 40px 40px;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;">Evidence Health Score</p>
          <p style="margin:0;font-size:56px;font-weight:700;color:#C9A84C;line-height:1;">${score}<span style="font-size:20px;color:#F5F0E8;opacity:0.4;">/100</span></p>
          <p style="margin:8px 0 0;font-size:16px;color:#F5F0E8;font-weight:500;">${scoreBand.label}</p>
        </td></tr>
        <tr><td style="background:#ffffff;padding:40px;">
          <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">Hi ${firstName},</p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;opacity:0.8;">
            We're researching <strong>${orgName}</strong> and running your diagnostic through Auxeira's Evidence Intelligence Framework.
            Your full <strong>Entity Evidence Risk Report</strong> will arrive within 2 hours.
          </p>
          <div style="border-left:3px solid #C9A84C;padding:14px 20px;margin:24px 0;background:#F5F0E8;">
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;font-weight:600;">Your primary evidence gap</p>
            <p style="margin:0;font-size:18px;font-weight:600;color:#0A1628;">${primaryGap}</p>
          </div>
          <p style="margin:0 0 12px;font-size:13px;opacity:0.6;">Your full report will include:</p>
          <ul style="margin:0 0 32px;padding-left:20px;">
            ${[
              "Evidence Health Score with sector benchmark",
              "Top 3 risks and estimated funding at risk",
              "3-year counterfactual funding forecast",
              "Recommended Auxeira intervention and tier",
              "Sector competitive landscape analysis",
            ].map(item => `<li style="font-size:13px;line-height:1.8;opacity:0.75;">${item}</li>`).join("")}
          </ul>
          <div style="background:#0A1628;padding:20px 24px;margin-bottom:32px;">
            <p style="margin:0 0 12px;font-size:14px;color:#F5F0E8;opacity:0.7;line-height:1.6;">
              You're at peak clarity about your evidence gaps right now. Book your Evidence Strategy Call while it's fresh.
            </p>
            <a href="${calendlyUrl}" style="display:inline-block;background:#C9A84C;color:#0A1628;padding:12px 24px;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:1px;">
              Book your Evidence Strategy Call →
            </a>
          </div>
          <p style="margin:0;font-size:12px;opacity:0.4;">Can't find the report? Check your spam folder or reply to this email.</p>
        </td></tr>
        <tr><td style="background:#0A1628;padding:24px 40px;">
          <p style="margin:0;font-size:12px;color:#F5F0E8;opacity:0.4;">Auxeira · info@auxeira.com · Johannesburg, South Africa</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildLeadNotificationEmail({
  email, firstName, lastName, orgName, jobTitle, orgUrl, orgSize,
  score, answers, scoreBand, tierRec, topGaps, primaryGap, manusTaskId,
}: {
  email: string;
  firstName: string;
  lastName?: string;
  orgName: string;
  jobTitle?: string;
  orgUrl?: string;
  orgSize?: string;
  score: number;
  answers: HealthCheckAnswers;
  scoreBand: ReturnType<typeof getScoreBand>;
  tierRec: ReturnType<typeof getTierRecommendation>;
  topGaps: string[];
  primaryGap: string;
  manusTaskId: string | null;
}) {
  const answerRows = Object.entries(answers)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;width:100px;">${k}</td><td style="padding:6px 12px;font-size:13px;color:#1A1A2A;border-bottom:1px solid #eee;">${v}</td></tr>`)
    .join("");

  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#1A1A2A;padding:32px;max-width:600px;">
  <h2 style="color:#0A1628;margin-bottom:4px;">New Health Check Submission</h2>
  <p style="color:#C9A84C;font-size:13px;margin-top:0;">${new Date().toISOString()}</p>
  <table style="border-collapse:collapse;width:100%;margin-bottom:24px;">
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;width:140px;">Name</td><td style="padding:6px 12px;font-size:13px;">${firstName} ${lastName ?? ""}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Email</td><td style="padding:6px 12px;font-size:13px;">${email}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Organisation</td><td style="padding:6px 12px;font-size:13px;">${orgName}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Job Title</td><td style="padding:6px 12px;font-size:13px;">${jobTitle ?? "—"}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Website</td><td style="padding:6px 12px;font-size:13px;">${orgUrl ? `<a href="${orgUrl}">${orgUrl}</a>` : "—"}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Org Size</td><td style="padding:6px 12px;font-size:13px;">${orgSize ?? "—"}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Score</td><td style="padding:6px 12px;font-size:13px;font-weight:bold;">${score}/100 — ${scoreBand.label}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Primary Gap</td><td style="padding:6px 12px;font-size:13px;color:#C9A84C;font-weight:bold;">${primaryGap}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Tier Rec.</td><td style="padding:6px 12px;font-size:13px;">${tierRec.label}</td></tr>
    <tr><td style="padding:6px 12px;font-size:13px;color:#666;border-bottom:1px solid #eee;">Manus Task ID</td><td style="padding:6px 12px;font-size:13px;">${manusTaskId ?? "not triggered"}</td></tr>
  </table>
  <p style="font-size:13px;color:#666;">Top gaps: ${topGaps.join(" · ")}</p>
  <h3 style="margin-top:24px;">Full Answers</h3>
  <table style="border-collapse:collapse;width:100%;">
    <thead><tr>
      <th style="text-align:left;padding:6px 12px;background:#f5f5f5;font-size:12px;">Question</th>
      <th style="text-align:left;padding:6px 12px;background:#f5f5f5;font-size:12px;">Answer</th>
    </tr></thead>
    <tbody>${answerRows}</tbody>
  </table>
</body></html>`;
}
