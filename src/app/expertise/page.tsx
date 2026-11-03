import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CTASection } from "@/components/home/CTASection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Engineering Expertise — Robotics, Design, Simulation, Automation",
  description:
    "Robotics engineering, mechanical design services, computational simulation and industrial automation — the four connected disciplines of Synthea Advanced Technologies.",
  path: "/expertise",
});

export default function ExpertisePage() {
  return (
    <>
      <PageHero
        eyebrow="Expertise"
        title="Four disciplines. One engineering approach."
        crumbs={[{ label: "Expertise", href: "/expertise" }]}
        intro={
          <p>
            Robotics, engineering design, simulation and automation work best together. We combine them to take ideas from
            first principles to working technology — for clients and for our own development programmes.
          </p>
        }
      />
      <ExpertiseSection label={false} />
      <ServicesSection />
      <ProcessSection />
      <CTASection />
    </>
  );
}
