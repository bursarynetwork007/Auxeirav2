"use client";

import { useState } from "react";
import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const ACCORDION_ITEMS = [
  {
    num: "01",
    tag: "Quantitative Rigour",
    title: "MIT Economics & Data",
    source: "MicroMasters · DEDP · 2021",
    body: "When we model your SROI, project fiscal impact, or run an econometric evaluation, it is built to withstand Treasury scrutiny, not just look credible in a funder deck. MIT-trained rigour means the numbers we produce are citable, auditable, and defensible at the highest institutional level.",
    bold: "built to withstand Treasury scrutiny",
  },
  {
    num: "02",
    tag: "Risk & Actuarial Precision",
    title: "Discovery Holdings",
    source: "Actuarial Specialist · Former",
    body: "We do not do static risk matrices. We quantify, price, and engineer mitigation for systemic and tail risks: the kind that derail programmes and erode funder confidence before scale. Actuarial discipline applied to social sector execution is rare. It is what makes our models hold up under scrutiny.",
    bold: "quantify, price, and engineer mitigation",
  },
  {
    num: "03",
    tag: "Pan-African Leadership",
    title: "Mandela Washington Fellow",
    source: "YALI · Dartmouth · 2017",
    body: "A credential and a network that open doors across government, philanthropy, and development finance on the continent. Your evidence travels further with us, into rooms that require institutional trust before the conversation can begin.",
    bold: "Your evidence travels further with us",
  },
  {
    num: "04",
    tag: "Behavioural Architecture",
    title: "Decision-Maker Psychology",
    source: "Kahneman · Thaler · Ariely · Applied",
    body: "We embed cognitive and structural behavioural science directly into how evidence is designed and presented, so every knowledge product is built for how funders and ministers actually process information, not how researchers prefer to share it.",
    bold: "directly into how evidence is designed and presented",
  },
  {
    num: "05",
    tag: "Strategic Narrative",
    title: "Evidence Translation at Scale",
    source: "RCTs · Quasi-experimental · M&E",
    body: "We turn complex econometric findings into board-ready narratives and policy briefs that move funding decisions and shift institutional attention. The SmartStart 10-year report (49 interviews, 207-quote Evidence Index, delivered in six weeks) is what this looks like in practice.",
    bold: "board-ready narratives and policy briefs",
  },
  {
    num: "06",
    tag: "Financial Architecture",
    title: "SROI & Sustainability Valuation",
    source: "Contingent Forecasts · Long-Term Present Value",
    body: "We model Social Return on Investment and long-term cash flow sustainability with the precision of someone who has built, funded, and exited ventures, not just evaluated them. SmartStart's SROI was 3.3x. That number had existed in the data for a decade. Auxeira found it.",
    bold: "built, funded, and exited ventures",
  },
];

const STATS = [
  {
    num: "3",
    label: "Successful Exits",
    detail: "LanteOTC · SeeADoctor · BursaryNetwork. We know what execution risk feels like because we have carried it.",
  },
  {
    num: "12+",
    label: "Angel Investments",
    detail: "We have sat on both sides of the funding table. We know what allocators need before they commit.",
  },
];

function highlightBold(text: string, bold: string) {
  const parts = text.split(bold);
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <strong className="text-[#0A1628] font-medium">{bold}</strong>
      {parts[1]}
    </>
  );
}

export default function Founder() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section
      id="founder"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="founder-heading"
    >
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Two-column: photo + quote */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">

          <RevealOnScroll>
            <div className="relative aspect-[4/5] max-w-sm w-full overflow-hidden">
              <Image
                src="/images/lante-luthuli.jpg"
                alt="Lante Emmanuel Luthuli, Founder and CEO of Auxeira"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 400px"
                priority
              />
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div>
              <h2
                id="founder-heading"
                className="font-display text-3xl lg:text-4xl font-semibold text-[#0A1628] mb-1"
              >
                Lante Emmanuel Luthuli
              </h2>
              <p className="text-[#C9A84C] text-sm uppercase tracking-[0.15em] font-medium mb-8">
                Founder &amp; CEO, Auxeira
              </p>

              <blockquote>
                <p className="font-display text-xl lg:text-2xl font-light text-[#1A1A2A]/80 leading-relaxed italic">
                  &ldquo;I built Auxeira because I watched brilliant organisations do
                  extraordinary work, and watched that work disappear into reports
                  that nobody read, decisions that never changed, and communities
                  that waited for impact that never came.
                </p>
                <p className="font-display text-xl lg:text-2xl font-light text-[#1A1A2A]/80 leading-relaxed italic mt-4">
                  The problem was never the evidence. The problem was always the
                  translation.
                </p>
                <p className="font-display text-xl lg:text-2xl font-light text-[#1A1A2A]/80 leading-relaxed italic mt-4">
                  Auxeira is my answer to that problem, built on African
                  entrepreneurship, MIT-trained behavioural economics, actuarial
                  precision and the conviction that the world&apos;s most important
                  data is still waiting to be found.&rdquo;
                </p>
              </blockquote>
            </div>
          </RevealOnScroll>
        </div>

        {/* Credentials accordion */}
        <RevealOnScroll delay={150}>

          <div className="mb-10">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#C9A84C] mb-4">
              Why the methodology holds
            </p>
            <h3 className="font-display text-2xl lg:text-3xl font-normal text-[#0A1628] mb-3">
              Every claim we make is{" "}
              <em className="italic text-[#C9A84C]">built on something real.</em>
            </h3>
            <p className="text-sm text-[#1A1A2A]/55 leading-relaxed max-w-xl">
              Our framework is not borrowed from a textbook. It is the direct
              output of a career built at the intersection of actuarial risk
              precision, randomised policy evaluation, and venture execution
              across Africa.
            </p>
          </div>

          {/* Accordion */}
          <div className="border border-[#1A1A2A]/12">
            {ACCORDION_ITEMS.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={item.num}
                  className={`relative border-b border-[#1A1A2A]/12 last:border-b-0 transition-colors duration-200${isOpen ? " bg-[#0A1628]/[0.03]" : ""}`}
                >
                  {/* Gold left bar */}
                  <div
                    className="absolute top-0 left-0 w-[2px] bg-[#C9A84C] transition-transform duration-300 origin-top"
                    style={{ height: "100%", transform: isOpen ? "scaleY(1)" : "scaleY(0)" }}
                  />

                  <button
                    className="w-full text-left flex items-center gap-4 pl-7 pr-6 py-5 hover:bg-[#0A1628]/[0.04] transition-colors duration-150"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-mono text-[9px] tracking-[0.18em] text-[#C9A84C] w-6 flex-shrink-0">
                      {item.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={`font-mono text-[9px] tracking-[0.16em] uppercase block mb-1 transition-colors duration-200 ${isOpen ? "text-[#C9A84C]" : "text-[#1A1A2A]/35"}`}>
                        {item.tag}
                      </span>
                      <span className="font-display text-[15px] font-semibold text-[#0A1628] block leading-snug">
                        {item.title}
                      </span>
                      <span className="font-mono text-[9.5px] text-[#1A1A2A]/35 tracking-[0.05em] mt-1 block">
                        {item.source}
                      </span>
                    </div>
                    {/* Plus / minus icon */}
                    <span className="relative w-4 h-4 flex-shrink-0 ml-2" aria-hidden="true">
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[11px] h-px bg-[#C9A84C]" />
                      <span
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[11px] bg-[#C9A84C] transition-all duration-300"
                        style={{ opacity: isOpen ? 0 : 1 }}
                      />
                    </span>
                  </button>

                  {/* Panel */}
                  <div
                    className="overflow-hidden transition-all duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{ maxHeight: isOpen ? "240px" : "0px" }}
                  >
                    <p className="text-[13.5px] text-[#1A1A2A]/60 leading-[1.78] border-t border-[#1A1A2A]/10 pl-[68px] pr-6 py-5">
                      {highlightBold(item.body, item.bold)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 border border-t-0 border-[#1A1A2A]/12">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-baseline gap-4 px-7 py-7${i === 0 ? " sm:border-r border-[#1A1A2A]/12" : ""}`}
              >
                <span className="font-display text-[38px] font-normal text-[#C9A84C] leading-none flex-shrink-0">
                  {s.num}
                </span>
                <div className="text-[12.5px] text-[#1A1A2A]/55 leading-relaxed">
                  <strong className="block text-[13px] font-medium text-[#0A1628] mb-1">
                    {s.label}
                  </strong>
                  {s.detail}
                </div>
              </div>
            ))}
          </div>

        </RevealOnScroll>
      </div>
    </section>
  );
}
