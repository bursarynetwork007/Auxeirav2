import type { Metadata } from "next";
import InsightStub from "@/components/InsightStub";

export const metadata: Metadata = {
  title: "The Translation Gap: Why Strong Evidence Doesn't Drive Strong Decisions | Auxeira",
  description:
    "The gap between evidence and decision is where impact dies. It is not a communications problem. It is a behavioural science problem. And it has a solution.",
};

export default function TranslationGapPage() {
  return (
    <InsightStub
      type="Long-form article"
      title="The Translation Gap: Why Strong Evidence Doesn't Drive Strong Decisions"
      teaser="The gap between evidence and decision is where impact dies. It is not a communications problem. It is a behavioural science problem. And it has a solution. Across a decade of working inside African programme data, one pattern repeats: the evidence exists, the decision-makers exist, and the gap between them is almost never about the quality of the research."
    />
  );
}
