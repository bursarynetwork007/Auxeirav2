"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import StatCounter from "@/components/ui/StatCounter";

const HEADLINE_WORDS = [
  "The", "most", "important", "evidence", "in", "the", "world",
  "is", "in", "Africa.", "We're", "bringing", "it", "online.",
];

const DISSOLVING_STATEMENTS = [
  "You've spent years building something that works. We build the evidence that proves it — and makes it impossible for funders and government to look away.",
  "We surface the economic story inside your grantees' data — the SROI, the multiplier effect, the fiscal case — and translate it into the language that moves co-funders and government.",
  "We build the economic case that justifies resource allocation — from community-level programme data to Treasury-ready fiscal impact analysis.",
  "You need to understand what's working in markets you can't reach. We go there, synthesise the evidence, and bring back intelligence that changes how you allocate.",
  "We aggregate evidence across the sector — building the intelligence engine that no single organisation could build alone, and making it available to the decisions that drive systemic change.",
];

const PROOF_ANCHORS = [
  { stat: "49", label: "Structured Interviews Conducted" },
  { stat: "207", label: "Quote Evidence Index Built" },
  { stat: "3.3×", label: "Independently Verified SROI" },
  { stat: "$2M", label: "Skoll Award — 2026" },
];

export default function Hero() {
  const [visibleWords, setVisibleWords] = useState(0);
  const [statementIndex, setStatementIndex] = useState(0);
  const [statementVisible, setStatementVisible] = useState(true);
  const [headlineDone, setHeadlineDone] = useState(false);

  // Word-by-word headline animation
  useEffect(() => {
    if (visibleWords >= HEADLINE_WORDS.length) {
      setHeadlineDone(true);
      return;
    }
    const delay = visibleWords === 0 ? 400 : 90;
    const t = setTimeout(() => setVisibleWords((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [visibleWords]);

  // Dissolving statement crossfade — desktop only, starts after headline
  useEffect(() => {
    if (!headlineDone) return;
    const interval = setInterval(() => {
      setStatementVisible(false);
      setTimeout(() => {
        setStatementIndex((i) => (i + 1) % DISSOLVING_STATEMENTS.length);
        setStatementVisible(true);
      }, 600);
    }, 5000);
    return () => clearInterval(interval);
  }, [headlineDone]);

  return (
    <section
      className="relative min-h-screen bg-[#0A1628] flex flex-col justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 79px, #C9A84C 79px, #C9A84C 80px)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24 lg:pt-40 lg:pb-32 w-full">
        {/* Headline */}
        <h1
          className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light text-[#F5F0E8] leading-tight max-w-4xl"
          aria-label="The most important evidence in the world is in Africa. We're bringing it online."
        >
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={i}
              className="inline-block mr-[0.25em] transition-all duration-300"
              style={{
                opacity: i < visibleWords ? 1 : 0,
                transform: i < visibleWords ? "translateY(0)" : "translateY(12px)",
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Gold rule — animates in after headline */}
        <div
          className="mt-8 h-px bg-[#C9A84C] transition-all duration-700 ease-out"
          style={{ width: headlineDone ? "100%" : "0%" }}
          aria-hidden="true"
        />

        {/* Fixed descriptor */}
        <p className="mt-8 text-[#F5F0E8]/70 text-base lg:text-lg max-w-2xl leading-relaxed">
          Auxeira delivers evidence, economic analysis and impact intelligence to funders,
          governments and social sector organisations across Africa.
        </p>

        {/* Dissolving statements — desktop only */}
        <div className="hidden lg:block mt-6 min-h-[4rem] max-w-2xl">
          <p
            className="text-[#F5F0E8]/55 text-base leading-relaxed transition-opacity duration-500"
            style={{ opacity: statementVisible ? 1 : 0 }}
          >
            {DISSOLVING_STATEMENTS[statementIndex]}
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button variant="gold-filled" href="#proof-of-work" className="text-base px-8 py-4">
            See Our Proof
          </Button>
          <Button variant="gold-outline" href="#cta" className="text-base px-8 py-4">
            Start a Conversation
          </Button>
        </div>

        {/* Proof anchors — animated stat counters */}
        <div className="mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-[#C9A84C]/20">
          {PROOF_ANCHORS.map((anchor, i) => (
            <StatCounter
              key={anchor.stat}
              value={anchor.stat}
              label={anchor.label}
              className={`pt-6 pb-2 pr-6 ${
                i < PROOF_ANCHORS.length - 1 ? "border-r border-[#C9A84C]/20" : ""
              } ${i > 0 ? "pl-6" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
