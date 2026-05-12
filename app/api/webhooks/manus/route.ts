import { NextRequest, NextResponse } from "next/server";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Anthropic from "@anthropic-ai/sdk";
import { dynamo } from "@/lib/dynamodb";
import { sendEmail } from "@/lib/mailer";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const TABLE = process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ManusWebhookPayload {
  event_type: string;
  task_detail: {
    task_id: string;
    stop_reason: "finish" | "ask" | string;
    structured_output?: {
      success: boolean;
      value?: ManusResearchResult;
    };
  };
}

interface ManusResearchResult {
  overview?: string;
  evidence_landscape?: string;
  funders?: string;
  sector_context?: string;
  gap_risks?: string;
  funding_risk_estimate?: string;
}

interface SubmissionRecord {
  id: string;
  email: string;
  firstName: string;
  orgName: string;
  score: number;
  scoreBand: string;
  primaryGap: string;
  topGaps: string[];
  tierRecommendation: number;
  manusTaskId?: string;
}

// ── Webhook handler ───────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Optional webhook secret verification
    const secret = process.env.MANUS_WEBHOOK_SECRET;
    if (secret) {
      const sig = req.headers.get("x-manus-signature") ?? req.headers.get("authorization") ?? "";
      if (!sig.includes(secret)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const payload = (await req.json()) as ManusWebhookPayload;
    const { event_type, task_detail } = payload;

    // Only process task completion events
    if (event_type !== "task_stopped") {
      return NextResponse.json({ received: true });
    }

    const { task_id, stop_reason, structured_output } = task_detail;

    // Task needs clarification — log and return; no report generated
    if (stop_reason === "ask") {
      console.warn(`Manus task ${task_id} stopped with stop_reason=ask — needs clarification`);
      await markFailed(task_id, "Manus task stopped: needs clarification");
      return NextResponse.json({ received: true });
    }

    // Task finished but structured output missing or failed
    if (stop_reason !== "finish" || !structured_output?.success || !structured_output.value) {
      console.error(`Manus task ${task_id} finished without usable structured output`, structured_output);
      await markFailed(task_id, `stop_reason=${stop_reason}, structured_output.success=${structured_output?.success}`);
      return NextResponse.json({ received: true });
    }

    const research = structured_output.value;

    // Look up the submission by task_id
    const submission = await getSubmissionByTaskId(task_id);
    if (!submission) {
      console.error("No submission found for Manus task_id:", task_id);
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Mark as processing
    await dynamo.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id: submission.id },
        UpdateExpression: "SET reportStatus = :s",
        ExpressionAttributeValues: { ":s": "processing" },
      })
    );

    // Generate the full report with Claude
    const reportHtml = await generateReport(submission, research);

    // Send the report email
    await sendEmail({
      to: submission.email,
      subject: `Your Auxeira Entity Evidence Risk Report — ${submission.orgName}`,
      html: reportHtml,
    });

    // Mark as sent
    await dynamo.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id: submission.id },
        UpdateExpression: "SET reportStatus = :s, reportSentAt = :t",
        ExpressionAttributeValues: {
          ":s": "sent",
          ":t": new Date().toISOString(),
        },
      })
    );

    // Internal notification
    try {
      const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@auxeira.com";
      await sendEmail({
        to: notifyEmail,
        subject: `Report sent: ${submission.orgName} (${submission.email})`,
        html: `<p>Entity Evidence Risk Report delivered to <strong>${submission.email}</strong> for <strong>${submission.orgName}</strong>.</p><p>Manus task: <code>${task_id}</code></p>`,
      });
    } catch {
      // Non-critical
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Manus webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── DynamoDB helpers ──────────────────────────────────────────────────────────

async function getSubmissionByTaskId(taskId: string): Promise<SubmissionRecord | null> {
  try {
    const result = await dynamo.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: "manusTaskId-index",
        KeyConditionExpression: "manusTaskId = :tid",
        ExpressionAttributeValues: { ":tid": taskId },
        Limit: 1,
      })
    );
    return (result.Items?.[0] as SubmissionRecord) ?? null;
  } catch (err) {
    console.error("DynamoDB GSI lookup failed:", err);
    return null;
  }
}

async function markFailed(taskId: string, reason: string) {
  try {
    // Best-effort — look up by task_id and mark failed
    const submission = await getSubmissionByTaskId(taskId);
    if (!submission) return;
    await dynamo.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id: submission.id },
        UpdateExpression: "SET reportStatus = :s, reportFailReason = :r",
        ExpressionAttributeValues: { ":s": "failed", ":r": reason },
      })
    );
  } catch {
    // Best-effort
  }
}

// ── Claude report generation ──────────────────────────────────────────────────

async function generateReport(
  submission: SubmissionRecord,
  research: ManusResearchResult
): Promise<string> {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";

  const prompt = `You are Auxeira's Evidence Intelligence system. Generate a professional Entity Evidence Risk Report for ${submission.orgName}.

DIAGNOSTIC DATA:
- Evidence Health Score: ${submission.score}/100 (${submission.scoreBand})
- Primary Evidence Gap: ${submission.primaryGap}
- Top Gaps: ${(submission.topGaps ?? []).join("; ")}
- Tier Recommendation: ${submission.tierRecommendation}

ORGANISATION RESEARCH:
Overview: ${research.overview ?? "Not available"}
Evidence Landscape: ${research.evidence_landscape ?? "Not available"}
Key Funders: ${research.funders ?? "Not available"}
Sector Context: ${research.sector_context ?? "Not available"}
Gap Risks: ${research.gap_risks ?? "Not available"}
Funding Risk Estimate: ${research.funding_risk_estimate ?? "Not available"}

Generate a structured report with these sections:
1. EXECUTIVE SUMMARY
2. EVIDENCE HEALTH ASSESSMENT
3. PRIMARY GAP ANALYSIS
4. TOP 3 RISKS
5. 3-YEAR FUNDING RISK FORECAST
6. RECOMMENDED NEXT STEP

Rules: authoritative and specific to this organisation. No filler. No markdown. Section headers in ALL CAPS. Plain text only.`;

  let reportText = "";

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    reportText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");
  } catch (err) {
    console.error("Claude generation failed:", err);
    reportText = buildFallbackReport(submission, research);
  }

  return wrapReportInEmail({
    firstName: submission.firstName,
    orgName: submission.orgName,
    score: submission.score,
    scoreBand: submission.scoreBand,
    primaryGap: submission.primaryGap,
    reportText,
    calendlyUrl,
  });
}

function buildFallbackReport(
  submission: SubmissionRecord,
  research: ManusResearchResult
): string {
  return `ENTITY EVIDENCE RISK REPORT — ${submission.orgName}

Evidence Health Score: ${submission.score}/100 (${submission.scoreBand})
Primary Evidence Gap: ${submission.primaryGap}

ORGANISATION OVERVIEW
${research.overview ?? "Research data not available."}

EVIDENCE LANDSCAPE
${research.evidence_landscape ?? "Not available."}

KEY FUNDERS
${research.funders ?? "Not available."}

SECTOR CONTEXT
${research.sector_context ?? "Not available."}

GAP RISKS
${research.gap_risks ?? "Not available."}

FUNDING RISK ESTIMATE
${research.funding_risk_estimate ?? "Not available."}

RECOMMENDED NEXT STEP
Based on your Evidence Health Score and primary gap (${submission.primaryGap}), we recommend booking an Evidence Strategy Call to discuss a tailored intervention plan.`;
}

function wrapReportInEmail({
  firstName,
  orgName,
  score,
  scoreBand,
  primaryGap,
  reportText,
  calendlyUrl,
}: {
  firstName: string;
  orgName: string;
  score: number;
  scoreBand: string;
  primaryGap: string;
  reportText: string;
  calendlyUrl: string;
}): string {
  const bodyHtml = reportText
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (/^[A-Z][A-Z\s\-–—]+$/.test(trimmed) || /^[0-9]+\.\s+[A-Z]/.test(trimmed)) {
        return `<p style="margin:24px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;font-weight:600;">${trimmed}</p>`;
      }
      return `<p style="margin:0 0 12px;font-size:14px;line-height:1.75;color:#1A1A2A;opacity:0.85;">${trimmed}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'DM Sans',Arial,sans-serif;color:#1A1A2A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#0A1628;padding:32px 40px 0;">
          <p style="margin:0;font-size:22px;font-weight:600;color:#C9A84C;letter-spacing:4px;text-transform:uppercase;">Auxeira</p>
          <p style="margin:8px 0 0;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#F5F0E8;opacity:0.4;">Entity Evidence Risk Report</p>
        </td></tr>
        <tr><td style="background:#0A1628;padding:24px 40px 40px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:32px;">
                <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;">Health Score</p>
                <p style="margin:0;font-size:52px;font-weight:700;color:#C9A84C;line-height:1;">${score}<span style="font-size:18px;color:#F5F0E8;opacity:0.4;">/100</span></p>
                <p style="margin:6px 0 0;font-size:14px;color:#F5F0E8;opacity:0.7;">${scoreBand}</p>
              </td>
              <td style="border-left:1px solid rgba(255,255,255,0.1);padding-left:32px;">
                <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;">Primary Gap</p>
                <p style="margin:0;font-size:20px;font-weight:600;color:#F5F0E8;">${primaryGap}</p>
                <p style="margin:6px 0 0;font-size:13px;color:#F5F0E8;opacity:0.5;">${orgName}</p>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="background:#ffffff;padding:40px;">
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;">Hi ${firstName},</p>
          <p style="margin:0 0 32px;font-size:14px;line-height:1.7;opacity:0.7;">
            Your Entity Evidence Risk Report for <strong>${orgName}</strong> is below. This report is based on your diagnostic answers and independent research into your organisation and sector.
          </p>
          ${bodyHtml}
        </td></tr>
        <tr><td style="background:#0A1628;padding:32px 40px;">
          <p style="margin:0 0 16px;font-size:14px;color:#F5F0E8;opacity:0.7;line-height:1.6;">
            Ready to close your evidence gap? Book your Evidence Strategy Call — we'll walk through this report and map a specific intervention.
          </p>
          <a href="${calendlyUrl}" style="display:inline-block;background:#C9A84C;color:#0A1628;padding:14px 28px;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:1px;">
            Book your Evidence Strategy Call →
          </a>
          <p style="margin:24px 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#C9A84C;opacity:0.7;">Also useful</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://auxeira.com"}/capability-overview.html"
             style="font-size:13px;color:#F5F0E8;opacity:0.5;text-decoration:underline;">
            Download the Auxeira Capability Overview →
          </a>
        </td></tr>
        <tr><td style="background:#0A1628;border-top:1px solid rgba(255,255,255,0.08);padding:20px 40px;">
          <p style="margin:0;font-size:11px;color:#F5F0E8;opacity:0.3;">Auxeira · info@auxeira.com · Johannesburg, South Africa</p>
          <p style="margin:6px 0 0;font-size:11px;color:#F5F0E8;opacity:0.25;">This report is confidential and prepared exclusively for ${orgName}.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
