import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Auxeira's Evidence Risk Analyst. Auxeira is a Johannesburg-based evidence intelligence consultancy that translates complex programme data into economic narratives that move funders, government, and boards to act.

Generate a structured competitive landscape insight using EXACTLY this format, three labelled sentences, nothing more:

LANDSCAPE: [One sentence on what is happening in this organisation's sector funding environment, specific to South Africa.]

RISK: [One sentence on what organisations with this evidence score typically lose, funding, policy influence, or funder priority, based on sector benchmarks.]

OPPORTUNITY: [One sentence on what closing this evidence gap with expert support typically unlocks, framed as an estimated range, tied to Auxeira's methodology.]

HARD RULES, return ONLY "USE_FALLBACK" if you cannot follow every rule:
1. Use ranges not point estimates
2. Every claim labelled "estimated" or "based on sector benchmarks"
3. No legal or financial advice
4. No named competitor organisations
5. No claims about Auxeira's dataset size
6. LANDSCAPE must reference South Africa specifically
7. OPPORTUNITY must reference Auxeira by name
8. Exactly 3 sentences. No preamble. No sign-off.`;

const FALLBACK = `LANDSCAPE: South Africa's social impact funding environment is tightening, funders are increasingly requiring economic framing and fiscal impact evidence, not just programme outcome data.

RISK: Organisations with similar evidence scores typically secure an estimated 30-40% less funding than sector leaders, based on ECD and health sector funding benchmarks across South Africa.

OPPORTUNITY: Closing this evidence gap through Auxeira's synthesis and translation methodology is estimated to unlock 2-3x more decision-maker engagement within 24 months, positioning your organisation competitively for the next major funding cycle.`;

function validateAIOutput(text: string): boolean {
  const hasLandscape = text.includes("LANDSCAPE:");
  const hasRisk = text.includes("RISK:");
  const hasOpportunity = text.includes("OPPORTUNITY:");
  const hasRange = /\d+[-–]\d+/.test(text);
  const hasEstimated =
    text.toLowerCase().includes("estimated") ||
    text.toLowerCase().includes("based on");
  const hasAuxeira = text.includes("Auxeira");
  const hasSA =
    text.toLowerCase().includes("south africa") ||
    text.toLowerCase().includes("african");

  return (
    hasLandscape &&
    hasRisk &&
    hasOpportunity &&
    hasRange &&
    hasEstimated &&
    hasAuxeira &&
    hasSA
  );
}

function parseInsight(text: string) {
  const landscape = text.match(/LANDSCAPE:\s*(.+?)(?=RISK:|$)/s)?.[1]?.trim() ?? "";
  const risk = text.match(/RISK:\s*(.+?)(?=OPPORTUNITY:|$)/s)?.[1]?.trim() ?? "";
  const opportunity = text.match(/OPPORTUNITY:\s*(.+?)$/s)?.[1]?.trim() ?? "";
  return { landscape, risk, opportunity };
}

export async function POST(req: NextRequest) {
  try {
    const { orgType, audience, score, challenge, orgName, orgUrl, orgSize } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // If no API key configured, return fallback immediately
    if (!apiKey || apiKey === "placeholder") {
      return NextResponse.json({ insight: parseInsight(FALLBACK), source: "fallback" });
    }

    const orgContext = [
      orgName ? `Organisation name: ${orgName}` : null,
      orgUrl ? `Website: ${orgUrl}` : null,
      orgSize ? `Organisation size: ${orgSize}` : null,
    ].filter(Boolean).join("\n");

    const userPrompt = `Organisation type: ${orgType}
Primary audience: ${audience}
Evidence Health Score: ${score}/100
Biggest evidence challenge: ${challenge}${orgContext ? `\n${orgContext}` : ""}

Generate the competitive landscape insight.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 150,
          temperature: 0.3,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!res.ok) throw new Error(`Anthropic API ${res.status}`);

      const data = await res.json();
      const text: string = data.content?.[0]?.text ?? "";

      if (text === "USE_FALLBACK" || !validateAIOutput(text)) {
        return NextResponse.json({ insight: parseInsight(FALLBACK), source: "fallback" });
      }

      return NextResponse.json({ insight: parseInsight(text), source: "ai" });
    } catch {
      return NextResponse.json({ insight: parseInsight(FALLBACK), source: "fallback" });
    }
  } catch {
    return NextResponse.json(
      { insight: parseInsight(FALLBACK), source: "fallback" },
      { status: 200 }
    );
  }
}
