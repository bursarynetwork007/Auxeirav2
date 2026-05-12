"use client";

import { useState } from "react";
import Link from "next/link";

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

const footerLinks = [
  { label: "About", href: "#founder" },
  { label: "How We Work", href: "#how-we-work" },
  { label: "Our Proof", href: "#proof-of-work" },
  { label: "Sectors", href: "#sectors" },
  { label: "Insights", href: "#insights" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

interface FooterSubFields {
  firstName: string;
  lastName: string;
  email: string;
  orgName: string;
  orgWebsite: string;
}

export default function Footer() {
  const [sub, setSub] = useState<FooterSubFields>({
    firstName: "", lastName: "", email: "", orgName: "", orgWebsite: "",
  });
  const [subState, setSubState] = useState<"idle" | "submitting" | "success">("idle");

  const showWebsite = isPersonalEmail(sub.email);

  function set(key: keyof FooterSubFields) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setSub((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sub.firstName || !sub.lastName || !sub.email || !sub.orgName) return;
    setSubState("submitting");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: sub.firstName,
          lastName: sub.lastName,
          email: sub.email,
          orgName: sub.orgName,
          orgWebsite: showWebsite ? sub.orgWebsite : undefined,
          source: "newsletter",
        }),
      });
    } catch {
      // Non-blocking
    }
    setSubState("success");
  }

  const fieldClass =
    "bg-[#F5F0E8]/5 border border-[#C9A84C]/20 px-3 py-2.5 text-sm text-[#F5F0E8] placeholder-[#F5F0E8]/30 focus:outline-none focus:border-[#C9A84C]/60 w-full";

  return (
    <footer className="bg-[#0A1628] text-[#F5F0E8]/70 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pb-12 border-b border-[#C9A84C]/20">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-display text-2xl font-semibold text-[#C9A84C] tracking-widest uppercase"
            >
              Auxeira
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#F5F0E8]/60">
              Bringing a billion data points online that the world doesn&apos;t know exist.
            </p>
            <p className="mt-2 text-sm text-[#F5F0E8]/50">
              Johannesburg · London · New York, Global from Africa
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-3" role="list">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-[#F5F0E8]/60 hover:text-[#C9A84C] transition-colors duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Subscribe */}
          <div className="text-sm">
            <p className="text-[#F5F0E8]/40 uppercase tracking-widest text-xs mb-3">
              Auxeira Intelligence
            </p>
            {subState === "success" ? (
              <p className="text-[#C9A84C] text-sm">
                You are subscribed. First edition arrives on the first Monday of next month.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="First name *" value={sub.firstName} onChange={set("firstName")} required className={fieldClass} />
                  <input type="text" placeholder="Last name *" value={sub.lastName} onChange={set("lastName")} required className={fieldClass} />
                </div>
                <input type="email" placeholder="Work email *" value={sub.email} onChange={set("email")} required className={fieldClass} />
                <input type="text" placeholder="Organisation *" value={sub.orgName} onChange={set("orgName")} required className={fieldClass} />
                {showWebsite && (
                  <input type="url" placeholder="Organisation website (https://…)" value={sub.orgWebsite} onChange={set("orgWebsite")} className={fieldClass} />
                )}
                <button
                  type="submit"
                  disabled={subState === "submitting" || !sub.firstName || !sub.lastName || !sub.email || !sub.orgName}
                  className="w-full bg-[#C9A84C] text-[#0A1628] px-4 py-2.5 text-xs font-semibold tracking-wide hover:bg-[#F5F0E8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {subState === "submitting" ? "Subscribing…" : "Subscribe →"}
                </button>
              </form>
            )}
          </div>

          {/* Contact */}
          <div className="text-sm space-y-2">
            <p className="text-[#F5F0E8]/40 uppercase tracking-widest text-xs">Contact</p>
            <a
              href="mailto:info@auxeira.com"
              className="block text-[#F5F0E8]/70 hover:text-[#C9A84C] transition-colors"
            >
              info@auxeira.com
            </a>
            <div className="flex gap-4 pt-2">
              <a
                href="https://linkedin.com/company/auxeira"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors text-sm"
                aria-label="Auxeira on LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/auxeira"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors text-sm"
                aria-label="Auxeira on X"
              >
                X
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#F5F0E8]/30">
          <p>© {new Date().getFullYear()} Auxeira. All rights reserved.</p>
          <p>Johannesburg, South Africa</p>
        </div>
      </div>
    </footer>
  );
}
