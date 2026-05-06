import Link from "next/link";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

// All 17 UN SDGs mapped to Auxeira's sector architecture
const SDGS = [
  {
    number: "SDG 4",
    name: "Education & Early Childhood Development",
    status: "active" as const,
    badge: "ACTIVE",
    description:
      "Where we began. Where we proved the model. 152,664 children. A Skoll Award. A methodology that works.",
    href: "/sectors/education",
  },
  {
    number: "SDG 3",
    name: "Health & Nutrition",
    status: "building" as const,
    badge: "BUILDING",
    description:
      "The evidence gap in African health systems is vast and costly. We are building the sector intelligence engine.",
    href: "/sectors/health",
  },
  {
    number: "SDG 8",
    name: "Economic Development",
    status: "building" as const,
    badge: "BUILDING",
    description:
      "From microenterprise to national fiscal policy, we translate economic evidence into the language of growth and scale.",
    href: "/sectors/health",
  },
  {
    number: "SDG 13",
    name: "Climate & Environment",
    status: "coming" as const,
    badge: "COMING",
    description:
      "The climate crisis in Africa is under-evidenced and over-politicised. We are changing that.",
    href: "#sectors",
  },
  {
    number: "SDG 16",
    name: "Governance & Justice",
    status: "coming" as const,
    badge: "COMING",
    description: "Policy change requires evidence that moves ministries. We build it.",
    href: "#sectors",
  },
  // SDGs 1, 2, 5, 6, 7, 9, 10, 11, 12, 14, 15, 17, pipeline
  ...([1, 2, 5, 6, 7, 9, 10, 11, 12, 14, 15, 17].map((n) => ({
    number: `SDG ${n}`,
    name: `SDG ${n}`,
    status: "pipeline" as const,
    badge: "PIPELINE",
    description: "Sector intelligence engine under development. Register your sector interest.",
    href: "#cta",
  }))),
];

const statusStyles = {
  active: {
    card: "border-[#C9A84C] bg-white",
    badge: "bg-[#C9A84C] text-[#0A1628]",
    number: "text-[#C9A84C]",
    name: "text-[#0A1628]",
    desc: "text-[#1A1A2A]/65",
  },
  building: {
    card: "border-[#C9A84C]/40 bg-white hover:border-[#C9A84C]/70",
    badge: "border border-[#C9A84C] text-[#C9A84C]",
    number: "text-[#C9A84C]/70",
    name: "text-[#0A1628]",
    desc: "text-[#1A1A2A]/55",
  },
  coming: {
    card: "border-[#1A1A2A]/10 bg-white/60 hover:border-[#C9A84C]/30",
    badge: "text-[#1A1A2A]/30 border border-[#1A1A2A]/15",
    number: "text-[#1A1A2A]/30",
    name: "text-[#1A1A2A]/50",
    desc: "text-[#1A1A2A]/35",
  },
  pipeline: {
    card: "border-[#1A1A2A]/8 bg-white/40",
    badge: "text-[#1A1A2A]/20 border border-[#1A1A2A]/10",
    number: "text-[#1A1A2A]/20",
    name: "text-[#1A1A2A]/30",
    desc: "text-[#1A1A2A]/25",
  },
};

export default function SectorGrid() {
  return (
    <section
      id="sectors"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="sectors-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="sectors-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#0A1628] max-w-3xl leading-tight mb-4"
          >
            We start where the evidence gap is deepest, then expand. One sector at a time.
          </h2>
          <p className="text-[#1A1A2A]/55 text-base max-w-2xl leading-relaxed">
            Until no important decision in Africa is made without the best available evidence.
          </p>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SDGS.map((sdg, i) => {
            const s = statusStyles[sdg.status];
            const isClickable = sdg.status === "active" || sdg.status === "building";
            const Wrapper = isClickable ? Link : "div";

            return (
              <RevealOnScroll key={sdg.number} delay={Math.min(i * 40, 400)}>
                <Wrapper
                  href={sdg.href as string}
                  className={`block border p-5 transition-all duration-200 ${s.card} ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-mono font-medium ${s.number}`}>
                      {sdg.number}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 font-medium ${s.badge}`}
                    >
                      {sdg.badge}
                    </span>
                  </div>
                  <h3 className={`text-sm font-semibold mb-2 leading-snug ${s.name}`}>
                    {sdg.name}
                  </h3>
                  <p className={`text-xs leading-relaxed ${s.desc}`}>{sdg.description}</p>
                </Wrapper>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll delay={300}>
          <p className="mt-12 text-center text-sm text-[#1A1A2A]/45 max-w-2xl mx-auto leading-relaxed">
            Our horizon: All 17 UN Sustainable Development Goals. One sector at a time. One
            decision at a time. Until no important choice in the world is made without the best
            available evidence.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
