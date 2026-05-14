// Scoring matrix — values sourced directly from Auxeira_Evidence_Health_Check_Scoring_Matrix.xlsx
// Sheet 1: Scoring Matrix | Sheet 2: Score Bands & Outputs | Sheet 3: Tier Routing Logic

export interface HealthCheckAnswers {
  q1: string; // Organisation type
  q2: string; // Primary decision-making audience
  q3: string; // Years of evaluation / programme data
  q4: string; // What happened when you last shared a report?
  q5: string; // SROI / economic / fiscal impact analysis status
  q6: string; // Biggest evidence challenge right now
  q7: string; // How often asked to simplify / shorten reports?
  q8: string; // Approximate annual budget
}

// ── Scoring lookup (max 100) ──────────────────────────────────────────────────
// Each answer slug maps to its exact point value from the Excel scoring matrix.

const SCORING: Record<keyof HealthCheckAnswers, Record<string, number>> = {
  // Q1 — Organisation type (max 10)
  q1: {
    "national-ngo":               10,
    "foundation-funder":           8,
    "government-dept":             6,
    "international-philanthropy":  7,
    "sector-body":                 5,
  },
  // Q2 — Primary decision-making audience (max 14)
  q2: {
    "treasury-national-govt":  14,
    "international-funders":   12,
    "provincial-govt":         10,
    "board-executive":          8,
    "multiple-audiences":       6,
  },
  // Q3 — Years of evaluation / programme data (max 14)
  q3: {
    "more-than-10":  14,
    "5-10":          11,
    "2-5":            7,
    "less-than-2":    4,
  },
  // Q4 — What happened when you last shared a report? (max 15)
  q4: {
    "read-in-full":             15,
    "asked-for-summary":         8,
    "followed-up-no-response":   4,
    "dont-know":                 2,
  },
  // Q5 — SROI / economic / fiscal impact analysis (max 15)
  q5: {
    "yes-actively-used":  15,
    "yes-not-used":        8,
    "no-know-we-need":     4,
    "no-unsure":           2,
  },
  // Q6 — Biggest evidence challenge (max 12)
  q6: {
    "strong-data-not-acting":   12,
    "havent-measured-return":    8,
    "reports-wrong-format":      6,
    "not-enough-data":           4,
  },
  // Q7 — How often asked to simplify / shorten reports? (max 10)
  // Inverted: regularly asked = low score = high urgency
  q7: {
    "regularly":              2,
    "occasionally":           6,
    "rarely":                10,
    "never-still-dont-land":  4,
  },
  // Q8 — Annual budget (routing signal only, max 14)
  q8: {
    "under-5m":    5,
    "5m-20m":      8,
    "20m-100m":   11,
    "over-100m":  14,
  },
};

// Per-question max scores (for gap identification)
const Q_MAX: Record<keyof HealthCheckAnswers, number> = {
  q1: 10, q2: 14, q3: 14, q4: 15, q5: 15, q6: 12, q7: 10, q8: 14,
};

// Gap type each question diagnoses
const Q_GAP: Record<keyof HealthCheckAnswers, string> = {
  q1: "Translation Gap",
  q2: "Translation Gap",
  q3: "Data Gap",
  q4: "Translation Gap",
  q5: "Data Gap",
  q6: "Translation Gap",
  q7: "Translation Gap",
  q8: "Tier Signal",
};

// Human-readable primary gap label driven by Q6 answer
const GAP_LABELS: Record<string, string> = {
  "strong-data-not-acting":  "Translation Gap",
  "havent-measured-return":  "Economic Evidence Gap",
  "reports-wrong-format":    "Communication Architecture Gap",
  "not-enough-data":         "Evidence Foundation Gap",
};

// ── Score calculation ─────────────────────────────────────────────────────────

export function calculateScore(answers: HealthCheckAnswers): number {
  let total = 0;
  for (const q of Object.keys(SCORING) as (keyof HealthCheckAnswers)[]) {
    total += SCORING[q][answers[q]] ?? 0;
  }
  return Math.min(100, total);
}

export function getQuestionScores(
  answers: HealthCheckAnswers
): Record<keyof HealthCheckAnswers, number> {
  const result = {} as Record<keyof HealthCheckAnswers, number>;
  for (const q of Object.keys(SCORING) as (keyof HealthCheckAnswers)[]) {
    result[q] = SCORING[q][answers[q]] ?? 0;
  }
  return result;
}

// ── Score bands ───────────────────────────────────────────────────────────────
// Labels, headlines, sub-copy and CTA text from Sheet 2: Score Bands & Outputs

export function getScoreBand(score: number): {
  label: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaVariant: "book" | "urgent";
  priceRange: string;
  timeline: string;
} {
  if (score >= 75) {
    return {
      label: "Strong foundation",
      headline: "Your evidence is strong. Your gap is translation.",
      description:
        "Your data is solid. Your evaluations exist. But your evidence isn't moving the decisions it should — because it hasn't been translated into the language your audience responds to. That's a solvable problem. Auxeira solves it.",
      ctaText:
        "Book a 30-minute Evidence Diagnostic Call. We'll show you exactly where your translation gap is costing you.",
      ctaVariant: "book",
      priceRange: "R85,000 – R150,000",
      timeline: "3–6 weeks",
    };
  }
  if (score >= 50) {
    return {
      label: "Solid base, significant gap",
      headline: "You have more evidence than you think. It's not working as hard as it should.",
      description:
        "You have programme data, evaluations, and sector knowledge that funders and government should be acting on. The gap is in how it's synthesised, framed, and communicated. Your SROI may never have been calculated. Your economic contribution may be invisible. These are fixable — and fixing them changes what you're able to raise and influence.",
      ctaText:
        "Book a 30-minute Evidence Diagnostic Call. Your gaps are specific and solvable. Let's identify them.",
      ctaVariant: "book",
      priceRange: "R180,000 – R350,000",
      timeline: "6–10 weeks",
    };
  }
  if (score >= 25) {
    return {
      label: "Significant gaps — urgent",
      headline: "Your evidence gaps are likely costing you funding and policy traction right now.",
      description:
        "Decision-makers aren't acting on your work — not because your work isn't good, but because the evidence of your impact hasn't reached them in a form they can act on. Your economic contribution is unmeasured. Your data exists but hasn't been synthesised. Every funding round and policy window you miss has a cost. Auxeira quantifies that cost — and closes the gap.",
      ctaText:
        "Talk to us today. Your evidence gaps have a direct, quantifiable cost. We can show you what it is.",
      ctaVariant: "urgent",
      priceRange: "R180,000 – R350,000",
      timeline: "6–10 weeks",
    };
  }
  return {
    label: "Critical gaps",
    headline: "Critical evidence gaps. Important decisions are being made without your story.",
    description:
      "Your evidence is not reaching the people who need to act on it. Your economic and social contribution is unmeasured or uncommunicated. Funders, government, and boards are making decisions — about your sector, your funding, your policy environment — without the evidence that would change those decisions. This is not a data problem. It is an architecture problem. Auxeira fixes it.",
    ctaText:
      "Talk to us today. We'll quantify what your evidence gaps are costing you — and show you the fastest path to closing them.",
    ctaVariant: "urgent",
    priceRange: "Scoping call required",
    timeline: "Book scoping call",
  };
}

// ── Tier routing ──────────────────────────────────────────────────────────────
// Logic from Sheet 3: Tier Routing Decision Matrix (Q8 × Q6 × score band)

export function getTierRecommendation(answers: HealthCheckAnswers): {
  tier: 1 | 2 | 3 | "2-3";
  label: string;
  description: string;
  ctaText: string;
} {
  const budget = answers.q8;
  const challenge = answers.q6;
  const score = calculateScore(answers);

  const isPortfolioChallenge =
    challenge === "havent-measured-return" || challenge === "not-enough-data";

  // Over R100M
  if (budget === "over-100m") {
    if (isPortfolioChallenge) {
      return {
        tier: 3,
        label: "Tier 3 — Sector Intelligence Platform",
        description: "The long-term play for funders and sector leaders serious about scale.",
        ctaText: "Talk to us today — scoping call required →",
      };
    }
    if (score >= 50) {
      return {
        tier: 2,
        label: "Tier 2 — Evidence Synthesis & Strategy",
        description: "When you need the full picture built, not just translated.",
        ctaText: "Book a 30-minute Evidence Diagnostic Call →",
      };
    }
    return {
      tier: "2-3",
      label: "Tier 2–3 — Scoping call required",
      description: "Scale and complexity require a tailored engagement.",
      ctaText: "Talk to us today →",
    };
  }

  // R20M – R100M — always Tier 2
  if (budget === "20m-100m") {
    return {
      tier: 2,
      label: "Tier 2 — Evidence Synthesis & Strategy",
      description: "When you need the full picture built, not just translated.",
      ctaText:
        score >= 50
          ? "Book a 30-minute Evidence Diagnostic Call →"
          : "Talk to us today →",
    };
  }

  // R5M – R20M
  if (budget === "5m-20m") {
    if (isPortfolioChallenge && score >= 25 && score <= 74) {
      return {
        tier: 2,
        label: "Tier 2 — Evidence Synthesis & Strategy",
        description: "When you need the full picture built, not just translated.",
        ctaText: "Book a 30-minute Evidence Diagnostic Call →",
      };
    }
    if (!isPortfolioChallenge && score <= 49) {
      return {
        tier: 2,
        label: "Tier 2 — Evidence Synthesis & Strategy",
        description: "When you need the full picture built, not just translated.",
        ctaText: "Talk to us today →",
      };
    }
    return {
      tier: 1,
      label: "Tier 1 — Evidence Translation",
      description: "The fastest path from strong evidence to decisions that move.",
      ctaText: "Book a 30-minute Evidence Diagnostic Call →",
    };
  }

  // Under R5M — always Tier 1
  return {
    tier: 1,
    label: "Tier 1 — Evidence Translation",
    description: "The fastest path from strong evidence to decisions that move.",
    ctaText: "Book a 30-minute Evidence Diagnostic Call →",
  };
}

// ── Gap identification ────────────────────────────────────────────────────────
// Identifies the two lowest-scoring questions (by deficit vs max, excluding Q8)
// Returns human-readable gap descriptions for the two gap cards.

const Q_GAP_DESCRIPTIONS: Record<keyof HealthCheckAnswers, string> = {
  q1: "Your organisation type signals a systemic evidence gap that requires a tailored approach.",
  q2: "Your evidence isn't reaching the right decision-makers in the language they respond to.",
  q3: "Your evidence base is still developing — a structured evidence strategy will compound value quickly.",
  q4: "Your evidence is not landing with decision-makers in a form they can act on.",
  q5: "You have no economic or SROI analysis — the language funders and Treasury require.",
  q6: "Your core evidence challenge is unresolved and is directly limiting funding and policy traction.",
  q7: "Decision-makers are consistently asking you to simplify — your evidence architecture needs redesigning.",
  q8: "",
};

export function getTopGaps(answers: HealthCheckAnswers): string[] {
  const scores = getQuestionScores(answers);

  const deficits = (Object.keys(scores) as (keyof HealthCheckAnswers)[])
    .filter((q) => q !== "q8") // Q8 is routing only, not a gap signal
    .map((q) => ({ q, deficit: Q_MAX[q] - scores[q] }))
    .sort((a, b) => b.deficit - a.deficit);

  return deficits.slice(0, 2).map((d) => Q_GAP_DESCRIPTIONS[d.q]);
}

export function getPrimaryGapLabel(answers: HealthCheckAnswers): string {
  return GAP_LABELS[answers.q6] ?? "Translation Gap";
}

// ── Re-exports for report generation ─────────────────────────────────────────

export { Q_GAP, Q_MAX, SCORING };
