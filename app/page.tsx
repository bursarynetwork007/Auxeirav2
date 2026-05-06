import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import CostOfGettingItWrong from "@/components/sections/CostOfGettingItWrong";
import HowWeWork from "@/components/sections/HowWeWork";
import ServicesAndTiers from "@/components/sections/ServicesAndTiers";
import EvidenceHealthCheck from "@/components/sections/EvidenceHealthCheck";
import TrustBuilders from "@/components/sections/TrustBuilders";
import ProofOfWork from "@/components/sections/ProofOfWork";
import Methodology from "@/components/sections/Methodology";
import SectorGrid from "@/components/sections/SectorGrid";
import AuxeiraDifference from "@/components/sections/AuxeiraDifference";
import WhoWeWorkWith from "@/components/sections/WhoWeWorkWith";
import Insights from "@/components/sections/Insights";
import Founder from "@/components/sections/Founder";
import Team from "@/components/sections/Team";
import MultiPointCTA from "@/components/sections/MultiPointCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CostOfGettingItWrong />
        <HowWeWork />
        <ServicesAndTiers />
        <EvidenceHealthCheck />
        <TrustBuilders />
        <ProofOfWork />
        <Methodology />
        <SectorGrid />
        <AuxeiraDifference />
        <WhoWeWorkWith />
        <Insights />
        <Founder />
        <Team />
        <MultiPointCTA />
      </main>
      <Footer />
    </>
  );
}
