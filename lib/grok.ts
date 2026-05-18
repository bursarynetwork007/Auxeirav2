// Grok API client — real-time web search for org research and weekly topic discovery.
// Grok handles all organisation research for the Evidence Health Check (Phase 1).
// No Manus dependency.

const GROK_BASE = "https://api.x.ai/v1";

export interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GrokSearchResult {
  title: string;
  url: string;
  snippet: string;
  published_at?: string;
  source?: string;
}

export interface GrokTopicDiscoveryResult {
  topics: Array<{
    title: string;
    summary: string;
    sector: string;
    relevance_score: number; // 1–10
    sources: GrokSearchResult[];
  }>;
  generated_at: string;
}

function grokHeaders(): HeadersInit {
  // XAI_API_KEY is the canonical env var name (matches SSM and Amplify config)
  const key = process.env.XAI_API_KEY ?? process.env.GROK_API_KEY ?? "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${key}`,
  };
}

// ── Core chat completion ──────────────────────────────────────────────────────
// Uses /v1/responses (Agent Tools API) when search=true, /v1/chat/completions otherwise.

export async function grokChat(
  messages: GrokMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    search?: boolean;
  } = {}
): Promise<string> {
  const {
    model = "grok-3",
    temperature = 0.3,
    max_tokens = 2000,
    search = false,
  } = options;

  if (search) {
    // Agent Tools API — /v1/responses with web_search tool
    const body: Record<string, unknown> = {
      model,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature,
      max_output_tokens: max_tokens,
      tools: [{ type: "web_search" }],
    };

    const res = await fetch(`${GROK_BASE}/responses`, {
      method: "POST",
      headers: grokHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Grok API error ${res.status}: ${err}`);
    }

    const data = await res.json() as {
      output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }>;
    };

    // Extract text from output array
    const text = (data.output ?? [])
      .filter((o) => o.type === "message")
      .flatMap((o) => o.content ?? [])
      .filter((c) => c.type === "output_text")
      .map((c) => c.text ?? "")
      .join("");

    return text;
  }

  // Standard chat completions (no search)
  const body: Record<string, unknown> = {
    model,
    messages,
    temperature,
    max_tokens,
  };

  const res = await fetch(`${GROK_BASE}/chat/completions`, {
    method: "POST",
    headers: grokHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Grok API error ${res.status}: ${err}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content ?? "";
}

// ── Weekly topic discovery ────────────────────────────────────────────────────

const SECTORS = [
  "early childhood development",
  "economic development and livelihoods",
  "education",
  "health systems",
  "social protection",
  "impact investing and philanthropy",
  "government evidence and policy",
];

export async function discoverWeeklyTopics(): Promise<GrokTopicDiscoveryResult> {
  if (!(process.env.XAI_API_KEY ?? process.env.GROK_API_KEY)) {
    throw new Error("XAI_API_KEY not set");
  }

  const sectorList = SECTORS.join(", ");
  const today = new Date().toISOString().split("T")[0];

  const prompt = `You are Auxeira's sector intelligence engine. Today is ${today}.

Search for the most significant news, research, and funder activity from the past 7 days across these sectors in Africa and globally: ${sectorList}.

For each topic found, assess its relevance to organisations that need to translate evidence into funding decisions.

Return a JSON object with this exact structure:
{
  "topics": [
    {
      "title": "concise topic title",
      "summary": "2-3 sentence summary of what happened and why it matters for evidence-based organisations",
      "sector": "one of the sectors listed above",
      "relevance_score": 8,
      "sources": [
        {
          "title": "article or report title",
          "url": "source URL",
          "snippet": "key quote or finding",
          "published_at": "YYYY-MM-DD",
          "source": "publication name"
        }
      ]
    }
  ],
  "generated_at": "${today}"
}

Return 5–8 topics. Prioritise African context. Score relevance 1–10 where 10 = directly actionable for a funder or NGO evidence team.`;

  const raw = await grokChat(
    [{ role: "user", content: prompt }],
    { search: true, temperature: 0.2, max_tokens: 3000 }
  );

  // Extract JSON from response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Grok did not return valid JSON");
  }

  return JSON.parse(jsonMatch[0]) as GrokTopicDiscoveryResult;
}

// ── Theme selection (used by Claude downstream) ───────────────────────────────

export async function selectMonthlyTheme(
  topicBank: GrokTopicDiscoveryResult[]
): Promise<{ theme: string; rationale: string; top_topics: string[] }> {
  if (!(process.env.XAI_API_KEY ?? process.env.GROK_API_KEY)) {
    throw new Error("XAI_API_KEY not set");
  }

  const allTopics = topicBank
    .flatMap((t) => t.topics)
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 15)
    .map((t) => `[${t.relevance_score}/10] ${t.sector}: ${t.title} — ${t.summary}`)
    .join("\n");

  const prompt = `You are selecting the theme for this month's Auxeira Intelligence newsletter.

Auxeira's audience: funders, government officials, and impact leaders who need evidence to drive decisions.

Topic bank (last 4 weeks, sorted by relevance):
${allTopics}

Select the strongest single theme for this month's newsletter. Return JSON:
{
  "theme": "theme title (5–8 words)",
  "rationale": "1-2 sentences on why this theme is timely and relevant to the audience",
  "top_topics": ["topic title 1", "topic title 2", "topic title 3"]
}`;

  const raw = await grokChat(
    [{ role: "user", content: prompt }],
    { temperature: 0.3, max_tokens: 500 }
  );

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Grok theme selection returned no JSON");
  return JSON.parse(jsonMatch[0]);
}

// ── Organisation research (Evidence Health Check — Phase 1) ───────────────────
// Synchronous call with real-time web search. Runs immediately on submission.
// Returns a structured research profile used by Claude to generate the report.

export interface GrokOrgResearch {
  // Core identity
  overview: string;              // mission, programmes, scale, geography
  evidence_landscape: string;    // current evaluation and evidence activity
  funders: string;               // key funders and decision-maker audience
  sector_context: string;        // competitive landscape and sector benchmarks
  gap_risks: string;             // risks tied to the primary evidence gap
  funding_risk_estimate: string; // 3-year funding risk estimate with rand range

  // Leadership
  seniority: "executive" | "senior_manager" | "programme_level";
  ceo_name: string;              // CEO/Director name (empty string if not found)
  person_title: string;          // exact job title of the submitter

  // Sector classification
  sector_key: "ecd" | "education" | "health" | "econ" | "foundation" | "policy" | "government" | "other";
  sector_label: string;          // human-readable sector label for report (e.g. "foundation phase education")

  // Programme identity (for forward box, closing question, value identity)
  flagship_programme: string;    // most prominent named programme or focus area noun phrase

  // Leadership team (for forward box and sector intelligence)
  leadership_team: string;       // comma-separated names and titles

  // Evidence maturity
  evidence_maturity: "outcome" | "output" | "activity"; // most advanced level cited in their comms
  has_sroi: boolean;             // whether any SROI/economic analysis exists publicly

  // Funder relationships (structured)
  named_funders: string[];       // array of named funders from public sources

  // Recent activity
  recent_news: string;           // notable events, awards, publications in last 36 months

  // Raw full briefing text (for Claude user prompt)
  full_briefing: string;
}

// Verbatim from Auxeira_HealthCheck_Spec-2.md Part A
const GROK_ORG_RESEARCH_PROMPT = (
  orgName: string,
  orgUrl: string,
  personFirstName: string,
  personLastName: string,
) => `You are conducting a comprehensive intelligence briefing on an organisation for a senior evidence intelligence consultant. This briefing will be used to write a personalised report that must read as if someone spent two days researching the organisation before picking up a pen.

ORGANISATION: ${orgName}
WEBSITE: ${orgUrl || "not provided — search by organisation name only"}
PERSON WHO COMPLETED THE DIAGNOSTIC: ${personFirstName} ${personLastName}

Research this organisation exhaustively using every available public source. Read the website in full — every page including About, Team, Board, Programmes, Impact, Reports, News, and any downloadable documents. Download and read any annual reports, evaluations, strategy documents, or publications available on the site. Search LinkedIn for both the organisation and the named person. Search for news coverage in the last 36 months. Search for any academic papers, government references, or sector mentions. Look for any awards, recognition, or notable events.

BUILD A COMPLETE INTELLIGENCE PROFILE covering:

WHO THEY ARE
What does this organisation do and who does it serve? What is their founding story and mission? What sector do they operate in — be precise and specific. Note important distinctions (foundation phase education is not ECD; community health is not hospital care). What is their scale — number of beneficiaries, geographic reach, staff size, years of operation?

LEADERSHIP AND DECISION-MAKERS
Who is the CEO or Executive Director? Full name and title. Who else is on the leadership team? List names and roles. Who is on the board? Any notable board members? What is ${personFirstName} ${personLastName}'s exact job title and role? What is their seniority level — are they executive, senior management, or programme level? Have they published anything, spoken at events, or appeared in news coverage? Note what you find.

PROGRAMMES AND INITIATIVES
List every named programme or initiative you can find. For each one: what does it do, who does it serve, what is the geographic scope, and what evidence exists of its outcomes? Are there flagship programmes that define the organisation's identity publicly?

EVIDENCE AND EVALUATION PORTFOLIO
Has the organisation published evaluations, impact reports, or research? List titles, dates, and authors if found. Have they commissioned independent evaluations? Is there any SROI, economic multiplier, or fiscal impact analysis in any of their documents? How do they currently communicate their impact — what language do they use, what metrics do they cite? How mature is their evidence — are they citing outcome data, output data, or primarily activity data?

FUNDER AND GOVERNMENT RELATIONSHIPS
Which funders are named on their website, in reports, or in news coverage? List every foundation, government body, corporate funder, or development finance institution mentioned anywhere. Any evidence of government partnerships, co-funding relationships, or policy influence? Are they mentioned in any government documents, parliamentary submissions, or policy papers?

SECTOR POSITIONING
How does this organisation position itself relative to peers? Are they a sector leader, a mid-tier organisation, or an emerging player? What is their public reputation — are they cited by others, referenced in sector reports, or invited to sector convenings? What is their competitive advantage as stated or implied in their communications?

RECENT ACTIVITY
What has happened in the last 36 months? New programmes, new funders, leadership changes, publications, awards, controversies, strategic pivots? What is the most recent significant thing you can find about this organisation?

FLAGSHIP PROGRAMME
Identify the single most prominent named programme, initiative, or flagship product from all sources. This name is used in the forward box, the closing question, and wherever a specific reference to their work appears. If no single programme dominates, state the primary focus area as a descriptive noun phrase. Examples: "ZenLit", "ReadRight", "foundation phase literacy programme".

Return a JSON object with exactly these keys:

{
  "overview": "2-3 sentences. Mission, programmes, scale, geography. Specific — named programmes, beneficiary numbers, geographic reach.",
  "evidence_landscape": "2-3 sentences. Current evaluation and evidence activity. What evaluations exist. What is published. What is missing.",
  "funders": "1-2 sentences. Key funders and decision-maker audience. Named funders where publicly available.",
  "sector_context": "2-3 sentences. Competitive landscape and sector benchmarks. South Africa-specific where possible.",
  "gap_risks": "2-3 sentences. Specific risks for this organisation. What they are likely losing.",
  "funding_risk_estimate": "1-2 sentences. 3-year funding risk estimate with rand range. Label as estimated.",
  "seniority": "executive OR senior_manager OR programme_level",
  "ceo_name": "Full name of CEO/Executive Director. Empty string if not found.",
  "person_title": "Exact job title of ${personFirstName} ${personLastName}. Empty string if not found.",
  "sector_key": "ecd OR education OR health OR econ OR foundation OR policy OR government OR other",
  "sector_label": "Human-readable sector label. E.g. 'foundation phase education', 'early childhood development', 'community health'.",
  "flagship_programme": "Most prominent named programme or focus area noun phrase.",
  "leadership_team": "Comma-separated names and titles of leadership team members.",
  "evidence_maturity": "outcome OR output OR activity — most advanced level cited in their public communications.",
  "has_sroi": true or false,
  "named_funders": ["Funder 1", "Funder 2"],
  "recent_news": "1-2 sentences on notable events, awards, publications in last 36 months.",
  "full_briefing": "Complete intelligence briefing in prose. All sections above. No length limit. More detail produces a better report. Flag clearly anything you could not find or verify."
}

Return everything you find in a structured intelligence briefing. There is no field limit. More detail produces a better report. Flag clearly anything you could not find or verify.`;

export async function researchOrganisation(params: {
  orgName: string;
  orgUrl: string;
  personFirstName: string;
  personLastName: string;
  primaryGap: string;
  score: number;
}): Promise<GrokOrgResearch> {
  if (!(process.env.XAI_API_KEY ?? process.env.GROK_API_KEY)) {
    throw new Error("XAI_API_KEY not set");
  }

  const raw = await grokChat(
    [
      {
        role: "user",
        content: GROK_ORG_RESEARCH_PROMPT(
          params.orgName,
          params.orgUrl,
          params.personFirstName,
          params.personLastName,
        ),
      },
    ],
    { search: true, temperature: 0.2, max_tokens: 3000 }
  );

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Grok org research returned no JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<GrokOrgResearch>;

  const validSeniority = ["executive", "senior_manager", "programme_level"];
  const validSectorKey = ["ecd", "education", "health", "econ", "foundation", "policy", "government", "other"];

  return {
    overview:               parsed.overview               ?? `${params.orgName} is a South African social sector organisation.`,
    evidence_landscape:     parsed.evidence_landscape     ?? "Evidence landscape data not available from public sources.",
    funders:                parsed.funders                ?? "Funder information not available from public sources.",
    sector_context:         parsed.sector_context         ?? "Sector context not available.",
    gap_risks:              parsed.gap_risks              ?? `The primary gap (${params.primaryGap}) is likely limiting funding and policy traction.`,
    funding_risk_estimate:  parsed.funding_risk_estimate  ?? "Funding risk estimate not available.",
    seniority:              validSeniority.includes(parsed.seniority ?? "")
                              ? (parsed.seniority as GrokOrgResearch["seniority"])
                              : "senior_manager",
    ceo_name:               parsed.ceo_name               ?? "",
    person_title:           parsed.person_title           ?? "",
    sector_key:             validSectorKey.includes(parsed.sector_key ?? "")
                              ? (parsed.sector_key as GrokOrgResearch["sector_key"])
                              : "other",
    sector_label:           parsed.sector_label           ?? "social sector",
    flagship_programme:     parsed.flagship_programme     ?? "",
    leadership_team:        parsed.leadership_team        ?? "",
    evidence_maturity:      (["outcome","output","activity"].includes(parsed.evidence_maturity ?? ""))
                              ? (parsed.evidence_maturity as GrokOrgResearch["evidence_maturity"])
                              : "output",
    has_sroi:               parsed.has_sroi               ?? false,
    named_funders:          Array.isArray(parsed.named_funders) ? parsed.named_funders : [],
    recent_news:            parsed.recent_news            ?? "",
    full_briefing:          parsed.full_briefing          ?? raw,
  };
}
