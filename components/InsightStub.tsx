"use client";

import { useState } from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

interface InsightStubProps {
  type: string;
  title: string;
  teaser: string;
}

export default function InsightStub({ type, title, teaser }: InsightStubProps) {
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
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-[#0A1628] pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
                {type}
              </p>
              <h1 className="font-display text-4xl lg:text-6xl font-light text-[#F5F0E8] leading-tight mb-8">
                {title}
              </h1>
              <div className="flex items-center gap-4 border-t border-[#C9A84C]/20 pt-6">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C9A84C]/30 shrink-0 relative">
                  <Image
                    src="/images/lante-luthuli.jpg"
                    alt="Lante Emmanuel Luthuli"
                    fill
                    className="object-cover object-top"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="text-[#F5F0E8] text-sm font-medium">Lante Emmanuel Luthuli</p>
                  <p className="text-[#F5F0E8]/40 text-xs">Founder & CEO, Auxeira</p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Teaser */}
        <section className="bg-[#F5F0E8] py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <div className="max-w-2xl">
                <p className="font-display text-xl lg:text-2xl font-light text-[#1A1A2A]/80 leading-relaxed mb-10">
                  {teaser}
                </p>

                {/* Coming soon notice */}
                <div className="border border-[#C9A84C]/30 bg-white p-6 mb-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-2">
                    Coming Soon
                  </p>
                  <p className="text-[#1A1A2A]/65 text-sm leading-relaxed">
                    This article is in preparation. Subscribe to Auxeira Intelligence to be
                    notified when it publishes.
                  </p>
                </div>

                {/* Email capture */}
                {!submitted ? (
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="flex-1 border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                    />
                    <Button
                      variant="gold-filled"
                      className="text-sm whitespace-nowrap"
                      disabled={loading}
                    >
                      {loading ? "Subscribing..." : "Notify me when it publishes →"}
                    </Button>
                  </form>
                ) : (
                  <p className="text-[#C9A84C] text-sm font-medium">
                    You&apos;re subscribed. We&apos;ll notify you when this publishes.
                  </p>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Back to insights */}
        <section className="bg-[#0A1628] py-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <p className="text-[#F5F0E8]/50 text-sm">
                  More thinking from Auxeira on evidence, behavioural science, and the decisions
                  that shape Africa&apos;s future.
                </p>
                <Button variant="gold-outline" href="/#insights" className="shrink-0 text-sm">
                  ← Back to Insights
                </Button>
              </div>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
