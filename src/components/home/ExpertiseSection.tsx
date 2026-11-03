import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "./ServiceCard";
import { expertise } from "@/content/expertise";

export function ExpertiseSection({ label = true }: { label?: boolean }) {
  return (
    <section aria-labelledby="expertise-title" className="section-y bg-surface">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            {label && <SectionLabel index="02">What we do</SectionLabel>}
            <AnimatedHeading
              id="expertise-title"
              text="Advanced Engineering. Practical Solutions."
              className="mt-6 text-h2 font-semibold"
            />
          </div>
          <Reveal className="lg:col-span-5">
            <p className="text-lead text-gray">
              Four connected disciplines — applied to client projects and to Synthea&apos;s own technology programmes.
            </p>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {expertise.map((e, i) => (
            <li key={e.slug}>
              <Reveal delay={i * 0.08} className="h-full">
                <ServiceCard
                  index={`0${i + 1}`}
                  title={e.cardTitle}
                  summary={e.summary}
                  href={`/expertise/${e.slug}`}
                  illustration={e.illustration}
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
