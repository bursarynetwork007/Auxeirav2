import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

const CLIENTS = [
  {
    type: "Foundations & Funders",
    description:
      "You invest in evidence-driven organisations. We make that evidence visible, to government, to co-funders, to the sector.",
  },
  {
    type: "Impact Organisations & NGOs",
    description:
      "You do the work. We build the story that earns the next round of support, and moves policy in your direction.",
  },
  {
    type: "Government & Development Agencies",
    description:
      "You need evidence to justify decisions and allocate resources. We build the economic case that stands up in Treasury.",
  },
  {
    type: "International Philanthropy",
    description:
      "You need to understand what's working in markets you can't reach. We go there and bring back what you need to know.",
  },
];

export default function WhoWeWorkWith() {
  return (
    <section
      id="who-we-work-with"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="clients-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="clients-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#0A1628] max-w-3xl leading-tight"
          >
            We work with organisations whose evidence deserves a world-class partner.
          </h2>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1A1A2A]/8">
          {CLIENTS.map((c, i) => (
            <RevealOnScroll key={c.type} delay={i * 100}>
              <div className="bg-[#F5F0E8] p-8 lg:p-10">
                <h3 className="font-display text-xl lg:text-2xl font-semibold text-[#0A1628] mb-4">
                  {c.type}
                </h3>
                <p className="text-[#1A1A2A]/65 text-base leading-relaxed">{c.description}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={450}>
          <div className="mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-t border-[#1A1A2A]/10 pt-10">
            <p className="text-[#1A1A2A]/50 text-sm max-w-md leading-relaxed">
              We take on a small number of engagements at a time. Every client gets our full
              attention and our full methodology.
            </p>
            <Button variant="gold-filled" href="#cta" className="shrink-0">
              Start a Conversation →
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
