import Link from "next/link";

const NAV_GROUPS = [
  {
    heading: "Work",
    links: [
      { label: "SmartStart Case Study", href: "/work/smartstart" },
    ],
  },
  {
    heading: "Intelligence",
    links: [
      { label: "ECD Evidence: South Africa 2026", href: "/intelligence/ecd-evidence-south-africa-2026" },
    ],
  },
  {
    heading: "Methodology",
    links: [
      { label: "How We Work", href: "/methodology" },
    ],
  },
  {
    heading: "For Foundations",
    links: [
      { label: "Commissioned Research", href: "/commissioned-research" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-[#F5F0E8]/70 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Health Check CTA — most prominent */}
        <div className="mb-12 rounded-xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 px-8 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[#C9A84C] font-semibold text-base tracking-wide uppercase">
              Health Check
            </p>
            <p className="mt-1 text-sm text-[#F5F0E8]/60 max-w-md">
              Free diagnostic for foundations and funders. Understand the evidence quality behind your portfolio in 48 hours.
            </p>
          </div>
          <Link
            href="/health-check"
            className="shrink-0 inline-block rounded-lg bg-[#C9A84C] px-6 py-3 text-sm font-semibold text-[#0A1628] hover:bg-[#D4B86A] transition-colors duration-200"
          >
            Start your Health Check →
          </Link>
        </div>

        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 pb-12 border-b border-[#C9A84C]/20">

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

          {/* Grouped nav */}
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-10 gap-y-8">
            {NAV_GROUPS.map((group) => (
              <div key={group.heading} className="min-w-[130px]">
                <p className="text-[#F5F0E8]/40 uppercase tracking-widest text-xs mb-3">
                  {group.heading}
                </p>
                <ul className="space-y-2" role="list">
                  {group.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-[#F5F0E8]/60 hover:text-[#C9A84C] transition-colors duration-200"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

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
