import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { DesignerRobotConcept } from "@/components/illustrations/ConceptIllustrations";

export const designerRobotFeatures = [
  {
    title: "Precision robotic movement",
    text: "A motion architecture engineered for accurate, repeatable positioning over the working surface.",
  },
  {
    title: "Digital design workflows",
    text: "Patterns and shapes created digitally are converted into motion and dosing instructions.",
  },
  {
    title: "Controlled deposition",
    text: "Dosing designed around materials with different flow behaviour, for consistent results.",
  },
  {
    title: "Prototype development",
    text: "Iterative prototypes used to evaluate mechanics, control and usability.",
  },
  {
    title: "Creative food manufacturing",
    text: "A potential application area: reproducible decoration and shaped deposits in food production.",
  },
];

export function TechnologySpotlight() {
  return (
    <section aria-labelledby="spotlight-title" className="section-y overflow-hidden bg-white">
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionLabel index="04">Developing technology</SectionLabel>
            <AnimatedHeading id="spotlight-title" text="Innovation Made Tangible." className="mt-6 text-h2 font-semibold" />
            <Reveal>
              <p className="mt-8 text-sm font-medium uppercase tracking-[0.16em]">Designer Robot</p>
              <p className="mt-3 text-lead text-gray">
                An advanced robotic platform being developed for precision food design, controlled deposition, and
                digital-to-physical manufacturing workflows.
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-gray">
                <span aria-hidden className="size-1.5 rounded-full bg-red" /> In development · Not commercially available
              </p>
              <div className="mt-10">
                <ButtonLink href="/technologies" magnetic>
                  Explore Our Technologies
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <figure className="relative overflow-hidden rounded-3xl border border-line bg-surface">
                <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
                <div className="relative aspect-[640/520] p-4 sm:p-8">
                  <DesignerRobotConcept />
                </div>
                <figcaption className="relative border-t border-line bg-white px-6 py-4 text-sm text-gray">
                  Concept illustration — not a photograph of the prototype.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {designerRobotFeatures.map((f, i) => (
            <li key={f.title} className="bg-white p-6">
              <Reveal delay={i * 0.06}>
                <span className="font-mono text-xs text-red">0{i + 1}</span>
                <h3 className="mt-3 font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray">{f.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
