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
  overview: string;              // mission, programmes, scale, geography
  evidence_landscape: string;    // current evaluation and evidence activity
  funders: string;               // key funders and decision-maker audience
  sector_context: string;        // competitive landscape and sector benchmarks
  gap_risks: string;             // risks tied to the primary evidence gap
  funding_risk_estimate: string; // 3-year funding risk estimate with rand range
  seniority: "executive" | "senior_manager" | "programme_level";
  ceo_name: string;              // CEO/Director name (empty string if not found)
  sector_key: "ecd" | "health" | "econ" | "other"; // for projections and risks
}

// Prompt verbatim from EVIDENCE_HEALTH_CHECK.md Part A
const GROK_ORG_RESEARCH_PROMPT = (
  orgName: string,
  orgUrl: string,
  personName: string,
  primaryGap: string,
  score: number
) => `Research the organisation "${orgName}" thoroughly using real-time web search.

Person who completed the diagnostic: ${personName}
Organisation website: ${orgUrl || "not provided — search by organisation name"}
Primary evidence gap identified: ${primaryGap}
Evidence Health Score: ${score}/100

Search for: website content, annual reports, publications, LinkedIn profiles,
news coverage, funder relationships, recent activity, awards, and any publicly
available programme data.

Return a JSON object with exactly these keys:

{
  "overview": "Organisation mission, programmes, scale, and geography. 2-3 sentences. Specific — named programmes, beneficiary numbers, geographic reach.",
  "evidence_landscape": "Current evaluation and evidence activity. What evaluations exist. What is published. What is missing. 2-3 sentences.",
  "funders": "Key funders and decision-maker audience. Named funders where publicly available. 1-2 sentences.",
  "sector_context": "Competitive landscape and sector benchmarks relevant to this organisation. South Africa-specific where possible. 2-3 sentences.",
  "gap_risks": "Specific risks tied to the primary gap '${primaryGap}' for this organisation. What they are likely losing. 2-3 sentences.",
  "funding_risk_estimate": "3-year funding risk estimate with a rand range calibrated to their scale. Label as estimated based on sector benchmarks. 1-2 sentences.",
  "seniority": "executive OR senior_manager OR programme_level — inferred from ${personName}'s likely role at ${orgName}",
  "ceo_name": "Full name of the CEO, Executive Director, or equivalent. Empty string if not found.",
  "sector_key": "ecd OR health OR econ OR other — primary sector of this organisation"
}

Be specific to this organisation. Use publicly available information only.
These must be real and verifiable — named programmes, specific publications,
recent events, notable quotes from leadership, awards received.
Not generic observations. Specifics only.

Return everything you find in a structured intelligence briefing.
Flag clearly anything you could not find or verify.`;

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

  const personName = `${params.personFirstName} ${params.personLastName}`.trim();

  const raw = await grokChat(
    [
      {
        role: "user",
        content: GROK_ORG_RESEARCH_PROMPT(
          params.orgName,
          params.orgUrl,
          personName,
          params.primaryGap,
          params.score
        ),
      },
    ],
    { search: true, temperature: 0.2, max_tokens: 2000 }
  );

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Grok org research returned no JSON");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<GrokOrgResearch>;

  // Normalise and provide safe defaults
  return {
    overview:               parsed.overview               ?? `${params.orgName} is a South African social sector organisation.`,
    evidence_landscape:     parsed.evidence_landscape     ?? "Evidence landscape data not available from public sources.",
    funders:                parsed.funders                ?? "Funder information not available from public sources.",
    sector_context:         parsed.sector_context         ?? "Sector context not available.",
    gap_risks:              parsed.gap_risks              ?? `The primary gap (${params.primaryGap}) is likely limiting funding and policy traction.`,
    funding_risk_estimate:  parsed.funding_risk_estimate  ?? "Funding risk estimate not available — calibrate to budget profile.",
    seniority:              (["executive","senior_manager","programme_level"].includes(parsed.seniority ?? ""))
                              ? (parsed.seniority as GrokOrgResearch["seniority"])
                              : "senior_manager",
    ceo_name:               parsed.ceo_name               ?? "",
    sector_key:             (["ecd","health","econ","other"].includes(parsed.sector_key ?? ""))
                              ? (parsed.sector_key as GrokOrgResearch["sector_key"])
                              : "other",
  };
}
