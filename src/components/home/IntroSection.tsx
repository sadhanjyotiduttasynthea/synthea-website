import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { DesignSimulateBuild } from "./DesignSimulateBuild";

export function IntroSection() {
  return (
    <section aria-labelledby="intro-title" className="section-y border-t border-line bg-white">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01">About Synthea</SectionLabel>
          </div>
          <div className="lg:col-span-7">
            <AnimatedHeading id="intro-title" text="Engineering Beyond Boundaries." className="text-h2 font-semibold" />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lead text-gray">
                Synthea integrates robotics, engineering design, and computational simulation to develop technologies that
                address complex real-world challenges.
              </p>
              <Link
                href="/about"
                className="group mt-8 inline-flex min-h-11 items-center gap-2 border-b border-ink pb-1 text-sm font-medium hover:border-red hover:text-red"
              >
                About Synthea
                <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
      <div className="container-site mt-16 lg:mt-24">
        <DesignSimulateBuild />
      </div>
    </section>
  );
}
