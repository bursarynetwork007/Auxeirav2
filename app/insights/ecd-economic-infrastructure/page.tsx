import type { Metadata } from "next";
import InsightStub from "@/components/InsightStub";

export const metadata: Metadata = {
  title: "ECD as Economic Infrastructure: The Unmade Case for Treasury | Auxeira",
  description:
    "Early childhood development is not social expenditure. It is economic infrastructure. The case has never been properly made to Treasury. This is what that case looks like.",
};

export default function EcdEconomicInfrastructurePage() {
  return (
    <InsightStub
      type="Sector brief"
      title="ECD as Economic Infrastructure: The Unmade Case for Treasury"
      teaser="Early childhood development is consistently framed as social expenditure. It is not. It is economic infrastructure, with measurable fiscal multipliers, workforce participation effects, and long-term savings to the state that dwarf the cost of investment. The case has never been properly made to Treasury. This brief sets out what that case looks like, and why the R10 billion Bana Pele opportunity depends on it being made correctly."
    />
  );
}
