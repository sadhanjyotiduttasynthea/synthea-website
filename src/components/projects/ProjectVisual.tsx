import Image from "next/image";
import type { ProjectVisual as VisualKey } from "@/content/projects";
import { DeliveryConcept, DesignerRobotConcept } from "@/components/illustrations/ConceptIllustrations";
import { ThermalIllustration } from "@/components/illustrations/ServiceIllustrations";

/** Renders a project visual (concept illustration, diagram or render). */
export function ProjectVisual({ name, sizes = "(min-width: 1024px) 50vw, 100vw" }: { name: VisualKey; sizes?: string }) {
  switch (name) {
    case "designer-robot":
      return <DesignerRobotConcept />;
    case "delivery":
      return <DeliveryConcept />;
    case "simulation":
      return (
        <div className="grid h-full place-items-center p-6">
          <ThermalIllustration />
        </div>
      );
    case "robot-render":
      return <Image src="/images/robot-real.png" alt="Illustrative render of an articulated robotic mechanism" fill sizes={sizes} className="object-contain" />;
  }
}
