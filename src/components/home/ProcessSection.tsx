import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { EngineeringProcess } from "./EngineeringProcess";

export function ProcessSection() {
  return (
    <section aria-labelledby="process-title" className="section-y bg-white">
      <div className="container-site">
        <SectionLabel index="03">Our process</SectionLabel>
        <AnimatedHeading id="process-title" text="From Concept to Reality." className="mt-6 max-w-3xl text-h2 font-semibold" />
        <div className="mt-14 lg:mt-20">
          <EngineeringProcess />
        </div>
      </div>
    </section>
  );
}
