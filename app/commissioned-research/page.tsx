import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Commissioned Research | Impact Evaluation & Portfolio Evidence | Auxeira",
  description:
    "Auxeira commissions portfolio evidence audits, SROI assessments, longitudinal impact synthesis, and evidence infrastructure builds for foundations operating in Africa.",
  openGraph: {
    title: "Commissioned Research | Auxeira Evidence Intelligence",
    description:
      "Commissioned impact evaluation Africa: portfolio evidence audits, economic contribution assessments, longitudinal synthesis, and evidence infrastructure for foundations.",
    url: "https://auxeira.com/commissioned-research",
    siteName: "Auxeira",
    locale: "en_ZA",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Auxeira Commissioned Research Services",
  "description": "Commissioned impact evaluation Africa: four research types for foundations and social sector organisations.",
  "url": "https://auxeira.com/commissioned-research",
  "itemListElement": [
    { "@type": "Service", "position": 1, "name": "Portfolio Evidence Audit", "description": "Evidence maturity assessment across a foundation's grantee portfolio." },
    { "@type": "Service", "position": 2, "name": "Economic Contribution Assessment", "description": "SROI analysis, fiscal multiplier modelling, and Treasury-ready economic evidence." },
    { "@type": "Service", "position": 3, "name": "Longitudinal Evidence Synthesis", "description": "5-15 year programme data synthesised into a single authoritative impact document." },
    { "@type": "Service", "position": 4, "name": "Evidence Infrastructure Build", "description": "MEL system design, SROI methodology, and evidence architecture for scale." },
  ],
};

const RESEARCH_TYPES = [
  {
    num: "01",
    title: "Portfolio Evidence Audit",
    tag: "For foundations managing 5+ grantees",
    what: "Auxeira assesses evidence maturity across a foundation's grantee portfolio, scoring each organisation against a standardised evidence framework. The audit identifies which grantees are evidence-ready for scale, which have critical gaps, and where collective evidence investment would produce the highest portfolio return.",
    produces: [
      "Portfolio evidence map with individual grantee scores",
      "Gap analysis across the full portfolio",
      "Recommended evidence investment prioritisation",
      "Comparative benchmark against sector averages",
    ],
    timeline: "6-10 weeks",
    for: "Foundations managing 5 or more grantees who need to understand collective evidence quality before the next funding cycle.",
  },
  {
    num: "02",
    title: "Economic Contribution Assessment",
    tag: "For government co-investment and DFI conversations",
    what: "Auxeira builds the fiscal case for a programme or portfolio: SROI analysis, fiscal multiplier modelling, cost-per-outcome benchmarking, and economic contribution to government savings and workforce outcomes. This translates existing evaluation evidence into the Treasury-ready economic language that unlocks co-investment.",
    produces: [
      "SROI report to HACT/SROI Network standards",
      "Fiscal multiplier brief",
      "Cost-effectiveness analysis with sector benchmarks",
      "Treasury-facing evidence architecture document",
    ],
    timeline: "8-14 weeks depending on data availability",
    for: "Foundations seeking government co-investment, organisations approaching development finance institutions, grantees preparing for policy influence conversations.",
  },
  {
    num: "03",
    title: "Longitudinal Evidence Synthesis",
    tag: "For organisations at major milestones",
    what: "Synthesis of 5 to 15 years of programme data into a coherent evidence narrative. Auxeira processes evaluations, annual reports, monitoring data, and stakeholder interviews into a single authoritative impact document using the Auxeira Evidence Index. The SmartStart 10-year impact report (49 interviews, 207-quote Evidence Index, 3.3x SROI) was delivered in six weeks.",
    produces: [
      "Long-form impact report with full evidence architecture",
      "Executive brief for funder audiences",
      "Funder-specific summary documents",
      "Key statistics package for communications use",
    ],
    timeline: "5-8 weeks",
    for: "Organisations approaching major milestones, preparing scale-up cases, or entering new funding conversations with institutional funders who require a comprehensive evidence base.",
  },
  {
    num: "04",
    title: "Evidence Infrastructure Build",
    tag: "For organisations preparing for the next phase of scale",
    what: "Auxeira designs the evidence architecture an organisation needs to operate at the level required for institutional funding conversations: the monitoring framework, SROI methodology, policy influence tracking system, and funder-facing reporting structure. This is an ongoing advisory engagement, not a one-time report.",
    produces: [
      "Evidence framework document",
      "MEL system design",
      "SROI methodology guide",
      "Reporting templates for funder audiences",
    ],
    timeline: "Ongoing retainer or 12-week build",
    for: "Foundations and delivery organisations preparing for the next phase of scale where evidence quality will be the determining factor in co-funding decisions.",
  },
];

export default function CommissionedResearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1628]/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex flex-col" aria-label="Auxeira home">
            <span className="font-display text-xl font-semibold tracking-widest text-white uppercase">Auxeira</span>
          </Link>
          <Link href="/" className="text-sm text-[#C9A84C] hover:text-white transition-colors duration-200">
            Back to auxeira.com
          </Link>
        </div>
      </header>

      <main className="pt-16">

        {/* Hero */}
        <section className="bg-[#0A1628] py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-6">Commissioned Research</p>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#F5F0E8] leading-tight mb-6">
              Evidence architecture work.<br />
              <span className="text-[#C9A84C] italic">Not M&E.</span>
            </h1>
            <p className="text-[#F5F0E8]/65 text-lg leading-relaxed max-w-2xl">
              Auxeira works with foundations to audit evidence quality across grantee portfolios, build the economic case for scaling proven interventions, and translate programme evidence into the fiscal language that unlocks government co-investment. Four commissioned research types. Each with a specific output and a defined timeline.
            </p>
          </div>
        </section>

        {/* Research types */}
        {RESEARCH_TYPES.map((r, i) => (
          <section
            key={r.num}
            id={`type-${r.num}`}
            className={`py-16 lg:py-24 border-b border-[#1A1A2A]/10 ${i % 2 === 0 ? "bg-[#F5F0E8]" : "bg-white"}`}
          >
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                <div className="lg:col-span-2">
                  <div className="flex items-start gap-4 mb-5">
                    <span className="font-mono text-[9px] tracking-[0.18em] text-[#C9A84C] mt-1 flex-shrink-0">{r.num}</span>
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#C9A84C] mb-2">{r.tag}</p>
                      <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628]">{r.title}</h2>
                    </div>
                  </div>
                  <p className="text-[#1A1A2A]/70 text-[15px] leading-[1.85] mb-8">{r.what}</p>
                  <div>
                    <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#C9A84C] mb-3">Produces</p>
                    <ul className="space-y-2">
                      {r.produces.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-[13.5px] text-[#1A1A2A]/65">
                          <span className="text-[#C9A84C] mt-0.5 flex-shrink-0">+</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-[#0A1628]/[0.04] p-5">
                    <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#C9A84C] mb-2">Timeline</p>
                    <p className="text-[#0A1628] font-medium text-[14px]">{r.timeline}</p>
                  </div>
                  <div className="bg-[#0A1628]/[0.04] p-5">
                    <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#C9A84C] mb-2">For</p>
                    <p className="text-[#1A1A2A]/65 text-[13px] leading-relaxed">{r.for}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* How Auxeira is commissioned */}
        <section className="bg-[#0A1628] py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">How to Commission</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#F5F0E8] mb-6">
              Direct inquiry. No tender required under R500,000.
            </h2>
            <div className="space-y-4 text-[#F5F0E8]/65 text-[15px] leading-[1.85] mb-8">
              <p>
                Auxeira accepts commissions through direct inquiry, RFP response, or grantee referral. For engagements under R500,000, a formal tender process is not required. A scoping call is sufficient to establish scope, timeline, and fee.
              </p>
              <p>
                Contact: <a href="mailto:info@auxeira.com" className="text-[#C9A84C] hover:underline">info@auxeira.com</a>
              </p>
            </div>
          </div>
        </section>

        {/* Conflict of interest */}
        <section className="bg-[#F5F0E8] py-12 lg:py-16 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Conflict of Interest Policy</p>
            <p className="text-[#1A1A2A]/70 text-[15px] leading-[1.85]">
              Auxeira does not accept simultaneous commissions from organisations in direct competition within a single funding round. Evidence integrity is non-negotiable. If a conflict exists or may arise during an engagement, Auxeira will disclose it immediately and, where necessary, decline the commission.
            </p>
          </div>
        </section>

        {/* Health Check for foundations */}
        <section className="bg-white py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Entry Point for Foundations</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-6">
              Assess a grantee before commissioning a full audit.
            </h2>
            <p className="text-[#1A1A2A]/70 text-[15px] leading-[1.85]">
              Foundations can use the Auxeira Evidence Health Check to assess individual grantees before commissioning a full portfolio audit. The Health Check takes three minutes, produces a scored evidence maturity assessment across eight dimensions, and identifies the specific gaps between where a grantee is and where it needs to be for institutional funding conversations. It is a low-cost entry point that tells you whether a full portfolio audit is warranted and where to focus it.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0A1628] py-20 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#F5F0E8] mb-4">
              Ready to commission?
            </h2>
            <p className="text-[#F5F0E8]/60 text-[15px] leading-relaxed mb-10 max-w-xl mx-auto">
              Start with a scoping conversation or assess a grantee with the Evidence Health Check.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@auxeira.com?subject=Commissioned Research Scoping"
                className="inline-block bg-[#C9A84C] text-[#0A1628] font-semibold text-sm px-8 py-4 hover:bg-[#b8963e] transition-colors duration-200"
              >
                Commission a Scoping Conversation
              </a>
              <Link
                href="/health-check"
                className="inline-block border border-[#C9A84C] text-[#C9A84C] font-semibold text-sm px-8 py-4 hover:bg-[#C9A84C]/10 transition-colors duration-200"
              >
                Assess a Grantee with the Health Check
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
