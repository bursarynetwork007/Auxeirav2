import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Education & Early Childhood Development | Auxeira",
  description:
    "Auxeira's sector intelligence engine for ECD, the evidence gap, the economic case, and what we built for SmartStart.",
};

const METRICS = [
  { stat: "152,664", label: "Children reached" },
  { stat: "14,740", label: "Women-led micro-enterprises surfaced" },
  { stat: "3.3×", label: "Independently verified SROI" },
  { stat: "$2M", label: "Skoll Award, 2026" },
];

export default function EducationSectorPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-[#0A1628] pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
                SDG 4, Education & Early Childhood Development
              </p>
              <h1 className="font-display text-4xl lg:text-6xl font-light text-[#F5F0E8] max-w-3xl leading-tight mb-6">
                Where we began. Where we proved the model.
              </h1>
              <p className="text-[#F5F0E8]/60 text-base lg:text-lg max-w-2xl leading-relaxed">
                152,664 children. A Skoll Award. A methodology that works. ECD is Auxeira&apos;s
                founding sector, and the proof that evidence, properly translated, changes what
                governments fund and what funders back.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* Block 1, The evidence gap */}
        <section className="bg-[#F5F0E8] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-3xl lg:text-4xl font-light text-[#0A1628] max-w-2xl leading-tight mb-8">
                The evidence gap in African ECD
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-4xl">
                <p className="text-[#1A1A2A]/70 text-base leading-relaxed">
                  Early childhood development in Africa is chronically under-evidenced, not because
                  the programmes don&apos;t work, but because the economic case has never been built.
                  Treasury sees ECD as social expenditure. Funders see it as charity. Neither sees
                  what the data actually shows: a multiplier effect, a workforce development engine,
                  a fiscal savings mechanism that compounds over decades.
                </p>
                <p className="text-[#1A1A2A]/70 text-base leading-relaxed">
                  The R10 billion Bana Pele ECD investment on the table in South Africa will not be
                  unlocked by good intentions. It will be unlocked by evidence that speaks the
                  language of economic infrastructure, SROI, fiscal multipliers, workforce
                  participation rates. That evidence exists. It has almost never been surfaced.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Block 2, Cost of the gap */}
        <section className="bg-[#0A1628] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-3xl lg:text-4xl font-light text-[#F5F0E8] max-w-2xl leading-tight mb-12">
                What the gap costs
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  stat: "R10B",
                  label: "ECD investment at stake",
                  body: "The Bana Pele programme represents the largest ECD funding opportunity in South Africa's history. Programmes without economic evidence will not be funded at this scale.",
                },
                {
                  stat: "3.3×",
                  label: "SROI hidden in plain sight",
                  body: "SmartStart's independently verified SROI had existed in the data for a decade. No one had surfaced it. That number was the difference between a good programme and a globally recognised one.",
                },
                {
                  stat: "14,740",
                  label: "Women-led enterprises uncounted",
                  body: "The economic contribution of women-led micro-enterprises in the ECD sector was entirely absent from funding conversations, until Auxeira built the evidence.",
                },
              ].map((item, i) => (
                <RevealOnScroll key={item.stat} delay={i * 100}>
                  <div className="border border-[#C9A84C]/25 p-8">
                    <p className="font-display text-3xl font-semibold text-[#C9A84C] mb-2">
                      {item.stat}
                    </p>
                    <p className="text-[#F5F0E8]/70 text-sm font-medium mb-3">{item.label}</p>
                    <p className="text-[#F5F0E8]/45 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Block 3, Our sector intelligence engine */}
        <section className="bg-[#F5F0E8] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-3xl lg:text-4xl font-light text-[#0A1628] max-w-2xl leading-tight mb-8">
                Auxeira&apos;s ECD intelligence engine
              </h2>
              <p className="text-[#1A1A2A]/65 text-base leading-relaxed max-w-2xl mb-10">
                We have built the deepest evidence architecture in the African ECD sector, a
                cross-referenced, auditable knowledge base drawn from a decade of programme data,
                49 structured stakeholder interviews, and a 207-quote Master Evidence Index. This
                is not a report. It is a living intelligence engine that compounds in value with
                every engagement.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[#1A1A2A]/10">
                {METRICS.map((m, i) => (
                  <div
                    key={m.stat}
                    className={`p-6 ${i < METRICS.length - 1 ? "border-r border-[#1A1A2A]/10" : ""}`}
                  >
                    <p className="font-display text-2xl lg:text-3xl font-semibold text-[#C9A84C]">
                      {m.stat}
                    </p>
                    <p className="mt-1 text-xs text-[#1A1A2A]/45 leading-snug">{m.label}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Block 4, SmartStart case study */}
        <section className="bg-[#0A1628] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-3xl lg:text-4xl font-light text-[#F5F0E8] max-w-2xl leading-tight mb-4">
                SmartStart South Africa
              </h2>
              <p className="text-[#F5F0E8]/55 text-base leading-relaxed max-w-2xl mb-10">
                A decade of rigorous programme data. A critical evidence gap. A Skoll Award that
                followed.
              </p>
              <p className="text-[#F5F0E8]/50 text-sm italic border-l-2 border-[#C9A84C] pl-5 max-w-xl mb-10">
                Full case study available following SmartStart&apos;s official publication of the
                10-Year Impact Report.
              </p>
              <Button variant="gold-outline" href="/#proof-of-work">
                ← Back to Proof of Work
              </Button>
            </RevealOnScroll>
          </div>
        </section>

        {/* Block 5, CTA */}
        <section className="bg-[#C9A84C] py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <RevealOnScroll>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#0A1628] max-w-xl leading-tight mb-6">
                Book an ECD Evidence Strategy Call
              </h2>
              <p className="text-[#0A1628]/65 text-base leading-relaxed max-w-lg mb-8">
                30 minutes. Free. We&apos;ll assess your evidence base, identify your gaps, and
                tell you exactly what Auxeira would do for your organisation.
              </p>
              <Button
                variant="dark-filled"
                href={process.env.NEXT_PUBLIC_CALENDLY_URL ?? "#"}
                external
                className="text-base px-8 py-4"
              >
                Book a Call →
              </Button>
            </RevealOnScroll>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
