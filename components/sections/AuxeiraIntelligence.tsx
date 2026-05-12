"use client";

import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type State = "idle" | "submitting" | "success" | "error";

const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com",
  "outlook.com", "hotmail.com", "hotmail.co.uk", "live.com",
  "yahoo.com", "yahoo.co.uk", "yahoo.co.za",
  "icloud.com", "me.com", "mac.com",
]);

function isPersonalEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return PERSONAL_DOMAINS.has(domain);
}

interface Fields {
  firstName: string;
  lastName: string;
  email: string;
  orgName: string;
  orgWebsite: string;
}

export default function AuxeiraIntelligence() {
  const [fields, setFields] = useState<Fields>({
    firstName: "",
    lastName: "",
    email: "",
    orgName: "",
    orgWebsite: "",
  });
  const [state, setState] = useState<State>("idle");

  const showWebsite = isPersonalEmail(fields.email);

  function set(key: keyof Fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.firstName || !fields.lastName || !fields.email || !fields.orgName) return;
    setState("submitting");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          orgName: fields.orgName,
          orgWebsite: showWebsite ? fields.orgWebsite : undefined,
          source: "newsletter",
        }),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  const inputClass =
    "w-full border border-[#1A1A2A]/15 bg-white px-4 py-3 text-sm text-[#1A1A2A] placeholder-[#1A1A2A]/30 focus:outline-none focus:border-[#C9A84C]";
  const labelClass =
    "block text-xs text-[#1A1A2A]/50 mb-1.5 uppercase tracking-wider";

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
                <p className="text-[#0A1628] font-medium text-sm mb-1">You are subscribed.</p>
                <p className="text-[#1A1A2A]/55 text-sm leading-relaxed">
                  The first edition arrives on the first Monday of next month.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>
                      First name <span className="text-[#C9A84C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={fields.firstName}
                      onChange={set("firstName")}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Last name <span className="text-[#C9A84C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={fields.lastName}
                      onChange={set("lastName")}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Work email */}
                <div>
                  <label className={labelClass}>
                    Work email <span className="text-[#C9A84C]">*</span>
                  </label>
                  <input
                    type="email"
                    value={fields.email}
                    onChange={set("email")}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Org name */}
                <div>
                  <label className={labelClass}>
                    Organisation <span className="text-[#C9A84C]">*</span>
                  </label>
                  <input
                    type="text"
                    value={fields.orgName}
                    onChange={set("orgName")}
                    required
                    className={inputClass}
                  />
                </div>

                {/* Conditional website — only shown for personal email domains */}
                {showWebsite && (
                  <div>
                    <label className={labelClass}>
                      Organisation website
                      <span className="text-[#1A1A2A]/30 ml-1 normal-case tracking-normal">
                        (helps us personalise your edition)
                      </span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://"
                      value={fields.orgWebsite}
                      onChange={set("orgWebsite")}
                      className={inputClass}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    state === "submitting" ||
                    !fields.firstName ||
                    !fields.lastName ||
                    !fields.email ||
                    !fields.orgName
                  }
                  className="w-full sm:w-auto bg-[#0A1628] text-[#F5F0E8] px-8 py-3.5 text-sm font-semibold tracking-wide hover:bg-[#C9A84C] hover:text-[#0A1628] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {state === "submitting"
                    ? "Subscribing..."
                    : "Subscribe to Auxeira Intelligence →"}
                </button>

                {state === "error" && (
                  <p className="text-red-600 text-xs">
                    Something went wrong. Try again or email{" "}
                    <a href="mailto:info@auxeira.com" className="underline">
                      info@auxeira.com
                    </a>.
                  </p>
                )}

                <p className="text-[#1A1A2A]/30 text-xs pt-1">
                  No spam. One edition monthly. Unsubscribe any time.
                </p>
              </form>
            )}
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
