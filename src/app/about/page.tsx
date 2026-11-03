import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CTASection } from "@/components/home/CTASection";
import { DesignSimulateBuild } from "@/components/home/DesignSimulateBuild";
import { site } from "@/content/site";
import { jsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Synthea — Science-Led, Engineering-Driven",
  description:
    "Synthea Advanced Technologies translates advanced engineering and scientific knowledge into practical technology. Founded in France by Dr. Sadhan Jyoti Dutta.",
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

const expertiseAreas = [
  "Thermal processes",
  "Computational simulation",
  "Experimental engineering",
  "Technology development",
];

export default function AboutPage() {
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.founder.name,
    jobTitle: site.founder.role,
    worksFor: { "@id": `${site.url}/#organization` },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Oniris" },
    knowsAbout: expertiseAreas,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(personLd)} />
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
              We work in two complementary ways. We develop our own technologies — such as the Designer Robot — and we
              provide engineering services to companies, entrepreneurs, research institutions and industrial partners.
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

      {/* Founder */}
      <section aria-labelledby="founder-title" className="section-y border-t border-line bg-surface">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="03">Founder</SectionLabel>
            <Reveal>
              <div className="relative mt-8 aspect-[4/5] max-w-sm overflow-hidden rounded-3xl border border-line bg-white">
                <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-gray">Founder &amp; CEO</span>
                  <span aria-hidden className="text-[7rem] font-semibold leading-none tracking-[-0.06em] text-ink">
                    SJD<span className="text-red">.</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:pt-16">
            <AnimatedHeading id="founder-title" text={site.founder.name} className="text-h2 font-semibold" />
            <p className="mt-3 font-mono text-sm uppercase tracking-[0.14em] text-red">{site.founder.role}</p>
            <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-gray">
              <p>
                Dr. Sadhan Jyoti Dutta holds a PhD in Process Engineering from Oniris in France. The doctoral and research
                work spans thermal processes, computational simulation, experimental engineering and technology development.
              </p>
              <p>
                That background — connecting physical experiments with computational models — shapes how Synthea works:
                understand the physics, model it, then design and build with confidence.
              </p>
            </Reveal>
            <ul className="mt-10 flex flex-wrap gap-2">
              {expertiseAreas.map((e) => (
                <li key={e} className="rounded-full border border-line bg-white px-4 py-2 text-sm">
                  {e}
                </li>
              ))}
            </ul>
            <ButtonLink href={`mailto:${site.email}`} variant="secondary" className="mt-10" icon="up-right">
              Contact the founder
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles-title" className="section-y bg-white">
        <div className="container-site">
          <SectionLabel index="04">How we work</SectionLabel>
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

      <CTASection />
    </>
  );
}
