"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const links = [
  { label: "About", href: "#founder" },
  { label: "How We Work", href: "#how-we-work" },
  { label: "Our Proof", href: "#proof-of-work" },
  { label: "Sectors", href: "#sectors" },
  { label: "Insights", href: "#insights" },
  { label: "Contact", href: "#cta" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1628]/95 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20"
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-2xl font-semibold text-[#C9A84C] tracking-widest uppercase"
          aria-label="Auxeira home"
        >
          Auxeira
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8" role="list">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-[#F5F0E8]/80 hover:text-[#C9A84C] text-sm tracking-wide transition-colors duration-200 gold-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:block">
          <Button variant="gold-outline" href="#cta">
            Start a Conversation
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-[#F5F0E8] p-2"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
          <div className="w-6 flex flex-col gap-1.5">
            <span
              className={`block h-px bg-current transition-all duration-200 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px bg-current transition-all duration-200 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0A1628] border-t border-[#C9A84C]/20 px-6 py-6">
          <ul className="flex flex-col gap-5" role="list">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-[#F5F0E8]/80 hover:text-[#C9A84C] text-base tracking-wide transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Button variant="gold-filled" href="#cta" className="w-full justify-center">
                Start a Conversation
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
