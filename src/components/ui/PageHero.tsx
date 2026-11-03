import { AnimatedHeading } from "./AnimatedHeading";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

type Props = {
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  crumbs?: Crumb[];
  aside?: React.ReactNode;
  children?: React.ReactNode;
};

/** Standard hero for inner pages. */
export function PageHero({ eyebrow, title, intro, crumbs, aside, children }: Props) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-white pt-[var(--header-h)]">
      <div aria-hidden className="tech-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_80%_0%,black_0%,transparent_65%)]" />
      <div className="container-site pb-16 pt-12 lg:pb-24 lg:pt-20">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={aside ? "grid items-end gap-12 lg:grid-cols-12" : undefined}>
          <div className={aside ? "lg:col-span-7" : undefined}>
            <SectionLabel className="mt-10">{eyebrow}</SectionLabel>
            <AnimatedHeading as="h1" immediate text={title} className="mt-6 max-w-5xl text-h1 font-semibold" />
            {intro && (
              <Reveal delay={0.25}>
                <div className="mt-8 max-w-2xl text-lead text-gray">{intro}</div>
              </Reveal>
            )}
            {children}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
