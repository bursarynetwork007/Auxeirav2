import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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

        {/* Founder card, large */}
        <RevealOnScroll delay={100}>
          <div className="mt-16 border border-[#C9A84C]/30 p-8 lg:p-10 max-w-2xl">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-[#C9A84C]/30 shrink-0 relative">
                <Image
                  src="/images/lante-luthuli.jpg"
                  alt="Lante Emmanuel Luthuli"
                  fill
                  className="object-cover object-top"
                  sizes="56px"
                />
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
                    "Behavioural Economics",
                    "Actuarial Analysis",
                    "Evidence Architecture",
                    "Sector Intelligence",
                    "Data Science",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-[#F5F0E8]/50 border border-[#F5F0E8]/10 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href="https://za.linkedin.com/in/emmanuel-luthuli-193194146"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-[#F5F0E8]/30 hover:text-[#C9A84C] transition-colors"
                  aria-label="LinkedIn profile"
                >
                  <LinkedInIcon className="w-4 h-4" />
                  <span className="text-xs">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Expert network */}
        <RevealOnScroll delay={200}>
          <div className="mt-12 max-w-3xl">
            <p className="text-[#F5F0E8]/55 text-base leading-relaxed mb-8">
              We build dedicated project teams from a senior network of economists, data scientists,
              qualitative researchers, and sector specialists, matched specifically to each
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
