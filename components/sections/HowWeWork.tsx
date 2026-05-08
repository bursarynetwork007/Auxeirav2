import RevealOnScroll from "@/components/ui/RevealOnScroll";

const STEPS = [
  {
    number: "01",
    title: "The Longitudinal Evidence Audit",
    body: "We go deep. Into communities. Into longitudinal datasets. Into a decade of evaluations, financial records and programme data. Through structured stakeholder interviews, evidence mining, qualitative research and financial reconciliation, we surface the evidence that exists nowhere else. We build what we call a Sector Intelligence Machine: a cross-referenced, auditable knowledge base that no single organisation, algorithm or consulting firm could build alone.",
  },
  {
    number: "02",
    title: "The Decision-Ready Synthesis Engine",
    body: "We apply the full Auxeira Evidence Intelligence Framework, AI, behavioural science, data science, actuarial analysis, systems thinking and qualitative synthesis, to find the signal in the complexity. We identify what the evidence actually means, which findings matter most, and what language will move the specific decision-makers who need to act. The output is not data. It is structured, verified, decision-ready intelligence.",
  },
  {
    number: "03",
    title: "Knowledge Products That Move",
    body: "We produce knowledge products built to drive decisions, not sit in filing cabinets. 10-Year impact reports. Annual reports. Policy and funder briefs. Economic multiplier analyses. M&E frameworks. Practitioner narratives. Infographic systems. Evidence indexes. Sector publications in design-ready format. Each product is designed with one question in mind: what does this audience need to see, hear and feel to act? The result is always evidence that moves.",
  },
];

export default function HowWeWork() {
  return (
    <section
      id="how-we-work"
      className="bg-[#0A1628] py-24 lg:py-32"
      aria-labelledby="how-we-work-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
            The Auxeira Evidence Intelligence Framework
          </p>
          <h2
            id="how-we-work-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#F5F0E8] max-w-3xl leading-tight"
          >
            We go where others can&apos;t. Then we bring back what the world needs to know.
          </h2>
        </RevealOnScroll>

        <div className="mt-20 space-y-0 divide-y divide-[#C9A84C]/15">
          {STEPS.map((step, i) => (
            <RevealOnScroll key={step.number} delay={i * 100}>
              <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 group">
                {/* Number + title */}
                <div className="lg:col-span-3 flex lg:flex-col gap-4 lg:gap-2">
                  <span className="text-[#C9A84C]/40 font-display text-5xl font-light leading-none select-none">
                    {step.number}
                  </span>
                  <h3 className="font-display text-2xl lg:text-3xl font-semibold text-[#C9A84C] self-end lg:self-auto">
                    {step.title}
                  </h3>
                </div>
                {/* Body */}
                <div className="lg:col-span-9">
                  <p className="text-[#F5F0E8]/65 text-base lg:text-lg leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
