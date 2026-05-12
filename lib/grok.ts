// Grok API client — used for real-time sector news discovery (weekly topic bank)
// Grok's built-in live search replaces the Manus weekly news scraper.
// Manus remains the primary tool for deep single-org research on subscriber onboarding.

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
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROK_API_KEY}`,
  };
}

// ── Core chat completion ──────────────────────────────────────────────────────

export async function grokChat(
  messages: GrokMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    search?: boolean; // enable live web search
  } = {}
): Promise<string> {
  const {
    model = "grok-3",
    temperature = 0.3,
    max_tokens = 2000,
    search = false,
  } = options;

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature,
    max_tokens,
  };

  // Enable Grok's built-in real-time search
  if (search) {
    body.search_parameters = { mode: "auto" };
  }

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
  if (!process.env.GROK_API_KEY) {
    throw new Error("GROK_API_KEY not set");
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
  if (!process.env.GROK_API_KEY) {
    throw new Error("GROK_API_KEY not set");
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
