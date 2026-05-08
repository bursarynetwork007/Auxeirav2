// Scoring matrix for the Evidence Health Check
// Each answer carries a weighted point value (max 100 total)

export interface HealthCheckAnswers {
  q1: string; // org type
  q2: string; // audience
  q3: string; // evidence age
  q4: string; // translation signal
  q5: string; // economic analysis
  q6: string; // evidence challenge
  q7: string; // decision-maker response
  q8: string; // budget
}

const scoring: Record<string, Record<string, number>> = {
  // Q3: evidence age (max 15)
  q3: {
    "less-than-2": 3,
    "2-5": 8,
    "5-10": 12,
    "more-than-10": 15,
  },
  // Q4: translation signal (max 20)
  q4: {
    "read-in-full": 20,
    "asked-for-summary": 12,
    "followed-up-no-response": 6,
    "dont-know": 2,
  },
  // Q5: economic analysis (max 20)
  q5: {
    "yes-actively-used": 20,
    "yes-not-used": 10,
    "no-know-we-need": 5,
    "no-unsure": 2,
  },
  // Q6: evidence challenge (max 20)
  q6: {
    "strong-data-not-acting": 14,
    "havent-measured-return": 8,
    "reports-wrong-format": 10,
    "not-enough-data": 4,
  },
  // Q7: decision-maker response (max 15)
  q7: {
    "regularly": 4,
    "occasionally": 9,
    "rarely": 13,
    "never-still-dont-land": 15,
  },
  // Q2: audience complexity (max 10)
  q2: {
    "treasury-national-govt": 10,
    "international-funders": 9,
    "provincial-govt": 8,
    "board-executive": 7,
    "multiple-audiences": 10,
  },
};

export function calculateScore(answers: HealthCheckAnswers): number {
  let total = 0;
  for (const [key, map] of Object.entries(scoring)) {
    const answer = answers[key as keyof HealthCheckAnswers];
    total += map[answer] ?? 0;
  }
  return Math.min(100, total);
}

export function getScoreBand(score: number): {
  label: string;
  description: string;
  ctaText: string;
} {
  if (score >= 75) {
    return {
      label: "Strong evidence foundation",
      description: "Your gap is translation, not data.",
      ctaText: "Book a 30-minute Evidence Strategy Call — we'll show you exactly where your translation gap is.",
    };
  }
  if (score >= 50) {
    return {
      label: "Solid evidence base",
      description: "Significant untapped potential.",
      ctaText: "Book a 30-minute Evidence Strategy Call — your gaps are specific and solvable.",
    };
  }
  if (score >= 25) {
    return {
      label: "Evidence gaps are likely costing you",
      description: "Funding and policy traction are at risk.",
      ctaText: "Book a 30-minute Evidence Strategy Call — your gaps are specific and solvable.",
    };
  }
  return {
    label: "Critical evidence gaps",
    description: "Decisions are being made without your story.",
    ctaText: "Talk to us today. Your evidence gaps have a direct cost. We can quantify it.",
  };
}

export function getTierRecommendation(answers: HealthCheckAnswers): {
  tier: 1 | 2 | 3;
  label: string;
  description: string;
} {
  const budget = answers.q8;
  const challenge = answers.q6;

  if (budget === "over-100m" || challenge === "strong-data-not-acting" && budget !== "under-5m") {
    return {
      tier: 3,
      label: "Tier 3 — Sector Intelligence Platform",
      description: "The long-term play for funders and sector leaders serious about scale.",
    };
  }
  if (budget === "under-5m" || challenge === "strong-data-not-acting") {
    return {
      tier: 1,
      label: "Tier 1 — Evidence Translation",
      description: "The fastest path from strong evidence to decisions that move.",
    };
  }
  return {
    tier: 2,
    label: "Tier 2 — Evidence Synthesis & Strategy",
    description: "When you need the full picture built, not just translated.",
  };
}

export function getTopGaps(answers: HealthCheckAnswers): string[] {
  const gaps: string[] = [];

  if (["dont-know", "followed-up-no-response"].includes(answers.q4)) {
    gaps.push("Your evidence is not reaching decision-makers in a format they act on.");
  }
  if (["no-know-we-need", "no-unsure"].includes(answers.q5)) {
    gaps.push("You have no economic or SROI analysis — the language funders and Treasury require.");
  }
  if (answers.q6 === "reports-wrong-format") {
    gaps.push("Your reports are not designed for the audiences who need to act on them.");
  }
  if (answers.q6 === "havent-measured-return") {
    gaps.push("Your social and economic return is unmeasured and invisible to funders.");
  }
  if (answers.q3 === "less-than-2") {
    gaps.push("Your evidence base is still early-stage — a structured evidence strategy will compound value quickly.");
  }
  if (["regularly", "occasionally"].includes(answers.q7)) {
    gaps.push("Decision-makers are consistently asking you to simplify — a signal your evidence architecture needs redesigning.");
  }

  return gaps.slice(0, 2);
}
