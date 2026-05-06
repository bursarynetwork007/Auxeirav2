import RevealOnScroll from "@/components/ui/RevealOnScroll";

const PROBLEMS = [
  {
    title: "The Data Gap",
    body: "The most important evidence in the world has never been captured — not because it doesn't exist, but because the tools to reach it don't operate where it lives. In communities. In practitioner networks. In a decade of programme data that no one has synthesised.",
  },
  {
    title: "The Translation Gap",
    body: "When evidence does exist, it rarely reaches the decision-makers who can act on it. Not because they don't care. Because the evidence was written for researchers, not for ministers, funders, or boards. Strong evidence in the wrong language is invisible evidence.",
  },
  {
    title: "The Decision Gap",
    body: "Misallocated resources. Missed policy windows. Programmes that don't scale because no one has built the economic case. The cost of this gap is borne by the communities that needed better decisions — and never got them.",
  },
];

export default function CostOfGettingItWrong() {
  return (
    <section
      id="cost-of-getting-it-wrong"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="cost-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Editorial pull quote */}
        <RevealOnScroll>
          <blockquote className="max-w-4xl">
            <p className="font-display text-2xl lg:text-4xl font-light text-[#1A1A2A] leading-snug">
              &ldquo;Every day, governments allocate resources, funders make bets, and boards make
              decisions — based on incomplete evidence. The impact that gets missed, the policy that
              lands wrong, the funding that misses its mark — that cost is invisible. Until it
              isn&apos;t.&rdquo;
            </p>
          </blockquote>
        </RevealOnScroll>

        {/* Three-column problem grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[#1A1A2A]/10">
          {PROBLEMS.map((p, i) => (
            <RevealOnScroll key={p.title} delay={i * 120}>
              <div
                className={`pt-10 pb-8 ${
                  i < PROBLEMS.length - 1 ? "md:pr-10 md:border-r border-[#1A1A2A]/10" : ""
                } ${i > 0 ? "md:pl-10" : ""}`}
              >
                <h3
                  id={i === 0 ? "cost-heading" : undefined}
                  className="font-display text-xl lg:text-2xl font-semibold text-[#0A1628] mb-4"
                >
                  {p.title}
                </h3>
                <p className="text-[#1A1A2A]/70 text-base leading-relaxed">{p.body}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Closing line */}
        <RevealOnScroll delay={360}>
          <p className="mt-12 text-[#0A1628] font-medium text-lg lg:text-xl">
            Auxeira closes all three gaps. In a single engagement.
          </p>
        </RevealOnScroll>
      </div>

      {/* ROI Framing Block — navy, immediately below */}
      <div className="mt-20 bg-[#0A1628] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <RevealOnScroll>
            <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-6">
              The Real Cost
            </p>
            <h2 className="font-display text-3xl lg:text-5xl font-light text-[#F5F0E8] max-w-3xl leading-tight">
              Bad evidence communication isn&apos;t a communications problem. It&apos;s a capital
              allocation problem.
            </h2>
          </RevealOnScroll>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stat: "R10 Billion",
                label: "The Bana Pele ECD investment on the table in South Africa.",
                body: "Programmes that cannot demonstrate economic impact — not just child outcomes — will not be funded at that scale. The evidence gap is a funding gap.",
              },
              {
                stat: "$2,000,000",
                label: "The Skoll Award that followed a single, well-structured evidence narrative.",
                body: "The difference between a good programme and a recognised one is almost never the programme. It's the translation.",
              },
              {
                stat: "3.3×",
                label: "The independently verified SROI of a community-based ECD platform.",
                body: "A figure that had existed in the data for a decade and had never been surfaced. That number was always there. Auxeira found it.",
              },
            ].map((item, i) => (
              <RevealOnScroll key={item.stat} delay={i * 120}>
                <div className="border border-[#C9A84C]/30 p-8">
                  <p className="font-display text-3xl lg:text-4xl font-semibold text-[#C9A84C]">
                    {item.stat}
                  </p>
                  <p className="mt-3 text-[#F5F0E8]/80 text-sm font-medium leading-snug">
                    {item.label}
                  </p>
                  <p className="mt-3 text-[#F5F0E8]/50 text-sm leading-relaxed">{item.body}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={400}>
            <p className="mt-14 text-[#C9A84C] text-center text-base lg:text-lg font-medium max-w-3xl mx-auto leading-relaxed">
              &ldquo;The question isn&apos;t whether you can afford Auxeira. It&apos;s what a
              misallocated funding round, a missed policy window, or an unseen SROI is costing you
              right now.&rdquo;
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
