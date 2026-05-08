import Image from "next/image";

export default function FrameworkDiagram() {
  return (
    <>
      {/* Desktop: production SVG */}
      <div className="hidden md:block w-full">
        <Image
          src="/images/auxeira-methodology-diagram.svg"
          alt="The Auxeira Evidence Intelligence Framework: three-stage process showing Extract (The Longitudinal Evidence Audit), Synthesise (The Decision-Ready Synthesis Engine), and Move (Knowledge Products That Move)"
          width={1200}
          height={500}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* Mobile: three text blocks instead of the diagram */}
      <div className="md:hidden space-y-4">
        {[
          { n: "01", label: "EXTRACT", title: "The Longitudinal Evidence Audit" },
          { n: "02", label: "SYNTHESISE", title: "The Decision-Ready Synthesis Engine" },
          { n: "03", label: "MOVE", title: "Knowledge Products That Move" },
        ].map((step, i) => (
          <div key={step.n} className="border border-[#C9A84C]/30 p-5">
            <p className="text-[#C9A84C]/40 font-display text-3xl font-light leading-none mb-1 select-none">
              {step.n}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-medium mb-1">
              {step.label}
            </p>
            <p className="font-display text-lg font-semibold text-[#F5F0E8]">{step.title}</p>
            {i < 2 && (
              <p className="text-[#C9A84C]/40 text-xs mt-3">↓</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
