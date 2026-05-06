import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Auxeira",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#F5F0E8] pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="font-display text-4xl font-semibold text-[#0A1628] mb-8">
            Privacy Policy
          </h1>
          <div className="prose prose-sm max-w-none text-[#1A1A2A]/70 space-y-6 text-base leading-relaxed">
            <p>
              <strong>Last updated:</strong> {new Date().getFullYear()}
            </p>
            <p>
              Auxeira (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to
              protecting your personal information. This policy explains what data we collect, how
              we use it, and your rights.
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#0A1628] mt-8 mb-3">
              What we collect
            </h2>
            <p>
              We collect your name and email address when you complete the Evidence Health Check,
              subscribe to Auxeira Intelligence, request the Capability Overview, or register
              interest in a sector. We also collect your Health Check answers and score to
              personalise your results and follow-up.
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#0A1628] mt-8 mb-3">
              How we use it
            </h2>
            <p>
              We use your information to send you the results and content you requested, to notify
              you of relevant Auxeira developments, and to improve our services. We do not sell
              your data to third parties.
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#0A1628] mt-8 mb-3">
              Your rights
            </h2>
            <p>
              You may unsubscribe from any email at any time using the link in the footer of each
              message. To request deletion of your data, email{" "}
              <a href="mailto:info@auxeira.com" className="text-[#C9A84C]">
                info@auxeira.com
              </a>
              .
            </p>
            <h2 className="font-display text-2xl font-semibold text-[#0A1628] mt-8 mb-3">
              Contact
            </h2>
            <p>
              Auxeira · Johannesburg, South Africa ·{" "}
              <a href="mailto:info@auxeira.com" className="text-[#C9A84C]">
                info@auxeira.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
