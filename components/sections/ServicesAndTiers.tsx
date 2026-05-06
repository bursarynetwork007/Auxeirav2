import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

const TIERS = [
  {
    number: "Tier 1",
    title: "Evidence Translation",
    subtitle: "The fastest path from strong evidence to decisions that move",
    description:
      "For organisations that have strong data but aren't getting the funding, policy traction, or sector visibility their work deserves.",
    deliverables: [
      "Funder-facing impact brief",
      "Practitioner communications package",
      "Economic snapshot",
      "Infographic systems",
      "Annual report contribution",
    ],
    timeline: "3 – 6 weeks",
    price: "R85,000 – R150,000",
    cta: "Start Here",
    ctaHref: "#cta",
  },
  {
    number: "Tier 2",
    title: "Evidence Synthesis & Strategy",
    subtitle: "When you need the full picture built, not just translated",
    description:
      "For organisations with a decade of data, multiple evaluations, and a story that's never been properly told.",
    deliverables: [
      "10-Year / flagship impact report",
      "Master Evidence Index",
      "Policy brief",
      "Economic analysis",
      "Practitioner narratives",
      "Full infographic system",
    ],
    timeline: "6 – 10 weeks",
    price: "R180,000 – R350,000",
    cta: "This Is What We Did for SmartStart",
    ctaHref: "#proof-of-work",
    featured: true,
  },
  {
    number: "Tier 3",
    title: "Sector Intelligence Platform",
    subtitle: "The long-term play — for funders and sector leaders serious about scale",
    description:
      "For foundations, development agencies, and sector bodies that want a continuously updated intelligence engine.",
    deliverables: ["Bespoke — built around your sector and your decision architecture."],
    timeline: "Ongoing retainer",
    price: "Investment: By conversation",
    cta: "Talk to Us About This",
    ctaHref: "#cta",
  },
];

export default function ServicesAndTiers() {
  return (
    <section
      id="services"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="services-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#0A1628] max-w-3xl leading-tight"
          >
            Every engagement starts with a conversation. But here&apos;s what that conversation
            typically leads to.
          </h2>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <RevealOnScroll key={tier.number} delay={i * 120}>
              <div
                className={`flex flex-col h-full p-8 lg:p-10 border transition-all duration-300 ${
                  tier.featured
                    ? "bg-[#0A1628] border-[#C9A84C] text-[#F5F0E8]"
                    : "bg-white border-[#1A1A2A]/10 text-[#1A1A2A] hover:border-[#C9A84C]/40"
                }`}
              >
                <div>
                  <p
                    className={`text-xs uppercase tracking-[0.2em] font-medium mb-3 ${
                      tier.featured ? "text-[#C9A84C]" : "text-[#C9A84C]"
                    }`}
                  >
                    {tier.number}
                  </p>
                  <h3
                    className={`font-display text-2xl font-semibold mb-2 ${
                      tier.featured ? "text-[#F5F0E8]" : "text-[#0A1628]"
                    }`}
                  >
                    {tier.title}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      tier.featured ? "text-[#F5F0E8]/60" : "text-[#1A1A2A]/60"
                    }`}
                  >
                    {tier.subtitle}
                  </p>
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      tier.featured ? "text-[#F5F0E8]/70" : "text-[#1A1A2A]/70"
                    }`}
                  >
                    {tier.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {tier.deliverables.map((d) => (
                      <li
                        key={d}
                        className={`text-sm flex items-start gap-2 ${
                          tier.featured ? "text-[#F5F0E8]/70" : "text-[#1A1A2A]/70"
                        }`}
                      >
                        <span className="text-[#C9A84C] mt-0.5 shrink-0">·</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <div
                    className={`border-t pt-6 mb-6 ${
                      tier.featured ? "border-[#C9A84C]/20" : "border-[#1A1A2A]/10"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-widest mb-1 ${
                        tier.featured ? "text-[#F5F0E8]/40" : "text-[#1A1A2A]/40"
                      }`}
                    >
                      Timeline
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        tier.featured ? "text-[#F5F0E8]" : "text-[#0A1628]"
                      }`}
                    >
                      {tier.timeline}
                    </p>
                    <p
                      className={`mt-3 text-xs uppercase tracking-widest mb-1 ${
                        tier.featured ? "text-[#F5F0E8]/40" : "text-[#1A1A2A]/40"
                      }`}
                    >
                      Investment
                    </p>
                    <p
                      className={`font-display text-xl font-semibold ${
                        tier.featured ? "text-[#C9A84C]" : "text-[#0A1628]"
                      }`}
                    >
                      {tier.price}
                    </p>
                  </div>

                  <Button
                    variant={tier.featured ? "gold-filled" : "gold-outline"}
                    href={tier.ctaHref}
                    className="w-full justify-center text-sm"
                  >
                    {tier.cta} →
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Scarcity signal */}
        <RevealOnScroll delay={400}>
          <p className="mt-10 text-center text-sm text-[#1A1A2A]/50 max-w-xl mx-auto">
            We run a maximum of four active engagements at any time. If you&apos;re considering
            Tier 2 or Tier 3, early conversation is worth it.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
