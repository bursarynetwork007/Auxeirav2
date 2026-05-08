"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { calculateScore, getPrimaryGapLabel, type HealthCheckAnswers } from "@/lib/healthCheckScoring";

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

const ORG_SIZE_OPTIONS = [
  "Under 10 staff",
  "10–50 staff",
  "50–200 staff",
  "200+ staff",
  "Government department",
  "Foundation / Funder",
];

type Step = "quiz" | "org-info" | "confirmation";

interface OrgInfo {
  firstName: string;
  lastName: string;
  orgName: string;
  jobTitle: string;
  email: string;
  orgUrl: string;
  orgSize: string;
}

// ── Confirmation screen ───────────────────────────────────────────────────────
function ConfirmationScreen({
  orgInfo,
  primaryGap,
  onReset,
}: {
  orgInfo: OrgInfo;
  primaryGap: string;
  onReset: () => void;
}) {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#cta";

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-3">
          Submitted
        </p>
        <h3 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-4">
          Your report is being prepared.
        </h3>
        <p className="text-[#1A1A2A]/65 text-sm leading-relaxed">
          We&apos;re researching{" "}
          <span className="font-medium text-[#0A1628]">{orgInfo.orgName}</span> and running your
          diagnostic answers through Auxeira&apos;s Evidence Intelligence Framework. Your full
          Entity Evidence Risk Report will arrive at{" "}
          <span className="font-medium text-[#0A1628]">{orgInfo.email}</span> within 2 hours.
        </p>
      </div>

      {/* Primary gap — the one instant insight */}
      <div className="border-l-2 border-[#C9A84C] pl-5 mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-1">
          Your primary evidence gap
        </p>
        <p className="font-display text-xl font-semibold text-[#0A1628]">{primaryGap}</p>
      </div>

      {/* What the report includes */}
      <div className="bg-white border border-[#1A1A2A]/8 p-6 mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A2A]/40 font-medium mb-4">
          What your report will include
        </p>
        <ul className="space-y-2">
          {[
            "Evidence Health Score with sector benchmark",
            "Top 3 risks and estimated funding at risk",
            "3-year counterfactual funding forecast",
            "Recommended Auxeira intervention and tier",
            "Sector competitive landscape analysis",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#1A1A2A]/70">
              <span className="text-[#C9A84C] shrink-0 mt-0.5">·</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Calendly CTA — peak engagement moment */}
      <div className="bg-[#0A1628] p-6 mb-6">
        <p className="text-[#F5F0E8]/60 text-sm mb-4 leading-relaxed">
          While you wait, book your Evidence Strategy Call. You&apos;re at peak clarity about your
          evidence gaps right now, it&apos;s the best time to talk.
        </p>
        <Button
          variant="gold-filled"
          href={calendlyUrl}
          external
          className="w-full justify-center py-4 text-base"
        >
          Book your Evidence Strategy Call →
        </Button>
      </div>

      <p className="text-xs text-[#1A1A2A]/35 text-center leading-relaxed">
        Can&apos;t find the email? Check your spam folder or contact{" "}
        <a href="mailto:info@auxeira.com" className="underline hover:text-[#C9A84C]">
          info@auxeira.com
        </a>
      </p>

      <button
        onClick={onReset}
        className="w-full text-center text-xs text-[#1A1A2A]/25 hover:text-[#1A1A2A]/50 transition-colors py-4 mt-2"
      >
        Start over
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EvidenceHealthCheck() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("quiz");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Partial<HealthCheckAnswers>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [primaryGap, setPrimaryGap] = useState("");

  const [orgInfo, setOrgInfo] = useState<OrgInfo>({
    firstName: "",
    lastName: "",
    orgName: "",
    jobTitle: "",
    email: "",
    orgUrl: "",
    orgSize: "",
  });
  const [privacyChecked, setPrivacyChecked] = useState(false);

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
      setStep("org-info");
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ((c) => c - 1);
      const prevQ = QUESTIONS[currentQ - 1];
      setSelected(answers[prevQ.id as keyof HealthCheckAnswers] ?? null);
    }
  }

  async function handleOrgSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!privacyChecked) {
      setSubmitError("Please accept the privacy policy to continue.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    const finalAnswers = answers as HealthCheckAnswers;
    const score = calculateScore(finalAnswers);
    const gap = getPrimaryGapLabel(finalAnswers);
    setPrimaryGap(gap);

    try {
      await fetch("/api/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: finalAnswers,
          score,
          ...orgInfo,
        }),
      });
    } catch {
      // Non-blocking — confirmation screen still shown
    }

    setSubmitting(false);
    setStep("confirmation");
  }

  function handleReset() {
    setStep("quiz");
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setOrgInfo({ firstName: "", lastName: "", orgName: "", jobTitle: "", email: "", orgUrl: "", orgSize: "" });
    setPrivacyChecked(false);
    setPrimaryGap("");
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
                evidence gaps, with a full Entity Evidence Risk Report delivered to your inbox
                within 2 hours.
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
                    {currentQ < totalQ - 1 ? "Next →" : "Continue →"}
                  </Button>
                </div>
              </div>
            )}

            {/* Org info */}
            {step === "org-info" && (
              <div>
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-3">
                  Almost done
                </p>
                <h3 className="font-display text-2xl lg:text-3xl font-light text-[#0A1628] mb-3 leading-snug">
                  Tell us about your organisation.
                </h3>
                <p className="text-[#1A1A2A]/55 text-sm mb-8 leading-relaxed">
                  Your full Entity Evidence Risk Report, with deep organisational research and a
                  3-year funding forecast, will be delivered to your inbox within 2 hours.
                </p>

                <form onSubmit={handleOrgSubmit} className="space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#1A1A2A]/50 mb-1.5 uppercase tracking-wider">
                        First name <span className="text-[#C9A84C]">*</span>
                      </label>
                      <input
                        type="text"
                        value={orgInfo.firstName}
                        onChange={(e) => setOrgInfo({ ...orgInfo, firstName: e.target.value })}
                        required
                        className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#1A1A2A]/50 mb-1.5 uppercase tracking-wider">
                        Last name <span className="text-[#C9A84C]">*</span>
                      </label>
                      <input
                        type="text"
                        value={orgInfo.lastName}
                        onChange={(e) => setOrgInfo({ ...orgInfo, lastName: e.target.value })}
                        required
                        className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>
                  </div>

                  {/* Org name */}
                  <div>
                    <label className="block text-xs text-[#1A1A2A]/50 mb-1.5 uppercase tracking-wider">
                      Organisation name <span className="text-[#C9A84C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={orgInfo.orgName}
                      onChange={(e) => setOrgInfo({ ...orgInfo, orgName: e.target.value })}
                      required
                      className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  {/* Job title */}
                  <div>
                    <label className="block text-xs text-[#1A1A2A]/50 mb-1.5 uppercase tracking-wider">
                      Job title / role <span className="text-[#C9A84C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={orgInfo.jobTitle}
                      onChange={(e) => setOrgInfo({ ...orgInfo, jobTitle: e.target.value })}
                      required
                      className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  {/* Work email */}
                  <div>
                    <label className="block text-xs text-[#1A1A2A]/50 mb-1.5 uppercase tracking-wider">
                      Work email <span className="text-[#C9A84C]">*</span>
                    </label>
                    <input
                      type="email"
                      value={orgInfo.email}
                      onChange={(e) => setOrgInfo({ ...orgInfo, email: e.target.value })}
                      required
                      className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-xs text-[#1A1A2A]/50 mb-1.5 uppercase tracking-wider">
                      Organisation website
                      <span className="text-[#1A1A2A]/30 ml-1 normal-case tracking-normal">
                        (recommended)
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://"
                      value={orgInfo.orgUrl}
                      onChange={(e) => setOrgInfo({ ...orgInfo, orgUrl: e.target.value })}
                      className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]"
                    />
                  </div>

                  {/* Org size */}
                  <div>
                    <label className="block text-xs text-[#1A1A2A]/50 mb-1.5 uppercase tracking-wider">
                      Organisation size
                    </label>
                    <select
                      value={orgInfo.orgSize}
                      onChange={(e) => setOrgInfo({ ...orgInfo, orgSize: e.target.value })}
                      className="w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] focus:outline-none focus:border-[#C9A84C] appearance-none"
                    >
                      <option value="">Select...</option>
                      {ORG_SIZE_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>

                  {/* Privacy */}
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
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
                      . We don&apos;t share your information. You&apos;ll receive your Evidence
                      Risk Report and occasional Auxeira Intelligence updates. Unsubscribe any
                      time.
                    </span>
                  </label>

                  {submitError && <p className="text-red-600 text-xs">{submitError}</p>}

                  <Button
                    variant="gold-filled"
                    className="w-full justify-center py-4 text-base"
                    disabled={submitting || !orgInfo.email || !orgInfo.firstName || !orgInfo.orgName || !orgInfo.jobTitle}
                  >
                    {submitting ? "Preparing your report..." : "Get my Entity Evidence Risk Report →"}
                  </Button>
                </form>
              </div>
            )}

            {/* Confirmation */}
            {step === "confirmation" && (
              <ConfirmationScreen
                orgInfo={orgInfo}
                primaryGap={primaryGap}
                onReset={handleReset}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
