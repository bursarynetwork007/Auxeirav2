import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from "uuid";
import { readFileSync } from "fs";
import { join } from "path";
import { dynamo } from "@/lib/dynamodb";
import { sendEmail } from "@/lib/mailer";
import { normaliseUrl } from "@/lib/normaliseUrl";
import { getEnv } from "@/lib/config";
import { researchOrganisation, type GrokOrgResearch } from "@/lib/grok";
import Anthropic from "@anthropic-ai/sdk";

const sns = new SNSClient({ region: "us-east-1" });
const SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:615608124862:auxeira-health-check-pipeline";
import {
  calculateScore,
  calculateRawScore,
  getScoreBand,
  getERC,
  getTierRecommendation,
  getTopGaps,
  getPrimaryGapLabel,
  getQuestionScores,
  getOrgType,
  showPilotDiagnostic,
  getPrimaryAudienceLabel,
  getSectorAverage,
  getAnswerText,
  type HealthCheckAnswers,
  type OrgType,
} from "@/lib/healthCheckScoring";

// ── Types ────────────────────────────────────────────────────────────────────

// Ona webhook sends 0-based integer indices for each answer
interface OnaWebhookBody {
  // Contact fields
  first_name: string;
  last_name: string;
  email: string;
  org_name: string;
  org_website?: string; // optional — shown only for personal email domains

  // Answer indices (0-based integers)
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
}

// All 18 Claude-generated report variables
interface ReportVars {
  // Section 2
  score_headline: string;
  // Section 3
  funding_at_risk: string;
  influence_gap: string;
  opportunity_cost: string;
  // Section 4
  gap1_title: string;
  gap1_q_ref: string;
  gap1_body: string;
  gap1_cost: string;
  gap2_title: string;
  gap2_q_ref: string;
  gap2_body: string;
  gap2_cost: string;
  // Section 5
  sector_context: string;
  sector_metric1_num: string;
  sector_metric1_desc: string;
  sector_metric2_num: string;
  sector_metric2_desc: string;
  sector_metric3_num: string;
  sector_metric3_desc: string;
  // Section 6
  scenario_nothing: string;
  scenario_partial: string;
  scenario_full: string;
  recovery_value: string;
  // Section 7
  risk1_title: string;
  risk1_body: string;
  risk2_title: string;
  risk2_body: string;
  risk3_title: string;
  risk3_body: string;
  // Section 8 — Market loss
  market_loss_leading_question: string;
  leverage_now: string;
  leverage_48m: string;
  tipping_month: string;
  cumulative_loss: string;
  sector_position_now: string;
  sector_position_48m: string;
  loss_year1: string;
  loss_year2: string;
  loss_year3: string;
  loss_year4: string;
  // Section 9 — Value identity
  value_identity_leading_question: string;
  value1_label: string;
  value1_metric: string;
  value1_now: string;
  value1_48m: string;
  value1_pct_decline: string;
  value2_label: string;
  value2_metric: string;
  value2_now: string;
  value2_48m: string;
  value2_pct_decline: string;
  policy_windows: string;
  policy_expected_b: string;
  policy_expected_a: string;
  policy_gap: string;
  policy_value_low: string;
  policy_value_high: string;
  compound_b_pct: string;
  compound_a_pct: string;
  stakeholder_count: string;
  stakeholder_now_pct: string;
  stakeholder_48m_pct: string;
  stakeholder_rows_html: string; // rendered HTML rows for email template
  policy_windows_html: string;   // rendered HTML rows for email template
  // Section 10
  market_context_body: string;
  mkt_metric1_num: string;
  mkt_metric1_desc: string;
  mkt_metric2_num: string;
  mkt_metric2_desc: string;
  mkt_metric3_num: string;
  mkt_metric3_desc: string;
  // Section 11
  intel_landscape: string;
  intel_risk: string;
  intel_opportunity: string;
  // Section 12
  proof_bridge: string;
  // Section 13
  tier_label: string;
  urgency_label: string;
  rec_body: string;
  closing_question: string;
  tier_price: string;
  tier_timeline: string;
  pilot_diagnostic_text: string; // empty for delivery orgs
  // Section 14 (conditional)
  ceo_name: string;
  programme_name: string;
  primary_audience_label: string;
  forward_box_html: string; // empty if seniority == executive
}

// ── Constants ────────────────────────────────────────────────────────────────

const PERSONAL_DOMAINS = new Set([
  "gmail.com","googlemail.com","yahoo.com","yahoo.co.za","outlook.com",
  "hotmail.com","hotmail.co.za","live.com","icloud.com","me.com","mac.com",
  "protonmail.com","proton.me",
]);

function inferOrgUrl(email: string, explicitUrl?: string): string {
  if (explicitUrl) return normaliseUrl(explicitUrl);
  const domain = email.split("@")[1] ?? "";
  if (!domain || PERSONAL_DOMAINS.has(domain.toLowerCase())) return "";
  return normaliseUrl(`https://${domain}`);
}

// ── Sanitiser ────────────────────────────────────────────────────────────────

function sanitiseAIOutput(text: string): string {
  return text
    .replace(/\s*—\s*/g, " - ")          // em dash -> hyphen
    .replace(/–/g, "-")                   // en dash -> hyphen
    .replace(/!/g, ".")                   // exclamation -> period
    .replace(/\bleverage\b/gi, "use")
    .replace(/\bsynergies\b/gi, "shared strengths")
    .replace(/\btouch base\b/gi, "connect")
    .replace(/\breaching out\b/gi, "writing")
    .replace(/\bcircle back\b/gi, "follow up")
    .replace(/\bI hope this finds you well\b/gi, "")
    .replace(/\bAs an AI\b/gi, "")
    .replace(/\bAs a language model\b/gi, "")
    .replace(/\bClaude\b/g, "")
    .replace(/\bAnthropic\b/g, "")
    .trim();
}

// ── Ona field name normaliser ─────────────────────────────────────────────────
// Ona auto-generates XLSForm names from question label text when the name
// column is not set explicitly. This shim maps every known auto-generated
// variant to the canonical field names the route expects.
// Add new variants here if Ona produces different slugs.

const ONA_FIELD_MAP: Record<string, string> = {
  // Contact fields — common Ona auto-generated variants
  "first_name":                                    "first_name",
  "firstname":                                     "first_name",
  "your_first_name":                               "first_name",
  "whats_your_first_name":                         "first_name",
  "last_name":                                     "last_name",
  "lastname":                                      "last_name",
  "your_last_name":                                "last_name",
  "whats_your_last_name":                          "last_name",
  "email":                                         "email",
  "email_address":                                 "email",
  "your_email":                                    "email",
  "your_email_address":                            "email",
  "work_email":                                    "email",
  "work_email_address":                            "email",
  "org_name":                                      "org_name",
  "organisation_name":                             "org_name",
  "organization_name":                             "org_name",
  "your_organisation":                             "org_name",
  "your_organization":                             "org_name",
  "name_of_your_organisation":                     "org_name",
  "name_of_your_organization":                     "org_name",
  "org_website":                                   "org_website",
  "organisation_website":                          "org_website",
  "website":                                       "org_website",
  "your_website":                                  "org_website",

  // Q1 — organisation type
  "q1":                                            "q1",
  "which_best_describes_your_organisation":        "q1",
  "which_best_describes_your_organization":        "q1",
  "organisation_type":                             "q1",
  "organization_type":                             "q1",
  "type_of_organisation":                          "q1",

  // Q2 — primary audience
  "q2":                                            "q2",
  "who_are_your_primary_decision_making_audience": "q2",
  "primary_decision_making_audience":              "q2",
  "primary_audience":                              "q2",
  "who_do_you_primarily_report_to":                "q2",

  // Q3 — years of data
  "q3":                                            "q3",
  "how_many_years_of_evaluation_data":             "q3",
  "years_of_evaluation_data":                      "q3",
  "years_of_programme_data":                       "q3",
  "how_many_years_of_programme_data":              "q3",

  // Q4 — last report response
  "q4":                                            "q4",
  "what_happened_when_you_last_shared_a_report":   "q4",
  "last_report_response":                          "q4",
  "when_you_last_shared_a_report":                 "q4",

  // Q5 — SROI status
  "q5":                                            "q5",
  "do_you_have_an_sroi_or_economic_analysis":      "q5",
  "sroi_status":                                   "q5",
  "economic_analysis_status":                      "q5",
  "sroi_or_economic_analysis":                     "q5",

  // Q6 — biggest challenge
  "q6":                                            "q6",
  "what_is_your_biggest_evidence_challenge":       "q6",
  "biggest_evidence_challenge":                    "q6",
  "biggest_challenge":                             "q6",

  // Q7 — simplify requests
  "q7":                                            "q7",
  "how_often_are_you_asked_to_simplify_reports":   "q7",
  "simplify_reports":                              "q7",
  "asked_to_simplify":                             "q7",

  // Q8 — annual budget
  "q8":                                            "q8",
  "what_is_your_approximate_annual_budget":        "q8",
  "annual_budget":                                 "q8",
  "approximate_annual_budget":                     "q8",
  "organisation_budget":                           "q8",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseOnaBody(raw: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(raw)) {
    const canonical = ONA_FIELD_MAP[key.toLowerCase()] ?? key;
    out[canonical] = value;
  }
  return out;
}

// ── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const body = normaliseOnaBody(rawBody as Record<string, unknown>) as OnaWebhookBody;
    const { first_name, last_name, email, org_name } = body;

    if (!email || !first_name || !last_name || !org_name) {
      return NextResponse.json(
        { error: "first_name, last_name, email, org_name are required" },
        { status: 400 }
      );
    }

    // Coerce answer indices — Ona may send integers or numeric strings
    const qKeys = ["q1","q2","q3","q4","q5","q6","q7","q8"] as const;
    for (const k of qKeys) {
      const v = body[k];
      if (typeof v === "string" && /^\d+$/.test(v)) {
        (body as unknown as Record<string, unknown>)[k] = parseInt(v, 10);
      }
    }

    // Validate all answer indices are now numbers
    for (const k of qKeys) {
      if (typeof body[k] !== "number" || isNaN(body[k])) {
        return NextResponse.json(
          { error: `Missing or invalid answer index for ${k}` },
          { status: 400 }
        );
      }
    }

    const answers: HealthCheckAnswers = {
      q1: body.q1, q2: body.q2, q3: body.q3, q4: body.q4,
      q5: body.q5, q6: body.q6, q7: body.q7, q8: body.q8,
    };

    // ── Step 1: Score immediately ──────────────────────────────────────────
    const rawScore   = calculateRawScore(answers);
    const score      = calculateScore(answers);
    const scoreBand  = getScoreBand(score);
    const erc        = getERC(score);
    const tierRec    = getTierRecommendation(answers);
    const topGaps    = getTopGaps(answers);
    const primaryGap = getPrimaryGapLabel(answers);
    const qScores    = getQuestionScores(answers);
    const orgType    = getOrgType(answers);
    const orgUrl     = inferOrgUrl(email, body.org_website);

    const id        = uuidv4();
    const timestamp = new Date().toISOString();

    // ── Step 1b: Store submission ──────────────────────────────────────────
    try {
      await dynamo.send(
        new PutCommand({
          TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
          Item: {
            id, timestamp, email,
            firstName: first_name, lastName: last_name,
            orgName: org_name, orgUrl,
            answers, rawScore, score,
            scoreBand: scoreBand.label,
            tierRecommendation: String(tierRec.tier),
            topGaps: topGaps.map(g => g.description),
            primaryGap,
            orgType,
            reportStatus: "pending",
          },
        })
      );
    } catch (dbErr) {
      console.error("[health-check] DynamoDB write failed:", dbErr);
    }

    // ── Publish to SNS — Lambda handles Grok + Claude + email ─────────────
    try {
      await sns.send(new PublishCommand({
        TopicArn: SNS_TOPIC_ARN,
        Message: JSON.stringify({
          id, timestamp, email,
          firstName: first_name, lastName: last_name,
          orgName: org_name, orgUrl,
          answers, rawScore, score,
        }),
      }));
      console.log("[health-check] SNS published for", org_name, id);
    } catch (snsErr) {
      console.error("[health-check] SNS publish failed — falling back to inline pipeline:", snsErr);
      void runAsyncPipeline({
        id, timestamp, email,
        firstName: first_name, lastName: last_name,
        orgName: org_name, orgUrl,
        answers, rawScore, score, scoreBand, erc, tierRec,
        topGaps, primaryGap, qScores, orgType,
      });
    }

    return NextResponse.json({ success: true, score, id });

  } catch (err) {
    console.error("[health-check] API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── Async pipeline ────────────────────────────────────────────────────────────

async function runAsyncPipeline(p: {
  id: string;
  timestamp: string;
  email: string;
  firstName: string;
  lastName: string;
  orgName: string;
  orgUrl: string;
  answers: HealthCheckAnswers;
  rawScore: number;
  score: number;
  scoreBand: ReturnType<typeof getScoreBand>;
  erc: ReturnType<typeof getERC>;
  tierRec: ReturnType<typeof getTierRecommendation>;
  topGaps: ReturnType<typeof getTopGaps>;
  primaryGap: string;
  qScores: Record<keyof HealthCheckAnswers, number>;
  orgType: OrgType;
}) {
  const { id, email, firstName, lastName, orgName, orgUrl,
          answers, rawScore, score, scoreBand, erc, tierRec,
          topGaps, primaryGap, qScores, orgType } = p;

  // ── Step 3: Grok research ────────────────────────────────────────────────
  let research: GrokOrgResearch | null = null;
  try {
    research = await researchOrganisation({
      orgName, orgUrl,
      personFirstName: firstName,
      personLastName: lastName,
      primaryGap, score,
    });
    console.log("[health-check] Grok complete. sector:", research.sector_key, "seniority:", research.seniority);
  } catch (grokErr) {
    console.error("[health-check] Grok failed:", grokErr);
  }

  // ── Step 4: Claude generates all 18 report sections ─────────────────────
  let reportVars: ReportVars | null = null;
  try {
    reportVars = await generateReportVars({
      firstName, lastName, orgName,
      score, rawScore, scoreBand, erc, tierRec,
      topGaps, primaryGap, qScores, answers, orgType,
      research,
    });
  } catch (claudeErr) {
    console.error("[health-check] Claude generation failed:", claudeErr);
    reportVars = buildFallbackVars(p, research);
  }

  // ── Step 5: Email with 25-55 min randomised delay ────────────────────────
  const delayMs = (25 + Math.floor(Math.random() * 31)) * 60 * 1000;
  console.log(`[health-check] Email scheduled in ${Math.round(delayMs/60000)} min for ${email}`);
  await new Promise(resolve => setTimeout(resolve, delayMs));

  if (reportVars) {
    try {
      const emailHtml = buildEmailHtml(reportVars, {
        firstName, lastName, orgName, score, rawScore,
        scoreBand, erc, tierRec, answers, qScores,
      });
      const emailText = buildPlainText(reportVars, { firstName, orgName, score });
      await sendEmail({
        to: email,
        subject: `Your Auxeira Evidence Risk Report — ${orgName}`,
        html: emailHtml,
        text: emailText,
      });
      console.log("[health-check] Report email sent to", email);
      // Update audit record
      try {
        await dynamo.send(new PutCommand({
          TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
          Item: {
            id: `email-audit-${p.id}`,
            submissionId: p.id,
            email, orgName, score,
            reportEmailStatus: "sent",
            reportEmailSentAt: new Date().toISOString(),
            timestamp: new Date().toISOString(),
          },
        }));
      } catch { /* non-critical */ }
    } catch (emailErr) {
      console.error("[health-check] Report email failed:", emailErr);
      try {
        await dynamo.send(new PutCommand({
          TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
          Item: {
            id: `email-audit-${p.id}`,
            submissionId: p.id,
            email, orgName, score,
            reportEmailStatus: "failed",
            reportEmailError: String(emailErr),
            timestamp: new Date().toISOString(),
          },
        }));
      } catch { /* non-critical */ }
    }
  }

  // ── Step 5b: Lead notification to info@auxeira.com ───────────────────────
  let notifyStatus = "pending";
  try {
    const notifyEmail = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@auxeira.com";
    await sendEmail({
      to: notifyEmail,
      subject: `New Health Check: ${orgName} — Score ${score}/100`,
      html: buildLeadNotificationEmail({ email, firstName, lastName, orgName,
        score, rawScore, answers, qScores, scoreBand, tierRec, topGaps, primaryGap, research }),
    });
    notifyStatus = "sent";
    console.log("[health-check] Lead notification sent for", orgName);
  } catch (notifyErr) {
    notifyStatus = "failed";
    console.error("[health-check] Lead notification failed:", notifyErr);
  }

  // Write email audit record to DynamoDB
  try {
    await dynamo.send(new PutCommand({
      TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
      Item: {
        id: `email-audit-${p.id}`,
        submissionId: p.id,
        email,
        orgName,
        score,
        notifyEmailStatus: notifyStatus,
        notifyEmailSentAt: new Date().toISOString(),
        reportEmailStatus: "pending",
        timestamp: new Date().toISOString(),
      },
    }));
  } catch (auditErr) {
    console.error("[health-check] Email audit write failed:", auditErr);
  }

  // ── Step 6: Zoho CRM upsert ──────────────────────────────────────────────
  try {
    await upsertZohoCRM({
      email, firstName, lastName, orgName, orgUrl,
      score, scoreBand: scoreBand.label,
      tierRecommendation: String(tierRec.tier),
      primaryGap, orgType,
      seniority: research?.seniority ?? "senior_manager",
      sectorKey: research?.sector_key ?? "other",
      flagshipProgramme: research?.flagship_programme ?? "",
    });
  } catch (zohoErr) {
    console.error("[health-check] Zoho CRM upsert failed:", zohoErr);
  }

  // ── Update DynamoDB status ───────────────────────────────────────────────
  try {
    await dynamo.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks",
        Item: {
          id, email,
          firstName, lastName, orgName, orgUrl,
          answers, rawScore, score,
          scoreBand: scoreBand.label,
          tierRecommendation: String(tierRec.tier),
          topGaps: topGaps.map(g => g.description),
          primaryGap, orgType,
          reportStatus: "sent",
          reportSentAt: new Date().toISOString(),
          seniority: research?.seniority ?? "senior_manager",
          sectorKey: research?.sector_key ?? "other",
          flagshipProgramme: research?.flagship_programme ?? "",
        },
      })
    );
  } catch (dbErr) {
    console.error("[health-check] DynamoDB status update failed:", dbErr);
  }
}

// ── Claude system prompt — verbatim from Auxeira_HealthCheck_Spec-2.md Part B ─

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
Never reveal that Auxeira has researched the subscriber. Never say "we researched you" or "we found" or "we noticed." The personalisation must feel like informed sector intelligence, not like an investigation.

LANGUAGE REGISTER BY ORG TYPE — mandatory:
Read the org type from Q1 and the Grok research profile. Apply the correct register throughout the entire report.

Delivery orgs (NGOs, social enterprises, government depts):
Use standard framing. "Gap" is appropriate. "Evidence gap" is accurate and non-threatening. Loss aversion language works directly.

Foundation and funder orgs:
Never use "gap" or "problem" as primary framing.
Never use "intervention" — use "partnership."
Never use "fix" — use "unlock."
Never use "what you are losing" — use "what remains unmeasured" or "what is not yet visible."
Replace "the evidence gap is costing you" with "the portfolio contribution that remains unmeasured."

Consultant and evaluator orgs:
Frame around client impact, not internal evidence. "Your clients are leaving funding on the table" is more resonant than "your evidence is weak."

LEADING QUESTION PLACEMENT — mandatory:
Loss aversion sections (Market Loss — Section 8, and Value Identity — Section 9): place the leading question at the START of the section, before the data.
Recommendation section (Section 13): place the leading question at the END.
All other sections: leading question at the end.`;

// ── generateReportVars ────────────────────────────────────────────────────────

async function generateReportVars(p: {
  firstName: string; lastName: string; orgName: string;
  score: number; rawScore: number;
  scoreBand: ReturnType<typeof getScoreBand>;
  erc: ReturnType<typeof getERC>;
  tierRec: ReturnType<typeof getTierRecommendation>;
  topGaps: ReturnType<typeof getTopGaps>;
  primaryGap: string;
  qScores: Record<keyof HealthCheckAnswers, number>;
  answers: HealthCheckAnswers;
  orgType: OrgType;
  research: GrokOrgResearch | null;
}): Promise<ReportVars> {
  const { firstName, lastName, orgName, score, rawScore, scoreBand, tierRec,
          topGaps, primaryGap, qScores, answers, orgType, research } = p;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const seniority       = research?.seniority        ?? "senior_manager";
  const ceoName         = research?.ceo_name         ?? "";
  const sectorKey       = research?.sector_key       ?? "other";
  const sectorLabel     = research?.sector_label     ?? "social sector";
  const flagshipProg    = research?.flagship_programme ?? orgName;
  const sectorAvg       = getSectorAverage(sectorKey);
  const scoreVsAvg      = Math.abs(score - sectorAvg);
  const aboveBelow      = score >= sectorAvg ? "above" : "below";
  const pilotDiag       = showPilotDiagnostic(answers);
  const primaryAudience = getPrimaryAudienceLabel(answers);

  // Build Q&A summary for prompt
  const qLabels: Record<string, string> = {
    q1: "Organisation type", q2: "Primary audience", q3: "Years of data",
    q4: "Last report response", q5: "SROI status", q6: "Biggest challenge",
    q7: "Simplify requests", q8: "Annual budget",
  };
  const answerSummary = (Object.keys(qScores) as (keyof HealthCheckAnswers)[])
    .map(k => `${qLabels[k]}: ${getAnswerText(k, answers[k])} — ${qScores[k]} pts`)
    .join("\n");

  const gap1 = topGaps[0];
  const gap2 = topGaps[1];

  const userPrompt = `Generate a complete Entity Evidence Risk Report for this organisation. Populate every variable with specific, personalised content. Do not use placeholder text or generic observations.

SUBSCRIBER:
First name: ${firstName}
Last name: ${lastName}
Organisation: ${orgName}
Seniority: ${seniority}
CEO name (if submitter is not CEO): ${ceoName || "not identified"}
Org type: ${orgType}
Programme name (flagship from research): ${flagshipProg}
Primary audience: ${primaryAudience}

SECTOR:
Sector: ${sectorLabel}
Sector average score: ${sectorAvg}
This org score: ${score} (${scoreVsAvg} pts ${aboveBelow} average)

DIAGNOSTIC ANSWERS AND SCORE:
${answerSummary}
Raw score: ${rawScore} / 104
Final score: ${score} / 100
Score band: ${scoreBand.label}
Gap 1: ${gap1?.gapType ?? ""} (${gap1?.q ?? ""})
Gap 2: ${gap2?.gapType ?? ""} (${gap2?.q ?? ""})

GROK RESEARCH PROFILE:
${research?.full_briefing ?? research?.overview ?? "Not available — generate from diagnostic answers and sector knowledge."}

---

Return a JSON object with EXACTLY these keys. All values are strings. No markdown. No line breaks within values — use spaces only.

{
  "score_headline": "1 sentence. What the score tells us about this specific organisation.",
  "funding_at_risk": "Rand range. E.g. R8M-R18M",
  "influence_gap": "Percentage range. E.g. 35-50%",
  "opportunity_cost": "Rand range over 3 years. E.g. R25-40M over 3 years",
  "gap1_title": "Gap 1 name. 3-5 words.",
  "gap1_q_ref": "Q${gap1?.q?.toUpperCase() ?? "Q4"}",
  "gap1_body": "3-4 sentences. Specific to this organisation.",
  "gap1_cost": "1 sentence estimated cost statement.",
  "gap2_title": "Gap 2 name. 3-5 words.",
  "gap2_q_ref": "Q${gap2?.q?.toUpperCase() ?? "Q5"}",
  "gap2_body": "3-4 sentences. Specific to this organisation.",
  "gap2_cost": "1 sentence estimated cost statement.",
  "sector_context": "4-5 sentences. South Africa-specific. One data point minimum.",
  "sector_metric1_num": "E.g. 3.3x",
  "sector_metric1_desc": "Short label. E.g. ECD SROI verified",
  "sector_metric2_num": "E.g. 30-40%",
  "sector_metric2_desc": "Short label.",
  "sector_metric3_num": "E.g. 70%",
  "sector_metric3_desc": "Short label.",
  "scenario_nothing": "3 sentences. What happens over 3 years with no action.",
  "scenario_partial": "3 sentences. What happens if only one gap is addressed.",
  "scenario_full": "3 sentences. What the org looks like after full ${tierRec.label} engagement.",
  "recovery_value": "Rand range. E.g. R25-40M",
  "risk1_title": "Primary risk title. 4-6 words.",
  "risk1_body": "2-3 sentences.",
  "risk2_title": "Secondary risk title.",
  "risk2_body": "2-3 sentences.",
  "risk3_title": "Sector positioning risk title.",
  "risk3_body": "2-3 sentences.",
  "market_loss_leading_question": "1 sentence. Leading question placed at START of market loss section. Reference the tipping month.",
  "leverage_now": "${score}",
  "leverage_48m": "Projected leverage at month 48 without action. ERC-B typically 25-35.",
  "tipping_month": "Month at which sector average crosses their score. Typically 18-26 for ERC-B.",
  "cumulative_loss": "Total 4-year funding attrition. Calibrate to Q8 budget band.",
  "sector_position_now": "E.g. Top 40%",
  "sector_position_48m": "E.g. Bottom 35%",
  "loss_year1": "Year 1 loss figure (number only, millions). Lowest.",
  "loss_year2": "Year 2 loss figure.",
  "loss_year3": "Year 3 loss figure.",
  "loss_year4": "Year 4 loss figure.",
  "value_identity_leading_question": "1 sentence. Leading question at START of value identity section. Reference the specific value metric.",
  "value1_label": "Value identity metric 1 label. E.g. Evidence influence",
  "value1_metric": "Unit of measurement. E.g. Policy decisions informed annually",
  "value1_now": "Current annual figure (number only).",
  "value1_48m": "Month 48 figure without action (number only).",
  "value1_pct_decline": "E.g. 64%",
  "value2_label": "Value identity metric 2 label.",
  "value2_metric": "Unit of measurement.",
  "value2_now": "Current annual figure (number only).",
  "value2_48m": "Month 48 figure without action (number only).",
  "value2_pct_decline": "E.g. 64%",
  "policy_windows": "Total number of relevant policy windows over 24 months (number only).",
  "policy_expected_b": "Expected influence events at ERC-B (number only).",
  "policy_expected_a": "Expected influence events at ERC-A (number only).",
  "policy_gap": "Foregone events gap (number only).",
  "policy_value_low": "Low end of foregone value range. E.g. R10M",
  "policy_value_high": "High end. E.g. R28M",
  "compound_b_pct": "P(3 consecutive successes) at ERC-B. E.g. 3%",
  "compound_a_pct": "P(3 consecutive successes) at ERC-A. E.g. 31%",
  "stakeholder_count": "Number of key stakeholder categories identified (number only).",
  "stakeholder_now_pct": "Aggregate current engagement %. E.g. 60%",
  "stakeholder_48m_pct": "Aggregate month 48 engagement %. E.g. 25%",
  "stakeholders_json": "[{name, role, now_pct, m48_pct}, ...] — 4-6 stakeholder categories from Grok research.",
  "policy_windows_json": "[{name, body, freq, deadline, count, prob_b, prob_a, prob_b_pct}, ...] — 4-6 windows.",
  "market_context_body": "3-4 sentences. Sector benchmarks and market context.",
  "mkt_metric1_num": "E.g. 47",
  "mkt_metric1_desc": "Short label.",
  "mkt_metric2_num": "E.g. 68%",
  "mkt_metric2_desc": "Short label.",
  "mkt_metric3_num": "E.g. R2.1B",
  "mkt_metric3_desc": "Short label.",
  "intel_landscape": "LANDSCAPE sentence. South Africa-specific.",
  "intel_risk": "RISK sentence. Based on sector benchmarks.",
  "intel_opportunity": "OPPORTUNITY sentence. Reference Auxeira by name.",
  "proof_bridge": "2-3 sentences. Methodology bridge. Never compare to SmartStart directly.",
  "tier_label": "${tierRec.label}",
  "urgency_label": "Urgent OR Within 3 months OR Within 6 months",
  "rec_body": "3-4 sentences. Concrete output for this specific organisation.",
  "closing_question": "1 sentence. Must name ${flagshipProg} and a specific upcoming cycle or window.",
  "tier_price": "${tierRec.priceRange}",
  "tier_timeline": "${tierRec.timeline}",
  "pilot_diagnostic_text": "${pilotDiag ? "A 3-week Portfolio Evidence Diagnostic at R85,000 - R150,000 provides the evidence base for the full partnership conversation, with no obligation to proceed to the full engagement." : ""}",
  "forward_box_body": "${seniority !== "executive" && ceoName ? `This report is most relevant to ${orgName}'s executive leadership. The evidence architecture gaps identified here directly affect ${flagshipProg}'s ${primaryAudience} positioning. Forward this report to ${ceoName} — or reply to this email and we will take it from there.` : ""}"
}`;

  const msg = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4000,
    system: CLAUDE_SYSTEM,
    messages: [{ role: "user", content: userPrompt }],
  });

  const raw = msg.content
    .filter(b => b.type === "text")
    .map(b => (b as { type: "text"; text: string }).text)
    .join("").trim();

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude returned no JSON");

  const parsed = JSON.parse(jsonMatch[0]) as Record<string, string>;

  // Parse stakeholders and policy windows JSON arrays into HTML rows
  let stakeholderRowsHtml = "";
  let policyWindowsHtml = "";
  try {
    const shJson = JSON.parse(parsed.stakeholders_json ?? "[]") as Array<{
      name: string; role: string; now_pct: number; m48_pct: number;
    }>;
    stakeholderRowsHtml = shJson.map(sh => `
      <tr>
        <td style="padding:6px 8px;font-size:11px;color:#1A1A2A;border-bottom:.5px solid #EEE">${sh.name}</td>
        <td style="padding:6px 8px;font-size:11px;color:#555;border-bottom:.5px solid #EEE">${sh.role}</td>
        <td style="padding:6px 8px;font-size:11px;font-weight:700;color:#1D9E75;text-align:center;border-bottom:.5px solid #EEE">${sh.now_pct}%</td>
        <td style="padding:6px 8px;font-size:11px;font-weight:700;color:#E24B4A;text-align:center;border-bottom:.5px solid #EEE">${sh.m48_pct}%</td>
      </tr>`).join("");
  } catch { /* use empty */ }

  try {
    const pwJson = JSON.parse(parsed.policy_windows_json ?? "[]") as Array<{
      name: string; body: string; freq: string; deadline: string;
      count: number; prob_b: number; prob_a: number; prob_b_pct: string;
    }>;
    policyWindowsHtml = pwJson.map(w => `
      <tr>
        <td style="padding:6px 8px;font-size:11px;color:#1A1A2A;border-bottom:.5px solid #EEE">${w.name}</td>
        <td style="padding:6px 8px;font-size:11px;color:#555;border-bottom:.5px solid #EEE">${w.body}</td>
        <td style="padding:6px 8px;font-size:11px;color:#555;text-align:center;border-bottom:.5px solid #EEE">${w.freq}</td>
        <td style="padding:6px 8px;font-size:11px;color:#C9A84C;font-weight:700;text-align:center;border-bottom:.5px solid #EEE">${w.deadline}</td>
        <td style="padding:6px 8px;font-size:11px;color:#E24B4A;text-align:center;border-bottom:.5px solid #EEE">${w.prob_b_pct}</td>
        <td style="padding:6px 8px;font-size:11px;color:#1D9E75;text-align:center;border-bottom:.5px solid #EEE">${w.prob_a ?? ""}</td>
      </tr>`).join("");
  } catch { /* use empty */ }

  const s = (key: string, fallback = "") => sanitiseAIOutput(parsed[key] ?? fallback);

  const forwardBoxHtml = seniority !== "executive" && ceoName
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF7FF;border:0.5px solid #B5D4F4;border-radius:8px;margin-bottom:12px;">
        <tr><td style="padding:10px 14px;font-size:12px;color:#185FA5;line-height:1.6;">
          ${s("forward_box_body")}
        </td></tr>
       </table>`
    : "";

  return {
    score_headline:    s("score_headline"),
    funding_at_risk:   s("funding_at_risk", "R8M-R18M"),
    influence_gap:     s("influence_gap", "35-50%"),
    opportunity_cost:  s("opportunity_cost", "R25-40M over 3 years"),
    gap1_title:        s("gap1_title", gap1?.gapType ?? "Translation Gap"),
    gap1_q_ref:        s("gap1_q_ref", gap1?.q?.toUpperCase() ?? "Q4"),
    gap1_body:         s("gap1_body"),
    gap1_cost:         s("gap1_cost"),
    gap2_title:        s("gap2_title", gap2?.gapType ?? "Economic Evidence Gap"),
    gap2_q_ref:        s("gap2_q_ref", gap2?.q?.toUpperCase() ?? "Q5"),
    gap2_body:         s("gap2_body"),
    gap2_cost:         s("gap2_cost"),
    sector_context:    s("sector_context"),
    sector_metric1_num:  s("sector_metric1_num", "3.3x"),
    sector_metric1_desc: s("sector_metric1_desc", "SROI verified"),
    sector_metric2_num:  s("sector_metric2_num", "30-40%"),
    sector_metric2_desc: s("sector_metric2_desc", "less co-funding without economic framing"),
    sector_metric3_num:  s("sector_metric3_num", "70%"),
    sector_metric3_desc: s("sector_metric3_desc", "proposals deprioritised"),
    scenario_nothing:  s("scenario_nothing"),
    scenario_partial:  s("scenario_partial"),
    scenario_full:     s("scenario_full"),
    recovery_value:    s("recovery_value", "R25-40M"),
    risk1_title:       s("risk1_title"),
    risk1_body:        s("risk1_body"),
    risk2_title:       s("risk2_title"),
    risk2_body:        s("risk2_body"),
    risk3_title:       s("risk3_title"),
    risk3_body:        s("risk3_body"),
    market_loss_leading_question: s("market_loss_leading_question"),
    leverage_now:      s("leverage_now", String(score)),
    leverage_48m:      s("leverage_48m", "28"),
    tipping_month:     s("tipping_month", "22"),
    cumulative_loss:   s("cumulative_loss", "R30M+"),
    sector_position_now: s("sector_position_now", "Top 40%"),
    sector_position_48m: s("sector_position_48m", "Bottom 35%"),
    loss_year1:        s("loss_year1", "8"),
    loss_year2:        s("loss_year2", "13"),
    loss_year3:        s("loss_year3", "13"),
    loss_year4:        s("loss_year4", "13"),
    value_identity_leading_question: s("value_identity_leading_question"),
    value1_label:      s("value1_label", "Evidence influence"),
    value1_metric:     s("value1_metric", "Policy decisions informed annually"),
    value1_now:        s("value1_now", "14"),
    value1_48m:        s("value1_48m", "5"),
    value1_pct_decline: s("value1_pct_decline", "64%"),
    value2_label:      s("value2_label", "Knowledge reach"),
    value2_metric:     s("value2_metric", "Practitioners using your findings"),
    value2_now:        s("value2_now", "2840"),
    value2_48m:        s("value2_48m", "1020"),
    value2_pct_decline: s("value2_pct_decline", "64%"),
    policy_windows:    s("policy_windows", "26"),
    policy_expected_b: s("policy_expected_b", "9"),
    policy_expected_a: s("policy_expected_a", "16"),
    policy_gap:        s("policy_gap", "7"),
    policy_value_low:  s("policy_value_low", "R10M"),
    policy_value_high: s("policy_value_high", "R28M"),
    compound_b_pct:    s("compound_b_pct", "3%"),
    compound_a_pct:    s("compound_a_pct", "31%"),
    stakeholder_count: s("stakeholder_count", "5"),
    stakeholder_now_pct: s("stakeholder_now_pct", "60%"),
    stakeholder_48m_pct: s("stakeholder_48m_pct", "25%"),
    stakeholder_rows_html: stakeholderRowsHtml,
    policy_windows_html: policyWindowsHtml,
    market_context_body:  s("market_context_body"),
    mkt_metric1_num:  s("mkt_metric1_num", "47"),
    mkt_metric1_desc: s("mkt_metric1_desc", "comparable organisations"),
    mkt_metric2_num:  s("mkt_metric2_num", "68%"),
    mkt_metric2_desc: s("mkt_metric2_desc", "sector funding shift"),
    mkt_metric3_num:  s("mkt_metric3_num", "R2.1B"),
    mkt_metric3_desc: s("mkt_metric3_desc", "sector funding pool"),
    intel_landscape:   s("intel_landscape"),
    intel_risk:        s("intel_risk"),
    intel_opportunity: s("intel_opportunity"),
    proof_bridge:      s("proof_bridge"),
    tier_label:        tierRec.label,
    urgency_label:     s("urgency_label", "Within 3 months"),
    rec_body:          s("rec_body"),
    closing_question:  s("closing_question"),
    tier_price:        tierRec.priceRange,
    tier_timeline:     tierRec.timeline,
    pilot_diagnostic_text: pilotDiag
      ? "A 3-week Portfolio Evidence Diagnostic at R85,000 - R150,000 provides the evidence base for the full partnership conversation, with no obligation to proceed to the full engagement."
      : "",
    ceo_name:              ceoName,
    programme_name:        flagshipProg,
    primary_audience_label: primaryAudience,
    forward_box_html:      forwardBoxHtml,
  };
}

// ── buildEmailHtml ────────────────────────────────────────────────────────────
// Reads auxeira_health_check_email_template.html and injects all {{variables}}

function loadEmailTemplate(): string {
  const candidates = [
    join(process.cwd(), "auxeira_health_check_email_template.html"),
    join(process.cwd(), "public", "auxeira_health_check_email_template.html"),
    join(__dirname, "..", "..", "..", "auxeira_health_check_email_template.html"),
  ];
  for (const p of candidates) {
    try { return readFileSync(p, "utf-8"); } catch { /* try next */ }
  }
  return "<p>Report template not found.</p>";
}

function buildEmailHtml(
  vars: ReportVars,
  meta: {
    firstName: string; lastName: string; orgName: string;
    score: number; rawScore: number;
    scoreBand: ReturnType<typeof getScoreBand>;
    erc: ReturnType<typeof getERC>;
    tierRec: ReturnType<typeof getTierRecommendation>;
    answers: HealthCheckAnswers;
    qScores: Record<keyof HealthCheckAnswers, number>;
  }
): string {
  const { firstName, lastName, orgName, score, rawScore, scoreBand, erc, answers, qScores } = meta;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";
  const reportDate  = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

  const sectorAvg   = getSectorAverage("other");
  const scoreVsAvg  = Math.abs(score - sectorAvg);
  const aboveBelow  = score >= sectorAvg ? "above" : "below";

  // Build scoring table rows
  const qLabels: Record<string, string> = {
    q1:"Organisation type",q2:"Primary audience",q3:"Years of data",
    q4:"Last report response",q5:"SROI status",q6:"Biggest challenge",
    q7:"Simplify requests",q8:"Annual budget",
  };
  const scoringRows = (Object.keys(qScores) as (keyof HealthCheckAnswers)[])
    .map(k => `<tr><td style="padding:4px 8px;font-size:11px;color:#555;border-bottom:.5px solid #EEE">${qLabels[k]}</td><td style="padding:4px 8px;font-size:11px;color:#555;border-bottom:.5px solid #EEE">${getAnswerText(k, answers[k])}</td><td style="padding:4px 8px;font-size:11px;font-weight:700;color:#C9A84C;text-align:right;border-bottom:.5px solid #EEE">${qScores[k]}</td></tr>`)
    .join("");

  const replacements: Record<string, string> = {
    // Core
    org_name:          orgName,
    first_name:        firstName,
    last_name:         lastName,
    score:             String(score),
    score_pct:         String(score),
    erc:               erc.erc,
    risk_level:        erc.risk_level,
    erc_color:         erc.erc_color,
    erc_bg:            erc.erc_bg,
    score_band:        scoreBand.label,
    report_date:       reportDate,
    sector_label:      vars.sector_context.split(".")[0] ?? "social sector",
    sector_avg:        String(sectorAvg),
    score_vs_avg:      String(scoreVsAvg),
    above_below:       aboveBelow,
    sector_peer_count: "47",
    // Projections
    funding_at_risk:   vars.funding_at_risk,
    influence_gap:     vars.influence_gap,
    opportunity_cost:  vars.opportunity_cost,
    // Gaps
    gap1_title:  vars.gap1_title,
    gap1_q_ref:  vars.gap1_q_ref,
    gap1_body:   vars.gap1_body,
    gap1_cost:   vars.gap1_cost,
    gap2_title:  vars.gap2_title,
    gap2_q_ref:  vars.gap2_q_ref,
    gap2_body:   vars.gap2_body,
    gap2_cost:   vars.gap2_cost,
    // Sector
    sector_context:      vars.sector_context,
    sector_metric1_num:  vars.sector_metric1_num,
    sector_metric1_desc: vars.sector_metric1_desc,
    sector_metric2_num:  vars.sector_metric2_num,
    sector_metric2_desc: vars.sector_metric2_desc,
    sector_metric3_num:  vars.sector_metric3_num,
    sector_metric3_desc: vars.sector_metric3_desc,
    // Scenarios
    scenario_nothing: vars.scenario_nothing,
    scenario_partial:  vars.scenario_partial,
    scenario_full:     vars.scenario_full,
    recovery_value:    vars.recovery_value,
    // Risks
    risk1_title: vars.risk1_title,
    risk1_body:  vars.risk1_body,
    risk2_title: vars.risk2_title,
    risk2_body:  vars.risk2_body,
    risk3_title: vars.risk3_title,
    risk3_body:  vars.risk3_body,
    // Market loss
    market_loss_leading_question: vars.market_loss_leading_question,
    leverage_now:        vars.leverage_now,
    leverage_48m:        vars.leverage_48m,
    tipping_month:       vars.tipping_month,
    cumulative_loss:     vars.cumulative_loss,
    sector_position_now: vars.sector_position_now,
    sector_position_48m: vars.sector_position_48m,
    loss_year1: vars.loss_year1,
    loss_year2: vars.loss_year2,
    loss_year3: vars.loss_year3,
    loss_year4: vars.loss_year4,
    // Value identity
    value_identity_leading_question: vars.value_identity_leading_question,
    value1_label:       vars.value1_label,
    value1_label_lower: vars.value1_label.toLowerCase(),
    value1_metric:      vars.value1_metric,
    value1_now:         vars.value1_now,
    value1_48m:         vars.value1_48m,
    value1_pct_decline: vars.value1_pct_decline,
    value2_label:       vars.value2_label,
    value2_label_lower: vars.value2_label.toLowerCase(),
    value2_metric:      vars.value2_metric,
    value2_now:         vars.value2_now,
    value2_48m:         vars.value2_48m,
    value2_pct_decline: vars.value2_pct_decline,
    policy_windows:     vars.policy_windows,
    policy_expected_b:  vars.policy_expected_b,
    policy_expected_a:  vars.policy_expected_a,
    policy_gap:         vars.policy_gap,
    policy_value_low:   vars.policy_value_low,
    policy_value_high:  vars.policy_value_high,
    compound_b_pct:     vars.compound_b_pct,
    compound_a_pct:     vars.compound_a_pct,
    stakeholder_count:  vars.stakeholder_count,
    stakeholder_now_pct: vars.stakeholder_now_pct,
    stakeholder_48m_pct: vars.stakeholder_48m_pct,
    stakeholder_rows:   vars.stakeholder_rows_html,
    policy_windows_rows: vars.policy_windows_html,
    // Market context
    market_context_body: vars.market_context_body,
    mkt_metric1_num:  vars.mkt_metric1_num,
    mkt_metric1_desc: vars.mkt_metric1_desc,
    mkt_metric2_num:  vars.mkt_metric2_num,
    mkt_metric2_desc: vars.mkt_metric2_desc,
    mkt_metric3_num:  vars.mkt_metric3_num,
    mkt_metric3_desc: vars.mkt_metric3_desc,
    // Intelligence
    intel_landscape:   vars.intel_landscape,
    intel_risk:        vars.intel_risk,
    intel_opportunity: vars.intel_opportunity,
    // Proof
    proof_bridge: vars.proof_bridge,
    // Recommendation
    tier_label:            vars.tier_label,
    urgency_label:         vars.urgency_label,
    rec_body:              vars.rec_body,
    closing_question:      vars.closing_question,
    tier_price:            vars.tier_price,
    tier_timeline:         vars.tier_timeline,
    pilot_diagnostic_text: vars.pilot_diagnostic_text,
    // Forward box
    ceo_name:              vars.ceo_name,
    programme_name:        vars.programme_name,
    primary_audience_label: vars.primary_audience_label,
    forward_box_html:      vars.forward_box_html,
    // Scoring table
    scoring_rows: scoringRows,
    raw_score:    String(rawScore),
    // CTA
    calendly_url: calendlyUrl,
    score_headline: vars.score_headline,
    // Seniority (used for conditional blocks)
    seniority: vars.forward_box_html ? "senior_manager" : "executive",
  };

  let html = loadEmailTemplate();

  // Replace all {{variable}} tokens
  for (const [key, value] of Object.entries(replacements)) {
    html = html.replaceAll(`{{${key}}}`, value ?? "");
  }

  // Hide forward box block if executive (template uses conditional comment markers)
  if (!vars.forward_box_html) {
    html = html.replace(/<!--\s*FORWARD_BOX_START\s*-->[\s\S]*?<!--\s*FORWARD_BOX_END\s*-->/g, "");
  }

  // Hide pilot diagnostic block for delivery orgs
  if (!vars.pilot_diagnostic_text) {
    html = html.replace(/<!--\s*PILOT_DIAG_START\s*-->[\s\S]*?<!--\s*PILOT_DIAG_END\s*-->/g, "");
  }

  return html;
}

// ── buildPlainText ────────────────────────────────────────────────────────────

function buildPlainText(
  vars: ReportVars,
  meta: { firstName: string; orgName: string; score: number }
): string {
  const { firstName, orgName, score } = meta;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";
  return [
    `Your Auxeira Evidence Risk Report — ${orgName}`,
    ``,
    `${firstName},`,
    ``,
    vars.score_headline,
    ``,
    `EVIDENCE HEALTH SCORE: ${score}/100`,
    `${vars.tier_label} | ${vars.urgency_label}`,
    ``,
    `KEY PROJECTIONS`,
    `Funding at risk: ${vars.funding_at_risk}`,
    `Influence gap: ${vars.influence_gap}`,
    `Opportunity cost: ${vars.opportunity_cost}`,
    ``,
    `GAP 1 — ${vars.gap1_title}`,
    vars.gap1_body,
    vars.gap1_cost,
    ``,
    `GAP 2 — ${vars.gap2_title}`,
    vars.gap2_body,
    vars.gap2_cost,
    ``,
    `SECTOR CONTEXT`,
    vars.sector_context,
    ``,
    `RECOMMENDATION`,
    vars.rec_body,
    ``,
    vars.closing_question,
    ``,
    `Book your Evidence Strategy Call: ${calendlyUrl}`,
    ``,
    `Auxeira | info@auxeira.com | auxeira.com`,
    `Johannesburg — Global from Africa`,
    ``,
    `To unsubscribe, reply with "unsubscribe" in the subject line.`,
  ].join("\n");
}

// ── buildFallbackVars ─────────────────────────────────────────────────────────

function buildFallbackVars(
  p: { firstName: string; orgName: string; score: number;
       scoreBand: ReturnType<typeof getScoreBand>;
       tierRec: ReturnType<typeof getTierRecommendation>;
       topGaps: ReturnType<typeof getTopGaps>;
       answers: HealthCheckAnswers; },
  research: GrokOrgResearch | null
): ReportVars {
  const { orgName, score, scoreBand, tierRec, topGaps } = p;
  const gap1 = topGaps[0];
  const gap2 = topGaps[1];
  const prog = research?.flagship_programme ?? orgName;
  return {
    score_headline:    `${orgName}'s evidence score of ${score}/100 signals a ${scoreBand.label.toLowerCase()} that is limiting funding and policy traction.`,
    funding_at_risk:   "R8M-R18M",
    influence_gap:     "35-50%",
    opportunity_cost:  "R25-40M over 3 years",
    gap1_title:        gap1?.gapType ?? "Translation Gap",
    gap1_q_ref:        gap1?.q?.toUpperCase() ?? "Q4",
    gap1_body:         gap1?.description ?? "Evidence is not reaching decision-makers in a form they can act on.",
    gap1_cost:         "Estimated cost: R5M-R15M in foregone funding annually based on sector benchmarks.",
    gap2_title:        gap2?.gapType ?? "Economic Evidence Gap",
    gap2_q_ref:        gap2?.q?.toUpperCase() ?? "Q5",
    gap2_body:         gap2?.description ?? "No economic or SROI analysis exists to support funder conversations.",
    gap2_cost:         "Estimated cost: R3M-R10M in missed co-funding opportunities annually.",
    sector_context:    "South Africa's social sector is undergoing a major funding shift toward evidence-weighted portfolio allocation. Organisations without strong economic framing are being structurally deprioritised in competitive funding rounds.",
    sector_metric1_num: "3.3x", sector_metric1_desc: "SROI verified",
    sector_metric2_num: "30-40%", sector_metric2_desc: "less co-funding without economic framing",
    sector_metric3_num: "70%", sector_metric3_desc: "proposals deprioritised",
    scenario_nothing:  "Without addressing the evidence gaps, funding attrition is likely to accelerate as sector peers improve their evidence architecture. Policy windows will close without the organisation's evidence reaching the right decision-makers.",
    scenario_partial:  "Addressing one gap improves positioning but leaves the core translation or economic evidence problem unresolved. Partial improvement yields partial results.",
    scenario_full:     `A full ${tierRec.label} engagement positions ${prog} to enter the next funding cycle with a complete economic case and translated evidence products.`,
    recovery_value:    "R25-40M",
    risk1_title: "Funder deprioritisation", risk1_body: "Without economic framing, proposals are likely being passed over in competitive rounds for organisations with stronger evidence narratives.",
    risk2_title: "Policy window misses",    risk2_body: "Policy reach is constrained despite strong programme delivery because the economic case has not been made at the right level.",
    risk3_title: "Sector positioning risk", risk3_body: "As sector peers improve their evidence architecture, the relative positioning of this organisation will decline without action.",
    market_loss_leading_question: `At Month 22, the sector average is projected to cross this organisation's current score. What is the plan?`,
    leverage_now: String(score), leverage_48m: "28", tipping_month: "22",
    cumulative_loss: "R30M+", sector_position_now: "Top 40%", sector_position_48m: "Bottom 35%",
    loss_year1: "8", loss_year2: "13", loss_year3: "13", loss_year4: "13",
    value_identity_leading_question: "If evidence influence declines by 64% over 48 months, which relationships does this organisation stop being in the room for?",
    value1_label: "Evidence influence", value1_metric: "Policy decisions informed annually",
    value1_now: "14", value1_48m: "5", value1_pct_decline: "64%",
    value2_label: "Knowledge reach", value2_metric: "Practitioners using your findings",
    value2_now: "2840", value2_48m: "1020", value2_pct_decline: "64%",
    policy_windows: "26", policy_expected_b: "9", policy_expected_a: "16", policy_gap: "7",
    policy_value_low: "R10M", policy_value_high: "R28M",
    compound_b_pct: "3%", compound_a_pct: "31%",
    stakeholder_count: "5", stakeholder_now_pct: "60%", stakeholder_48m_pct: "25%",
    stakeholder_rows_html: "", policy_windows_html: "",
    market_context_body: "South Africa's social impact funding landscape is shifting toward evidence-weighted allocation. Organisations with strong economic framing are securing 2-3x more decision-maker engagement than those without.",
    mkt_metric1_num: "47", mkt_metric1_desc: "comparable organisations benchmarked",
    mkt_metric2_num: "68%", mkt_metric2_desc: "sector funding shift toward evidence",
    mkt_metric3_num: "R2.1B", mkt_metric3_desc: "sector funding pool",
    intel_landscape: "LANDSCAPE: South Africa's social sector funding environment is tightening, with major funders shifting toward evidence-weighted portfolio allocation.",
    intel_risk: "RISK: Organisations at this score typically secure an estimated 30-40% less funding than sector leaders with strong economic framing, based on sector benchmarks.",
    intel_opportunity: "OPPORTUNITY: Closing this evidence gap through Auxeira's synthesis and translation methodology is estimated to unlock 2-3x more decision-maker engagement within 24 months.",
    proof_bridge: "The same approach that surfaced the economic contribution of a South African delivery network applies equally to this sector's work, where the fiscal multipliers are equally strong and equally unmade.",
    tier_label: tierRec.label, urgency_label: "Within 3 months",
    rec_body: `A ${tierRec.label} engagement would produce a complete evidence architecture for ${prog} — translated into the language your primary audience responds to, with an economic case that can be placed in front of funders and government.`,
    closing_question: `What would it look like for ${prog} to enter the next funding cycle with a ready fiscal case for its contribution?`,
    tier_price: tierRec.priceRange, tier_timeline: tierRec.timeline,
    pilot_diagnostic_text: "",
    ceo_name: research?.ceo_name ?? "",
    programme_name: prog,
    primary_audience_label: "Funders / Government",
    forward_box_html: "",
  };
}

// ── buildLeadNotificationEmail ────────────────────────────────────────────────

function buildLeadNotificationEmail(p: {
  email: string; firstName: string; lastName: string; orgName: string;
  score: number; rawScore: number;
  answers: HealthCheckAnswers;
  qScores: Record<keyof HealthCheckAnswers, number>;
  scoreBand: ReturnType<typeof getScoreBand>;
  tierRec: ReturnType<typeof getTierRecommendation>;
  topGaps: ReturnType<typeof getTopGaps>;
  primaryGap: string;
  research: GrokOrgResearch | null;
}): string {
  const { email, firstName, lastName, orgName, score, rawScore,
          answers, qScores, scoreBand, tierRec, topGaps, primaryGap, research } = p;
  const qLabels: Record<string, string> = {
    q1:"Organisation type",q2:"Primary audience",q3:"Years of data",
    q4:"Last report response",q5:"SROI status",q6:"Biggest challenge",
    q7:"Simplify requests",q8:"Annual budget",
  };
  const answerRows = (Object.keys(qScores) as (keyof HealthCheckAnswers)[])
    .map(k => `<tr><td style="padding:4px 8px;font-size:12px;">${qLabels[k]}</td><td style="padding:4px 8px;font-size:12px;">${getAnswerText(k, answers[k])}</td><td style="padding:4px 8px;font-size:12px;font-weight:700;">${qScores[k]}</td></tr>`)
    .join("");
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#1A1A2A;font-size:13px;">
<h2 style="color:#0A1628;">New Health Check Submission</h2>
<p><strong>${firstName} ${lastName}</strong> &lt;${email}&gt;<br>
<strong>Organisation:</strong> ${orgName}<br>
<strong>Score:</strong> ${score}/100 (raw ${rawScore}/104)<br>
<strong>Band:</strong> ${scoreBand.label}<br>
<strong>Tier:</strong> ${tierRec.label}<br>
<strong>Primary gap:</strong> ${primaryGap}</p>
<p><strong>Top gaps:</strong><br>${topGaps.map(g => `${g.gapType} (${g.q}): deficit ${g.deficit}`).join("<br>")}</p>
${research ? `<p><strong>Grok research:</strong><br>${research.overview}<br>Seniority: ${research.seniority} | CEO: ${research.ceo_name || "not found"} | Sector: ${research.sector_key}</p>` : ""}
<h3>Full Answers</h3>
<table style="border-collapse:collapse;width:100%;">
<thead><tr><th style="text-align:left;padding:5px 8px;background:#f5f5f5;font-size:11px;">Question</th><th style="text-align:left;padding:5px 8px;background:#f5f5f5;font-size:11px;">Answer</th><th style="text-align:left;padding:5px 8px;background:#f5f5f5;font-size:11px;">Pts</th></tr></thead>
<tbody>${answerRows}</tbody>
</table>
</body></html>`;
}

// ── upsertZohoCRM ─────────────────────────────────────────────────────────────

async function upsertZohoCRM(data: {
  email: string; firstName: string; lastName: string;
  orgName: string; orgUrl: string;
  score: number; scoreBand: string; tierRecommendation: string;
  primaryGap: string; orgType: string;
  seniority: string; sectorKey: string; flagshipProgramme: string;
}): Promise<void> {
  const clientId     = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.log("[zoho] Credentials not configured — skipping CRM upsert");
    return;
  }

  // Get access token
  const tokenRes = await fetch(
    `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`,
    { method: "POST" }
  );
  if (!tokenRes.ok) {
    throw new Error(`Zoho token refresh failed: ${tokenRes.status}`);
  }
  const { access_token } = await tokenRes.json() as { access_token: string };

  const payload = {
    data: [{
      Email: data.email,
      First_Name: data.firstName,
      Last_Name: data.lastName,
      Account_Name: data.orgName,
      Website: data.orgUrl || undefined,
      Lead_Source: "Evidence Health Check",
      // Custom fields
      HC_Score: data.score,
      HC_Score_Band: data.scoreBand,
      HC_Tier: data.tierRecommendation,
      HC_Primary_Gap: data.primaryGap,
      HC_Org_Type: data.orgType,
      HC_Seniority: data.seniority,
      HC_Sector: data.sectorKey,
      HC_Flagship_Programme: data.flagshipProgramme,
      HC_Submitted_At: new Date().toISOString(),
    }],
    duplicate_check_fields: ["Email"],
  };

  const upsertRes = await fetch("https://www.zohoapis.com/crm/v2/Leads/upsert", {
    method: "POST",
    headers: {
      "Authorization": `Zoho-oauthtoken ${access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!upsertRes.ok) {
    const err = await upsertRes.text();
    throw new Error(`Zoho CRM upsert failed: ${upsertRes.status} ${err}`);
  }
  console.log("[zoho] CRM upsert complete for", data.email);
}

export { sanitiseAIOutput };
