import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/home/CTASection";
import { DesignSimulateBuild } from "@/components/home/DesignSimulateBuild";
import { Supporters } from "@/components/home/Supporters";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Synthea — Science-Led, Engineering-Driven",
  description:
    "Synthea Advanced Technologies translates advanced engineering and scientific knowledge into practical technology.",
  path: "/about",
});

const principles = [
  {
    title: "Science first",
    text: "We start from the physics of the problem. Understanding heat, flow, motion and structure leads to better engineering decisions.",
  },
  {
    title: "Engineering that gets built",
    text: "Designs are only valuable when they can be manufactured, assembled, operated and maintained. We design with that in mind.",
  },
  {
    title: "Simulation with integrity",
    text: "Models are tools for insight. We state assumptions clearly and validate against measurements whenever possible.",
  },
  {
    title: "Honest communication",
    text: "We describe our work as it is — concept, prototype or validated result — and we never overstate capabilities.",
  },
];


export default function AboutPage() {

  return (
    <>
      <PageHero
        eyebrow="About Synthea"
        title="Science-Led. Engineering-Driven."
        crumbs={[{ label: "About", href: "/about" }]}
        intro={
          <p>
            Synthea Advanced Technologies exists to translate advanced engineering and scientific knowledge into practical
            technological solutions — robotic systems, mechanical designs and simulation-driven technologies that work in
            the real world.
          </p>
        }
      />

      {/* Mission */}
      <section aria-labelledby="mission-title" className="section-y bg-night text-white dark-surface">
        <div className="container-site">
          <SectionLabel tone="dark" index="01">
            Mission
          </SectionLabel>
          <h2 id="mission-title" className="sr-only">
            Our mission
          </h2>
          <Reveal>
            <blockquote className="mt-10 max-w-5xl text-[clamp(1.75rem,1.1rem+2.6vw,3.5rem)] font-medium leading-[1.12] tracking-[-0.03em]">
              <span className="text-red">“</span>To develop intelligent engineering technologies that make advanced robotics,
              simulation, and automation more accessible and impactful.<span className="text-red">”</span>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* What we are */}
      <section aria-labelledby="who-title" className="section-y bg-white">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="02">Who we are</SectionLabel>
            <AnimatedHeading id="who-title" text="A deep-tech engineering company." className="mt-6 text-h2 font-semibold" />
          </div>
          <Reveal className="space-y-6 text-lg leading-relaxed text-gray lg:col-span-7">
            <p>
              Synthea combines scientific expertise, engineering design, robotics, computational modeling and prototype
              development to solve practical technological challenges.
            </p>
            <p>
              We work in three complementary ways. We develop our own technologies and machines — such as the Chocolate 3D
              Food Printer and the Designer Robot — we rent our machines to businesses and venues, and we provide engineering
              and machine design services to companies, entrepreneurs, research institutions and industrial partners.
            </p>
            <p>
              Food robotics is one application of our work, not its boundary. The same methods apply to industrial
              equipment, automation, laboratory systems and research platforms.
            </p>
          </Reveal>
        </div>
        <div className="container-site mt-20">
          <DesignSimulateBuild />
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles-title" className="section-y bg-white">
        <div className="container-site">
          <SectionLabel index="03">How we work</SectionLabel>
          <AnimatedHeading id="principles-title" text="Principles we engineer by." className="mt-6 text-h2 font-semibold" />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li key={p.title} className="bg-white p-7">
                <Reveal delay={i * 0.06}>
                  <span className="font-mono text-xs text-red">0{i + 1}</span>
                  <h3 className="mt-4 text-h3 font-medium">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray">{p.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Supporters tone="surface" />

      <CTASection />
    </>
  );
}
