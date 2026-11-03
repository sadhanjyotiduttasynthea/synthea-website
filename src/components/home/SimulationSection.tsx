import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { SimulationTabs } from "@/components/simulation/SimulationTabs";

export function SimulationSection() {
  return (
    <section aria-labelledby="simulation-title" className="dark-surface section-y relative isolate overflow-hidden bg-night text-white">
      <div aria-hidden className="tech-grid-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel tone="dark">Advanced simulation</SectionLabel>
            <AnimatedHeading id="simulation-title" text="Predict. Optimize. Engineer." className="mt-6 text-h2 font-semibold" />
          </div>
          <Reveal className="lg:col-span-5">
            <p className="text-lead text-metal">
              Computational simulation helps us explore complex physical behavior, improve engineering decisions, and
              evaluate designs before physical production.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 lg:mt-20">
          <SimulationTabs />
        </div>
      </div>
    </section>
  );
}
