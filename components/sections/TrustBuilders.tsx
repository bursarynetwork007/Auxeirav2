import RevealOnScroll from "@/components/ui/RevealOnScroll";

const AFFILIATIONS = [
  "Mandela Washington Fellows Network",
  "YALI Alumni",
  "MIT Economics Community",
  "Skoll Foundation — 2026 Award",
];

const THOUGHT_LEADERSHIP = [
  {
    type: "Long-form article",
    title: "The Translation Gap: Why Strong Evidence Doesn't Drive Strong Decisions",
    cta: "Read →",
    href: "#insights",
  },
  {
    type: "Sector brief",
    title: "ECD as Economic Infrastructure: The Unmade Case for Treasury",
    cta: "Download →",
    href: "#cta",
  },
  {
    type: "Op-ed",
    title: "What the Skoll Award Tells Us About Evidence Communication in Africa",
    cta: "Read →",
    href: "#insights",
  },
];

export default function TrustBuilders() {
  return (
    <section
      id="trust"
      className="bg-[#F5F0E8] py-20 lg:py-28 border-t border-[#1A1A2A]/8"
      aria-label="Trust signals"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Affiliations */}
        <RevealOnScroll>
          <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A2A]/40 font-medium mb-8">
            As Featured In / Affiliated With
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {AFFILIATIONS.map((a) => (
              <span
                key={a}
                className="text-sm text-[#1A1A2A]/60 font-medium border-r border-[#1A1A2A]/15 pr-8 last:border-0 last:pr-0"
              >
                {a}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        {/* Phase 1 testimonial placeholder */}
        <RevealOnScroll delay={100}>
          <div className="mt-16 border-l-2 border-[#C9A84C] pl-8 max-w-2xl">
            <p className="font-display text-xl lg:text-2xl font-light text-[#1A1A2A]/80 italic leading-relaxed">
              &ldquo;Case study testimonial — available following SmartStart&apos;s official
              release.&rdquo;
            </p>
            <p className="mt-4 text-sm text-[#1A1A2A]/40">SmartStart South Africa — coming soon</p>
          </div>
        </RevealOnScroll>

        {/* Thought leadership stubs */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {THOUGHT_LEADERSHIP.map((item, i) => (
            <RevealOnScroll key={item.title} delay={i * 100}>
              <a
                href={item.href}
                className="group block border border-[#1A1A2A]/10 bg-white p-6 hover:border-[#C9A84C]/40 transition-all duration-200"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-[#C9A84C] font-medium mb-3">
                  {item.type}
                </p>
                <h3 className="font-display text-lg font-semibold text-[#0A1628] leading-snug mb-4 group-hover:text-[#C9A84C] transition-colors">
                  {item.title}
                </h3>
                <span className="text-sm text-[#C9A84C] font-medium">{item.cta}</span>
              </a>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
