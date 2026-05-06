"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

export default function Insights() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
    } catch {
      // Non-blocking
    }
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section
      id="insights"
      className="bg-[#0A1628] py-24 lg:py-32"
      aria-labelledby="insights-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="insights-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#F5F0E8] max-w-3xl leading-tight"
          >
            We don&apos;t just produce evidence for our clients. We publish what we learn — because
            the sector needs better thinking, not just better reports.
          </h2>
        </RevealOnScroll>

        {/* Featured article */}
        <RevealOnScroll delay={100}>
          <div className="mt-16 border border-[#C9A84C]/25 p-8 lg:p-12 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-4">
              Featured Article
            </p>
            <h3 className="font-display text-2xl lg:text-3xl font-semibold text-[#F5F0E8] leading-snug mb-3">
              The Translation Gap: Why Strong Evidence Doesn&apos;t Drive Strong Decisions
            </h3>
            <p className="text-[#F5F0E8]/45 text-sm mb-4">
              By Lante Emmanuel Luthuli, Founder & CEO
            </p>
            <blockquote className="border-l-2 border-[#C9A84C] pl-5 mb-6">
              <p className="text-[#F5F0E8]/65 text-base italic leading-relaxed">
                &ldquo;The gap between evidence and decision is where impact dies. It is not a
                communications problem. It is a behavioural science problem. And it has a
                solution.&rdquo;
              </p>
            </blockquote>
            <Button variant="gold-outline" href="#insights" className="text-sm">
              Read the Article →
            </Button>
          </div>
        </RevealOnScroll>

        {/* Newsletter signup */}
        <RevealOnScroll delay={200}>
          <div className="mt-16 max-w-xl">
            <h3 className="font-display text-xl font-semibold text-[#F5F0E8] mb-2">
              Subscribe to Auxeira Intelligence
            </h3>
            <p className="text-[#F5F0E8]/50 text-sm mb-6 leading-relaxed">
              Monthly insights on evidence, behavioural science, and the decisions that shape
              Africa&apos;s future — for funders, government, and impact leaders who want to stay
              ahead.
            </p>
            {!submitted ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
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
                  {loading ? "Subscribing…" : "Subscribe"}
                </Button>
              </form>
            ) : (
              <p className="text-[#C9A84C] text-sm">
                ✓ You&apos;re subscribed to Auxeira Intelligence.
              </p>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
