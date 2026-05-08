"use client";

import { useState } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

export default function EconomicDevelopmentPage() {
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
        body: JSON.stringify({ email, source: "economic-development-waitlist" }),
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
                SDG 8 — Economic Development
              </p>
              <h1 className="font-display text-4xl lg:text-6xl font-light text-[#F5F0E8] max-w-3xl leading-tight mb-6">
                From microenterprise to national fiscal policy.
              </h1>
              <p className="text-[#F5F0E8]/60 text-base lg:text-lg max-w-2xl leading-relaxed">
                We translate economic evidence into the language of growth and scale. Our Economic
                Development sector intelligence engine is under development.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* The gap */}
        <section className="bg-[#F5F0E8] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-3xl lg:text-4xl font-light text-[#0A1628] max-w-2xl leading-tight mb-8">
                The evidence gap in African economic development
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl">
                <p className="text-[#1A1A2A]/70 text-base leading-relaxed">
                  Africa's economic development story is being told in the wrong language. Microenterprise
                  data sits in programme reports. Fiscal multiplier effects go unmeasured. The economic
                  contribution of informal sector development, women-led enterprise growth, and
                  community-level capital formation is almost entirely absent from the conversations
                  that drive national resource allocation.
                </p>
                <p className="text-[#1A1A2A]/70 text-base leading-relaxed">
                  The result is a systematic underinvestment in the interventions that work, and
                  continued funding of frameworks that don't, because the evidence that would
                  redirect capital has never been built, synthesised, or translated into the
                  language that moves Treasury, development finance institutions, and international
                  funders.
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
                  Auxeira&apos;s Economic Development Intelligence Engine is under construction.
                </h2>
                <p className="text-[#F5F0E8]/55 text-base leading-relaxed mb-10">
                  We are scoping the first economic development sector engagements, building the
                  evidence architecture that will underpin this sector&apos;s intelligence engine.
                  If your organisation works in economic development, enterprise development,
                  or fiscal policy across Africa, we want to hear from you.
                </p>

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
                      {loading ? "Saving..." : "Register Interest →"}
                    </Button>
                  </form>
                ) : (
                  <p className="text-[#C9A84C] text-sm">
                    We&apos;ll be in touch as the Economic Development Intelligence Engine develops.
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
                Working in African economic development? Let&apos;s talk.
              </h2>
              <p className="text-[#0A1628]/65 text-base leading-relaxed max-w-lg mb-8">
                We&apos;re actively scoping economic development sector engagements. If your
                organisation has evidence that needs to move decisions, we want to hear from you.
              </p>
              <Button variant="dark-filled" href="/#cta" className="text-base px-8 py-4">
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
