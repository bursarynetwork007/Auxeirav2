import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { dynamo } from "@/lib/dynamodb";
import { sendEmail } from "@/lib/mailer";
import { subscribeToForm } from "@/lib/convertkit";
import {
  calculateScore,
  calculateRawScore,
  getScoreBand,
  getTierRecommendation,
  getTopGaps,
  getPrimaryGapLabel,
  getQuestionScores,
  type HealthCheckAnswers,
} from "@/lib/healthCheckScoring";
import { normaliseUrl } from "@/lib/normaliseUrl";
import { researchOrganisation, type GrokOrgResearch } from "@/lib/grok";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface HealthCheckBody {
  answers: HealthCheckAnswers;
  firstName: string;
  lastName: string;
  orgName: string;
  email: string;
}

const PERSONAL_DOMAINS = new Set([
  "gmail.com","googlemail.com","yahoo.com","yahoo.co.za","outlook.com",
  "hotmail.com","hotmail.co.za","live.com","icloud.com","me.com","mac.com",
  "protonmail.com","proton.me",
]);

function inferOrgUrl(email: string): string {
  const domain = email.split("@")[1] ?? "";
  if (!domain || PERSONAL_DOMAINS.has(domain.toLowerCase())) return "";
  return normaliseUrl(`https://${domain}`);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HealthCheckBody;
    const { answers, firstName, lastName, orgName, email } = body;

    if (!email || !answers || !firstName || !lastName || !orgName) {
      return NextResponse.json(
        { error: "firstName, lastName, email, orgName and answers are required" },
        { status: 400 }
      );
    }

    const rawScore   = calculateRawScore(answers);
    const score      = calculateScore(answers);
    const scoreBand  = getScoreBand(score);
    const tierRec    = getTierRecommendation(answers);
    const topGaps    = getTopGaps(answers);
    const primaryGap = getPrimaryGapLabel(answers);
    const qScores    = getQuestionScores(answers);
    const orgUrl     = inferOrgUrl(email);

    const id        = uuidv4();
    const timestamp = new Date().toISOString();

    try {
      await dynamo.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
          Item: {
            id, timestamp, email, firstName, lastName, orgName, orgUrl,
            answers, rawScore, score,
            scoreBand: scoreBand.label,
            tierRecommendation: String(tierRec.tier),
            topGaps, primaryGap,
            reportStatus: "pending",
          },
        })
      );
    } catch (dbErr) {
      console.error("[health-check] DynamoDB write failed:", dbErr);
    }

    let research: GrokOrgResearch | null = null;
    try {
      research = await researchOrganisation({
        orgName, orgUrl,
        personFirstName: firstName,
        personLastName:  lastName,
        primaryGap, score,
      });
      console.log("[health-check] Grok research complete. sector:", research.sector_key, "seniority:", research.seniority);
    } catch (grokErr) {
      console.error("[health-check] Grok research failed:", grokErr);
    }

    const reportHtml = await generateReportEmail({
      firstName, lastName, orgName, email,
      score, rawScore, scoreBand, tierRec, topGaps, primaryGap, qScores, answers,
      research,
    });

    try {
      await sendEmail({
        to: email,
        subject: `Your Auxeira Evidence Risk Report — ${orgName}`,
        html: reportHtml,
      });
    } catch (emailErr) {
      console.error("[health-check] Report email failed:", emailErr);
    }

    try {
      const formId = process.env.CONVERTKIT_FORM_ID_CAPABILITY;
      if (formId && formId !== "placeholder") {
        await subscribeToForm({
          formId, email, firstName,
          fields: {
            score: String(score), score_band: scoreBand.label,
            tier_recommendation: String(tierRec.tier),
            top_gap_1: topGaps[0] ?? "", top_gap_2: topGaps[1] ?? "",
            org_name: orgName,
          },
        });
      }
    } catch (ckErr) {
      console.error("[health-check] ConvertKit failed:", ckErr);
    }

    try {
      const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@auxeira.com";
      await sendEmail({
        to: notifyEmail,
        subject: `New Health Check: ${orgName} — Score ${score}/100`,
        html: buildLeadNotificationEmail({
          email, firstName, lastName, orgName,
          score, rawScore, answers, scoreBand, tierRec, topGaps, primaryGap, research,
        }),
      });
    } catch (notifyErr) {
      console.error("[health-check] Lead notification failed:", notifyErr);
    }

    return NextResponse.json({ success: true, score, id, primaryGap });
  } catch (err) {
    console.error("[health-check] API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



// ── Claude system prompt — verbatim from EVIDENCE_HEALTH_CHECK.md ─────────────

const CLAUDE_SYSTEM = `You are a senior evidence intelligence consultant at Auxeira, a Johannesburg-based consultancy.

Your tone is: warm, intelligent, non-salesy, evidence-forward.

Never use exclamation marks.
Never say "I hope this finds you well."
Never use em dashes or long bars.
Never use bullet points in body copy.
Never use bold text mid-paragraph.
Never open with a compliment.
Never use "leverage" as a verb.
Never use "synergies", "touch base", "reaching out", or "circle back."
Never reference AI, Claude, or any technology in visible output. The report reads as if written by a senior human consultant.

Be specific. Be human. Write like a trusted advisor who has read their annual report and thought carefully about their situation before picking up the pen.

Auxeira is at the heart of every insight. Every observation about the sector connects naturally to what Auxeira's methodology does about it. This connection must feel inevitable, not forced.

Write in prose. Full sentences. One idea per paragraph.

PROOF POINT BRIDGE RULE — mandatory:
The SmartStart / Skoll Award proof point is a methodology proof, not a sector comparison. Never imply the subscriber's organisation is comparable to SmartStart. Always bridge via methodology: "The same approach that surfaced X for a South African delivery network applies equally to [their sector] work, where the fiscal multipliers are equally strong and equally unmade."

SURVEILLANCE RULE — mandatory:
Never reveal that Auxeira has researched the subscriber. Never say "we researched you" or "we found" or "we noticed." The personalisation must feel like informed sector intelligence, not like an investigation.`;

// ── Projection data — mirrors Evidence_Risk_Report.html PROJ object ───────────

const PROJ: Record<string, { fund: string; inf: string; opp: string; scale: string; base: number; imp: number }> = {
  "under-5m":   { fund: "R500K–R2M",   inf: "25–40%", opp: "R1–3M over 3 years",    scale: "R5M+",       base: 2,  imp: 6   },
  "5m-20m":     { fund: "R2M–R8M",     inf: "30–45%", opp: "R5–15M over 3 years",   scale: "R15M+",      base: 5,  imp: 18  },
  "20m-100m":   { fund: "R8M–R25M",    inf: "35–50%", opp: "R15–40M over 3 years",  scale: "R40M+",      base: 15, imp: 50  },
  "over-100m":  { fund: "R25M–R80M",   inf: "40–60%", opp: "R50M+ over 3 years",    scale: "Portfolio",  base: 40, imp: 130 },
};

// ── Band data — mirrors Evidence_Risk_Report.html BANDS array ─────────────────

const BAND_META: Record<string, { grade: string; gc: string; gb: string; rl: string; sb: number }> = {
  "Strong foundation":          { grade: "Strong",         gc: "#1D9E75", gb: "rgba(29,158,117,0.12)",  rl: "Low",      sb: 85 },
  "Solid base, significant gap":{ grade: "Moderate",       gc: "#C9A84C", gb: "rgba(201,168,76,0.15)",  rl: "Medium",   sb: 60 },
  "Significant gaps — urgent":  { grade: "Needs attention",gc: "#D85A30", gb: "rgba(216,90,48,0.12)",   rl: "High",     sb: 35 },
  "Critical gaps":              { grade: "Critical",       gc: "#E24B4A", gb: "rgba(226,75,74,0.12)",   rl: "Critical", sb: 15 },
};

// ── Risks — mirrors Evidence_Risk_Report.html RISKS object ───────────────────

const RISKS: Record<string, [string, string, string]> = {
  low: [
    "Translation polish — strong evidence base, but audience-specific framing can be sharpened for higher-value funder conversations.",
    "Economic narrative — the full fiscal return of your programme may not yet be fully quantified or communicated in Treasury language.",
    "Funder language — the gap between evidence quality and funding conversion rate can still be narrowed with targeted translation work.",
  ],
  med: [
    "Partial economic framing — SROI or fiscal impact data exists but is not being maximised in funder conversations or government submissions.",
    "Translation gap — evidence is reaching funders but not converting to decisions at the rate the programme quality warrants.",
    "Sector positioning — the economic infrastructure case for your work has not been made at National Treasury or policy level.",
  ],
  high: [
    "Weak economic framing — likely difficulty securing Treasury allocations or government co-funding without a fiscal multiplier analysis.",
    "Funder deprioritisation — proposals are likely being passed over in competitive rounds for organisations with stronger evidence narratives.",
    "Limited policy influence — policy reach is constrained despite strong programme delivery because the economic case has not been made.",
  ],
};

// ── Sector context — mirrors Evidence_Risk_Report.html CTX object ─────────────

const SECTOR_CTX: Record<string, string> = {
  ecd:    "South Africa's ECD sector is undergoing a major funding shift — the Bana Pele commitment puts R10B on the table but requires economic impact evidence, not just child outcome data. Organisations without fiscal framing are being structurally deprioritised.",
  health: "Global health funders are tightening evidence requirements. South African health organisations without strong M&E frameworks and economic framing are losing ground to those that can demonstrate cost-per-outcome and long-term fiscal savings.",
  econ:   "Economic development funders are moving toward enterprise-level SROI and fiscal multiplier evidence. Organisations without verified economic contribution data face increasing competition for government and DFI co-funding.",
  other:  "Social impact funders globally are shifting toward evidence-weighted portfolio allocation. Organisations without strong evidence communication frameworks are structurally disadvantaged in competitive funding environments.",
};

// ── Sector intelligence insight — mirrors Evidence_Risk_Report.html getAI() ───

const SECTOR_INSIGHT_FALLBACK = "Based on sector benchmarks, organisations with similar evidence profiles typically secure an estimated 30–40% less funding than sector leaders with strong economic framing. Closing this evidence gap through Auxeira's synthesis and translation methodology is estimated to unlock 2–3x more decision-maker engagement within 24 months — based on patterns across South Africa's social impact funding landscape.";

async function getSectorInsight(score: number, bandLabel: string, sectorKey: string): Promise<string> {
  const prompt = `You are Auxeira's Evidence Risk Analyst. Auxeira is a Johannesburg-based evidence intelligence consultancy that translates complex programme data into economic narratives that move funders, government, and boards to act.

Generate a structured sector intelligence insight using EXACTLY this format — three labelled sentences, nothing more:

LANDSCAPE: [One sentence on the sector funding environment — specific to South Africa.]
RISK: [One sentence on what organisations with this score typically lose — based on sector benchmarks.]
OPPORTUNITY: [One sentence on what closing this gap with Auxeira typically unlocks — estimated range.]

Evidence score: ${score}/100 | Band: ${bandLabel} | Sector: ${sectorKey}
Sector context: ${SECTOR_CTX[sectorKey] ?? SECTOR_CTX.other}

HARD RULES — return ONLY "USE_FALLBACK" if you cannot follow every rule:
1. Use ranges not point estimates
2. Every claim labelled "estimated" or "based on sector benchmarks"
3. No legal or financial advice
4. No named competitor organisations
5. No claims about Auxeira's dataset size
6. LANDSCAPE must reference South Africa specifically
7. OPPORTUNITY must reference Auxeira by name
8. Exactly 3 sentences. No preamble. No sign-off.
9. No em dashes. No exclamation marks.`;

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
      .join("").trim();
    const valid = text && !text.includes("USE_FALLBACK") &&
      (text.includes("estimated") || text.includes("based on")) && text.includes("%");
    return valid ? text : SECTOR_INSIGHT_FALLBACK;
  } catch {
    return SECTOR_INSIGHT_FALLBACK;
  }
}

async function generateReportEmail(p: {
  firstName: string; lastName: string; orgName: string; email: string;
  score: number; rawScore: number;
  scoreBand: ReturnType<typeof getScoreBand>;
  tierRec: ReturnType<typeof getTierRecommendation>;
  topGaps: string[]; primaryGap: string;
  qScores: Record<string, number>;
  answers: HealthCheckAnswers;
  research: GrokOrgResearch | null;
}): Promise<string> {
  const { firstName, lastName, orgName, score, rawScore, scoreBand, tierRec,
          topGaps, primaryGap, qScores, answers, research } = p;

  const sectorKey  = research?.sector_key ?? "other";
  const seniority  = research?.seniority  ?? "senior_manager";
  const ceoName    = research?.ceo_name   ?? "";
  const proj       = PROJ[answers.q8] ?? PROJ["5m-20m"];
  const bm         = BAND_META[scoreBand.label] ?? BAND_META["Critical gaps"];
  const riskLevel  = bm.rl === "Low" ? "low" : bm.rl === "Medium" ? "med" : "high";
  const risks      = RISKS[riskLevel];
  const scoreColor = bm.gc;
  const sp         = bm.sb;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";
  const siteUrl     = process.env.NEXT_PUBLIC_SITE_URL ?? "https://auxeira.com";

  // Build per-question answer summary for Claude prompt
  const qLabels: Record<string, string> = {
    q1: "Organisation type", q2: "Primary audience", q3: "Years of data",
    q4: "Last report response", q5: "SROI status", q6: "Biggest challenge",
    q7: "Simplify requests", q8: "Annual budget",
  };
  const answerRows = Object.entries(answers)
    .map(([k, v]) => `${qLabels[k] ?? k}: ${v} — ${qScores[k] ?? 0} points`)
    .join("\n");

  // Claude user prompt — verbatim structure from EVIDENCE_HEALTH_CHECK.md Part B
  const userPrompt = `Generate a complete Entity Evidence Risk Report for this organisation. Use all sections below. Populate every variable with specific, personalised content. Do not use placeholder text or generic observations.

SUBSCRIBER:
First name: ${firstName}
Last name: ${lastName}
Organisation: ${orgName}
Seniority: ${seniority}
CEO name (if submitter is not CEO): ${ceoName || "not identified"}

DIAGNOSTIC ANSWERS AND SCORE:
${answerRows}
Raw score: ${rawScore} / 104
Final score: ${score} / 100
Score band: ${scoreBand.label}
Gap 1: ${topGaps[0] ?? ""}
Gap 2: ${topGaps[1] ?? ""}

GROK RESEARCH PROFILE:
Overview: ${research?.overview ?? "Not available"}
Evidence landscape: ${research?.evidence_landscape ?? "Not available"}
Key funders: ${research?.funders ?? "Not available"}
Sector context: ${research?.sector_context ?? "Not available"}
Gap risks: ${research?.gap_risks ?? "Not available"}
Funding risk estimate: ${research?.funding_risk_estimate ?? "Not available"}

GENERATE EACH SECTION BELOW. Be specific to this organisation throughout. Minimum 2 sentences per section.

SCORE HEADLINE (1 sentence):
What the score tells us about this specific organisation — not a generic statement.

EXECUTIVE SUMMARY (2 sentences):
What they have and what it is not yet doing. Reference their specific evidence profile.

GAP 1 TITLE AND BODY (3-4 sentences):
Name the gap precisely. Explain what it means for this organisation specifically. End with an estimated cost statement.

GAP 2 TITLE AND BODY (3-4 sentences):
Same approach. Different gap, different framing.

SECTOR CONTEXT (4-5 sentences):
The evidence and funding landscape in their specific sector right now. South Africa-specific. One data point minimum.

SCENARIO — DO NOTHING (3 sentences):
What happens to this specific organisation over 3 years if the evidence gaps are not addressed.

SCENARIO — FULL AUXEIRA (3 sentences):
What the organisation looks like after a full ${tierRec.label} engagement. Reference their specific programme or portfolio context.

PROOF POINT BRIDGE (2-3 sentences):
Apply the proof point bridge rule exactly. Bridge via methodology. Reference their specific sector.

RECOMMENDATION BODY (3-4 sentences):
What the recommended engagement would produce for this specific organisation. Make the output concrete, not abstract.

CLOSING QUESTION (1 sentence):
"What would it look like for ${orgName} to enter the next budget cycle with a ready fiscal case for [their specific focus area]?"`;

  let claudeNarrative = "";
  try {
    const msg = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2500,
      system: CLAUDE_SYSTEM,
      messages: [{ role: "user", content: userPrompt }],
    });
    claudeNarrative = msg.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("\n").trim();
  } catch (err) {
    console.error("[health-check] Claude generation failed:", err);
    claudeNarrative = buildFallbackNarrative(p, research);
  }

  // Sector intelligence insight (Claude with guardrails — no AI attribution in output)
  const sectorInsight = await getSectorInsight(score, scoreBand.label, sectorKey);

  // Render narrative sections as HTML paragraphs
  const narrativeHtml = claudeNarrative
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t) return "";
      if (/^[A-Z][A-Z\s\-]+$/.test(t) || /^\d+\.\s+[A-Z]/.test(t)) {
        return `<p style="margin:20px 0 6px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;font-weight:700;color:#C9A84C;">${t}</p>`;
      }
      return `<p style="margin:0 0 10px;font-size:13px;line-height:1.75;color:#1A1A2A;">${t}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  // Forward box — shown when seniority is not executive
  const showForward = seniority !== "executive" && ceoName;
  const forwardBox = showForward
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF7FF;border:0.5px solid #B5D4F4;border-radius:8px;margin-bottom:12px;">
        <tr><td style="padding:10px 14px;font-size:12px;color:#185FA5;line-height:1.6;">
          This report is most relevant to ${orgName}'s executive leadership. If the evidence architecture question is one for your CEO or board, forward this report to ${ceoName} — or reply to this email and we will take it from there.
        </td></tr>
       </table>`
    : "";

  // Recoverable gap figure
  const recoverableGap = Math.round(proj.imp - proj.base * 0.72);

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Auxeira — Entity Evidence Risk Report</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:Arial,sans-serif;color:#1A1A2A;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Navy header: score ring + band -->
  <tr><td style="background:#0A1628;border-radius:12px 12px 0 0;padding:20px 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
      <tr>
        <td><p style="margin:0;font-size:15px;font-weight:700;color:#C9A84C;letter-spacing:.02em;">Auxeira</p>
            <p style="margin:2px 0 0;font-size:7px;color:rgba(201,168,76,.5);letter-spacing:.15em;text-transform:uppercase;">Evidence Intelligence</p></td>
        <td style="text-align:right;">
          <p style="margin:0;font-size:9px;color:rgba(245,240,232,.3);letter-spacing:.08em;text-transform:uppercase;">Entity Evidence Risk Report</p>
          <p style="margin:2px 0 0;font-size:9px;color:rgba(245,240,232,.2);">${new Date().toLocaleDateString("en-ZA",{month:"long",year:"numeric"})}</p>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width:96px;vertical-align:middle;">
          <table cellpadding="0" cellspacing="0" style="width:84px;height:84px;border-radius:50%;border:3px solid #C9A84C;">
            <tr><td style="text-align:center;vertical-align:middle;">
              <p style="margin:0;font-size:26px;font-weight:700;color:#C9A84C;line-height:1;">${score}</p>
              <p style="margin:0;font-size:10px;color:rgba(245,240,232,0.4);">/100</p>
            </td></tr>
          </table>
        </td>
        <td style="padding-left:16px;vertical-align:middle;">
          <span style="display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;background:${bm.gb};color:${scoreColor};margin-bottom:6px;">${bm.grade} &nbsp;·&nbsp; ${bm.rl} risk</span>
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#F5F0E8;line-height:1.4;">${scoreBand.headline}</p>
          <p style="margin:0;font-size:11px;color:rgba(245,240,232,0.5);">${orgName}</p>
        </td>
      </tr>
    </table>
    <!-- Score bar -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr><td style="background:rgba(255,255,255,0.08);border-radius:3px;height:6px;overflow:hidden;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:${score}%;background:${scoreColor};height:6px;border-radius:3px;display:block;"></td>
        </tr></table>
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
    <p style="margin:0 0 16px;font-size:13px;line-height:1.7;color:#555;">Your <strong>Entity Evidence Risk Report</strong> for <strong>${orgName}</strong> is below — based on your diagnostic answers and independent sector research.</p>
    ${forwardBox}
  </td></tr>

  <!-- Key projections -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <p style="margin:0 0 10px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Key projections</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="33%" style="padding-right:4px;vertical-align:top;">
          <table width="100%" cellpadding="8" cellspacing="0" style="border-radius:8px;border:0.5px solid rgba(226,75,74,0.35);background:rgba(226,75,74,0.05);">
            <tr><td>
              <p style="margin:0 0 4px;font-size:10px;color:#E24B4A;font-weight:700;text-transform:uppercase;">Funding at risk</p>
              <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#1A1A2A;">${proj.fund}</p>
              <p style="margin:0;font-size:11px;color:#666;">annually</p>
            </td></tr>
          </table>
        </td>
        <td width="33%" style="padding:0 2px;vertical-align:top;">
          <table width="100%" cellpadding="8" cellspacing="0" style="border-radius:8px;border:0.5px solid rgba(216,90,48,0.35);background:rgba(216,90,48,0.05);">
            <tr><td>
              <p style="margin:0 0 4px;font-size:10px;color:#D85A30;font-weight:700;text-transform:uppercase;">Influence gap</p>
              <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#1A1A2A;">${proj.inf}</p>
              <p style="margin:0;font-size:11px;color:#666;">impact not reaching decision-makers</p>
            </td></tr>
          </table>
        </td>
        <td width="33%" style="padding-left:4px;vertical-align:top;">
          <table width="100%" cellpadding="8" cellspacing="0" style="border-radius:8px;border:0.5px solid rgba(201,168,76,0.4);background:rgba(201,168,76,0.07);">
            <tr><td>
              <p style="margin:0 0 4px;font-size:10px;color:#8B6914;font-weight:700;text-transform:uppercase;">Opportunity cost</p>
              <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#1A1A2A;">${proj.opp}</p>
              <p style="margin:0;font-size:11px;color:#666;">reachable funding left on the table</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Funding stability stats (no chart in email — static figures) -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0.5px solid #DDD;border-radius:12px;padding:16px;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Funding stability analysis — 36 months</p>
        <p style="margin:0 0 12px;font-size:12px;color:#555;line-height:1.6;">Estimated probability of maintaining current funding levels over 36 months — comparing your current evidence trajectory against a scenario where the identified gaps are addressed. Based on actuarially-informed scenario modelling using South African sector funding benchmarks.</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="50%" style="padding-right:6px;">
              <table width="100%" cellpadding="10" cellspacing="0" style="background:#F5F5F5;border-radius:8px;text-align:center;">
                <tr><td>
                  <p style="margin:0 0 3px;font-size:10px;color:#999;">Current path — 36-month estimate</p>
                  <p style="margin:0;font-size:22px;font-weight:700;color:#E24B4A;">~${sp}%</p>
                  <p style="margin:0;font-size:10px;color:#999;">funding stability probability</p>
                </td></tr>
              </table>
            </td>
            <td width="50%" style="padding-left:6px;">
              <table width="100%" cellpadding="10" cellspacing="0" style="background:#F5F5F5;border-radius:8px;text-align:center;">
                <tr><td>
                  <p style="margin:0 0 3px;font-size:10px;color:#999;">With evidence improvement</p>
                  <p style="margin:0;font-size:22px;font-weight:700;color:#1D9E75;">~${Math.min(93, sp + 25)}%</p>
                  <p style="margin:0;font-size:10px;color:#999;">estimated probability</p>
                </td></tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin:8px 0 0;font-size:10px;color:#999;font-style:italic;">Based on actuarially-informed scenario modelling using sector-level funding patterns. Illustrative — not a guarantee of outcome.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- Counterfactual recoverable gap -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0.5px solid #DDD;border-radius:12px;padding:16px;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Counterfactual — 3-year funding divergence</p>
        <p style="margin:0 0 12px;font-size:12px;color:#555;line-height:1.6;">Estimated cumulative funding secured over three years — comparing a trajectory without evidence improvement against one with a full Auxeira engagement. Based on sector funding benchmarks for your budget profile.</p>
        <table width="100%" cellpadding="10" cellspacing="0" style="background:#F0F9F4;border-radius:8px;">
          <tr>
            <td><p style="margin:0 0 2px;font-size:10px;color:#999;">Estimated 3-year recoverable gap</p>
                <p style="margin:0;font-size:20px;font-weight:700;color:#1D9E75;">R${recoverableGap}M+</p></td>
            <td style="text-align:right;font-size:11px;color:#1D9E75;font-weight:700;">with evidence<br>improvement</td>
          </tr>
        </table>
        <p style="margin:8px 0 0;font-size:10px;color:#999;font-style:italic;">All figures estimated and illustrative. Based on sector funding benchmarks. Not a specific financial forecast.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- Top 3 risks -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0.5px solid #DDD;border-radius:12px;padding:16px;">
      <tr><td>
        <p style="margin:0 0 10px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Top 3 risks</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:28px;vertical-align:top;padding:10px 0;border-bottom:0.5px solid #EEE;">
              <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:rgba(226,75,74,0.12);color:#E24B4A;font-size:11px;font-weight:700;text-align:center;line-height:22px;">1</span>
            </td>
            <td style="padding:10px 0 10px 10px;border-bottom:0.5px solid #EEE;font-size:12px;color:#555;line-height:1.6;">${risks[0]}</td>
          </tr>
          <tr>
            <td style="width:28px;vertical-align:top;padding:10px 0;border-bottom:0.5px solid #EEE;">
              <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:rgba(216,90,48,0.12);color:#D85A30;font-size:11px;font-weight:700;text-align:center;line-height:22px;">2</span>
            </td>
            <td style="padding:10px 0 10px 10px;border-bottom:0.5px solid #EEE;font-size:12px;color:#555;line-height:1.6;">${risks[1]}</td>
          </tr>
          <tr>
            <td style="width:28px;vertical-align:top;padding:10px 0;">
              <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:rgba(201,168,76,0.12);color:#C9A84C;font-size:11px;font-weight:700;text-align:center;line-height:22px;">3</span>
            </td>
            <td style="padding:10px 0 10px 10px;font-size:12px;color:#555;line-height:1.6;">${risks[2]}</td>
          </tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- Sector intelligence insight (no AI attribution) -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0.5px solid #DDD;border-radius:12px;padding:16px;">
      <tr><td>
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Sector intelligence</p>
        <p style="margin:0 0 6px;font-size:12px;color:#555;line-height:1.7;">${sectorInsight}</p>
        <p style="margin:0;font-size:10px;color:#999;font-style:italic;">Based on sector benchmarks. Illustrative — not a guarantee of outcome.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- Claude narrative -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:0.5px solid #DDD;border-radius:12px;padding:16px;">
      <tr><td>${narrativeHtml}</td></tr>
    </table>
  </td></tr>

  <!-- Tier recommendation -->
  <tr><td style="background:#fff;padding:0 24px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF8EE;border:1px solid #C9A84C;border-radius:12px;padding:16px 20px;">
      <tr><td>
        <p style="margin:0 0 4px;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:#C9A84C;">Recommended intervention</p>
        <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#0A1628;">${tierRec.label}</p>
        <p style="margin:0 0 4px;font-size:12px;color:#555;">${scoreBand.priceRange} &nbsp;·&nbsp; ${scoreBand.timeline}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- CTA -->
  <tr><td style="background:#0A1628;padding:24px;">
    <p style="margin:0 0 12px;font-size:13px;color:rgba(245,240,232,0.7);line-height:1.6;">You are at peak clarity about your evidence gaps right now. Book your Evidence Strategy Call while it is fresh — we will walk through this report and map a specific intervention.</p>
    <a href="${calendlyUrl}" style="display:block;background:#C9A84C;color:#0A1628;padding:13px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;text-align:center;margin-bottom:8px;">${scoreBand.ctaVariant === "urgent" ? "Talk to us today — book your Evidence Strategy Call" : "Book your Evidence Strategy Call"} →</a>
    <a href="${siteUrl}/capability-overview.pdf" style="display:block;background:transparent;color:rgba(245,240,232,0.5);border:0.5px solid rgba(255,255,255,0.2);padding:11px;border-radius:8px;font-size:12px;text-decoration:none;text-align:center;">Download Capability Overview →</a>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#0A1628;border-top:0.5px solid rgba(255,255,255,0.08);border-radius:0 0 12px 12px;padding:16px 24px;">
    <p style="margin:0;font-size:11px;color:rgba(245,240,232,0.3);">Auxeira &nbsp;·&nbsp; info@auxeira.com &nbsp;·&nbsp; auxeira.com<br>Johannesburg — Global from Africa</p>
    <p style="margin:4px 0 0;font-size:11px;color:rgba(245,240,232,0.2);">This report is confidential and prepared exclusively for ${orgName}.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildFallbackNarrative(
  p: { orgName: string; score: number; primaryGap: string; topGaps: string[] },
  research: GrokOrgResearch | null
): string {
  return `EXECUTIVE SUMMARY
${research?.overview ?? `${p.orgName} completed the Auxeira Evidence Health Check with a score of ${p.score}/100.`} The primary gap identified is ${p.primaryGap}.

EVIDENCE HEALTH ASSESSMENT
Score: ${p.score}/100. ${research?.evidence_landscape ?? "Evidence landscape data not available from public sources."}

PRIMARY GAP ANALYSIS
${research?.gap_risks ?? `The primary gap (${p.primaryGap}) is likely limiting funding and policy traction.`}

SECTOR CONTEXT
${research?.sector_context ?? "Sector context not available."}

SCENARIO — DO NOTHING
Without addressing the identified evidence gaps, ${p.orgName} faces increasing difficulty in competitive funding rounds over the next 36 months. The gap between evidence quality and decision-maker action will widen as sector benchmarks rise. Funding stability probability declines without intervention.

SCENARIO — FULL AUXEIRA
A full engagement would produce a translated evidence suite calibrated to ${p.orgName}'s primary audience. The economic contribution of the programme would be quantified and communicated in the language funders and government require. The result is a measurable improvement in funding conversion and policy traction within 12 months.

PROOF POINT BRIDGE
The same approach that surfaced the economic contribution of a South African delivery network applies equally to this sector, where the fiscal multipliers are equally strong and equally unmade. Auxeira's methodology translates programme evidence into the economic narrative that moves decisions.

RECOMMENDATION BODY
${research?.funding_risk_estimate ?? "Based on your budget profile and evidence score, significant funding is at risk over the next 36 months without intervention."} A structured engagement would close the identified gaps and position ${p.orgName} for the next funding cycle with a ready fiscal case.

CLOSING QUESTION
What would it look like for ${p.orgName} to enter the next budget cycle with a ready fiscal case for their core programme work?`;
}

function buildLeadNotificationEmail(p: {
  email: string; firstName: string; lastName: string; orgName: string;
  score: number; rawScore: number;
  answers: HealthCheckAnswers;
  scoreBand: ReturnType<typeof getScoreBand>;
  tierRec: ReturnType<typeof getTierRecommendation>;
  topGaps: string[]; primaryGap: string;
  research: GrokOrgResearch | null;
}): string {
  const { email, firstName, lastName, orgName, score, rawScore,
          answers, scoreBand, tierRec, topGaps, primaryGap, research } = p;

  const answerRows = Object.entries(answers)
    .map(([k, v]) => `<tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;width:120px;">${k}</td><td style="padding:5px 10px;font-size:12px;color:#1A1A2A;border-bottom:1px solid #eee;">${v}</td></tr>`)
    .join("");

  return `<!DOCTYPE html>
<html><body style="font-family:Arial,sans-serif;color:#1A1A2A;padding:32px;max-width:600px;">
  <h2 style="color:#0A1628;margin-bottom:4px;">New Health Check Submission</h2>
  <p style="color:#C9A84C;font-size:13px;margin-top:0;">${new Date().toISOString()}</p>
  <table style="border-collapse:collapse;width:100%;margin-bottom:24px;">
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;width:140px;">Name</td><td style="padding:5px 10px;font-size:12px;">${firstName} ${lastName}</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">Email</td><td style="padding:5px 10px;font-size:12px;">${email}</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">Organisation</td><td style="padding:5px 10px;font-size:12px;">${orgName}</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">Raw score</td><td style="padding:5px 10px;font-size:12px;">${rawScore} / 104</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">Final score</td><td style="padding:5px 10px;font-size:12px;font-weight:bold;">${score} / 100 — ${scoreBand.label}</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">Primary gap</td><td style="padding:5px 10px;font-size:12px;color:#C9A84C;font-weight:bold;">${primaryGap}</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">Tier rec.</td><td style="padding:5px 10px;font-size:12px;">${tierRec.label}</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">Seniority</td><td style="padding:5px 10px;font-size:12px;">${research?.seniority ?? "unknown"}</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">CEO name</td><td style="padding:5px 10px;font-size:12px;">${research?.ceo_name || "not found"}</td></tr>
    <tr><td style="padding:5px 10px;font-size:12px;color:#666;border-bottom:1px solid #eee;">Sector</td><td style="padding:5px 10px;font-size:12px;">${research?.sector_key ?? "unknown"}</td></tr>
  </table>
  <p style="font-size:12px;color:#666;">Top gaps: ${topGaps.join(" &nbsp;·&nbsp; ")}</p>
  ${research ? `<h3 style="margin-top:20px;font-size:13px;color:#0A1628;">Grok Research Profile</h3>
  <p style="font-size:12px;color:#555;line-height:1.6;"><strong>Overview:</strong> ${research.overview}</p>
  <p style="font-size:12px;color:#555;line-height:1.6;"><strong>Evidence landscape:</strong> ${research.evidence_landscape}</p>
  <p style="font-size:12px;color:#555;line-height:1.6;"><strong>Funders:</strong> ${research.funders}</p>
  <p style="font-size:12px;color:#555;line-height:1.6;"><strong>Sector context:</strong> ${research.sector_context}</p>
  <p style="font-size:12px;color:#555;line-height:1.6;"><strong>Gap risks:</strong> ${research.gap_risks}</p>
  <p style="font-size:12px;color:#555;line-height:1.6;"><strong>Funding risk estimate:</strong> ${research.funding_risk_estimate}</p>` : "<p style='font-size:12px;color:#999;'>Grok research not available.</p>"}
  <h3 style="margin-top:20px;font-size:13px;color:#0A1628;">Full Answers</h3>
  <table style="border-collapse:collapse;width:100%;">
    <thead><tr>
      <th style="text-align:left;padding:5px 10px;background:#f5f5f5;font-size:11px;">Question</th>
      <th style="text-align:left;padding:5px 10px;background:#f5f5f5;font-size:11px;">Answer</th>
    </tr></thead>
    <tbody>${answerRows}</tbody>
  </table>
</body></html>`;
}
