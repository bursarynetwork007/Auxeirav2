"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { calculateScore, type HealthCheckAnswers } from "@/lib/healthCheckScoring";
import HealthCheckResults from "@/components/sections/HealthCheckResults";

const QUESTIONS = [
  {
    id: "q1",
    question: "Which best describes your organisation?",
    options: [
      { value: "ngo", label: "National NGO or delivery organisation" },
      { value: "foundation", label: "Foundation or funder" },
      { value: "government", label: "Government department or agency" },
      { value: "international", label: "International philanthropy or development agency" },
      { value: "sector-body", label: "Sector body or intermediary" },
    ],
  },
  {
    id: "q2",
    question: "Who is your primary decision-making audience?",
    options: [
      { value: "treasury-national-govt", label: "Treasury or National Government" },
      { value: "international-funders", label: "International funders" },
      { value: "provincial-govt", label: "Provincial government" },
      { value: "board-executive", label: "Board or executive leadership" },
      { value: "multiple-audiences", label: "Multiple audiences simultaneously" },
    ],
  },
  {
    id: "q3",
    question: "How many years of evaluation or programme data do you have?",
    options: [
      { value: "less-than-2", label: "Less than 2 years" },
      { value: "2-5", label: "2 – 5 years" },
      { value: "5-10", label: "5 – 10 years" },
      { value: "more-than-10", label: "More than 10 years" },
    ],
  },
  {
    id: "q4",
    question: "When you last shared a report with a funder or government official, what happened?",
    options: [
      { value: "read-in-full", label: "They read it in full and responded substantively" },
      { value: "asked-for-summary", label: "They asked for a shorter summary" },
      { value: "followed-up-no-response", label: "We followed up but heard little back" },
      { value: "dont-know", label: "We genuinely don't know if it was read" },
    ],
  },
  {
    id: "q5",
    question: "Have you ever had an SROI, economic multiplier, or fiscal impact analysis done?",
    options: [
      { value: "yes-actively-used", label: "Yes, and it's actively used in our funder conversations" },
      { value: "yes-not-used", label: "Yes, but it's not being used effectively" },
      { value: "no-know-we-need", label: "No, but we know we need one" },
      { value: "no-unsure", label: "No, and we're not sure it applies to us" },
    ],
  },
  {
    id: "q6",
    question: "Which best describes your biggest evidence challenge right now?",
    options: [
      { value: "strong-data-not-acting", label: "We have strong data but decision-makers aren't acting on it" },
      { value: "havent-measured-return", label: "We haven't measured our economic or social return" },
      { value: "reports-wrong-format", label: "Our reports don't reach the right people in the right format" },
      { value: "not-enough-data", label: "We don't have enough data or evaluations yet" },
    ],
  },
  {
    id: "q7",
    question: "How often are you asked to 'make the report shorter' or 'simplify the findings'?",
    options: [
      { value: "regularly", label: "Regularly, it's a constant request" },
      { value: "occasionally", label: "Occasionally" },
      { value: "rarely", label: "Rarely" },
      { value: "never-still-dont-land", label: "Never, but our reports still don't seem to land" },
    ],
  },
  {
    id: "q8",
    question: "What is your organisation's approximate annual budget?",
    options: [
      { value: "under-5m", label: "Under R5 million" },
      { value: "5m-20m", label: "R5M – R20M" },
      { value: "20m-100m", label: "R20M – R100M" },
      { value: "over-100m", label: "Over R100M" },
    ],
  },
];

type Step = "quiz" | "email" | "results";

export default function EvidenceHealthCheck() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Partial<HealthCheckAnswers>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [score, setScore] = useState(0);

  const totalQ = QUESTIONS.length;
  const progress = (currentQ / totalQ) * 100;

  function handleOptionSelect(value: string) {
    setSelected(value);
  }

  function handleNext() {
    if (!selected) return;
    const q = QUESTIONS[currentQ];
    const updated = { ...answers, [q.id]: selected };
    setAnswers(updated);
    setSelected(null);
    if (currentQ < totalQ - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setStep("email");
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ((c) => c - 1);
      const prevQ = QUESTIONS[currentQ - 1];
      setSelected(answers[prevQ.id as keyof HealthCheckAnswers] ?? null);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!privacyChecked) {
      setSubmitError("Please accept the privacy policy to continue.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    const finalAnswers = answers as HealthCheckAnswers;
    const calculatedScore = calculateScore(finalAnswers);
    setScore(calculatedScore);
    try {
      await fetch("/api/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers, score: calculatedScore, firstName, email }),
      });
    } catch {
      // Non-blocking
    }
    setSubmitting(false);
    setStep("results");
  }

  function handleReset() {
    setStep("quiz");
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setFirstName("");
    setEmail("");
    setPrivacyChecked(false);
    setScore(0);
    setSubmitError("");
  }

  return (
    <section
      id="health-check"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="health-check-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {!open ? (
          <RevealOnScroll>
            <div className="max-w-2xl">
              <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
                How Strong Is Your Evidence?
              </p>
              <h2
                id="health-check-heading"
                className="font-display text-3xl lg:text-5xl font-light text-[#0A1628] leading-tight mb-6"
              >
                90 seconds. 8 questions. A clear picture of where your evidence is working, and
                where it&apos;s costing you.
              </h2>
              <p className="text-[#1A1A2A]/65 text-base leading-relaxed mb-8">
                The Evidence Health Check is free. No pitch. Just an honest assessment of your
                evidence gaps and what they&apos;re likely costing you in funding, policy traction,
                and sector credibility.
              </p>
              <Button
                variant="gold-filled"
                className="text-base px-8 py-4"
                onClick={() => setOpen(true)}
              >
                Take the Health Check →
              </Button>
            </div>
          </RevealOnScroll>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            {step === "quiz" && (
              <div className="mb-8">
                <div className="flex justify-between text-xs text-[#1A1A2A]/40 mb-2">
                  <span>Question {currentQ + 1} of {totalQ}</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="h-0.5 bg-[#1A1A2A]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A84C] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Quiz */}
            {step === "quiz" && (
              <div>
                <h3 className="font-display text-2xl lg:text-3xl font-light text-[#0A1628] mb-8 leading-snug">
                  {QUESTIONS[currentQ].question}
                </h3>
                <div className="space-y-3">
                  {QUESTIONS[currentQ].options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionSelect(opt.value)}
                      className={`w-full text-left px-5 py-4 border text-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] ${
                        selected === opt.value
                          ? "border-[#C9A84C] bg-[#0A1628] text-[#F5F0E8]"
                          : "border-[#1A1A2A]/15 bg-white text-[#1A1A2A] hover:border-[#C9A84C]/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={handleBack}
                    disabled={currentQ === 0}
                    className="text-sm text-[#1A1A2A]/40 hover:text-[#1A1A2A] disabled:opacity-0 transition-colors"
                  >
                    ← Back
                  </button>
                  <Button
                    variant="gold-filled"
                    onClick={handleNext}
                    disabled={!selected}
                    className="disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {currentQ < totalQ - 1 ? "Next →" : "See My Results →"}
                  </Button>
                </div>
              </div>
            )}

            {/* Email capture */}
            {step === "email" && (
              <div>
                <h3 className="font-display text-2xl lg:text-3xl font-light text-[#0A1628] mb-3">
                  Your Evidence Health Check is ready.
                </h3>
                <p className="text-[#1A1A2A]/60 text-sm mb-8">
                  Enter your email to receive your full Evidence Impact Report, including your
                  score, your two biggest gaps, and a recommended next step.
                </p>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                  />
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacyChecked}
                      onChange={(e) => setPrivacyChecked(e.target.checked)}
                      className="mt-0.5 accent-[#C9A84C]"
                    />
                    <span className="text-xs text-[#1A1A2A]/50 leading-relaxed">
                      I agree to the{" "}
                      <a href="/privacy" className="underline hover:text-[#C9A84C]">
                        Privacy Policy
                      </a>
                      . We don&apos;t share your information. You&apos;ll receive one email with
                      your results and occasional Auxeira Intelligence updates. Unsubscribe any
                      time.
                    </span>
                  </label>
                  {submitError && <p className="text-red-600 text-xs">{submitError}</p>}
                  <Button
                    variant="gold-filled"
                    className="w-full justify-center py-4 text-base"
                    disabled={submitting || !email}
                  >
                    {submitting ? "Sending..." : "See my results →"}
                  </Button>
                </form>
              </div>
            )}

            {/* Results */}
            {step === "results" && (
              <HealthCheckResults
                score={score}
                answers={answers as HealthCheckAnswers}
                onReset={handleReset}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
