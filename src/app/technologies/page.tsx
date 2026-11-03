import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DesignerRobotConcept } from "@/components/illustrations/ConceptIllustrations";
import { designerRobotFeatures } from "@/components/home/TechnologySpotlight";
import { SimulationSection } from "@/components/home/SimulationSection";
import { CTASection } from "@/components/home/CTASection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Technologies — Designer Robot & Engineering Platforms",
  description:
    "Synthea develops its own technologies, including the Designer Robot — a robotic platform in development for precision food design and controlled deposition.",
  path: "/technologies",
});

const foundations = [
  {
    title: "Robotic motion platforms",
    text: "Mechanisms and motion architectures that we reuse and adapt across robotic developments.",
    image: "/images/robot-cad.png",
  },
  {
    title: "Simulation-driven development",
    text: "Thermal, structural and flow models used early in development to guide design choices.",
    image: "/images/robot-analysis.png",
  },
  {
    title: "Digital-to-physical workflows",
    text: "Software that converts digital designs into machine instructions for automated manufacturing.",
    image: "/images/robot-real.png",
  },
];

export default function TechnologiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Technologies"
        title="Our own technology programmes."
        crumbs={[{ label: "Technologies", href: "/technologies" }]}
        intro={
          <p>
            Alongside client services, Synthea develops proprietary technologies. Building our own systems keeps our
            engineering grounded in real hardware, real constraints and real testing.
          </p>
        }
      />

      <section aria-labelledby="dr-title" className="section-y bg-white">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01">In development</SectionLabel>
            <AnimatedHeading id="dr-title" text="Designer Robot" className="mt-6 text-h1 font-semibold" />
            <Reveal>
              <p className="mt-8 text-lead text-gray">
                An advanced robotic platform being developed for precision food design, controlled deposition, and
                digital-to-physical manufacturing workflows.
              </p>
              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm">
                {[
                  ["Status", "Development project"],
                  ["Availability", "Not commercially available"],
                  ["Disciplines", "Robotics · Design · Control"],
                  ["Application focus", "Creative food manufacturing"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white p-5">
                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-gray">{k}</dt>
                    <dd className="mt-2 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/projects/designer-robot">Project details</ButtonLink>
                <ButtonLink href="/contact?category=research#inquiry" variant="secondary" icon="up-right">
                  Discuss collaboration
                </ButtonLink>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <figure className="relative overflow-hidden rounded-3xl border border-line bg-surface">
              <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
              <div className="relative aspect-[640/520] p-4 sm:p-8">
                <DesignerRobotConcept />
              </div>
              <figcaption className="relative border-t border-line bg-white px-6 py-4 text-sm text-gray">
                Concept illustration. Photographs of the prototype will be published once approved.
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="container-site mt-20">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {designerRobotFeatures.map((f, i) => (
              <li key={f.title} className="bg-white p-6">
                <span className="font-mono text-xs text-red">0{i + 1}</span>
                <h3 className="mt-3 font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="foundations-title" className="section-y bg-surface">
        <div className="container-site">
          <SectionLabel index="02">Technology foundations</SectionLabel>
          <AnimatedHeading
            id="foundations-title"
            text="Capabilities we build on."
            className="mt-6 max-w-3xl text-h2 font-semibold"
          />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {foundations.map((f, i) => (
              <li key={f.title} className="overflow-hidden rounded-2xl border border-line bg-white">
                <Reveal delay={i * 0.08}>
                  <div className="relative aspect-[4/3] border-b border-line bg-gradient-to-b from-surface to-white">
                    <Image src={f.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-contain p-4" />
                  </div>
                  <div className="p-7">
                    <h3 className="text-h3 font-medium">{f.title}</h3>
                    <p className="mt-3 leading-relaxed text-gray">{f.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray">Images are renders of an illustrative robotic model.</p>
        </div>
      </section>

      <SimulationSection />
      <CTASection />
    </>
  );
}
