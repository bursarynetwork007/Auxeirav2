import RevealOnScroll from "@/components/ui/RevealOnScroll";

const COMPARISON = [
  {
    label: "Global Firms",
    points: [
      "Deep pockets. Global brand.",
      "Frameworks built for Western markets.",
      "Day rates that absorb your entire annual budget.",
      "Delivered by junior analysts who've never set foot in your province.",
    ],
    highlight: false,
  },
  {
    label: "Local Research Firms",
    points: [
      "Strong sector relationships.",
      "Genuine commitment.",
      "Limited capacity to translate evidence into the economic and funder language that moves global decision-makers.",
    ],
    highlight: false,
  },
  {
    label: "Auxeira",
    points: [
      "Global methodology. African proximity.",
      "A team that has been inside your data, your communities and your evidence base.",
      "The credentials, the framework and the network to make it move internationally.",
      "At a fraction of the cost of the firms you've been comparing us to.",
    ],
    highlight: true,
  },
];

export default function AuxeiraDifference() {
  return (
    <section
      id="difference"
      className="bg-[#0A1628] py-24 lg:py-32"
      aria-labelledby="difference-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <RevealOnScroll>
          <h2
            id="difference-heading"
            className="font-display text-3xl lg:text-5xl font-light text-[#F5F0E8] max-w-3xl leading-tight"
          >
            The best evidence firms in the world operate from London and New York. They charge
            accordingly. And they&apos;ve never been inside the communities where your evidence
            lives.
          </h2>
        </RevealOnScroll>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#C9A84C]/10">
          {COMPARISON.map((col, i) => (
            <RevealOnScroll key={col.label} delay={i * 100}>
              <div
                className={`p-8 lg:p-10 h-full ${
                  col.highlight ? "bg-[#0f1f3d] border border-[#C9A84C]/30" : "bg-[#0A1628]"
                }`}
              >
                <h3
                  className={`text-xs uppercase tracking-[0.2em] font-medium mb-6 ${
                    col.highlight ? "text-[#C9A84C]" : "text-[#F5F0E8]/30"
                  }`}
                >
                  {col.label}
                </h3>
                <ul className="space-y-4">
                  {col.points.map((pt) => (
                    <li
                      key={pt}
                      className={`flex items-start gap-3 text-sm leading-relaxed ${
                        col.highlight ? "text-[#F5F0E8]/80" : "text-[#F5F0E8]/35"
                      }`}
                    >
                      <span
                        className={`shrink-0 mt-1 w-1 h-1 rounded-full ${
                          col.highlight ? "bg-[#C9A84C]" : "bg-[#F5F0E8]/20"
                        }`}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={350}>
          <p className="mt-14 font-display text-xl lg:text-2xl text-[#F5F0E8] max-w-2xl leading-snug">
            You don&apos;t need a global firm with an African office. You need an African firm with
            a global methodology.{" "}
            <span className="text-[#C9A84C]">That&apos;s Auxeira.</span>
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
