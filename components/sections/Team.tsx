import RevealOnScroll from "@/components/ui/RevealOnScroll";

const EXPERTISE_AREAS = [
  "Behavioural Economics",
  "Actuarial Analysis",
  "Evidence Architecture",
  "Sector Intelligence",
  "Data Science",
  "Qualitative Research",
  "Policy & Funder Communications",
  "Systems Thinking",
];

export default function Team() {
  return (
    <section
      id="team"
      className="bg-[#0A1628] py-24 lg:py-32"
      aria-labelledby="team-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="team-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#F5F0E8] max-w-3xl leading-tight"
          >
            Senior expertise on every engagement. No juniors left alone with your evidence.
          </h2>
        </RevealOnScroll>

        {/* Founder card — large */}
        <RevealOnScroll delay={100}>
          <div className="mt-16 border border-[#C9A84C]/30 p-8 lg:p-10 max-w-2xl">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                <span className="font-display text-lg text-[#C9A84C] font-semibold">LL</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-[#F5F0E8] mb-0.5">
                  Lante Emmanuel Luthuli
                </h3>
                <p className="text-[#C9A84C] text-xs uppercase tracking-[0.15em] font-medium mb-4">
                  Founder & CEO
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Behavioural economics",
                    "Actuarial analysis",
                    "Evidence architecture",
                    "Sector intelligence",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-[#F5F0E8]/50 border border-[#F5F0E8]/10 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-[#F5F0E8]/40 text-xs">
                  Mandela Washington Fellow · MIT Economics & Data · Discovery Holdings · 3 Exits
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Expert network */}
        <RevealOnScroll delay={200}>
          <div className="mt-12 max-w-3xl">
            <p className="text-[#F5F0E8]/55 text-base leading-relaxed mb-8">
              We build dedicated project teams from a senior network of economists, data scientists,
              qualitative researchers, and sector specialists — matched specifically to each
              engagement.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EXPERTISE_AREAS.map((area, i) => (
                <RevealOnScroll key={area} delay={200 + i * 50}>
                  <div className="border border-[#C9A84C]/15 px-4 py-3 text-center">
                    <p className="text-xs text-[#F5F0E8]/45 leading-snug">{area}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
