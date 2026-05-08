import Image from "next/image";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const CREDENTIALS = [
  "Mandela Washington Fellow",
  "YALI, Dartmouth 2017",
  "MIT 2021 Economics & Data",
  "Former Discovery Holdings Actuarial Specialist",
  "3 Successful Exits",
  "12+ Angel Investments",
  "Founder: LanteOTC | SeeADoctor | BursaryNetwork",
];

export default function Founder() {
  return (
    <section
      id="founder"
      className="bg-[#F5F0E8] py-24 lg:py-32"
      aria-labelledby="founder-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Photo placeholder */}
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

          {/* Text */}
          <RevealOnScroll delay={100}>
            <div>
              <h2
                id="founder-heading"
                className="font-display text-3xl lg:text-4xl font-semibold text-[#0A1628] mb-1"
              >
                Lante Emmanuel Luthuli
              </h2>
              <p className="text-[#C9A84C] text-sm uppercase tracking-[0.15em] font-medium mb-8">
                Founder & CEO, Auxeira
              </p>

              <blockquote className="mb-8">
                <p className="font-display text-xl lg:text-2xl font-light text-[#1A1A2A]/80 leading-relaxed italic">
                  &ldquo;I built Auxeira because I watched brilliant organisations do extraordinary
                  work, and watched that work disappear into reports that nobody read, decisions
                  that never changed, and communities that waited for impact that never came.
                </p>
                <p className="font-display text-xl lg:text-2xl font-light text-[#1A1A2A]/80 leading-relaxed italic mt-4">
                  The problem was never the evidence. The problem was always the translation.
                </p>
                <p className="font-display text-xl lg:text-2xl font-light text-[#1A1A2A]/80 leading-relaxed italic mt-4">
                  Auxeira is my answer to that problem, built on African entrepreneurship,
                  MIT-trained behavioural economics, actuarial precision and the conviction that the
                  world&apos;s most important data is still waiting to be found.&rdquo;
                </p>
              </blockquote>

              {/* Credentials bar */}
              <div className="border-t border-[#1A1A2A]/10 pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A2A]/35 font-medium mb-4">
                  Credentials
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {CREDENTIALS.map((c, i) => (
                    <span
                      key={c}
                      className={`text-sm text-[#1A1A2A]/60 ${
                        i < CREDENTIALS.length - 1
                          ? "after:content-['·'] after:ml-4 after:text-[#C9A84C]/50"
                          : ""
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
