import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { CTASection } from "@/components/home/CTASection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Engineering Projects",
  description:
    "Selected Synthea engineering projects in robotics, mechanical design and simulation — each labelled with its development stage.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Selected Engineering Projects."
        crumbs={[{ label: "Projects", href: "/projects" }]}
        intro={
          <p>
            A transparent view of our work. Every entry states whether it is a prototype, a development project, a concept
            or an illustrative technical showcase.
          </p>
        }
      />
      <section aria-labelledby="project-list-title" className="section-y bg-surface">
        <div className="container-site">
          <h2 id="project-list-title" className="sr-only">
            Project list
          </h2>
          <ProjectGallery />
        </div>
      </section>
      <CTASection />
    </>
  );
}
