// Projection values scaled by Q8 budget answer (item 3.3)

export interface Projections {
  fundingAtRisk: string;
  influenceGap: string;
  opportunityCost: string;
  // numeric ranges for charts
  fundingLow: number;
  fundingHigh: number;
  oppLow: number;
  oppHigh: number;
}

const PROJECTION_MAP: Record<string, Projections> = {
  "under-5m": {
    fundingAtRisk: "R500K – R2M",
    influenceGap: "25 – 40%",
    opportunityCost: "R1 – 3M over 3 years",
    fundingLow: 0.5, fundingHigh: 2,
    oppLow: 1, oppHigh: 3,
  },
  "5m-20m": {
    fundingAtRisk: "R2M – R8M",
    influenceGap: "30 – 45%",
    opportunityCost: "R5 – 15M over 3 years",
    fundingLow: 2, fundingHigh: 8,
    oppLow: 5, oppHigh: 15,
  },
  "20m-100m": {
    fundingAtRisk: "R8M – R25M",
    influenceGap: "35 – 50%",
    opportunityCost: "R15 – 40M over 3 years",
    fundingLow: 8, fundingHigh: 25,
    oppLow: 15, oppHigh: 40,
  },
  "over-100m": {
    fundingAtRisk: "R25M – R80M",
    influenceGap: "40 – 60%",
    opportunityCost: "R50M+ over 3 years",
    fundingLow: 25, fundingHigh: 80,
    oppLow: 50, oppHigh: 120,
  },
};

// Map numeric Q8 index (0-3) to slug
const Q8_INDEX_TO_SLUG: Record<number, string> = {
  0: "under-5m", 1: "5m-20m", 2: "20m-100m", 3: "over-100m",
};

export function getProjections(budget: string | number): Projections {
  const key = typeof budget === "number" ? (Q8_INDEX_TO_SLUG[budget] ?? "5m-20m") : budget;
  return PROJECTION_MAP[key] ?? PROJECTION_MAP["5m-20m"];
}

// Funding survival curve data — 36 months, two lines: with/without Auxeira
export function getSurvivalCurveData(budget: string | number) {
  const p = getProjections(budget);
  const months = Array.from({ length: 13 }, (_, i) => `M${i * 3}`);

  // Without intervention: gradual decline from 100%
  const withoutAuxeira = [100, 94, 87, 79, 71, 63, 56, 50, 45, 41, 38, 36, 35];

  // With Auxeira: stabilises then grows
  const withAuxeira = [100, 98, 97, 98, 100, 104, 109, 115, 122, 130, 138, 145, 152];

  return { months, withoutAuxeira, withAuxeira, projections: p };
}

// Counterfactual divergence — 3-year bar comparison
export function getCounterfactualData(budget: string | number) {
  const p = getProjections(budget);
  return {
    labels: ["Year 1", "Year 2", "Year 3"],
    withoutAuxeira: [
      p.fundingLow * 0.9,
      p.fundingLow * 0.75,
      p.fundingLow * 0.6,
    ],
    withAuxeira: [
      p.oppLow * 0.4,
      p.oppLow * 0.7,
      p.oppLow,
    ],
  };
}
