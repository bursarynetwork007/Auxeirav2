import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "The State of ECD Evidence in South Africa, 2026 | Auxeira",
  description:
    "The definitive intelligence document on early childhood development evidence in South Africa: funding context, evidence gaps, policy windows, and what Treasury-ready ECD evidence looks like.",
  openGraph: {
    title: "The State of ECD Evidence in South Africa, 2026 | Auxeira",
    description:
      "ECD evidence South Africa 2026: funding context, the Bana Pele commitment, three policy windows, and what evidence leadership looks like for the sector.",
    url: "https://auxeira.com/intelligence/ecd-evidence-south-africa-2026",
    siteName: "Auxeira",
    locale: "en_ZA",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The State of ECD Evidence in South Africa, 2026",
  "description": "ECD evidence South Africa 2026: the definitive sector intelligence document on early childhood development funding, evidence gaps, and policy windows.",
  "author": { "@type": "Organization", "name": "Auxeira", "url": "https://auxeira.com" },
  "publisher": { "@type": "Organization", "name": "Auxeira", "url": "https://auxeira.com" },
  "datePublished": "2026-01-01",
  "url": "https://auxeira.com/intelligence/ecd-evidence-south-africa-2026",
  "keywords": "ECD evidence South Africa 2026, early childhood development funding South Africa, Bana Pele ECD, SROI ECD Africa, evidence-based ECD investment",
};

export default function ECDIntelligencePage() {
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

      <article className="pt-16">

        {/* Hero */}
        <section className="bg-[#0A1628] py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-6">
              Sector Intelligence · <time dateTime="2026">2026</time>
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-semibold text-[#F5F0E8] leading-tight mb-6">
              The State of ECD Evidence<br />
              <span className="text-[#C9A84C] italic">in South Africa, 2026</span>
            </h1>
            <p className="text-[#F5F0E8]/65 text-lg leading-relaxed max-w-2xl mb-8">
              A structured intelligence document on the early childhood development evidence landscape in South Africa. Written for funders, programme officers, and policy practitioners. Grounded in the real funding and policy context.
            </p>
            <div className="flex flex-wrap gap-3">
              {["ECD Evidence", "Bana Pele", "MTEF 2026", "Treasury Evidence", "SROI ECD Africa"].map((t) => (
                <span key={t} className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Executive summary */}
        <section className="bg-[#F5F0E8] py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Executive Summary</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-6">
              Three things every funder needs to know.
            </h2>
            <div className="space-y-4 text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              <p>
                <strong className="text-[#0A1628] font-medium">First:</strong> South Africa&apos;s ECD sector has strong monitoring capability and weak economic translation. The estimated average evidence maturity score across the sector is 52 out of 100. Organisations can demonstrate outputs and some outcomes, but very few can produce the fiscal evidence that Treasury and development finance institutions require before committing co-investment at scale.
              </p>
              <p>
                <strong className="text-[#0A1628] font-medium">Second:</strong> Three policy windows open in 2026 and 2027 that will determine which ECD organisations access the next tier of government and institutional funding. Organisations without fiscal evidence cases will not be competitive in these windows. The preparation time is now.
              </p>
              <p>
                <strong className="text-[#0A1628] font-medium">Third:</strong> The evidence gap is not a data problem. The data exists in most organisations. It is a translation problem. The SROI, the fiscal multiplier, the cost-per-outcome benchmark: these are calculable from existing programme data in most cases. The gap is the methodology to assemble them.
              </p>
            </div>
          </div>
        </section>

        {/* Funding context */}
        <section className="bg-white py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">The Funding Context</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-6">
              A sector at a structural inflection point.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              <p>
                Early childhood development funding in South Africa is undergoing its most significant structural shift in a decade. The Bana Pele programme (the government&apos;s R10 billion commitment to ECD) represents the largest public investment in the sector since the National Integrated ECD Policy of 2015. It also represents the most demanding evidence environment the sector has faced.
              </p>
              <p>
                The 2022 function shift of ECD from the Department of Social Development to the Department of Basic Education changed the accountability framework for the sector. DBE operates with a curriculum and outcomes orientation. It requires evidence in a different register than DSD: fiscal efficiency, cost-per-learner benchmarks, and measurable school readiness outcomes that connect to the broader Basic Education performance framework.
              </p>
              <p>
                National Treasury&apos;s increasing requirement for fiscal evidence in social sector budget submissions is not a new trend, but its application to ECD is accelerating. The Medium Term Expenditure Framework process now expects organisations seeking government co-investment to demonstrate economic return, not just programme reach. Organisations that cannot produce a fiscal case are not being rejected on merit. They are being passed over because the evidence is not in the right language.
              </p>
              <p>
                Philanthropic funders are responding to the same pressure. The Mastercard Foundation, ELMA Philanthropies, and DGMT have all signalled, through their grant reporting requirements and strategic frameworks, that the next phase of ECD investment will prioritise organisations that can demonstrate economic contribution alongside programme quality. Early childhood development funding in South Africa is moving toward a dual accountability standard: programme evidence and fiscal evidence.
              </p>
            </div>
          </div>
        </section>

        {/* Evidence gap */}
        <section className="bg-[#F5F0E8] py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">The Evidence Gap</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-6">
              What exists. What does not.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85] mb-10">
              <p>
                South Africa&apos;s ECD sector has invested significantly in monitoring and evaluation over the past decade. Most established organisations have outcome measurement systems, annual reports with reach data, and some form of external evaluation. This is the evidence base that exists.
              </p>
              <p>
                What does not exist, at scale, is economic evidence. An estimated 80% of ECD organisations in South Africa (estimate based on sector diagnostic data) have never calculated an SROI. Fewer than 10% have produced a fiscal multiplier analysis. Policy influence tracking, the systematic documentation of how programme evidence has shaped budget decisions or policy positions, is almost entirely absent from the sector&apos;s evidence architecture.
              </p>
              <p>
                The consequence is a structural mismatch. Organisations arrive at Treasury conversations with programme evidence. Treasury asks for fiscal evidence. The conversation stalls. The funding does not move. The impact continues, unmeasured in the language that matters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { exists: true, item: "Outcome measurement and monitoring data" },
                { exists: true, item: "Annual reports with reach and output data" },
                { exists: true, item: "External evaluations (most established orgs)" },
                { exists: true, item: "Stakeholder feedback and beneficiary data" },
                { exists: false, item: "SROI at scale across the sector" },
                { exists: false, item: "Fiscal multiplier analysis" },
                { exists: false, item: "Policy influence tracking systems" },
                { exists: false, item: "Longitudinal economic contribution evidence" },
              ].map((r) => (
                <div key={r.item} className="flex items-start gap-3 text-[13.5px] text-[#1A1A2A]/65">
                  <span className={`mt-0.5 flex-shrink-0 font-medium ${r.exists ? "text-[#1D9E75]" : "text-[#E24B4A]"}`}>
                    {r.exists ? "+" : "-"}
                  </span>
                  {r.item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sector benchmarks */}
        <section className="bg-white py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Sector Benchmarks</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-6">
              52 out of 100. Solid monitoring. Weak translation.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              <p>
                Auxeira&apos;s Evidence Health Check diagnostic assesses evidence maturity across eight dimensions: organisation type, primary audience, years of data, reporting frequency, economic analysis capability, evidence challenges, translation demand, and budget scale. Across the ECD sector, the estimated average score is 52 out of 100.
              </p>
              <p>
                A score of 52 indicates solid monitoring capability: organisations know what they are doing and can demonstrate it to programme funders. It indicates weak economic translation. Organisations cannot yet produce the fiscal evidence that moves Treasury, development finance institutions, or co-investment conversations at scale.
              </p>
              <p>
                The gap between 52 and 75 (the threshold for what Auxeira classifies as evidence-ready for institutional funding conversations) is not a data gap. It is a methodology gap. The data to close it exists in most organisations. The framework to assemble it does not.
              </p>
            </div>
          </div>
        </section>

        {/* Policy windows */}
        <section className="bg-[#0A1628] py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Policy Windows</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#F5F0E8] mb-10">
              Three windows that matter in <time dateTime="2026">2026</time> and <time dateTime="2027">2027</time>.
            </h2>
            <div className="space-y-6">
              {[
                {
                  label: "01",
                  title: "October 2026 MTEF Submission Cycle",
                  what: "The Medium Term Expenditure Framework submission cycle is the primary mechanism through which social sector organisations influence government budget allocations. Submissions that include fiscal evidence, including cost-per-outcome analysis, SROI, and economic multiplier modelling, are materially more competitive than those that present programme reach alone.",
                  miss: "Organisations without a fiscal evidence case will not be able to make a credible economic argument for budget allocation. The window closes in October 2026. Preparation requires a minimum of 8 to 12 weeks of evidence work.",
                },
                {
                  label: "02",
                  title: "DBE Annual Performance Plan Process",
                  what: "The Department of Basic Education&apos;s Annual Performance Plan process sets the evidence requirements for ECD organisations seeking recognition and co-funding within the Basic Education framework. Since the 2022 function shift, DBE has applied a curriculum and outcomes lens that requires evidence in a different register than DSD previously required.",
                  miss: "Organisations that cannot demonstrate school readiness outcomes, cost-per-learner benchmarks, and fiscal efficiency within the DBE framework will find the co-funding conversation increasingly difficult to advance.",
                },
                {
                  label: "03",
                  title: "Bana Pele Implementation Review",
                  what: "The Bana Pele programme&apos;s implementation review will assess which ECD organisations and models are performing at the level required for continued and expanded government investment. The review will apply fiscal evidence standards. Organisations that have built economic evidence cases will be positioned to make the case for scale.",
                  miss: "Organisations without economic evidence will be assessed on programme data alone. In a competitive allocation environment, fiscal evidence is the differentiating factor.",
                },
              ].map((w) => (
                <div key={w.label} className="border border-[#F5F0E8]/10 p-7">
                  <div className="flex items-start gap-5 mb-4">
                    <span className="font-mono text-[9px] tracking-[0.18em] text-[#C9A84C] flex-shrink-0 mt-1">{w.label}</span>
                    <h3 className="font-display text-xl font-semibold text-[#F5F0E8]">{w.title}</h3>
                  </div>
                  <p className="text-[#F5F0E8]/60 text-[13.5px] leading-relaxed mb-3 pl-9">{w.what}</p>
                  <p className="text-[#C9A84C]/80 text-[12.5px] leading-relaxed pl-9 font-mono">
                    Without fiscal evidence: {w.miss}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Evidence leadership */}
        <section className="bg-[#F5F0E8] py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Evidence Leadership</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-6">
              What a Treasury-ready evidence architecture includes.
            </h2>
            <div className="space-y-5 text-[#1A1A2A]/75 text-[15px] leading-[1.85] mb-10">
              <p>
                Evidence leadership in the ECD sector is not about having more data. It is about having the right evidence in the right format for the right audience. A Treasury-ready evidence architecture has four components.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "SROI Framework", body: "A calculated, defensible social return on investment using HACT or SROI Network standards. Not an estimate. A calculation, with sources, methodology, and auditable assumptions." },
                { title: "Policy Influence Tracking", body: "A systematic record of how programme evidence has shaped budget decisions, policy positions, or institutional commitments. This is the evidence that demonstrates the pathway from programme to policy." },
                { title: "Cost-per-Outcome Analysis", body: "A benchmark of what it costs to produce a verified outcome: school readiness, caregiver income, child development milestone. Comparable to government delivery costs where available." },
                { title: "Economic Multiplier Model", body: "A model of the broader economic activity generated by the programme: practitioner income, enterprise activity in the value chain, fiscal savings to government from avoided costs." },
              ].map((c) => (
                <div key={c.title} className="border-l-2 border-[#C9A84C] pl-5 py-1">
                  <div className="text-[#0A1628] font-medium text-[14px] mb-1">{c.title}</div>
                  <div className="text-[#1A1A2A]/60 text-[13.5px] leading-relaxed">{c.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Auxeira role */}
        <section className="bg-white py-16 lg:py-20 border-b border-[#1A1A2A]/10">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">Auxeira in the Sector</p>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-[#0A1628] mb-6">
              Closing the gap between evaluation evidence and economic evidence.
            </h2>
            <p className="text-[#1A1A2A]/75 text-[15px] leading-[1.85]">
              Auxeira is a Johannesburg-based evidence intelligence consultancy that specialises in translating programme evidence into economic evidence for the African social sector. The SmartStart 10-year impact report (49 interviews, 207-quote Evidence Index, 3.3x SROI established in six weeks) is the clearest demonstration of what this looks like in practice. SmartStart&apos;s SROI had existed in the data for a decade. Auxeira found it. The report became the evidence foundation for the 2026 Skoll Award for Social Innovation. Auxeira works with ECD organisations, education foundations, and social franchise models that have built something real and need the economic evidence to match.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#0A1628] py-20 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#F5F0E8] mb-4">
              Where does your organisation sit?
            </h2>
            <p className="text-[#F5F0E8]/60 text-[15px] leading-relaxed mb-10 max-w-xl mx-auto">
              The Evidence Health Check takes three minutes and gives you a score, a gap analysis, and a clear picture of where your evidence stands relative to the sector.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/health-check"
                className="inline-block bg-[#C9A84C] text-[#0A1628] font-semibold text-sm px-8 py-4 hover:bg-[#b8963e] transition-colors duration-200"
              >
                Take the Evidence Health Check
              </Link>
              <a
                href="mailto:info@auxeira.com?subject=ECD Evidence Conversation"
                className="inline-block border border-[#C9A84C] text-[#C9A84C] font-semibold text-sm px-8 py-4 hover:bg-[#C9A84C]/10 transition-colors duration-200"
              >
                Talk to Auxeira
              </a>
            </div>
          </div>
        </section>

      </article>

      <Footer />
    </>
  );
}
