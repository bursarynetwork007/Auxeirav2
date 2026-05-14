import { NextRequest, NextResponse } from "next/server";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import Anthropic from "@anthropic-ai/sdk";
import { dynamo } from "@/lib/dynamodb";
import { sendEmail } from "@/lib/mailer";
import { getScoreBand, getTierRecommendation, type HealthCheckAnswers } from "@/lib/healthCheckScoring";
import { getProjections } from "@/lib/projections";

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
  tierRecommendation: number | string;
  answers?: HealthCheckAnswers;
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

// ── AI insight prompt (mirrors Evidence_Risk_Report.html getAI logic) ─────────

async function getAIInsight(
  score: number,
  scoreBand: string,
  sector: string
): Promise<string> {
  const FALLBACK =
    "Based on sector benchmarks, organisations with similar evidence profiles typically secure an estimated 30–40% less funding than sector leaders with strong economic framing. Closing this evidence gap through Auxeira's synthesis and translation methodology is estimated to unlock 2–3× more decision-maker engagement within 24 months — based on patterns across South Africa's social impact funding landscape.";

  const sectorCtx: Record<string, string> = {
    ecd: "South Africa's ECD sector is undergoing a major funding shift — the Bana Pele commitment puts R10B on the table but requires economic impact evidence, not just child outcome data.",
    health: "Global health funders are tightening evidence requirements. South African health organisations without strong M&E frameworks and economic framing are losing ground.",
    econ: "Economic development funders are moving toward enterprise-level SROI and fiscal multiplier evidence.",
    other: "Social impact funders globally are shifting toward evidence-weighted portfolio allocation.",
  };

  const prompt = `You are Auxeira's Evidence Risk Analyst. Generate a structured competitive landscape insight using EXACTLY this format — three labelled sentences, nothing more:

LANDSCAPE: [One sentence on the sector funding environment — specific to South Africa.]
RISK: [One sentence on what organisations with this score typically lose — based on sector benchmarks.]
OPPORTUNITY: [One sentence on what closing this gap with Auxeira typically unlocks — estimated range.]

Evidence score: ${score}/100 | Band: ${scoreBand} | Sector: ${sector}
Sector context: ${sectorCtx[sector] ?? sectorCtx.other}

HARD RULES — return ONLY "USE_FALLBACK" if you cannot follow every rule:
1. Use ranges not point estimates
2. Every claim labelled "estimated" or "based on sector benchmarks"
3. No legal or financial advice
4. No named competitor organisations
5. No claims about Auxeira's dataset size
6. LANDSCAPE must reference South Africa specifically
7. OPPORTUNITY must reference Auxeira by name
8. Exactly 3 sentences. No preamble. No sign-off.`;

  try {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 160,
      system: "You are a strict evidence risk analyst. Follow all rules exactly or return USE_FALLBACK.",
      messages: [{ role: "user", content: prompt }],
    });
    const text = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("")
      .trim();
    const valid =
      text &&
      !text.includes("USE_FALLBACK") &&
      (text.includes("estimated") || text.includes("based on")) &&
      text.includes("%");
    return valid ? text : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

// ── Report generation ─────────────────────────────────────────────────────────

async function generateReport(
  submission: SubmissionRecord,
  research: ManusResearchResult
): Promise<string> {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://auxeira.com";

  // Derive band and tier from stored data (answers may not be present for older records)
  const band = getScoreBand(submission.score);
  const budget = submission.answers?.q8 ?? "5m-20m";
  const proj = getProjections(budget);
  const tier = submission.answers
    ? getTierRecommendation(submission.answers)
    : { label: `Tier ${submission.tierRecommendation}`, ctaText: "Book a 30-minute Evidence Diagnostic Call →" };

  // Infer sector from org research (best-effort)
  const sector = inferSector(research.sector_context ?? "");

  // Score colour
  const scoreColor =
    submission.score >= 75 ? "#1D9E75" :
    submission.score >= 50 ? "#C9A84C" :
    submission.score >= 25 ? "#D85A30" : "#E24B4A";

  // AI competitive landscape insight
  const aiInsight = await getAIInsight(submission.score, band.label, sector);

  // Top 3 risks from scoring (use topGaps + primaryGap)
  const risks = buildRisks(submission);

  const prompt = `You are Auxeira's Evidence Intelligence system. Generate a concise Entity Evidence Risk Report for ${submission.orgName}.

DIAGNOSTIC DATA:
- Evidence Health Score: ${submission.score}/100 (${band.label})
- Primary Evidence Gap: ${submission.primaryGap}
- Top Gaps: ${(submission.topGaps ?? []).join("; ")}
- Recommended Tier: ${tier.label}

ORGANISATION RESEARCH:
Overview: ${research.overview ?? "Not available"}
Evidence Landscape: ${research.evidence_landscape ?? "Not available"}
Key Funders: ${research.funders ?? "Not available"}
Sector Context: ${research.sector_context ?? "Not available"}
Gap Risks: ${research.gap_risks ?? "Not available"}
Funding Risk Estimate: ${research.funding_risk_estimate ?? "Not available"}

Write exactly 6 sections. Each section: header in ALL CAPS, then 2–3 sentences. No markdown. No filler. Specific to this organisation.
Sections: EXECUTIVE SUMMARY | EVIDENCE HEALTH ASSESSMENT | PRIMARY GAP ANALYSIS | TOP 3 RISKS | 3-YEAR FUNDING RISK FORECAST | RECOMMENDED NEXT STEP`;

  let reportSections = "";

  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });
    reportSections = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n");
  } catch (err) {
    console.error("Claude generation failed:", err);
    reportSections = buildFallbackSections(submission, research);
  }

  return buildReportEmail({
    firstName: submission.firstName,
    orgName: submission.orgName,
    score: submission.score,
    scoreColor,
    band,
    primaryGap: submission.primaryGap,
    proj,
    tier,
    risks,
    aiInsight,
    reportSections,
    calendlyUrl,
    siteUrl,
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function inferSector(sectorContext: string): string {
  const lc = sectorContext.toLowerCase();
  if (lc.includes("ecd") || lc.includes("early childhood") || lc.includes("education")) return "ecd";
  if (lc.includes("health")) return "health";
  if (lc.includes("economic") || lc.includes("enterprise") || lc.includes("livelihoods")) return "econ";
  return "other";
}

function buildRisks(submission: SubmissionRecord): string[] {
  const score = submission.score;
  const gap = submission.primaryGap;

  const base: string[] = [];

  if (gap === "Translation Gap" || gap === "Communication Architecture Gap") {
    base.push("Evidence not converting — strong data exists but decision-makers are not acting on it, likely due to format and framing misalignment.");
  } else if (gap === "Economic Evidence Gap") {
    base.push("No economic or SROI analysis — funders and Treasury require fiscal multiplier evidence that is currently absent from your submissions.");
  } else {
    base.push("Evidence foundation is insufficient — without a structured MEL framework, funding proposals lack the credibility required in competitive rounds.");
  }

  if (score < 50) {
    base.push("Funder deprioritisation — proposals are likely being passed over in competitive rounds for organisations with stronger evidence narratives.");
  } else {
    base.push("Translation gap — evidence is reaching funders but not converting to decisions at the rate the programme quality warrants.");
  }

  base.push("Limited policy influence — policy reach is constrained despite programme delivery because the economic case has not been made at National Treasury or policy level.");

  return base;
}

function buildFallbackSections(
  submission: SubmissionRecord,
  research: ManusResearchResult
): string {
  return `EXECUTIVE SUMMARY
${research.overview ?? `${submission.orgName} completed the Auxeira Evidence Health Check with a score of ${submission.score}/100. The primary gap identified is ${submission.primaryGap}.`}

EVIDENCE HEALTH ASSESSMENT
Score: ${submission.score}/100 — ${submission.scoreBand}. ${research.evidence_landscape ?? "Evidence landscape data not available."}

PRIMARY GAP ANALYSIS
Primary gap: ${submission.primaryGap}. ${research.gap_risks ?? "Gap risk detail not available."}

TOP 3 RISKS
${(submission.topGaps ?? []).join(" ")} ${research.gap_risks ?? ""}

3-YEAR FUNDING RISK FORECAST
${research.funding_risk_estimate ?? "Based on your budget profile and evidence score, significant funding is at risk over the next 36 months without intervention."}

RECOMMENDED NEXT STEP
Book an Evidence Strategy Call to walk through this report and map a specific intervention for ${submission.orgName}.`;
}

// ── Email builder — mirrors Evidence_Risk_Report.html structure ───────────────

function buildReportEmail({
  firstName, orgName, score, scoreColor, band, primaryGap,
  proj, tier, risks, aiInsight, reportSections, calendlyUrl, siteUrl,
}: {
  firstName: string;
  orgName: string;
  score: number;
  scoreColor: string;
  band: ReturnType<typeof getScoreBand>;
  primaryGap: string;
  proj: ReturnType<typeof getProjections>;
  tier: { label: string; ctaText: string };
  risks: string[];
  aiInsight: string;
  reportSections: string;
  calendlyUrl: string;
  siteUrl: string;
}): string {
  // Score bar width (capped at 100%)
  const barWidth = Math.min(100, score);

  // Render report sections as HTML
  const sectionsHtml = reportSections
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t) return "";
      if (/^[A-Z][A-Z\s\-–—]+$/.test(t) || /^\d+\.\s+[A-Z]/.test(t)) {
        return `<p style="margin:20px 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:700;color:#C9A84C;">${t}</p>`;
      }
      return `<p style="margin:0 0 10px;font-size:13px;line-height:1.7;color:#1A1A2A;">${t}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  // Risks rows
  const riskColors = ["#E24B4A", "#D85A30", "#C9A84C"];
  const risksHtml = risks
    .map((r, i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:${i < risks.length - 1 ? "0.5px solid #EEE" : "none"};vertical-align:top;width:28px;">
          <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:${riskColors[i]}22;color:${riskColors[i]};font-size:11px;font-weight:700;text-align:center;line-height:22px;">${i + 1}</span>
        </td>
        <td style="padding:10px 0 10px 10px;border-bottom:${i < risks.length - 1 ? "0.5px solid #EEE" : "none"};font-size:12px;color:#555;line-height:1.6;">${r}</td>
      </tr>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Arial,sans-serif;color:#1A1A2A;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header / Score ring -->
  <tr><td style="background:#0A1628;border-radius:12px 12px 0 0;padding:20px 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:top;">
          <p style="margin:0;font-size:15px;font-weight:700;color:#C9A84C;letter-spacing:.02em;">Auxeira</p>
          <p style="margin:2px 0 0;font-size:7px;color:rgba(201,168,76,.5);letter-spacing:.15em;text-transform:uppercase;">Evidence Intelligence</p>
        </td>
        <td style="text-align:right;vertical-align:top;">
          <p style="margin:0;font-size:9px;color:rgba(245,240,232,.3);letter-spacing:.08em;text-transform:uppercase;">Entity Evidence Risk Report</p>
          <p style="margin:2px 0 0;font-size:9px;color:rgba(245,240,232,.2);">${new Date().toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>
        <td style="width:90px;vertical-align:middle;">
          <table cellpadding="0" cellspacing="0" style="width:84px;height:84px;border-radius:50%;border:3px solid #C9A84C;text-align:center;">
            <tr><td style="vertical-align:middle;padding:0;">
              <p style="margin:0;font-size:26px;font-weight:700;color:#C9A84C;line-height:1;">${score}</p>
              <p style="margin:0;font-size:10px;color:rgba(245,240,232,0.4);">/100</p>
            </td></tr>
          </table>
        </td>
        <td style="padding-left:16px;vertical-align:middle;">
          <span style="display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;background:${scoreColor}22;color:${scoreColor};margin-bottom:6px;">${band.label}</span>
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#F5F0E8;line-height:1.4;">${band.headline}</p>
          <p style="margin:0;font-size:11px;color:rgba(245,240,232,0.5);">${orgName}</p>
        </td>
      </tr>
    </table>
    <!-- Score bar -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr><td style="background:rgba(255,255,255,0.08);border-radius:3px;height:6px;">
        <table cellpadding="0" cellspacing="0" style="width:${barWidth}%;height:6px;">
          <tr><td style="background:${scoreColor};border-radius:3px;height:6px;"></td></tr>
        </table>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
      <tr>
        <td style="font-size:10px;color:rgba(245,240,232,0.2);">Critical (0)</td>
        <td style="text-align:right;font-size:10px;color:rgba(245,240,232,0.2);">Strong (100)</td>
      </tr>
    </table>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="background:#fff;padding:20px 24px 0;">
    <p style="margin:0 0 8px;font-size:14px;line-height:1.6;">Hi ${firstName},</p>
    <p style="margin:0 0 16px;font-size:13px;line-height:1.7;color:#555;">Your <strong>Entity Evidence Risk Report</strong> for <strong>${orgName}</strong> is below — based on your diagnostic answers and independent research into your organisation and sector.</p>
  </td></tr>

  <!-- Key projections -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <p style="margin:0 0 10px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Key projections</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="33%" style="padding-right:6px;vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;border:0.5px solid rgba(226,75,74,0.35);background:rgba(226,75,74,0.05);padding:10px 12px;">
            <tr><td>
              <p style="margin:0 0 4px;font-size:10px;color:#E24B4A;font-weight:700;text-transform:uppercase;">Funding at risk</p>
              <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#1A1A2A;">${proj.fundingAtRisk}</p>
              <p style="margin:0;font-size:11px;color:#666;">annually</p>
            </td></tr>
          </table>
        </td>
        <td width="33%" style="padding:0 3px;vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;border:0.5px solid rgba(216,90,48,0.35);background:rgba(216,90,48,0.05);padding:10px 12px;">
            <tr><td>
              <p style="margin:0 0 4px;font-size:10px;color:#D85A30;font-weight:700;text-transform:uppercase;">Influence gap</p>
              <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#1A1A2A;">${proj.influenceGap}</p>
              <p style="margin:0;font-size:11px;color:#666;">impact not reaching decision-makers</p>
            </td></tr>
          </table>
        </td>
        <td width="33%" style="padding-left:6px;vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:8px;border:0.5px solid rgba(201,168,76,0.4);background:rgba(201,168,76,0.07);padding:10px 12px;">
            <tr><td>
              <p style="margin:0 0 4px;font-size:10px;color:#8B6914;font-weight:700;text-transform:uppercase;">Opportunity cost</p>
              <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#1A1A2A;">${proj.opportunityCost}</p>
              <p style="margin:0;font-size:11px;color:#666;">reachable funding left on the table</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Top 3 risks -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0.5px solid #DDD;border-radius:12px;padding:16px;">
      <tr><td>
        <p style="margin:0 0 10px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Top 3 risks</p>
        <table width="100%" cellpadding="0" cellspacing="0">${risksHtml}</table>
      </td></tr>
    </table>
  </td></tr>

  <!-- AI competitive landscape insight -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF7FF;border:0.5px solid #B5D4F4;border-radius:8px;padding:12px 16px;">
      <tr><td>
        <p style="margin:0 0 6px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#185FA5;">Competitive landscape</p>
        <p style="margin:0;font-size:12px;color:#185FA5;line-height:1.7;">${aiInsight}</p>
        <p style="margin:6px 0 0;font-size:10px;color:#999;font-style:italic;">Based on sector benchmarks. Illustrative — not a guarantee of outcome.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- Full report sections -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0.5px solid #DDD;border-radius:12px;padding:16px;">
      <tr><td>
        <p style="margin:0 0 12px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Full analysis</p>
        ${sectionsHtml}
      </td></tr>
    </table>
  </td></tr>

  <!-- Tier recommendation -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8EE;border:1px solid #C9A84C;border-radius:12px;padding:16px 20px;">
      <tr><td>
        <p style="margin:0 0 4px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Recommended intervention</p>
        <p style="margin:0 0 8px;font-size:15px;font-weight:700;color:#0A1628;">${tier.label}</p>
        <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">${band.description}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="background:#0A1628;padding:24px;">
    <p style="margin:0 0 12px;font-size:13px;color:rgba(245,240,232,0.7);line-height:1.6;">You're at peak clarity about your evidence gaps right now. Book your Evidence Strategy Call while it's fresh — we'll walk through this report and map a specific intervention.</p>
    <a href="${calendlyUrl}" style="display:block;background:#C9A84C;color:#0A1628;padding:13px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;text-align:center;margin-bottom:8px;">${tier.ctaText}</a>
    <a href="${siteUrl}/capability-overview.pdf" style="display:block;background:transparent;color:rgba(245,240,232,0.5);border:0.5px solid rgba(255,255,255,0.2);padding:11px;border-radius:8px;font-size:12px;text-decoration:none;text-align:center;">Download Capability Overview →</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0A1628;border-top:0.5px solid rgba(255,255,255,0.08);border-radius:0 0 12px 12px;padding:16px 24px;">
    <p style="margin:0;font-size:11px;color:rgba(245,240,232,0.3);">Auxeira · info@auxeira.com · auxeira.com · Johannesburg — Global from Africa</p>
    <p style="margin:4px 0 0;font-size:11px;color:rgba(245,240,232,0.2);">This report is confidential and prepared exclusively for ${orgName}.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
