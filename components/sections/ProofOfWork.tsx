"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

const METRICS = [
  { stat: "152,664", label: "Children reached, communicated for global funder audiences" },
  { stat: "14,740", label: "Women-led micro-enterprises surfaced for the first time" },
  { stat: "3.3×", label: "SROI over five years, independently verified" },
  { stat: "$2,000,000", label: "Skoll Award for Social Innovation, 2026" },
];

export default function ProofOfWork() {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!notifyEmail) return;
    setNotifyLoading(true);
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notifyEmail, source: "proof-of-work" }),
      });
    } catch {
      // Non-blocking
    }
    setNotifyLoading(false);
    setNotifySubmitted(true);
  }

  return (
    <section
      id="proof-of-work"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="proof-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="proof-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#0A1628] max-w-3xl leading-tight mb-4"
          >
            We helped change the story of early childhood development in South Africa. The world
            noticed.
          </h2>
        </RevealOnScroll>

        {/* Case study card, navy */}
        <RevealOnScroll delay={100}>
          <div className="mt-12 bg-[#0A1628] p-8 lg:p-12">
            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8 border-b border-[#C9A84C]/20 mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C]/60 mb-1">Client</p>
                <p className="text-[#F5F0E8] font-medium">SmartStart South Africa</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C]/60 mb-1">Sector</p>
                <p className="text-[#F5F0E8] font-medium">Early Childhood Development</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C]/60 mb-1">
                  Engagement
                </p>
                <p className="text-[#F5F0E8] font-medium">
                  10-Year Impact Report, Evidence Intelligence & Strategic Knowledge Products
                </p>
              </div>
            </div>

            {/* Challenge + What We Did */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              <div>
                <h3 className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
                  The Challenge
                </h3>
                <p className="text-[#F5F0E8]/65 text-sm leading-relaxed">
                  SmartStart had a decade of rigorous programme data but a critical evidence gap:
                  their broader economic contribution, 14,740 women-led micro-enterprises,
                  household income effects, caregiver workforce participation, long-term fiscal
                  savings, was unmeasured and absent from policy and funding conversations. Without
                  this framing, ECD investment is perceived by Treasury as social expenditure. Not
                  economic infrastructure.
                </p>
              </div>
              <div>
                <h3 className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
                  What We Did
                </h3>
                <ul className="space-y-2 text-[#F5F0E8]/65 text-sm leading-relaxed">
                  {[
                    "49 structured stakeholder interviews across South Africa",
                    "207-quote Master Evidence Index from a decade of programme data",
                    "Full narrative architecture, from raw evidence to accessible story",
                    "10-Year Impact Report, policy and funder briefs, practitioner communications package",
                    "Economic snapshot, designed infographic systems, annual report contribution",
                    "Ten infographic corrections identified and resolved before publication",
                    "Delivered in six weeks",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#C9A84C] shrink-0 mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-[#C9A84C]/20">
              {METRICS.map((m, i) => (
                <div
                  key={m.stat}
                  className={`pt-6 pb-2 pr-4 ${
                    i < METRICS.length - 1 ? "border-r border-[#C9A84C]/20" : ""
                  } ${i > 0 ? "pl-4" : ""}`}
                >
                  <p className="font-display text-2xl lg:text-3xl font-semibold text-[#C9A84C]">
                    {m.stat}
                  </p>
                  <p className="mt-1 text-xs text-[#F5F0E8]/45 leading-snug">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Skoll quote */}
            <p className="mt-8 text-[#F5F0E8]/50 text-sm italic border-t border-[#C9A84C]/15 pt-6">
              &ldquo;The Skoll Foundation&apos;s $2M Award for Social Innovation recognised
              SmartStart&apos;s impact, and the evidence narrative that made it visible to a global
              audience.&rdquo;
            </p>

            {/* Phase 1 CTA, notify me */}
            <div className="mt-8 border-t border-[#C9A84C]/15 pt-8">
              {!notifySubmitted ? (
                <>
                  <p className="text-[#F5F0E8]/60 text-sm mb-4">
                    Case study available following SmartStart&apos;s official release. Leave your
                    email to be notified.
                  </p>
                  <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      required
                      className="flex-1 bg-[#0f1f3d] border border-[#C9A84C]/20 px-4 py-2.5 text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:outline-none focus:border-[#C9A84C]"
                    />
                    <Button
                      variant="gold-outline"
                      className="text-sm whitespace-nowrap"
                      disabled={notifyLoading}
                    >
                      {notifyLoading ? "Saving…" : "Notify Me →"}
                    </Button>
                  </form>
                </>
              ) : (
                <p className="text-[#C9A84C] text-sm">
                  ✓ We&apos;ll notify you when the case study publishes.
                </p>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
