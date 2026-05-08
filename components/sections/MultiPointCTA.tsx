"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function MultiPointCTA() {
  const [capEmail, setCapEmail] = useState("");
  const [capName, setCapName] = useState("");
  const [capSubmitted, setCapSubmitted] = useState(false);
  const [capLoading, setCapLoading] = useState(false);

  const [subEmail, setSubEmail] = useState("");
  const [subSubmitted, setSubSubmitted] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  const calendlyUrl =
    typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#")
      : "#";

  async function handleCapability(e: React.FormEvent) {
    e.preventDefault();
    if (!capEmail) return;
    setCapLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: capEmail, firstName: capName, source: "capability-pdf" }),
      });
    } catch {
      // Non-blocking
    }
    setCapLoading(false);
    setCapSubmitted(true);
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!subEmail) return;
    setSubLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail, source: "newsletter-cta" }),
      });
    } catch {
      // Non-blocking
    }
    setSubLoading(false);
    setSubSubmitted(true);
  }

  return (
    <section
      id="cta"
      className="bg-[#C9A84C] py-24 lg:py-32"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="cta-heading"
            className="font-display text-3xl lg:text-5xl font-semibold text-[#0A1628] max-w-2xl leading-tight mb-16"
          >
            Your evidence deserves to move the world.
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* 01, Book a call */}
          <RevealOnScroll delay={0}>
            <div className="flex flex-col h-full">
              <p className="text-[#0A1628]/40 text-xs uppercase tracking-[0.2em] font-medium mb-3">
                01
              </p>
              <h3 className="font-display text-xl font-semibold text-[#0A1628] mb-3">
                Book an Evidence Strategy Call
              </h3>
              <p className="text-[#0A1628]/65 text-sm leading-relaxed mb-6 flex-1">
                30 minutes. Free. No pitch. We&apos;ll look at what evidence you have, where the
                gaps are, and whether Auxeira is the right partner. If we&apos;re not the right
                fit, we&apos;ll tell you that too.
              </p>
              <Button
                variant="dark-filled"
                href={calendlyUrl}
                external
                className="w-full justify-center py-4 text-base"
              >
                Book a Call →
              </Button>
            </div>
          </RevealOnScroll>

          {/* 02, Capability PDF */}
          <RevealOnScroll delay={120}>
            <div className="flex flex-col h-full">
              <p className="text-[#0A1628]/40 text-xs uppercase tracking-[0.2em] font-medium mb-3">
                02
              </p>
              <h3 className="font-display text-xl font-semibold text-[#0A1628] mb-3">
                Download the Capability Overview
              </h3>
              <p className="text-[#0A1628]/65 text-sm leading-relaxed mb-6 flex-1">
                2-page PDF. Instant access. The fastest way to understand what Auxeira does, what
                we&apos;ve delivered, and what a partnership looks like.
              </p>
              {!capSubmitted ? (
                <form onSubmit={handleCapability} className="space-y-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={capName}
                    onChange={(e) => setCapName(e.target.value)}
                    className="w-full bg-[#b8963e]/30 border border-[#0A1628]/20 px-4 py-3 text-sm text-[#0A1628] placeholder-[#0A1628]/40 focus:outline-none focus:border-[#0A1628]/50"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={capEmail}
                    onChange={(e) => setCapEmail(e.target.value)}
                    required
                    className="w-full bg-[#b8963e]/30 border border-[#0A1628]/20 px-4 py-3 text-sm text-[#0A1628] placeholder-[#0A1628]/40 focus:outline-none focus:border-[#0A1628]/50"
                  />
                  <Button
                    variant="dark-filled"
                    className="w-full justify-center py-3 text-sm"
                    disabled={capLoading}
                  >
                    {capLoading ? "Sending…" : "Download Now →"}
                  </Button>
                </form>
              ) : (
                <p className="text-[#0A1628] text-sm font-medium">
                  ✓ Check your inbox, the Capability Overview is on its way.
                </p>
              )}
            </div>
          </RevealOnScroll>

          {/* 03, Subscribe */}
          <RevealOnScroll delay={240}>
            <div className="flex flex-col h-full">
              <p className="text-[#0A1628]/40 text-xs uppercase tracking-[0.2em] font-medium mb-3">
                03
              </p>
              <h3 className="font-display text-xl font-semibold text-[#0A1628] mb-3">
                Subscribe to Auxeira Intelligence
              </h3>
              <p className="text-[#0A1628]/65 text-sm leading-relaxed mb-6 flex-1">
                Monthly. Free. No noise. Evidence, behavioural science insights, and sector
                analysis, for funders, government, and impact leaders who want to stay ahead.
              </p>
              {!subSubmitted ? (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    required
                    className="w-full bg-[#b8963e]/30 border border-[#0A1628]/20 px-4 py-3 text-sm text-[#0A1628] placeholder-[#0A1628]/40 focus:outline-none focus:border-[#0A1628]/50"
                  />
                  <Button
                    variant="dark-filled"
                    className="w-full justify-center py-3 text-sm"
                    disabled={subLoading}
                  >
                    {subLoading ? "Subscribing…" : "Subscribe →"}
                  </Button>
                </form>
              ) : (
                <p className="text-[#0A1628] text-sm font-medium">
                  ✓ You&apos;re subscribed to Auxeira Intelligence.
                </p>
              )}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
