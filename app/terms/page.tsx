import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use | Auxeira",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#F5F0E8] pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold text-[#0A1628] mb-8">Terms of Use</h1>
          <div className="text-[#1A1A2A]/70 space-y-6 text-base leading-relaxed">
            <p>
              <strong>Last updated:</strong> {new Date().getFullYear()}
            </p>
            <p>
              By accessing auxeira.com, you agree to these terms. The content on this site is for
              informational purposes only. Auxeira retains all intellectual property rights to
              content published on this site.
            </p>
            <p>
              For full terms governing client engagements, please refer to your engagement
              agreement. For questions, contact{" "}
              <a href="mailto:info@auxeira.com" className="text-[#C9A84C]">
                info@auxeira.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
