import RevealOnScroll from "@/components/ui/RevealOnScroll";
import FrameworkDiagram from "@/components/ui/FrameworkDiagram";

const PILLARS = [
  {
    number: "01",
    title: "Longitudinal Intelligence",
    body: "We extract learning across multiple evaluations, datasets and reports over time, building a Sector Intelligence Machine that compounds in value. The longer we work in a sector, the more irreplaceable we become.",
  },
  {
    number: "02",
    title: "Behavioural Science",
    body: "We apply Thaler, Ariely and Kahneman principles to understand how decision-makers actually process evidence. Every knowledge product is architectured around the cognitive patterns of its target audience, not around researcher conventions.",
  },
  {
    number: "03",
    title: "Artificial Intelligence",
    body: "AI accelerates our synthesis, pattern recognition and knowledge product production. But it never replaces the human judgment, fieldwork and relationship intelligence that makes evidence credible. We use AI as infrastructure, not as shortcut.",
  },
  {
    number: "04",
    title: "Data Science & Actuarial Analysis",
    body: "Rigorous quantitative analysis underpins every claim we make, from SROI calculations to economic multiplier modelling to fiscal impact projection. Our actuarial foundation means our numbers are built to withstand scrutiny in Treasury, boardrooms and international funding reviews.",
  },
  {
    number: "05",
    title: "Qualitative Research",
    body: "The world's most important evidence lives in human experience. Structured interviews, focus groups, practitioner narratives and evidence synthesis surface the truth that quantitative data cannot capture alone.",
  },
  {
    number: "06",
    title: "Systems Thinking",
    body: "We see the ecosystem, not just the organisation. We map how evidence flows through systems, where it gets blocked, and what interventions unlock the decisions that drive scale.",
  },
];

export default function Methodology() {
  return (
    <section
      id="methodology"
      className="bg-[#0A1628] py-24 lg:py-32"
      aria-labelledby="methodology-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="methodology-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#F5F0E8] max-w-3xl leading-tight"
          >
            We didn&apos;t borrow our framework. We built it, from African fieldwork, Nobel
            Prize-winning research, and the hard lessons of evidence that never reached the people
            who needed it.
          </h2>
        </RevealOnScroll>

        {/* Framework diagram */}
        <RevealOnScroll delay={100}>
          <div className="mt-16 mb-4">
            <FrameworkDiagram />
          </div>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#C9A84C]/10">
          {PILLARS.map((p, i) => (
            <RevealOnScroll key={p.number} delay={i * 80}>
              <div className="bg-[#0A1628] p-8 lg:p-10 h-full hover:bg-[#0f1f3d] transition-colors duration-200">
                <span className="text-[#C9A84C]/30 font-display text-4xl font-light leading-none block mb-4 select-none">
                  {p.number}
                </span>
                <h3 className="font-display text-xl font-semibold text-[#C9A84C] mb-4">
                  {p.title}
                </h3>
                <p className="text-[#F5F0E8]/55 text-sm leading-relaxed">{p.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
