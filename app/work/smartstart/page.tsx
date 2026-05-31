import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "SmartStart Case Study | SROI Consultancy South Africa | Auxeira",
  description:
    "How Auxeira found SmartStart's 3.3x SROI in 6 weeks: 152,664 children, 14,740 enterprises, and the evidence foundation for a $2M Skoll Award.",
  openGraph: {
    title: "SmartStart Case Study | Auxeira Evidence Intelligence",
    description:
      "How Auxeira found SmartStart's 3.3x SROI in 6 weeks: 152,664 children, 14,740 enterprises, and the evidence foundation for a $2M Skoll Award.",
    url: "https://auxeira.com/work/smartstart",
    siteName: "Auxeira",
    locale: "en_ZA",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "name": "SmartStart South Africa: 10-Year Impact Report",
  "description": "SROI consultancy South Africa: Auxeira delivered a 3.3x verified social return on investment for SmartStart South Africa in 6 weeks, contributing to the 2026 Skoll Award for Social Innovation.",
  "author": { "@type": "Organization", "name": "Auxeira", "url": "https://auxeira.com" },
  "publisher": { "@type": "Organization", "name": "Auxeira", "url": "https://auxeira.com" },
  "datePublished": "2025-01-01",
  "url": "https://auxeira.com/work/smartstart",
  "about": { "@type": "Organization", "name": "SmartStart South Africa" },
  "keywords": "SROI consultancy South Africa, impact evaluation ECD, social return on investment Africa, evidence synthesis South Africa, Skoll Award social innovation 2026",
};

export default function SmartStartPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex flex-col" aria-label="Auxeira home">
            <span className="font-display text-xl font-semibold tracking-widest text-white uppercase">
              Auxeira
            </span>
          </Link>
          <Link href="/" className="text-sm text-[#C9A84C] hover:text-white transition-colors duration-200">
            Back to auxeira.com
          </Link>
        </div>
      </header>

      <article className="pt-16">

        {/* Hero */}
        <section className="bg-[#0A1628] py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-6">
              Case Study · SmartStart South Africa
            </p>
            <h1 className="font-display text-4xl lg:text-6xl font-semibold text-[#F5F0E8] leading-tight mb-6">
              The 3.3x SROI that existed in the data for a decade.
              <br />
              <span className="text-[#C9A84C] italic">Auxeira found it in six weeks.</span>
            </h1>
            <p className="text-[#F5F0E8]/70 text-lg leading-relaxed max-w-2xl mb-14">
              SmartStart South Africa had been running one of the continent&apos;s most effective ECD franchise models since 2015. The economic evidence for its impact had never been assembled. Auxeira built it, and the result became the foundation for a $2M Skoll Award.

            </p>

            {/* Key stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#F5F0E8]/10">
              {[
                { num: "3.3x", label: "Verified social return on investment", sub: "SROI · Auxeira calculation" },
                { num: "152,664", label: "Children reached across the programme", sub: "2015 to 2025" },
                { num: "$2M", label: "Skoll Award for Social Innovation", sub: "2026 · Highest global recognition" },
              ].map((s) => (
                <div key={s.num} className="bg-[#0A1628] px-8 py-8 border border-[#F5F0E8]/10">
                  <div className="font-display text-5xl font-normal text-[#C9A84C] mb-2">{s.num}</div>
                  <div className="text-[#F5F0E8] text-sm font-medium mb-1">{s.label}</div>
                  <div className="font-mono text-[10px] text-[#F5F0E8]/40 tracking-wider">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The brief */}
        <section className="bg-[#F5F0E8] py-20 lg:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">The brief</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#0A1628] mb-8">
              A decade of impact. No economic case.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              <p>
                SmartStart had built something rare: a social franchise model that trained and supported community-based ECD practitioners at scale across South Africa. By 2025, the programme had reached over 152,000 children and generated measurable economic activity across 14,740 enterprises in its value chain. The monitoring data existed. The annual reports existed. The impact was real.
              </p>
              <p>
                What did not exist was the economic evidence. No SROI had been calculated. No fiscal multiplier had been modelled. No caregiver workforce contribution had been quantified. When SmartStart approached major funders and government co-investment conversations, the evidence gap was the limiting factor. The programme was ready for scale. The evidence was not ready for Treasury.
              </p>
              <p>
                SmartStart commissioned Auxeira to close that gap. The brief: synthesise a decade of programme data, calculate a defensible SROI, and produce an impact report that could anchor the next phase of institutional funding conversations. Timeline: six weeks.
              </p>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">The methodology</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#0A1628] mb-8">
              Econometric rigour. Six weeks.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85] mb-12">
              <p>
                Auxeira applied a multi-method evidence synthesis approach built on three disciplines: longitudinal data analysis, SROI calculation using HACT/SROI Network standards, and the Auxeira Evidence Index for qualitative synthesis at scale.
              </p>
              <p>
                The quantitative work involved econometric modelling of programme outcomes across the full 2015 to 2025 dataset, regression analysis to isolate programme attribution, and counterfactual economic analysis to establish what would not have happened without SmartStart. Caregiver workforce participation was modelled as an economic contribution, not just a programme output. Fiscal savings to government were quantified using cost-per-outcome benchmarks from comparable public sector delivery.
              </p>
              <p>
                The qualitative work used the Auxeira Evidence Index: 49 stakeholder interviews coded across a thematic framework, producing 207 indexed quotes that formed the narrative architecture of the report. This is not standard interview synthesis. It is a structured evidence retrieval system that makes qualitative data citable and auditable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Longitudinal data synthesis (2015-2025)",
                "SROI calculation (HACT/SROI Network standards)",
                "Econometric modelling and causal attribution",
                "Counterfactual economic analysis",
                "Caregiver workforce participation modelling",
                "Fiscal savings quantification",
                "Evidence Index: 49 interviews, 207 quotes coded",
                "Narrative architecture for funder audiences",
              ].map((m) => (
                <div key={m} className="flex items-start gap-3 text-[13.5px] text-[#1A1A2A]/65">
                  <span className="text-[#C9A84C] mt-0.5 flex-shrink-0">+</span>
                  {m}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key findings */}
        <section className="bg-[#0A1628] py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Key findings</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#F5F0E8] mb-12">
              What the data showed.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#F5F0E8]/10">
              {[
                { num: "3.3x", label: "Social return on investment", detail: "For every rand invested in SmartStart, R3.30 in verified social and economic value was generated." },
                { num: "152,664", label: "Children reached", detail: "Across the full programme period, 2015 to 2025, in underserved communities across South Africa." },
                { num: "14,740", label: "Enterprises surfaced", detail: "Across the SmartStart value chain: practitioners, suppliers, and community economic activity generated by the programme." },
                { num: "R18M+", label: "Unmeasured economic contribution", detail: "Caregiver workforce participation and practitioner income that had never been quantified before this engagement." },
                { num: "207", label: "Indexed evidence quotes", detail: "Coded across 49 stakeholder interviews using the Auxeira Evidence Index, a citable, auditable qualitative evidence base." },
                { num: "6 weeks", label: "Delivery timeline", detail: "From commission to completed report, including full SROI calculation, econometric modelling, and narrative architecture." },
              ].map((f) => (
                <div key={f.num} className="bg-[#0A1628] border border-[#F5F0E8]/10 px-7 py-7">
                  <div className="font-display text-4xl font-normal text-[#C9A84C] mb-2">{f.num}</div>
                  <div className="text-[#F5F0E8] text-sm font-medium mb-2">{f.label}</div>
                  <div className="text-[#F5F0E8]/45 text-[12.5px] leading-relaxed">{f.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skoll connection */}
        <section className="bg-[#F5F0E8] py-20 lg:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">The Skoll Award</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#0A1628] mb-8">
              Evidence that travels to the highest rooms.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              <p>
                In 2026, SmartStart South Africa received the Skoll Award for Social Innovation, a $2M recognition from the Skoll Foundation, the highest honour in global social entrepreneurship. The award recognised SmartStart&apos;s decade of impact in early childhood development across South Africa.
              </p>
              <p>
                The Auxeira 10-year impact report was the evidence foundation for that nomination. The 3.3x SROI, the fiscal savings quantification, the caregiver economic contribution analysis: these were not decorative additions to a strong programme. They were the economic case that made SmartStart&apos;s impact legible to a global funder audience that requires fiscal evidence before it commits at scale.
              </p>
              <p>
                The Skoll Award positions SmartStart for government co-investment conversations at a level that was not previously accessible. The evidence architecture Auxeira built is now the platform for that next phase. This is what impact evaluation ECD work looks like when it is done at the level of economic evidence, not just programme monitoring.
              </p>
            </div>
          </div>
        </section>

        {/* What this means */}
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">What this means for your organisation</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#0A1628] mb-8">
              The SmartStart situation is not unique.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              <p>
                Across South Africa&apos;s ECD, education foundation, and social franchise sector, the pattern repeats: strong programmes, real impact, and an evidence base that stops at monitoring data. The SROI exists in the numbers. The fiscal multiplier is there. The caregiver economic contribution is real. It has simply never been assembled into the language that moves Treasury, unlocks co-investment, and positions organisations for the next phase of scale.
              </p>
              <p>
                Auxeira&apos;s evidence synthesis methodology, the same approach applied to SmartStart, is available to organisations with five or more years of programme data and a funding conversation that requires economic evidence. The work takes six to fourteen weeks. The output is a citable, auditable economic case that travels into rooms that monitoring reports cannot reach.
              </p>
              <p>
                If your organisation has built something real and the evidence has not caught up with the impact, that is the gap Auxeira closes.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0A1628] py-20 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#F5F0E8] mb-4">
              Ready to find your SROI?
            </h2>
            <p className="text-[#F5F0E8]/60 text-[15px] leading-relaxed mb-10 max-w-xl mx-auto">
              Start with a conversation or take the Evidence Health Check to see where your organisation&apos;s evidence stands today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@auxeira.com?subject=Evidence Strategy Call"
                className="inline-block bg-[#C9A84C] text-[#0A1628] font-semibold text-sm px-8 py-4 hover:bg-[#b8963e] transition-colors duration-200"
              >
                Book an Evidence Strategy Call
              </a>
              <Link
                href="/health-check"
                className="inline-block border border-[#C9A84C] text-[#C9A84C] font-semibold text-sm px-8 py-4 hover:bg-[#C9A84C]/10 transition-colors duration-200"
              >
                Take the Evidence Health Check
              </Link>
            </div>
          </div>
        </section>

      </article>

      <Footer />
    </>
  );
}
