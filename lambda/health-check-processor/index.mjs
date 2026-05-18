// Health Check Processor Lambda
// Triggered by SNS. Runs Grok research + Claude report + ZeptoMail delivery.
// Timeout: 15 minutes. Memory: 1024 MB.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import Anthropic from "@anthropic-ai/sdk";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const TABLE = process.env.DYNAMODB_HEALTH_CHECK_TABLE ?? "auxeira-health-checks";

// ── ZeptoMail sender ──────────────────────────────────────────────────────────
async function sendEmail({ to, subject, html, text }) {
  const token = process.env.ZEPTOMAIL_TOKEN;
  const res = await fetch("https://api.zeptomail.com/v1.1/email", {
    method: "POST",
    headers: { "Authorization": `Zoho-enczapikey ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: { address: "info@auxeira.com", name: "Lante at Auxeira" },
      to: [{ email_address: { address: to } }],
      reply_to: [{ address: "info@auxeira.com" }],
      subject,
      htmlbody: html,
      textbody: text ?? subject,
      headers: { "List-Unsubscribe": "<mailto:info@auxeira.com?subject=unsubscribe>" },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ZeptoMail ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Template injection ────────────────────────────────────────────────────────
function injectTemplate(template, vars) {
  let html = template;
  for (const [k, v] of Object.entries(vars)) {
    html = html.replaceAll(`{{${k}}}`, v ?? "");
  }
  // Remove conditional blocks if empty
  if (!vars.forward_box_html) {
    html = html.replace(/<!--\s*FORWARD_BOX_START\s*-->[\s\S]*?<!--\s*FORWARD_BOX_END\s*-->/g, "");
  }
  if (!vars.pilot_diagnostic_text) {
    html = html.replace(/<!--\s*PILOT_DIAG_START\s*-->[\s\S]*?<!--\s*PILOT_DIAG_END\s*-->/g, "");
  }
  return html;
}

// ── Build plain text fallback ─────────────────────────────────────────────────
function buildPlainText(v, firstName, orgName, s) {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta";
  return [
    `Your Auxeira Evidence Risk Report - ${orgName}`,
    ``,`${firstName},`,``,
    v.score_headline ?? "",``,
    `EVIDENCE HEALTH SCORE: ${s}/100`,
    `${v.tier_label} | ${v.urgency_label}`,``,
    `KEY PROJECTIONS`,
    `Funding at risk: ${v.funding_at_risk}`,
    `Influence gap: ${v.influence_gap}`,
    `Opportunity cost: ${v.opportunity_cost}`,``,
    `GAP 1 - ${v.gap1_title}`, v.gap1_body, v.gap1_cost,``,
    `GAP 2 - ${v.gap2_title}`, v.gap2_body, v.gap2_cost,``,
    `RECOMMENDATION`, v.rec_body,``,
    v.closing_question,``,
    `Book your Evidence Strategy Call: ${url}`,``,
    `Auxeira | info@auxeira.com | auxeira.com`,
    `To unsubscribe reply with "unsubscribe" in the subject line.`,
  ].join("\n");
}

// ── Main processor ────────────────────────────────────────────────────────────
async function processSubmission(sub) {
  const { id, email, firstName, lastName, orgName, orgUrl, answers } = sub;
  const s = score(answers);
  const oType = orgType(answers);
  const prog_gap = primaryGapLabel(answers);
  const tier = tierLabel(answers);
  const band = scoreBandLabel(s);
  const gaps = topGaps(answers);
  const audience = primaryAudience(answers);
  const pilot = pilotDiag(answers);

  console.log(`[processor] Starting pipeline for ${orgName} (${id})`);

  // Step 1: Grok research
  let research = null;
  try {
    research = await grokResearch(orgName, orgUrl, firstName, lastName);
    console.log(`[processor] Grok complete. sector=${research.sector_key} seniority=${research.seniority}`);
  } catch (e) {
    console.error("[processor] Grok failed:", e.message);
    research = {
      overview: `${orgName} is a South African social sector organisation.`,
      evidence_landscape: "Not available.", funders: "Not available.",
      sector_context: "Not available.", gap_risks: "Not available.",
      funding_risk_estimate: "Not available.",
      seniority: "senior_manager", ceo_name: "", person_title: "",
      sector_key: "other", sector_label: "social sector",
      flagship_programme: orgName, leadership_team: "",
      evidence_maturity: "output", has_sroi: false,
      named_funders: [], recent_news: "", full_briefing: "",
    };
  }

  // Step 2: Claude report
  let vars = null;
  try {
    const raw = await claudeReport(sub, research);
    const prog = research.flagship_programme ?? orgName;
    const s2 = (k, fb="") => sanitise(raw[k] ?? fb);

    // Build stakeholder and policy window HTML rows
    let stakeholderRowsHtml = "";
    let policyWindowsHtml = "";
    try {
      const sh = JSON.parse(raw.stakeholders_json ?? "[]");
      stakeholderRowsHtml = sh.map(r=>`<tr><td style="padding:6px 8px;font-size:11px;border-bottom:.5px solid #EEE">${r.name}</td><td style="padding:6px 8px;font-size:11px;color:#555;border-bottom:.5px solid #EEE">${r.role}</td><td style="padding:6px 8px;font-size:11px;font-weight:700;color:#1D9E75;text-align:center;border-bottom:.5px solid #EEE">${r.now_pct}%</td><td style="padding:6px 8px;font-size:11px;font-weight:700;color:#E24B4A;text-align:center;border-bottom:.5px solid #EEE">${r.m48_pct}%</td></tr>`).join("");
    } catch {}
    try {
      const pw = JSON.parse(raw.policy_windows_json ?? "[]");
      policyWindowsHtml = pw.map(r=>`<tr><td style="padding:6px 8px;font-size:11px;border-bottom:.5px solid #EEE">${r.name}</td><td style="padding:6px 8px;font-size:11px;color:#555;border-bottom:.5px solid #EEE">${r.body}</td><td style="padding:6px 8px;font-size:11px;text-align:center;border-bottom:.5px solid #EEE">${r.freq}</td><td style="padding:6px 8px;font-size:11px;color:#C9A84C;font-weight:700;text-align:center;border-bottom:.5px solid #EEE">${r.deadline}</td><td style="padding:6px 8px;font-size:11px;color:#E24B4A;text-align:center;border-bottom:.5px solid #EEE">${r.prob_b_pct}</td></tr>`).join("");
    } catch {}

    const forwardBoxHtml = research.seniority !== "executive" && research.ceo_name
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF7FF;border:0.5px solid #B5D4F4;border-radius:8px;margin-bottom:12px;"><tr><td style="padding:10px 14px;font-size:12px;color:#185FA5;line-height:1.6;">${s2("forward_box_body")}</td></tr></table>`
      : "";

    vars = {
      org_name: orgName, first_name: firstName, last_name: lastName,
      score: String(s), score_pct: String(s),
      erc: s>=75?"ERC-A":s>=50?"ERC-B":s>=25?"ERC-C":"ERC-D",
      erc_color: s>=75?"#1D9E75":s>=50?"#C9A84C":s>=25?"#D85A30":"#E24B4A",
      erc_bg: s>=75?"rgba(29,158,117,0.12)":s>=50?"rgba(201,168,76,0.15)":s>=25?"rgba(216,90,48,0.12)":"rgba(226,75,74,0.12)",
      risk_level: s>=75?"Low risk":s>=50?"Medium risk":s>=25?"High risk":"Critical risk",
      score_band: band, score_headline: s2("score_headline"),
      report_date: new Date().toLocaleDateString("en-ZA",{day:"numeric",month:"long",year:"numeric"}),
      sector_avg: "52", sector_peer_count: "47",
      funding_at_risk: s2("funding_at_risk","R8M-R18M"),
      influence_gap: s2("influence_gap","35-50%"),
      opportunity_cost: s2("opportunity_cost","R25-40M over 3 years"),
      gap1_title: s2("gap1_title"), gap1_q_ref: gaps[0]?.q?.toUpperCase()??"Q4",
      gap1_body: s2("gap1_body"), gap1_cost: s2("gap1_cost"),
      gap2_title: s2("gap2_title"), gap2_q_ref: gaps[1]?.q?.toUpperCase()??"Q5",
      gap2_body: s2("gap2_body"), gap2_cost: s2("gap2_cost"),
      sector_context: s2("sector_context"),
      sector_metric1_num: s2("sector_metric1_num","3.3x"), sector_metric1_desc: s2("sector_metric1_desc","SROI verified"),
      sector_metric2_num: s2("sector_metric2_num","30-40%"), sector_metric2_desc: s2("sector_metric2_desc","less co-funding"),
      sector_metric3_num: s2("sector_metric3_num","70%"), sector_metric3_desc: s2("sector_metric3_desc","proposals deprioritised"),
      scenario_nothing: s2("scenario_nothing"), scenario_partial: s2("scenario_partial"), scenario_full: s2("scenario_full"),
      recovery_value: s2("recovery_value","R25-40M"),
      risk1_title: s2("risk1_title"), risk1_body: s2("risk1_body"),
      risk2_title: s2("risk2_title"), risk2_body: s2("risk2_body"),
      risk3_title: s2("risk3_title"), risk3_body: s2("risk3_body"),
      market_loss_leading_question: s2("market_loss_leading_question"),
      leverage_now: String(s), leverage_48m: s2("leverage_48m","28"),
      tipping_month: s2("tipping_month","22"), cumulative_loss: s2("cumulative_loss","R30M+"),
      sector_position_now: s2("sector_position_now","Top 40%"), sector_position_48m: s2("sector_position_48m","Bottom 35%"),
      loss_year1: s2("loss_year1","8"), loss_year2: s2("loss_year2","13"),
      loss_year3: s2("loss_year3","13"), loss_year4: s2("loss_year4","13"),
      value_identity_leading_question: s2("value_identity_leading_question"),
      value1_label: s2("value1_label","Evidence influence"),
      value1_label_lower: s2("value1_label","evidence influence").toLowerCase(),
      value1_metric: s2("value1_metric","Policy decisions informed annually"),
      value1_now: s2("value1_now","14"), value1_48m: s2("value1_48m","5"), value1_pct_decline: s2("value1_pct_decline","64%"),
      value2_label: s2("value2_label","Knowledge reach"),
      value2_label_lower: s2("value2_label","knowledge reach").toLowerCase(),
      value2_metric: s2("value2_metric","Practitioners using your findings"),
      value2_now: s2("value2_now","2840"), value2_48m: s2("value2_48m","1020"), value2_pct_decline: s2("value2_pct_decline","64%"),
      policy_windows: s2("policy_windows","26"), policy_expected_b: s2("policy_expected_b","9"),
      policy_expected_a: s2("policy_expected_a","16"), policy_gap: s2("policy_gap","7"),
      policy_value_low: s2("policy_value_low","R10M"), policy_value_high: s2("policy_value_high","R28M"),
      compound_b_pct: s2("compound_b_pct","3%"), compound_a_pct: s2("compound_a_pct","31%"),
      stakeholder_count: s2("stakeholder_count","5"),
      stakeholder_now_pct: s2("stakeholder_now_pct","60%"), stakeholder_48m_pct: s2("stakeholder_48m_pct","25%"),
      stakeholder_rows: stakeholderRowsHtml, policy_windows_rows: policyWindowsHtml,
      market_context_body: s2("market_context_body"),
      mkt_metric1_num: s2("mkt_metric1_num","47"), mkt_metric1_desc: s2("mkt_metric1_desc","comparable organisations"),
      mkt_metric2_num: s2("mkt_metric2_num","68%"), mkt_metric2_desc: s2("mkt_metric2_desc","sector funding shift"),
      mkt_metric3_num: s2("mkt_metric3_num","R2.1B"), mkt_metric3_desc: s2("mkt_metric3_desc","sector funding pool"),
      intel_landscape: s2("intel_landscape"), intel_risk: s2("intel_risk"), intel_opportunity: s2("intel_opportunity"),
      proof_bridge: s2("proof_bridge"),
      tier_label: tier, urgency_label: s2("urgency_label","Within 3 months"),
      rec_body: s2("rec_body"), closing_question: s2("closing_question"),
      tier_price: s>=75?"R85,000 - R150,000":"R180,000 - R350,000",
      tier_timeline: s>=75?"3-6 weeks":"6-10 weeks",
      pilot_diagnostic_text: pilot ? "A 3-week Portfolio Evidence Diagnostic at R85,000 - R150,000 provides the evidence base for the full partnership conversation." : "",
      ceo_name: research.ceo_name ?? "", programme_name: prog,
      primary_audience_label: audience,
      forward_box_html: forwardBoxHtml,
      calendly_url: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://auxeira.com/#cta",
      scoring_rows: "", raw_score: String(sub.rawScore ?? 0),
      above_below: s >= 52 ? "above" : "below",
      score_vs_avg: String(Math.abs(s - 52)),
      sector_label: research.sector_label ?? "social sector",
    };
    console.log(`[processor] Claude complete.`);
  } catch (e) {
    console.error("[processor] Claude failed:", e.message);
  }

  // Step 3: Email delay 25-55 minutes
  const delayMs = (25 + Math.floor(Math.random() * 31)) * 60 * 1000;
  console.log(`[processor] Waiting ${Math.round(delayMs/60000)} min before sending report email`);
  await new Promise(r => setTimeout(r, delayMs));

  // Step 4: Send report email
  let reportStatus = "failed";
  let reportError = "";
  if (vars) {
    try {
      const templateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auxeira_health_check_email_template.html`;
      let template = "";
      try {
        const tr = await fetch(templateUrl);
        if (tr.ok) template = await tr.text();
      } catch {}

      if (!template) {
        // Minimal fallback if template not fetchable
        template = `<html><body style="font-family:Arial,sans-serif;color:#1A1A2A;max-width:600px;margin:0 auto;padding:20px">
<h2>Your Auxeira Evidence Risk Report</h2>
<p>{{first_name}},</p><p>{{score_headline}}</p>
<p><strong>Score: {{score}}/100</strong> | {{erc}} | {{risk_level}}</p>
<p><strong>Funding at risk:</strong> {{funding_at_risk}}<br>
<strong>Influence gap:</strong> {{influence_gap}}<br>
<strong>Opportunity cost:</strong> {{opportunity_cost}}</p>
<h3>{{gap1_title}}</h3><p>{{gap1_body}}</p><p>{{gap1_cost}}</p>
<h3>{{gap2_title}}</h3><p>{{gap2_body}}</p><p>{{gap2_cost}}</p>
<h3>Recommendation</h3><p>{{rec_body}}</p><p>{{closing_question}}</p>
<p><a href="{{calendly_url}}">Book your Evidence Strategy Call</a></p>
<p style="font-size:11px;color:#888">Auxeira | info@auxeira.com | auxeira.com<br>
To unsubscribe reply with "unsubscribe" in the subject line.</p>
</body></html>`;
      }

      const html = injectTemplate(template, vars);
      const text = buildPlainText(vars, firstName, orgName, s);
      await sendEmail({
        to: email,
        subject: `Your Auxeira Evidence Risk Report - ${orgName}`,
        html, text,
      });
      reportStatus = "sent";
      console.log(`[processor] Report email sent to ${email}`);
    } catch (e) {
      reportError = e.message;
      console.error("[processor] Report email failed:", e.message);
    }
  }

  // Step 5: Lead notification (no delay)
  let notifyStatus = "failed";
  try {
    const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL ?? "info@auxeira.com";
    const notifyHtml = `<html><body style="font-family:Arial,sans-serif;font-size:13px;color:#1A1A2A">
<h2>New Health Check: ${orgName} - Score ${s}/100</h2>
<p><strong>${firstName} ${lastName}</strong> &lt;${email}&gt;<br>
<strong>Org:</strong> ${orgName} | <strong>URL:</strong> ${orgUrl||"n/a"}<br>
<strong>Score:</strong> ${s}/100 | <strong>Band:</strong> ${band}<br>
<strong>Tier:</strong> ${tier} | <strong>Org type:</strong> ${oType}<br>
<strong>Primary gap:</strong> ${prog_gap}<br>
<strong>Seniority:</strong> ${research.seniority} | <strong>CEO:</strong> ${research.ceo_name||"not found"}<br>
<strong>Sector:</strong> ${research.sector_key} | <strong>Flagship:</strong> ${research.flagship_programme}</p>
<p><strong>Grok overview:</strong> ${research.overview}</p>
<p><strong>Report email:</strong> ${reportStatus}${reportError?" - "+reportError:""}</p>
</body></html>`;
    await sendEmail({ to: notifyTo, subject: `New Health Check: ${orgName} - Score ${s}/100`, html: notifyHtml });
    notifyStatus = "sent";
    console.log(`[processor] Lead notification sent`);
  } catch (e) {
    console.error("[processor] Lead notification failed:", e.message);
  }

  // Step 6: Update DynamoDB
  try {
    await dynamo.send(new PutCommand({
      TableName: TABLE,
      Item: {
        id, email, firstName, lastName, orgName, orgUrl,
        answers, score: s, scoreBand: band,
        tierRecommendation: tier, orgType: oType,
        reportStatus, reportSentAt: reportStatus==="sent" ? new Date().toISOString() : null,
        seniority: research.seniority, sectorKey: research.sector_key,
        flagshipProgramme: research.flagship_programme,
        timestamp: sub.timestamp ?? new Date().toISOString(),
      },
    }));
    // Audit record
    await dynamo.send(new PutCommand({
      TableName: TABLE,
      Item: {
        id: `email-audit-${id}`,
        submissionId: id, email, orgName, score: s,
        notifyEmailStatus: notifyStatus,
        reportEmailStatus: reportStatus,
        reportEmailError: reportError || null,
        processedAt: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      },
    }));
    console.log(`[processor] DynamoDB updated. reportStatus=${reportStatus}`);
  } catch (e) {
    console.error("[processor] DynamoDB update failed:", e.message);
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────
export const handler = async (event) => {
  for (const record of event.Records) {
    const payload = JSON.parse(record.Sns.Message);
    await processSubmission(payload);
  }
};

// ── Scoring helpers (inlined — no shared lib in Lambda) ───────────────────────
const SCORING = {
  q1:[10,8,6,7,5], q2:[14,12,10,8,6], q3:[14,11,7,4],
  q4:[15,8,4,2],   q5:[15,8,4,2],     q6:[12,8,6,4],
  q7:[2,6,10,4],   q8:[5,8,11,14],
};
const ANSWER_TEXT = {
  q1:["National NGO or delivery organisation","Foundation or funder","Government department or agency","International philanthropy / dev agency","Sector body or intermediary"],
  q2:["Treasury or National Government","International funders","Provincial government","Board or executive leadership","Multiple audiences simultaneously"],
  q3:["More than 10 years","5-10 years","2-5 years","Less than 2 years"],
  q4:["They read it in full and responded substantively","They asked for a shorter summary","We followed up but heard little back","We genuinely don't know if it was read"],
  q5:["Yes - actively used in funder conversations","Yes - but not being used effectively","No - but we know we need one","No - not sure it applies to us"],
  q6:["We have strong data but decision-makers aren't acting on it","We haven't measured our economic or social return","Our reports don't reach the right people in the right format","We don't have enough data or evaluations yet"],
  q7:["Regularly - it is a constant request","Occasionally","Rarely","Never - but our reports still don't seem to land"],
  q8:["Under R5 million","R5M - R20M","R20M - R100M","Over R100M"],
};
const ORG_TYPE = ["delivery","foundation_funder","delivery_government","foundation_funder","consultant"];
const SHOW_PILOT = [false,true,false,true,false];
const PRIMARY_AUDIENCE = [
  "Treasury / DBE / Provincial Govt / Funders",
  "Co-funders / Treasury / International philanthropy / Board",
  "Treasury / Portfolio Committee / Executive / Cabinet",
  "Board / Co-investors / Host government / Donor government",
  "Member organisations / Funders / Government",
];
const GAP_LABELS = ["Translation Gap","Economic Evidence Gap","Communication Architecture Gap","Evidence Foundation Gap"];
const Q_MAX = {q1:10,q2:14,q3:14,q4:15,q5:15,q6:12,q7:10,q8:14};

function pts(q,i){ return SCORING[q]?.[i] ?? 0; }
function rawScore(a){ return Object.keys(SCORING).reduce((s,q)=>s+pts(q,a[q]),0); }
function score(a){ return Math.round((rawScore(a)/104)*100); }
function orgType(a){ return ORG_TYPE[a.q1] ?? "delivery"; }
function pilotDiag(a){ return SHOW_PILOT[a.q1] ?? false; }
function primaryAudience(a){ return PRIMARY_AUDIENCE[a.q1] ?? "Funders / Government"; }
function primaryGapLabel(a){ return GAP_LABELS[a.q6] ?? "Translation Gap"; }
function topGaps(a){
  return Object.keys(SCORING).filter(q=>q!=="q8")
    .map(q=>({q, deficit: Q_MAX[q]-pts(q,a[q])}))
    .sort((x,y)=>y.deficit-x.deficit).slice(0,2);
}
function scoreBandLabel(s){
  if(s>=75) return "Strong foundation";
  if(s>=50) return "Solid base, significant gap";
  if(s>=25) return "Significant gaps, urgent";
  return "Critical gaps";
}
function tierLabel(a){
  const s=score(a), q8=a.q8, q1=a.q1, q6=a.q6;
  const isFF=q1===1||q1===3, isPC=q6===1||q6===3;
  if(isFF&&isPC) return "Tier 3 - Sector Intelligence Platform";
  if(q8===3) return isPC?"Tier 3 - Sector Intelligence Platform":"Tier 2 - Evidence Synthesis and Strategy";
  if(q8===2) return "Tier 2 - Evidence Synthesis and Strategy";
  if(q8===1&&isPC&&s>=25&&s<=74) return "Tier 2 - Evidence Synthesis and Strategy";
  return "Tier 1 - Evidence Translation";
}
function sanitise(t){
  return (t||"")
    .replace(/\s*—\s*/g," - ").replace(/–/g,"-").replace(/!/g,".")
    .replace(/\bleverage\b/gi,"use").replace(/\bsynergies\b/gi,"shared strengths")
    .trim();
}

// ── Grok research ─────────────────────────────────────────────────────────────
async function grokResearch(orgName, orgUrl, firstName, lastName) {
  const key = process.env.XAI_API_KEY ?? process.env.GROK_API_KEY;
  const prompt = `You are conducting a comprehensive intelligence briefing on "${orgName}" (website: ${orgUrl||"search by name"}) for a senior evidence consultant. Person who completed the diagnostic: ${firstName} ${lastName}.

Research exhaustively: website, annual reports, LinkedIn, news (last 36 months), funders, evaluations, leadership team, programmes.

Return JSON only:
{
  "overview": "2-3 sentences. Mission, programmes, scale, geography.",
  "evidence_landscape": "2-3 sentences. Evaluations, publications, what is missing.",
  "funders": "1-2 sentences. Named funders.",
  "sector_context": "2-3 sentences. SA-specific benchmarks.",
  "gap_risks": "2-3 sentences. Specific risks for this org.",
  "funding_risk_estimate": "1-2 sentences. 3-year rand range estimate.",
  "seniority": "executive OR senior_manager OR programme_level",
  "ceo_name": "Full name or empty string",
  "person_title": "Exact job title of ${firstName} ${lastName} or empty string",
  "sector_key": "ecd OR education OR health OR econ OR foundation OR policy OR government OR other",
  "sector_label": "Human-readable sector label",
  "flagship_programme": "Most prominent named programme or focus area",
  "leadership_team": "Comma-separated names and titles",
  "evidence_maturity": "outcome OR output OR activity",
  "has_sroi": true or false,
  "named_funders": ["Funder 1"],
  "recent_news": "1-2 sentences on notable events last 36 months.",
  "full_briefing": "Complete prose briefing. No length limit."
}`;

  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "grok-3",
      input: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search" }],
      max_output_tokens: 3000,
      temperature: 0.2,
    }),
  });
  if (!res.ok) throw new Error(`Grok API ${res.status}`);
  const data = await res.json();
  const text = data.output?.filter(b=>b.type==="message")
    .flatMap(b=>b.content).filter(c=>c.type==="output_text")
    .map(c=>c.text).join("") ?? "";
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Grok returned no JSON");
  const p = JSON.parse(m[0]);
  const validSen = ["executive","senior_manager","programme_level"];
  const validSec = ["ecd","education","health","econ","foundation","policy","government","other"];
  return {
    overview:            p.overview            ?? `${orgName} is a South African social sector organisation.`,
    evidence_landscape:  p.evidence_landscape  ?? "Evidence landscape not available.",
    funders:             p.funders             ?? "Funder information not available.",
    sector_context:      p.sector_context      ?? "Sector context not available.",
    gap_risks:           p.gap_risks           ?? "Gap risks not available.",
    funding_risk_estimate: p.funding_risk_estimate ?? "Funding risk estimate not available.",
    seniority:           validSen.includes(p.seniority) ? p.seniority : "senior_manager",
    ceo_name:            p.ceo_name            ?? "",
    person_title:        p.person_title        ?? "",
    sector_key:          validSec.includes(p.sector_key) ? p.sector_key : "other",
    sector_label:        p.sector_label        ?? "social sector",
    flagship_programme:  p.flagship_programme  ?? orgName,
    leadership_team:     p.leadership_team     ?? "",
    evidence_maturity:   ["outcome","output","activity"].includes(p.evidence_maturity) ? p.evidence_maturity : "output",
    has_sroi:            p.has_sroi            ?? false,
    named_funders:       Array.isArray(p.named_funders) ? p.named_funders : [],
    recent_news:         p.recent_news         ?? "",
    full_briefing:       p.full_briefing       ?? text,
  };
}

// ── Claude report generation ──────────────────────────────────────────────────
async function claudeReport(sub, research) {
  const { firstName, lastName, orgName, answers } = sub;
  const s = score(answers);
  const gaps = topGaps(answers);
  const oType = orgType(answers);
  const prog = research.flagship_programme ?? orgName;
  const audience = primaryAudience(answers);
  const pilot = pilotDiag(answers);
  const tier = tierLabel(answers);

  const qLabels = {q1:"Organisation type",q2:"Primary audience",q3:"Years of data",
    q4:"Last report response",q5:"SROI status",q6:"Biggest challenge",
    q7:"Simplify requests",q8:"Annual budget"};
  const answerSummary = Object.keys(SCORING)
    .map(k=>`${qLabels[k]}: ${ANSWER_TEXT[k]?.[answers[k]]} (${pts(k,answers[k])} pts)`)
    .join("\n");

  const system = `You are a senior evidence intelligence consultant at Auxeira, Johannesburg.
Tone: warm, intelligent, non-salesy, evidence-forward.
Never use exclamation marks. Never use em dashes. Never use bullet points in body copy.
Never reference AI, Claude, or any technology. Write as a trusted human advisor.
SURVEILLANCE RULE: Never say "we researched you" or "we found" or "we noticed."
PROOF POINT BRIDGE: Never compare subscriber to SmartStart directly. Bridge via methodology only.
ORG TYPE REGISTER: org_type=${oType}. ${oType==="foundation_funder"?"Never use 'gap' or 'problem' as primary framing. Use 'unmeasured' or 'not yet visible'. Replace 'fix' with 'unlock'.":""}`;

  const user = `Generate all 18 report sections for ${orgName}.

SUBSCRIBER: ${firstName} ${lastName} | ${oType} | seniority: ${research.seniority}
CEO: ${research.ceo_name||"not identified"} | Programme: ${prog} | Audience: ${audience}
Score: ${s}/100 | Band: ${scoreBandLabel(s)} | Tier: ${tier}
Gap 1: ${gaps[0]?.q} (deficit ${gaps[0]?.deficit}) | Gap 2: ${gaps[1]?.q} (deficit ${gaps[1]?.deficit})
Primary gap: ${primaryGapLabel(answers)}

GROK BRIEFING:
${research.full_briefing}

Return JSON with exactly these keys (all strings, no markdown, no line breaks in values):
{
  "score_headline":"1 sentence about this org's score.",
  "funding_at_risk":"Rand range e.g. R8M-R18M",
  "influence_gap":"Percentage range e.g. 35-50%",
  "opportunity_cost":"Rand range over 3 years",
  "gap1_title":"3-5 words",
  "gap1_body":"3-4 sentences specific to this org.",
  "gap1_cost":"1 sentence cost estimate.",
  "gap2_title":"3-5 words",
  "gap2_body":"3-4 sentences specific to this org.",
  "gap2_cost":"1 sentence cost estimate.",
  "sector_context":"4-5 sentences SA-specific with one data point.",
  "sector_metric1_num":"e.g. 3.3x","sector_metric1_desc":"short label",
  "sector_metric2_num":"e.g. 30-40%","sector_metric2_desc":"short label",
  "sector_metric3_num":"e.g. 70%","sector_metric3_desc":"short label",
  "scenario_nothing":"3 sentences. No action over 3 years.",
  "scenario_partial":"3 sentences. One gap addressed.",
  "scenario_full":"3 sentences. Full ${tier} engagement.",
  "recovery_value":"Rand range",
  "risk1_title":"4-6 words","risk1_body":"2-3 sentences.",
  "risk2_title":"4-6 words","risk2_body":"2-3 sentences.",
  "risk3_title":"4-6 words","risk3_body":"2-3 sentences.",
  "market_loss_leading_question":"1 sentence at START of section.",
  "leverage_now":"${s}","leverage_48m":"projected score at month 48",
  "tipping_month":"month sector avg crosses their score",
  "cumulative_loss":"total 4-year attrition",
  "sector_position_now":"e.g. Top 40%","sector_position_48m":"e.g. Bottom 35%",
  "loss_year1":"millions","loss_year2":"millions","loss_year3":"millions","loss_year4":"millions",
  "value_identity_leading_question":"1 sentence at START of section.",
  "value1_label":"metric label","value1_metric":"unit",
  "value1_now":"current figure","value1_48m":"month 48 figure","value1_pct_decline":"e.g. 64%",
  "value2_label":"metric label","value2_metric":"unit",
  "value2_now":"current figure","value2_48m":"month 48 figure","value2_pct_decline":"e.g. 64%",
  "policy_windows":"number","policy_expected_b":"number","policy_expected_a":"number","policy_gap":"number",
  "policy_value_low":"e.g. R10M","policy_value_high":"e.g. R28M",
  "compound_b_pct":"e.g. 3%","compound_a_pct":"e.g. 31%",
  "stakeholder_count":"number","stakeholder_now_pct":"e.g. 60%","stakeholder_48m_pct":"e.g. 25%",
  "stakeholders_json":"[{name,role,now_pct,m48_pct}] 4-6 rows",
  "policy_windows_json":"[{name,body,freq,deadline,count,prob_b_pct}] 4-6 rows",
  "market_context_body":"3-4 sentences.",
  "mkt_metric1_num":"","mkt_metric1_desc":"","mkt_metric2_num":"","mkt_metric2_desc":"","mkt_metric3_num":"","mkt_metric3_desc":"",
  "intel_landscape":"LANDSCAPE sentence.",
  "intel_risk":"RISK sentence.",
  "intel_opportunity":"OPPORTUNITY sentence referencing Auxeira.",
  "proof_bridge":"2-3 sentences. Methodology bridge only.",
  "urgency_label":"Urgent OR Within 3 months OR Within 6 months",
  "rec_body":"3-4 sentences concrete output for this org.",
  "closing_question":"1 sentence naming ${prog} and a specific upcoming cycle.",
  "forward_box_body":"${research.seniority!=="executive"&&research.ceo_name?`Forward box text referencing ${research.ceo_name} and ${prog}.`:""}"
}`;

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4000,
    system,
    messages: [{ role: "user", content: user }],
  });
  const raw = msg.content.filter(b=>b.type==="text").map(b=>b.text).join("").trim();
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Claude returned no JSON");
  return JSON.parse(m[0]);
}
