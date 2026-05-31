import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import EvidenceHealthCheck from "@/components/sections/EvidenceHealthCheck";

export const metadata: Metadata = {
  title: "Evidence Health Check | Auxeira",
  description:
    "Find out where your organisation's evidence is costing you influence, funding, and impact. Free. Takes 3 minutes.",
  openGraph: {
    title: "Evidence Health Check | Auxeira",
    description:
      "Find out where your organisation's evidence is costing you influence, funding, and impact. Free. Takes 3 minutes.",
    url: "https://auxeira.com/health-check",
    siteName: "Auxeira",
    locale: "en_ZA",
    type: "website",
  },
};

export default function HealthCheckPage() {
  return (
    <>
      {/* Minimal nav — no anchor links, just brand + back link */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex flex-col" aria-label="Auxeira home">
            <span className="font-[family-name:var(--font-cormorant)] text-xl font-semibold tracking-widest text-white uppercase">
              Auxeira
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#C9A84C] hover:text-white transition-colors duration-200"
          >
            ← Back to auxeira.com
          </Link>
        </div>
      </header>

      <main className="pt-16">
        <EvidenceHealthCheck />
      </main>

      <Footer />
    </>
  );
}
