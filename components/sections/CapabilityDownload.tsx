import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function CapabilityDownload() {
  return (
    <section
      id="capability"
      className="bg-[#0A1628] py-24 lg:py-32"
      aria-labelledby="capability-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl">
          <RevealOnScroll>
            <p className="text-[#C9A84C] text-xs uppercase tracking-[0.2em] font-medium mb-4">
              Capability Overview
            </p>
            <h2
              id="capability-heading"
              className="font-display text-3xl lg:text-5xl font-light text-[#F5F0E8] leading-tight mb-6"
            >
              Download the Capability Overview
            </h2>
            <p className="text-[#F5F0E8]/55 text-base leading-relaxed mb-10">
              2-page PDF. Instant access. The fastest way to understand what Auxeira does,
              what we&apos;ve delivered, and what a partnership looks like.
            </p>

            <a
              href="/capability-overview.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#C9A84C] text-[#0A1628] px-8 py-4 text-sm font-semibold tracking-wide hover:bg-[#F0E6C8] transition-colors"
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 2v8m0 0-3-3m3 3 3-3M2 12v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1" />
              </svg>
              Download Capability Overview
            </a>

            <p className="mt-4 text-[#F5F0E8]/25 text-xs">
              Opens in browser — use File → Print → Save as PDF
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
