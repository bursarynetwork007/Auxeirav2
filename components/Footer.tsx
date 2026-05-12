import Link from "next/link";

const footerLinks = [
  { label: "About", href: "#founder" },
  { label: "How We Work", href: "#how-we-work" },
  { label: "Our Proof", href: "#proof-of-work" },
  { label: "Sectors", href: "#sectors" },
  { label: "Insights", href: "#insights" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-[#F5F0E8]/70 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
