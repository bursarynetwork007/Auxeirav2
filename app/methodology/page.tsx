import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Methodology | SROI & Impact Evaluation Consultancy South Africa | Auxeira",
  description:
    "Auxeira's methodology: actuarial risk precision, econometric modelling, and randomised evaluation applied to social sector evidence in Africa. Built for Treasury scrutiny.",
  openGraph: {
    title: "Methodology | Auxeira Evidence Intelligence Johannesburg",
    description:
      "SROI methodology South Africa: three pillars — evidence science, development economics, and financial architecture. Built for the African social sector.",
    url: "https://auxeira.com/methodology",
    siteName: "Auxeira",
    locale: "en_ZA",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Auxeira",
  "description": "Evidence intelligence consultancy in Johannesburg applying SROI methodology, econometric modelling, and actuarial risk analysis to the African social sector.",
  "url": "https://auxeira.com",
  "areaServed": "Africa",
  "founder": { "@type": "Person", "name": "Lante Emmanuel Luthuli" },
  "knowsAbout": [
    "SROI methodology South Africa",
    "randomized controlled trials Africa",
    "quasi-experimental evaluation",
    "econometric modelling social sector",
    "actuarial risk social development",
    "evidence synthesis Africa",
    "Social Return on Investment Africa",
  ],
};

const PILLARS = [
  {
    num: "01",
    tag: "Pillar One",
    title: "Evidence & Evaluation Science",
    intro: "The foundation of every Auxeira engagement is causal rigour. We isolate what the programme actually caused — not what happened alongside it.",
    methods: [
      { term: "Randomised Controlled Trials (RCTs) and quasi-experimental design", def: "For causal impact isolation where experimental conditions are available or can be approximated. Difference-in-differences, propensity score matching, and regression discontinuity designs for non-experimental contexts." },
      { term: "Longitudinal data synthesis", def: "Structured analysis of multi-year datasets to identify trends, attribute change, and build the evidence base for long-term impact claims. Applied in the SmartStart 10-year synthesis across a full decade of programme data." },
      { term: "Econometric modelling", def: "Regression analysis, difference-in-differences, and propensity score matching to establish programme attribution with statistical defensibility. Every model is documented and auditable." },
      { term: "Thematic coding frameworks", def: "Grounded theory and framework analysis for qualitative synthesis at scale. The Auxeira Evidence Index — applied in the SmartStart engagement — codes stakeholder interviews into a structured, citable evidence base." },
    ],
    standards: "Campbell Collaboration · CONSORT · What Works Clearinghouse",
    when: "Baseline-endline evaluations, 10-year impact synthesis, programme attribution studies, longitudinal economic contribution assessments.",
  },
  {
    num: "02",
    tag: "Pillar Two",
    title: "Development & Behavioural Economics",
    intro: "Evidence that is technically correct but behaviourally wrong does not move decisions. We design evidence for how funders and ministers actually process information.",
    methods: [
      { term: "Macro-level structural analysis for developing economy contexts", def: "We do not import Northern frameworks. South African and African public sector contexts have specific institutional dynamics, resource constraints, and political economy considerations that require adapted analytical frameworks." },
      { term: "Behavioural economics applied to evidence design", def: "Cognitive bias mapping, loss aversion framing, and social proof architecture embedded directly into how evidence is structured and presented. The goal is not to manipulate — it is to ensure that accurate evidence is processed accurately by decision-makers." },
      { term: "Institutional scaling dynamics", def: "Resource allocation modelling for African public sector contexts: how budget decisions are made, what evidence formats are credible to different institutional audiences, and how policy influence pathways actually work." },
      { term: "Policy influence pathway mapping", def: "Systematic documentation of the route from programme evidence to budget decision to implementation. This is the evidence that demonstrates institutional impact — not just programme impact." },
    ],
    standards: "Kahneman · Thaler · Ariely · Applied behavioural science",
    when: "Funder narrative design, policy brief development, stakeholder mapping, evidence architecture for government co-investment conversations.",
  },
  {
    num: "03",
    tag: "Pillar Three",
    title: "Financial Architecture & Risk",
    intro: "The economic case for a programme must be built with the precision of someone who has carried financial risk — not just evaluated it.",
    methods: [
      { term: "SROI calculation using HACT/SROI Network standards", def: "Social Return on Investment calculated to the standard required by institutional funders and development finance institutions. Every assumption documented. Every figure auditable. SmartStart: 3.3x." },
      { term: "Long-term present value modelling", def: "Fiscal sustainability forecasting that projects the economic value of programme outcomes over time, discounted to present value. Used in investment cases for Treasury and development finance institutions." },
      { term: "Contingent financial scenario modelling", def: "Monte Carlo approaches where appropriate for tail risk quantification. Scenario analysis for funding sustainability, programme scale-up, and government co-investment cases." },
      { term: "Actuarial risk quantification", def: "Programme execution and funding tail risk analysis using actuarial discipline from Discovery Holdings training. We quantify, price, and model the risks that derail programmes before they reach scale." },
      { term: "Counterfactual economic analysis", def: "What would have happened without the programme. This is the analytical foundation of a credible SROI — and the most frequently missing component in social sector evidence work." },
    ],
    standards: "HACT · SROI Network · Discovery Holdings actuarial training",
    when: "SROI reports, investment cases for Treasury, economic contribution assessments, fiscal sustainability analysis, development finance institution submissions.",
  },
];

export default function MethodologyPage() {
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
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-6">Methodology</p>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#F5F0E8] leading-tight mb-6">
              Built for Treasury scrutiny.<br />
              <span className="text-[#C9A84C] italic">Not just funder decks.</span>
            </h1>
            <p className="text-[#F5F0E8]/65 text-lg leading-relaxed max-w-2xl">
              Auxeira&apos;s methodology is not borrowed from a textbook. It is the direct output of a career built at the intersection of actuarial risk precision, randomised policy evaluation, and venture execution across Africa. Three pillars. Every engagement draws on all three.
            </p>
          </div>
        </section>

        {/* Opening statement */}
        <section className="bg-[#F5F0E8] py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              <p>
                Standard M&E consultancy produces monitoring reports. Auxeira produces economic evidence. The distinction matters because monitoring reports inform programme management. Economic evidence moves funding decisions, unlocks government co-investment, and positions organisations for the next phase of scale.
              </p>
              <p>
                The three foundations of Auxeira&apos;s methodology are actuarial precision, econometric modelling, and randomised evaluation. These are not credentials listed for credibility. They are the specific disciplines that make the difference between evidence that is technically correct and evidence that is institutionally credible — the kind that withstands Treasury scrutiny, satisfies development finance institution requirements, and travels into rooms that programme reports cannot reach.
              </p>
            </div>
          </div>
        </section>

        {/* Three pillars */}
        {PILLARS.map((p, pi) => (
          <section
            key={p.num}
            className={`py-16 lg:py-24 border-b border-[#1A1A2A]/10 ${pi % 2 === 0 ? "bg-white" : "bg-[#F5F0E8]"}`}
          >
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
              <div className="flex items-start gap-4 mb-6">
                <span className="font-mono text-[9px] tracking-[0.18em] text-[#C9A84C] mt-1 flex-shrink-0">{p.num}</span>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-2">{p.tag}</p>
                  <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628]">{p.title}</h2>
                </div>
              </div>
              <p className="text-[#1A1A2A]/75 text-[15px] leading-[1.85] mb-10 max-w-2xl">{p.intro}</p>

              <dl className="space-y-6 mb-10">
                {p.methods.map((m) => (
                  <div key={m.term} className="border-l-2 border-[#C9A84C] pl-5">
                    <dt className="text-[#0A1628] font-medium text-[14px] mb-1">{m.term}</dt>
                    <dd className="text-[#1A1A2A]/60 text-[13.5px] leading-relaxed">{m.def}</dd>
                  </div>
                ))}
              </dl>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0A1628]/[0.04] p-5">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#C9A84C] mb-2">Standards</p>
                  <p className="text-[#1A1A2A]/60 text-[12.5px]">{p.standards}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#C9A84C] mb-2">When Auxeira uses this</p>
                  <p className="text-[#1A1A2A]/60 text-[12.5px]">{p.when}</p>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Quality assurance */}
        <section className="bg-[#0A1628] py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Quality Assurance</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#F5F0E8] mb-8">
              Every figure citable. Every assumption auditable.
            </h2>
            <div className="space-y-5 text-[#F5F0E8]/65 text-[15px] leading-[1.85] mb-10">
              <p>
                Auxeira operates a strict source hierarchy. Audited financial statements are the primary source. Annual reports and published evaluations are secondary. Management data and programme records are tertiary. Manually constructed estimates are clearly labelled as estimates, with methodology documented, and require client sign-off before publication.
              </p>
              <p>
                No figure in an Auxeira output is presented without a source. No claim is made that cannot be traced to a specific data point. This is not a quality aspiration — it is the operational standard that makes Auxeira&apos;s outputs credible to Treasury, development finance institutions, and institutional funders who will scrutinise every number.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { rank: "1", label: "Audited financial statements", note: "Primary source — always preferred" },
                { rank: "2", label: "Annual reports and published evaluations", note: "Secondary source" },
                { rank: "3", label: "Programme monitoring data and records", note: "Tertiary source" },
                { rank: "4", label: "Manually constructed estimates", note: "Clearly labelled — client sign-off required before publication" },
              ].map((s) => (
                <div key={s.rank} className="flex items-start gap-4 border border-[#F5F0E8]/10 px-5 py-4">
                  <span className="font-mono text-[9px] text-[#C9A84C] tracking-wider flex-shrink-0 mt-0.5">{s.rank}</span>
                  <div>
                    <div className="text-[#F5F0E8] text-[13.5px] font-medium">{s.label}</div>
                    <div className="text-[#F5F0E8]/40 text-[12px] font-mono mt-0.5">{s.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Evidence Index */}
        <section className="bg-[#F5F0E8] py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Proprietary Framework</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-6">
              The Auxeira Evidence Index.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              <p>
                Standard qualitative synthesis produces themes and quotes. The Auxeira Evidence Index produces a structured, citable evidence base. Each interview is coded against a thematic framework derived from the programme&apos;s theory of change. Quotes are indexed by theme, stakeholder type, and evidence strength. The result is a qualitative evidence architecture that functions like a database — searchable, auditable, and defensible to institutional audiences.
              </p>
              <p>
                In the SmartStart 10-year impact report, the Evidence Index processed 49 stakeholder interviews into 207 indexed quotes across the full thematic framework. The qualitative evidence in that report is not illustrative. It is systematic. Every claim is traceable to a specific coded source.
              </p>
              <p>
                The Evidence Index is available as a standalone commissioned service for organisations with significant qualitative evidence that has never been systematically synthesised.
              </p>
            </div>
          </div>
        </section>

        {/* Founder credentials */}
        <section className="bg-white py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Methodology Anchors</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-8">
              Credentials that map to specific capabilities.
            </h2>
            <div className="space-y-6">
              {[
                {
                  credential: "MIT DEDP MicroMasters — 2021",
                  name: "Lante Emmanuel Luthuli",
                  capability: "Econometric modelling, randomised evaluation design, causal inference, and development economics applied to African social sector contexts. The quantitative rigour in every Auxeira SROI and impact evaluation draws directly on this training.",
                },
                {
                  credential: "Discovery Holdings Actuarial Specialist — Former",
                  name: "Lante Emmanuel Luthuli",
                  capability: "Risk quantification, financial modelling, and tail risk analysis. The actuarial discipline that makes Auxeira&apos;s financial architecture work — SROI calculation, fiscal sustainability modelling, counterfactual analysis — is grounded in actuarial training, not adapted from standard M&E practice.",
                },
                {
                  credential: "YALI Mandela Washington Fellow — Dartmouth 2017",
                  name: "Lante Emmanuel Luthuli",
                  capability: "African policy context, institutional network, and government engagement methodology. Evidence that needs to travel into government budget processes and policy rooms requires institutional credibility. This credential and the network it represents open those doors.",
                },
              ].map((c) => (
                <div key={c.credential} className="border border-[#1A1A2A]/12 p-6">
                  <div className="font-mono text-[9px] tracking-[0.16em] uppercase text-[#C9A84C] mb-1">{c.credential}</div>
                  <div className="text-[#0A1628] font-medium text-[13.5px] mb-3">{c.name}</div>
                  <div className="text-[#1A1A2A]/60 text-[13.5px] leading-relaxed">{c.capability}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0A1628] py-20 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#F5F0E8] mb-4">
              Commission a methodology review.
            </h2>
            <p className="text-[#F5F0E8]/60 text-[15px] leading-relaxed mb-10 max-w-xl mx-auto">
              Auxeira reviews your current evidence architecture and identifies the specific gaps between what you have and what Treasury-ready evidence requires. Or start with the Evidence Health Check.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@auxeira.com?subject=Methodology Review"
                className="inline-block bg-[#C9A84C] text-[#0A1628] font-semibold text-sm px-8 py-4 hover:bg-[#b8963e] transition-colors duration-200"
              >
                Commission a Methodology Review
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

      </main>

      <Footer />
    </>
  );
}
