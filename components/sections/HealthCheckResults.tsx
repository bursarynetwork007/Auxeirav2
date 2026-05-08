"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import Button from "@/components/ui/Button";
import {
  getScoreBand,
  getTierRecommendation,
  getTopGaps,
  type HealthCheckAnswers,
} from "@/lib/healthCheckScoring";
import { getProjections, getSurvivalCurveData, getCounterfactualData } from "@/lib/projections";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
);

interface Props {
  score: number;
  answers: HealthCheckAnswers;
  onReset: () => void;
}

interface AIInsight {
  landscape: string;
  risk: string;
  opportunity: string;
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const band = getScoreBand(score);

  const riskLabel =
    score >= 75 ? "LOW RISK" : score >= 50 ? "MODERATE RISK" : score >= 25 ? "HIGH RISK" : "CRITICAL";
  const riskColor =
    score >= 75 ? "#1D9E75" : score >= 50 ? "#EF9F27" : "#E24B4A";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative inline-flex items-center justify-center w-36 h-36 shrink-0">
        <svg width="144" height="144" className="-rotate-90" aria-hidden="true">
          <circle cx="72" cy="72" r={r} fill="none" stroke="#C9A84C22" strokeWidth="6" />
          <circle
            cx="72" cy="72" r={r} fill="none" stroke="#C9A84C"
            strokeWidth="6" strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
        <div className="absolute text-center">
          <p className="font-display text-4xl font-semibold text-[#C9A84C]">{score}</p>
          <p className="text-[10px] text-[#1A1A2A]/40 tracking-widest">/ 100</p>
        </div>
      </div>
      <div>
        <span
          className="inline-block text-[10px] uppercase tracking-[0.2em] font-semibold px-2.5 py-1 mb-2"
          style={{ background: riskColor + "22", color: riskColor, border: `1px solid ${riskColor}` }}
        >
          {riskLabel}
        </span>
        <p className="font-display text-2xl font-semibold text-[#0A1628] mb-1">{band.label}</p>
        <p className="text-[#1A1A2A]/55 text-sm">{band.description}</p>
      </div>
    </div>
  );
}

// ── Chart options ─────────────────────────────────────────────────────────────
const lineOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" as const, labels: { color: "#1A1A2A", font: { size: 11 } } },
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: { grid: { color: "#1A1A2A11" }, ticks: { color: "#1A1A2A66", font: { size: 10 } } },
    y: {
      grid: { color: "#1A1A2A11" },
      ticks: { color: "#1A1A2A66", font: { size: 10 }, callback: (v: number | string) => `${v}%` },
    },
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" as const, labels: { color: "#1A1A2A", font: { size: 11 } } },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#1A1A2A66", font: { size: 11 } } },
    y: {
      grid: { color: "#1A1A2A11" },
      ticks: { color: "#1A1A2A66", font: { size: 10 }, callback: (v: number | string) => `R${v}M` },
    },
  },
};

// ── Main component ────────────────────────────────────────────────────────────
export default function HealthCheckResults({ score, answers, onReset }: Props) {
  const band = getScoreBand(score);
  const tierRec = getTierRecommendation(answers);
  const topGaps = getTopGaps(answers);
  const projections = getProjections(answers.q8);
  const survivalData = getSurvivalCurveData(answers.q8);
  const counterfactual = getCounterfactualData(answers.q8);
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#cta";

  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch("/api/ai-insight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgType: answers.q1,
        audience: answers.q2,
        score,
        challenge: answers.q6,
      }),
    })
      .then((r) => r.json())
      .then((d) => setAiInsight(d.insight))
      .catch(() => setAiInsight(null))
      .finally(() => setAiLoading(false));
  }, [answers, score]);

  const survivalChartData = {
    labels: survivalData.months,
    datasets: [
      {
        label: "Without evidence investment",
        data: survivalData.withoutAuxeira,
        borderColor: "#E24B4A",
        backgroundColor: "#E24B4A11",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "With Auxeira",
        data: survivalData.withAuxeira,
        borderColor: "#C9A84C",
        backgroundColor: "#C9A84C11",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const counterfactualChartData = {
    labels: counterfactual.labels,
    datasets: [
      {
        label: "Funding at risk (RM)",
        data: counterfactual.withoutAuxeira,
        backgroundColor: "#E24B4A55",
        borderColor: "#E24B4A",
        borderWidth: 1,
      },
      {
        label: "Opportunity unlocked (RM)",
        data: counterfactual.withAuxeira,
        backgroundColor: "#C9A84C55",
        borderColor: "#C9A84C",
        borderWidth: 1,
      },
    ],
  };

  const RISKS = [
    score < 50
      ? "Funders are likely deprioritising your organisation in favour of those with stronger economic evidence narratives."
      : "Your evidence base is solid but the translation gap is costing you influence at the decision-making level.",
    "Without an independently verified SROI or fiscal multiplier, Treasury-level conversations remain inaccessible.",
    "Organisations with similar scores typically miss 1-2 major funding cycles before the evidence gap is addressed.",
  ];

  const BENCHMARKS = [
    { label: "Organisations with SROI analysis", value: "3.2× more likely to secure co-funding" },
    { label: "Evidence-translated reports", value: "47% higher decision-maker response rate" },
    { label: "Sector leaders vs laggards", value: "Estimated 35-60% funding gap" },
  ];

  const TIMELINE = [
    { phase: "Weeks 1-2", label: "Evidence Audit", desc: "Longitudinal Evidence Audit completed. All data sources mapped and verified." },
    { phase: "Weeks 3-5", label: "Synthesis", desc: "Decision-Ready Synthesis Engine applied. Economic narrative built." },
    { phase: "Weeks 6+", label: "Knowledge Products", desc: "Funder briefs, policy documents, and infographic systems delivered." },
  ];

  return (
    <div className="space-y-10">
      {/* Score ring */}
      <ScoreRing score={score} />

      {/* Projection cards */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-4">
          What This Score Means for Your Organisation
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Funding at risk", value: projections.fundingAtRisk, color: "#E24B4A" },
            { label: "Influence gap", value: projections.influenceGap, color: "#EF9F27" },
            { label: "Opportunity cost", value: projections.opportunityCost, color: "#C9A84C" },
          ].map((card) => (
            <div key={card.label} className="border p-4" style={{ borderColor: card.color + "44" }}>
              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: card.color }}>
                {card.label}
              </p>
              <p className="font-display text-lg font-semibold text-[#0A1628]">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top gaps */}
      {topGaps.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-4">
            Your Two Biggest Gaps
          </p>
          <div className="space-y-3">
            {topGaps.map((gap, i) => (
              <div key={i} className="border border-[#C9A84C]/30 p-4 text-sm text-[#1A1A2A]/80 leading-relaxed">
                {gap}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funding survival curve */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-2">
          Funding Survival Curve — 36 Months
        </p>
        <p className="text-xs text-[#1A1A2A]/40 mb-4">
          Estimated funding index (100 = current baseline). Based on sector benchmarks.
        </p>
        <div className="bg-white border border-[#1A1A2A]/8 p-4">
          <Line data={survivalChartData} options={lineOptions} />
        </div>
      </div>

      {/* Counterfactual divergence */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-2">
          3-Year Counterfactual — Risk vs Opportunity (RM)
        </p>
        <p className="text-xs text-[#1A1A2A]/40 mb-4">
          Estimated rand values based on your budget band. All figures are ranges, not guarantees.
        </p>
        <div className="bg-white border border-[#1A1A2A]/8 p-4">
          <Bar data={counterfactualChartData} options={barOptions} />
        </div>
      </div>

      {/* Risks */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-4">
          Three Risks at Your Current Score
        </p>
        <div className="space-y-3">
          {RISKS.map((risk, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-[#1A1A2A]/70 leading-relaxed">
              <span className="text-[#E24B4A] shrink-0 font-semibold mt-0.5">{i + 1}.</span>
              {risk}
            </div>
          ))}
        </div>
      </div>

      {/* Market context */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-4">
          Sector Benchmarks
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BENCHMARKS.map((b) => (
            <div key={b.label} className="bg-[#F5F0E8] border border-[#1A1A2A]/8 p-4">
              <p className="text-xs text-[#1A1A2A]/45 mb-1 leading-snug">{b.label}</p>
              <p className="text-sm font-semibold text-[#0A1628]">{b.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI competitive insight */}
      <div className="bg-[#0A1628] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-4">
          Competitive Landscape Insight
        </p>
        {aiLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-[#F5F0E8]/10 rounded animate-pulse" style={{ width: `${85 - i * 10}%` }} />
            ))}
          </div>
        ) : aiInsight ? (
          <div className="space-y-4">
            {[
              { label: "LANDSCAPE", text: aiInsight.landscape },
              { label: "RISK", text: aiInsight.risk },
              { label: "OPPORTUNITY", text: aiInsight.opportunity },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] uppercase tracking-widest text-[#C9A84C]/60 mb-1">{item.label}</p>
                <p className="text-[#F5F0E8]/70 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#F5F0E8]/40 text-sm">Insight unavailable, please try again later.</p>
        )}
      </div>

      {/* Growth timeline */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-4">
          What an Auxeira Engagement Looks Like
        </p>
        <div className="space-y-0">
          {TIMELINE.map((t, i) => (
            <div key={t.phase} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C] shrink-0 mt-1" />
                {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-[#C9A84C]/20 my-1" />}
              </div>
              <div className="pb-6">
                <p className="text-[10px] uppercase tracking-widest text-[#C9A84C] font-medium mb-0.5">{t.phase}</p>
                <p className="text-sm font-semibold text-[#0A1628] mb-1">{t.label}</p>
                <p className="text-xs text-[#1A1A2A]/55 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier recommendation */}
      <div className="bg-[#0A1628] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-2">
          Recommended Starting Point
        </p>
        <p className="font-display text-xl font-semibold text-[#F5F0E8] mb-1">{tierRec.label}</p>
        <p className="text-[#F5F0E8]/55 text-sm">{tierRec.description}</p>
      </div>

      {/* Loss aversion close */}
      <div className="border-l-2 border-[#C9A84C] pl-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-3">
          The Honest Truth
        </p>
        <p className="text-[#1A1A2A]/70 text-sm leading-relaxed">
          {score >= 75
            ? "Your evidence foundation is strong. The gap is translation, not data. Organisations at your score level that invest in evidence translation typically see measurable improvements in funder response rates within one funding cycle. The cost of waiting is a missed window, not a missed report."
            : score >= 50
            ? "You have more evidence than most organisations in your sector. The gap is synthesis and economic framing. Without it, decision-makers will continue to ask for shorter reports, not because your work isn't good, but because it isn't speaking their language yet."
            : "The evidence gaps identified here have a direct cost. Every funding cycle that passes without addressing them is a cycle where better-evidenced organisations take the resources your work deserves. This is solvable. It is not a research problem. It is a translation problem."}
        </p>
      </div>

      {/* CTA */}
      <Button
        variant="gold-filled"
        href={calendlyUrl}
        external
        className="w-full justify-center py-4 text-base"
      >
        Book your Evidence Strategy Call →
      </Button>

      <button
        onClick={onReset}
        className="w-full text-center text-sm text-[#1A1A2A]/35 hover:text-[#1A1A2A] transition-colors py-2"
      >
        Start over
      </button>
    </div>
  );
}
