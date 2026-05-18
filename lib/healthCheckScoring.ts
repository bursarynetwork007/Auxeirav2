// Scoring matrix — values sourced directly from Auxeira_Evidence_Health_Check_Scoring_Matrix.xlsx
// Sheet 1: Scoring Matrix | Sheet 2: Score Bands & Outputs | Sheet 3: Tier Routing Logic | Sheet 5: Org Type Routing
//
// INPUT FORMAT: Ona webhook sends 0-based integer answer indices (Q1: 0, Q2: 1, etc.)
// Each question's answers are ordered exactly as they appear in the Ona form.

// ── Answer index → point value ────────────────────────────────────────────────
// Index 0 = first answer option, index 1 = second, etc.
// Order matches the Ona form question order exactly.

const SCORING_BY_INDEX: Record<string, number[]> = {
  // Q1 — Organisation type (max 10)
  // 0: National NGO or delivery organisation
  // 1: Foundation or funder
  // 2: Government department or agency
  // 3: International philanthropy / dev agency
  // 4: Sector body or intermediary
  q1: [10, 8, 6, 7, 5],

  // Q2 — Primary decision-making audience (max 14)
  // 0: Treasury or National Government
  // 1: International funders
  // 2: Provincial government
  // 3: Board or executive leadership
  // 4: Multiple audiences simultaneously
  q2: [14, 12, 10, 8, 6],

  // Q3 — Years of evaluation / programme data (max 14)
  // 0: More than 10 years
  // 1: 5-10 years
  // 2: 2-5 years
  // 3: Less than 2 years
  q3: [14, 11, 7, 4],

  // Q4 — What happened when you last shared a report? (max 15)
  // 0: They read it in full and responded substantively
  // 1: They asked for a shorter summary
  // 2: We followed up but heard little back
  // 3: We genuinely don't know if it was read
  q4: [15, 8, 4, 2],

  // Q5 — SROI / economic / fiscal impact analysis status (max 15)
  // 0: Yes — actively used in funder conversations
  // 1: Yes — but not being used effectively
  // 2: No — but we know we need one
  // 3: No — not sure it applies to us
  q5: [15, 8, 4, 2],

  // Q6 — Biggest evidence challenge right now (max 12)
  // 0: We have strong data but decision-makers aren't acting on it
  // 1: We haven't measured our economic or social return
  // 2: Our reports don't reach the right people in the right format
  // 3: We don't have enough data or evaluations yet
  q6: [12, 8, 6, 4],

  // Q7 — How often asked to simplify / shorten reports? (max 10)
  // Inverted: regularly asked = low score = high urgency
  // 0: Regularly — it is a constant request
  // 1: Occasionally
  // 2: Rarely
  // 3: Never — but our reports still don't seem to land
  q7: [2, 6, 10, 4],

  // Q8 — Approximate annual budget (routing signal only, max 14)
  // 0: Under R5 million
  // 1: R5M - R20M
  // 2: R20M - R100M
  // 3: Over R100M
  q8: [5, 8, 11, 14],
};

// Human-readable answer text for each index (used in report generation)
const ANSWER_TEXT: Record<string, string[]> = {
  q1: [
    "National NGO or delivery organisation",
    "Foundation or funder",
    "Government department or agency",
    "International philanthropy / dev agency",
    "Sector body or intermediary",
  ],
  q2: [
    "Treasury or National Government",
    "International funders",
    "Provincial government",
    "Board or executive leadership",
    "Multiple audiences simultaneously",
  ],
  q3: [
    "More than 10 years",
    "5-10 years",
    "2-5 years",
    "Less than 2 years",
  ],
  q4: [
    "They read it in full and responded substantively",
    "They asked for a shorter summary",
    "We followed up but heard little back",
    "We genuinely don't know if it was read",
  ],
  q5: [
    "Yes — actively used in funder conversations",
    "Yes — but not being used effectively",
    "No — but we know we need one",
    "No — not sure it applies to us",
  ],
  q6: [
    "We have strong data but decision-makers aren't acting on it",
    "We haven't measured our economic or social return",
    "Our reports don't reach the right people in the right format",
    "We don't have enough data or evaluations yet",
  ],
  q7: [
    "Regularly — it is a constant request",
    "Occasionally",
    "Rarely",
    "Never — but our reports still don't seem to land",
  ],
  q8: [
    "Under R5 million",
    "R5M - R20M",
    "R20M - R100M",
    "Over R100M",
  ],
};

// ── Org type mapping (Sheet 5) ────────────────────────────────────────────────
// Q1 index -> org_type classification used by Claude for language register

export type OrgType = "delivery" | "foundation_funder" | "delivery_government" | "consultant";

const ORG_TYPE_BY_Q1_INDEX: OrgType[] = [
  "delivery",            // 0: National NGO or delivery organisation
  "foundation_funder",   // 1: Foundation or funder
  "delivery_government", // 2: Government department or agency
  "foundation_funder",   // 3: International philanthropy / dev agency (same register)
  "consultant",          // 4: Sector body or intermediary
];

// Whether to show the pilot diagnostic block (foundation/funder orgs only)
const SHOW_PILOT_DIAGNOSTIC_BY_Q1_INDEX: boolean[] = [
  false, // delivery
  true,  // foundation_funder
  false, // delivery_government
  true,  // international philanthropy (same as foundation)
  false, // consultant
];

// Primary audience label for forward box (Sheet 5, column 7)
const PRIMARY_AUDIENCE_LABEL_BY_Q1_INDEX: string[] = [
  "Treasury / DBE / Provincial Govt / Funders",
  "Co-funders / Treasury / International philanthropy / Board",
  "Treasury / Portfolio Committee / Executive / Cabinet",
  "Board / Co-investors / Host government / Donor government",
  "Member organisations / Funders / Government",
];

// ── Answers interface ─────────────────────────────────────────────────────────
// All values are 0-based integer indices from Ona webhook

export interface HealthCheckAnswers {
  q1: number; // Organisation type
  q2: number; // Primary decision-making audience
  q3: number; // Years of evaluation / programme data
  q4: number; // What happened when you last shared a report?
  q5: number; // SROI / economic / fiscal impact analysis status
  q6: number; // Biggest evidence challenge right now
  q7: number; // How often asked to simplify / shorten reports?
  q8: number; // Approximate annual budget
}

// Per-question max scores (for gap identification)
const Q_MAX: Record<keyof HealthCheckAnswers, number> = {
  q1: 10, q2: 14, q3: 14, q4: 15, q5: 15, q6: 12, q7: 10, q8: 14,
};

// Gap type each question diagnoses (from Sheet 1)
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

// ── Score calculation ─────────────────────────────────────────────────────────
// Raw max = 10+14+14+15+15+12+10+14 = 104
// Final score = round(raw / 104 x 100), normalised to 0-100

const RAW_MAX = 104;

export function getAnswerPoints(q: keyof HealthCheckAnswers, index: number): number {
  return SCORING_BY_INDEX[q]?.[index] ?? 0;
}

export function getAnswerText(q: keyof HealthCheckAnswers, index: number): string {
  return ANSWER_TEXT[q]?.[index] ?? `Answer ${index}`;
}

export function calculateRawScore(answers: HealthCheckAnswers): number {
  let total = 0;
  for (const q of Object.keys(SCORING_BY_INDEX) as (keyof HealthCheckAnswers)[]) {
    total += getAnswerPoints(q, answers[q]);
  }
  return total;
}

export function calculateScore(answers: HealthCheckAnswers): number {
  const raw = calculateRawScore(answers);
  return Math.round((raw / RAW_MAX) * 100);
}

export function getQuestionScores(
  answers: HealthCheckAnswers
): Record<keyof HealthCheckAnswers, number> {
  const result = {} as Record<keyof HealthCheckAnswers, number>;
  for (const q of Object.keys(SCORING_BY_INDEX) as (keyof HealthCheckAnswers)[]) {
    result[q] = getAnswerPoints(q, answers[q]);
  }
  return result;
}

// ── Org type helpers ──────────────────────────────────────────────────────────

export function getOrgType(answers: HealthCheckAnswers): OrgType {
  return ORG_TYPE_BY_Q1_INDEX[answers.q1] ?? "delivery";
}

export function showPilotDiagnostic(answers: HealthCheckAnswers): boolean {
  return SHOW_PILOT_DIAGNOSTIC_BY_Q1_INDEX[answers.q1] ?? false;
}

export function getPrimaryAudienceLabel(answers: HealthCheckAnswers): string {
  return PRIMARY_AUDIENCE_LABEL_BY_Q1_INDEX[answers.q1] ?? "Funders / Government";
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
        "Your data is solid. Your evaluations exist. But your evidence isn't moving the decisions it should, because it hasn't been translated into the language your audience responds to. That's a solvable problem. Auxeira solves it.",
      ctaText:
        "Book a 30-minute Evidence Diagnostic Call. We'll show you exactly where your translation gap is costing you.",
      ctaVariant: "book",
      priceRange: "R85,000 - R150,000",
      timeline: "3-6 weeks",
    };
  }
  if (score >= 50) {
    return {
      label: "Solid base, significant gap",
      headline: "You have more evidence than you think. It's not working as hard as it should.",
      description:
        "You have programme data, evaluations, and sector knowledge that funders and government should be acting on. The gap is in how it's synthesised, framed, and communicated. Your SROI may never have been calculated. Your economic contribution may be invisible. These are fixable, and fixing them changes what you're able to raise and influence.",
      ctaText:
        "Book a 30-minute Evidence Diagnostic Call. Your gaps are specific and solvable. Let's identify them.",
      ctaVariant: "book",
      priceRange: "R180,000 - R350,000",
      timeline: "6-10 weeks",
    };
  }
  if (score >= 25) {
    return {
      label: "Significant gaps, urgent",
      headline: "Your evidence gaps are likely costing you funding and policy traction right now.",
      description:
        "Decision-makers aren't acting on your work, not because your work isn't good, but because the evidence of your impact hasn't reached them in a form they can act on. Your economic contribution is unmeasured. Your data exists but hasn't been synthesised. Every funding round and policy window you miss has a cost. Auxeira quantifies that cost and closes the gap.",
      ctaText:
        "Talk to us today. Your evidence gaps have a direct, quantifiable cost. We can show you what it is.",
      ctaVariant: "urgent",
      priceRange: "R180,000 - R350,000",
      timeline: "6-10 weeks",
    };
  }
  return {
    label: "Critical gaps",
    headline: "Critical evidence gaps. Important decisions are being made without your story.",
    description:
      "Your evidence is not reaching the people who need to act on it. Your economic and social contribution is unmeasured or uncommunicated. Funders, government, and boards are making decisions about your sector, your funding, your policy environment, without the evidence that would change those decisions. This is not a data problem. It is an architecture problem. Auxeira fixes it.",
    ctaText:
      "Talk to us today. We'll quantify what your evidence gaps are costing you, and show you the fastest path to closing them.",
    ctaVariant: "urgent",
    priceRange: "Scoping call required",
    timeline: "Book scoping call",
  };
}

// ERC rating derived from score
export function getERC(score: number): {
  erc: string;
  erc_color: string;
  erc_bg: string;
  risk_level: string;
} {
  if (score >= 75) return { erc: "ERC-A", erc_color: "#1D9E75", erc_bg: "rgba(29,158,117,0.12)", risk_level: "Low risk" };
  if (score >= 50) return { erc: "ERC-B", erc_color: "#C9A84C", erc_bg: "rgba(201,168,76,0.15)", risk_level: "Medium risk" };
  if (score >= 25) return { erc: "ERC-C", erc_color: "#D85A30", erc_bg: "rgba(216,90,48,0.12)", risk_level: "High risk" };
  return { erc: "ERC-D", erc_color: "#E24B4A", erc_bg: "rgba(226,75,74,0.12)", risk_level: "Critical risk" };
}

// ── Tier routing ──────────────────────────────────────────────────────────────
// Logic from Sheet 3: Tier Routing Decision Matrix (Q8 x Q6 x score band)

export function getTierRecommendation(answers: HealthCheckAnswers): {
  tier: 1 | 2 | 3 | "2-3";
  label: string;
  description: string;
  ctaText: string;
  priceRange: string;
  timeline: string;
} {
  const q8 = answers.q8; // 0=under5m, 1=5m-20m, 2=20m-100m, 3=over100m
  const q6 = answers.q6; // 0=translation, 1=economic, 2=format, 3=not-enough-data
  const q1 = answers.q1; // 0=ngo, 1=foundation, 2=govt, 3=intl, 4=sector-body
  const score = calculateScore(answers);

  const isPortfolioChallenge = q6 === 1 || q6 === 3;
  const isFoundationFunder = q1 === 1 || q1 === 3;

  // Foundation/funder with portfolio challenge -> Tier 3
  if (isFoundationFunder && isPortfolioChallenge) {
    return {
      tier: 3,
      label: "Tier 3 — Sector Intelligence Platform",
      description: "Portfolio-level evidence architecture for funders and philanthropies.",
      ctaText: "Talk to us today — scoping call required",
      priceRange: "Scoping call required",
      timeline: "Book scoping call",
    };
  }

  // Over R100M
  if (q8 === 3) {
    if (isPortfolioChallenge) {
      return {
        tier: 3,
        label: "Tier 3 — Sector Intelligence Platform",
        description: "The long-term play for funders and sector leaders serious about scale.",
        ctaText: "Talk to us today — scoping call required",
        priceRange: "Scoping call required",
        timeline: "Book scoping call",
      };
    }
    if (score >= 50) {
      return {
        tier: 2,
        label: "Tier 2 — Evidence Synthesis and Strategy",
        description: "When you need the full picture built, not just translated.",
        ctaText: "Book a 30-minute Evidence Diagnostic Call",
        priceRange: "R180,000 - R350,000",
        timeline: "6-10 weeks",
      };
    }
    return {
      tier: "2-3",
      label: "Tier 2-3 — Scoping call required",
      description: "Scale and complexity require a tailored engagement.",
      ctaText: "Talk to us today",
      priceRange: "Scoping call required",
      timeline: "Book scoping call",
    };
  }

  // R20M - R100M — always Tier 2
  if (q8 === 2) {
    return {
      tier: 2,
      label: "Tier 2 — Evidence Synthesis and Strategy",
      description: "When you need the full picture built, not just translated.",
      ctaText:
        score >= 50
          ? "Book a 30-minute Evidence Diagnostic Call"
          : "Talk to us today",
      priceRange: "R180,000 - R350,000",
      timeline: "6-10 weeks",
    };
  }

  // R5M - R20M
  if (q8 === 1) {
    if (isPortfolioChallenge && score >= 25 && score <= 74) {
      return {
        tier: 2,
        label: "Tier 2 — Evidence Synthesis and Strategy",
        description: "When you need the full picture built, not just translated.",
        ctaText: "Book a 30-minute Evidence Diagnostic Call",
        priceRange: "R180,000 - R350,000",
        timeline: "6-10 weeks",
      };
    }
    if (!isPortfolioChallenge && score <= 49) {
      return {
        tier: 2,
        label: "Tier 2 — Evidence Synthesis and Strategy",
        description: "When you need the full picture built, not just translated.",
        ctaText: "Talk to us today",
        priceRange: "R180,000 - R350,000",
        timeline: "6-10 weeks",
      };
    }
    return {
      tier: 1,
      label: "Tier 1 — Evidence Translation",
      description: "The fastest path from strong evidence to decisions that move.",
      ctaText: "Book a 30-minute Evidence Diagnostic Call",
      priceRange: "R85,000 - R150,000",
      timeline: "3-6 weeks",
    };
  }

  // Under R5M — always Tier 1
  return {
    tier: 1,
    label: "Tier 1 — Evidence Translation",
    description: "The fastest path from strong evidence to decisions that move.",
    ctaText: "Book a 30-minute Evidence Diagnostic Call",
    priceRange: "R85,000 - R150,000",
    timeline: "3-6 weeks",
  };
}

// ── Gap identification ────────────────────────────────────────────────────────
// Identifies the two lowest-scoring questions (by deficit vs max, excluding Q8)

const Q_GAP_DESCRIPTIONS: Record<keyof HealthCheckAnswers, string> = {
  q1: "Your organisation type signals a systemic evidence gap that requires a tailored approach.",
  q2: "Your evidence isn't reaching the right decision-makers in the language they respond to.",
  q3: "Your evidence base is still developing. A structured evidence strategy will compound value quickly.",
  q4: "Your evidence is not landing with decision-makers in a form they can act on.",
  q5: "You have no economic or SROI analysis - the language funders and Treasury require.",
  q6: "Your core evidence challenge is unresolved and is directly limiting funding and policy traction.",
  q7: "Decision-makers are consistently asking you to simplify. Your evidence architecture needs redesigning.",
  q8: "",
};

export function getTopGaps(answers: HealthCheckAnswers): Array<{
  q: keyof HealthCheckAnswers;
  description: string;
  deficit: number;
  gapType: string;
}> {
  const scores = getQuestionScores(answers);

  return (Object.keys(scores) as (keyof HealthCheckAnswers)[])
    .filter((q) => q !== "q8")
    .map((q) => ({
      q,
      description: Q_GAP_DESCRIPTIONS[q],
      deficit: Q_MAX[q] - scores[q],
      gapType: Q_GAP[q],
    }))
    .sort((a, b) => b.deficit - a.deficit)
    .slice(0, 2);
}

// Primary gap label driven by Q6 answer
const GAP_LABELS_BY_Q6_INDEX: string[] = [
  "Translation Gap",                 // 0: strong data, not acting
  "Economic Evidence Gap",           // 1: haven't measured return
  "Communication Architecture Gap",  // 2: reports wrong format
  "Evidence Foundation Gap",         // 3: not enough data
];

export function getPrimaryGapLabel(answers: HealthCheckAnswers): string {
  return GAP_LABELS_BY_Q6_INDEX[answers.q6] ?? "Translation Gap";
}

// ── Sector average benchmarks ─────────────────────────────────────────────────

const SECTOR_AVERAGES: Record<string, number> = {
  ecd:        52,
  education:  52,
  health:     55,
  econ:       50,
  foundation: 58,
  policy:     54,
  government: 48,
  other:      52,
};

export function getSectorAverage(sectorKey: string): number {
  return SECTOR_AVERAGES[sectorKey] ?? 52;
}

// ── Legacy string-slug support (frontend quiz uses string slugs) ──────────────
// Maps old string answer slugs to 0-based indices for backward compatibility.

const SLUG_TO_INDEX: Record<string, Record<string, number>> = {
  q1: { "ngo": 0, "national-ngo": 0, "foundation": 1, "foundation-funder": 1,
        "government": 2, "government-dept": 2, "international": 3, "international-philanthropy": 3,
        "sector-body": 4 },
  q2: { "treasury-national-govt": 0, "international-funders": 1, "provincial-govt": 2,
        "board-executive": 3, "multiple-audiences": 4 },
  q3: { "less-than-2": 3, "2-5": 2, "5-10": 1, "more-than-10": 0 },
  q4: { "read-in-full": 0, "asked-for-summary": 1, "followed-up-no-response": 2, "dont-know": 3 },
  q5: { "yes-actively-used": 0, "yes-not-used": 1, "no-know-we-need": 2, "no-unsure": 3 },
  q6: { "strong-data-not-acting": 0, "havent-measured-return": 1, "reports-wrong-format": 2, "not-enough-data": 3 },
  q7: { "regularly": 0, "occasionally": 1, "rarely": 2, "never-still-dont-land": 3 },
  q8: { "under-5m": 0, "5m-20m": 1, "20m-100m": 2, "over-100m": 3 },
};

// Frontend-facing string answers type (used by the quiz component)
export interface FrontendAnswers {
  q1: string; q2: string; q3: string; q4: string;
  q5: string; q6: string; q7: string; q8: string;
}

export function slugsToIndices(slugs: Partial<FrontendAnswers>): HealthCheckAnswers {
  const result = {} as HealthCheckAnswers;
  for (const q of ["q1","q2","q3","q4","q5","q6","q7","q8"] as (keyof FrontendAnswers)[]) {
    const slug = slugs[q] ?? "";
    result[q] = SLUG_TO_INDEX[q]?.[slug] ?? 0;
  }
  return result;
}

export function calculateScoreFromSlugs(slugs: Partial<FrontendAnswers>): number {
  return calculateScore(slugsToIndices(slugs));
}

export function getPrimaryGapLabelFromSlugs(slugs: Partial<FrontendAnswers>): string {
  return getPrimaryGapLabel(slugsToIndices(slugs));
}

// ── Re-exports ────────────────────────────────────────────────────────────────

export { Q_GAP, Q_MAX, SCORING_BY_INDEX, ANSWER_TEXT };
