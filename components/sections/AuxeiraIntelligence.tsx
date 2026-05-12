"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type State = "idle" | "submitting" | "success" | "error";

export default function AuxeiraIntelligence() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("submitting");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, source: "newsletter" }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section
      id="intelligence"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="intelligence-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl">
          <RevealOnScroll>
            <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
              Auxeira Intelligence
            </p>
            <h2
              id="intelligence-heading"
              className="font-display text-3xl lg:text-5xl font-light text-[#0A1628] leading-tight mb-6"
            >
              Subscribe to Auxeira Intelligence
            </h2>
            <p className="text-[#1A1A2A]/60 text-base leading-relaxed mb-10">
              Monthly. Free. No noise. Evidence, behavioural science insights, and sector
              analysis — for funders, government, and impact leaders who want to stay ahead.
            </p>

            {state === "success" ? (
              <div className="border-l-2 border-[#C9A84C] pl-5 py-1">
                <p className="text-[#0A1628] font-medium text-sm mb-1">You&apos;re in.</p>
                <p className="text-[#1A1A2A]/55 text-sm leading-relaxed">
                  Welcome to Auxeira Intelligence. The first issue will be in your inbox shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                  />
                  <input
                    type="email"
                    placeholder="Work email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={state === "submitting" || !email}
                  className="w-full sm:w-auto bg-[#0A1628] text-[#F5F0E8] px-8 py-3.5 text-sm font-semibold tracking-wide hover:bg-[#C9A84C] hover:text-[#0A1628] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {state === "submitting" ? "Subscribing..." : "Subscribe →"}
                </button>

                {state === "error" && (
                  <p className="text-red-600 text-xs">
                    Something went wrong. Try again or email{" "}
                    <a href="mailto:info@auxeira.com" className="underline">
                      info@auxeira.com
                    </a>
                    .
                  </p>
                )}

                <p className="text-[#1A1A2A]/30 text-xs pt-1">
                  No spam. Unsubscribe any time.
                </p>
              </form>
            )}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
