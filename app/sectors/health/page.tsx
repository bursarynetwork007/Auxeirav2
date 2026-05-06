"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

export default function HealthSectorPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "health-sector-waitlist" }),
      });
    } catch {
      // Non-blocking
    }
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-[#0A1628] pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
                SDG 3 — Health & Nutrition
              </p>
              <h1 className="font-display text-4xl lg:text-6xl font-light text-[#F5F0E8] max-w-3xl leading-tight mb-6">
                The evidence gap in African health systems is vast and costly.
              </h1>
              <p className="text-[#F5F0E8]/60 text-base lg:text-lg max-w-2xl leading-relaxed">
                We are building the sector intelligence engine. Health is where the next major
                African funding wave is going — and where the evidence infrastructure is most
                urgently needed.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* The gap */}
        <section className="bg-[#F5F0E8] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-3xl lg:text-4xl font-light text-[#0A1628] max-w-2xl leading-tight mb-8">
                Why health evidence fails to move decisions
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl">
                <p className="text-[#1A1A2A]/70 text-base leading-relaxed">
                  African health programmes generate enormous volumes of data — clinical outcomes,
                  community health worker performance, nutrition indicators, disease burden
                  estimates. Almost none of it is translated into the economic language that moves
                  health ministries, international funders, or development finance institutions.
                </p>
                <p className="text-[#1A1A2A]/70 text-base leading-relaxed">
                  The result: funding decisions are made on incomplete evidence. Programmes that
                  work don&apos;t scale. Interventions that fail continue to receive resources.
                  The cost is borne by the communities that needed better decisions — and the
                  funders who deserved better intelligence.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Building phase */}
        <section className="bg-[#0A1628] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <div className="max-w-2xl">
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
                  Status: Building
                </p>
                <h2 className="font-display text-3xl lg:text-4xl font-light text-[#F5F0E8] leading-tight mb-6">
                  Auxeira&apos;s Health Intelligence Engine is under construction.
                </h2>
                <p className="text-[#F5F0E8]/55 text-base leading-relaxed mb-10">
                  We are currently scoping the first health sector engagements and building the
                  evidence architecture that will underpin this sector&apos;s intelligence engine.
                  If you work in African health — as a funder, programme operator, government
                  agency, or development partner — we want to hear from you.
                </p>

                {/* Waitlist */}
                {!submitted ? (
                  <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 bg-[#0f1f3d] border border-[#C9A84C]/20 px-4 py-3 text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:outline-none focus:border-[#C9A84C]"
                    />
                    <Button
                      variant="gold-filled"
                      className="text-sm whitespace-nowrap"
                      disabled={loading}
                    >
                      {loading ? "Saving…" : "Register Interest →"}
                    </Button>
                  </form>
                ) : (
                  <p className="text-[#C9A84C] text-sm">
                    ✓ We&apos;ll be in touch as the Health Intelligence Engine develops.
                  </p>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#C9A84C] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#0A1628] max-w-xl leading-tight mb-6">
                Working in African health? Let&apos;s talk.
              </h2>
              <p className="text-[#0A1628]/65 text-base leading-relaxed max-w-lg mb-8">
                We&apos;re actively scoping health sector engagements. If your organisation has
                evidence that needs to move decisions, we want to hear from you.
              </p>
              <Button
                variant="dark-filled"
                href="/#cta"
                className="text-base px-8 py-4"
              >
                Start a Conversation →
              </Button>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
