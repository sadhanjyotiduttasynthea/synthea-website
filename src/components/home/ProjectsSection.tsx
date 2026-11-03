import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProjectGallery } from "@/components/projects/ProjectGallery";

export function ProjectsSection() {
  return (
    <section aria-labelledby="projects-title" className="section-y bg-surface">
      <div className="container-site">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="06">Projects</SectionLabel>
            <AnimatedHeading id="projects-title" text="Selected Engineering Projects." className="mt-6 max-w-3xl text-h2 font-semibold" />
          </div>
          <ButtonLink href="/projects" variant="secondary">
            All projects
          </ButtonLink>
        </div>
        <p className="mt-6 max-w-2xl text-gray">
          Each entry states its development stage — prototype, development project, concept or illustrative showcase.
        </p>
        <div className="mt-12">
          <ProjectGallery />
        </div>
      </div>
    </section>
  );
}
