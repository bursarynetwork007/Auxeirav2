import type { Metadata } from "next";
import InsightStub from "@/components/InsightStub";

export const metadata: Metadata = {
  title: "What the Skoll Award Tells Us About Evidence Communication in Africa | Auxeira",
  description:
    "The Skoll Foundation's $2M Award for Social Innovation recognised SmartStart's impact. What it actually recognised was the evidence narrative that made that impact visible to a global audience.",
};

export default function SkollAwardEvidencePage() {
  return (
    <InsightStub
      type="Op-ed"
      title="What the Skoll Award Tells Us About Evidence Communication in Africa"
      teaser="The Skoll Foundation's $2M Award for Social Innovation recognised SmartStart's impact. What it actually recognised was the evidence narrative that made that impact visible to a global audience. The programme had been running for a decade. The SROI had existed in the data for years. The difference was not the work, it was the translation. This is what that tells us about how African organisations communicate evidence, and what needs to change."
    />
  );
}
