import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { IntroSection } from "@/components/home/IntroSection";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { SimulationSection } from "@/components/home/SimulationSection";
import { TechnologySpotlight } from "@/components/home/TechnologySpotlight";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { CTASection } from "@/components/home/CTASection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "SYNTHEA — Robotics, Engineering Design & Simulation | France",
  description:
    "Synthea Advanced Technologies engineers custom robotic systems, mechanical designs, computational simulation and intelligent automation. Robotics engineering in France.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ExpertiseSection />
      <ProcessSection />
      <SimulationSection />
      <TechnologySpotlight />
      <ServicesSection />
      <ProjectsSection />
      <CTASection />
    </>
  );
}
