import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/content/projects";
import { projects } from "@/content/projects";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectVisual } from "./ProjectVisual";
import { StatusBadge } from "./ProjectGallery";
import { CTASection } from "@/components/home/CTASection";

export function ProjectDetail({ project }: { project: Project }) {
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <article>
      <PageHero
        eyebrow={`Project ${String(index + 1).padStart(2, "0")}`}
        title={project.title}
        intro={<p>{project.summary}</p>}
        crumbs={[
          { label: "Projects", href: "/projects" },
          { label: project.title, href: `/projects/${project.slug}` },
        ]}
      >
        <StatusBadge status={project.status} className="mt-8" />
      </PageHero>

      <section aria-label="Project visuals" className="bg-surface py-12 lg:py-16">
        <div className="container-site grid gap-6 lg:grid-cols-2">
          {project.visuals.map((v) => (
            <figure key={v.key} className={project.visuals.length === 1 ? "lg:col-span-2" : undefined}>
              <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-line bg-white">
                <div aria-hidden className="tech-grid absolute inset-0 opacity-60" />
                <div className="absolute inset-0 p-6 sm:p-10">
                  <div className="relative h-full w-full">
                    <ProjectVisual name={v.key} />
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 text-sm text-gray">{v.caption}</figcaption>
            </figure>
          ))}
          {project.images.map((img) => (
            <figure key={img.src}>
              <Image src={img.src} alt={img.alt} width={img.width} height={img.height} className="rounded-3xl border border-line" />
            </figure>
          ))}
        </div>
      </section>

      <section className="section-y bg-white">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <dl className="sticky top-28 divide-y divide-line border-y border-line">
              <div className="py-5">
                <dt className="eyebrow text-gray">Development stage</dt>
                <dd className="mt-2 leading-relaxed">{project.stage}</dd>
              </div>
              <div className="py-5">
                <dt className="eyebrow text-gray">Engineering disciplines</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {project.disciplines.map((d) => (
                    <span key={d} className="rounded-full border border-line px-3 py-1 text-sm">
                      {d}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <div className="space-y-16 lg:col-span-8">
            <Reveal>
              <SectionLabel index="01">Challenge</SectionLabel>
              <p className="mt-6 text-xl leading-relaxed tracking-tight sm:text-2xl">{project.challenge}</p>
            </Reveal>
            <Reveal>
              <SectionLabel index="02">Approach</SectionLabel>
              <ol className="mt-6 border-t border-line">
                {project.approach.map((a, i) => (
                  <li key={a} className="flex gap-6 border-b border-line py-5">
                    <span className="font-mono text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                    <span className="leading-relaxed">{a}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal>
              <SectionLabel index="03">Verified outcomes</SectionLabel>
              {project.outcomes.length > 0 ? (
                <ul className="mt-6 space-y-3">
                  {project.outcomes.map((o) => (
                    <li key={o} className="flex gap-3">
                      <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-red" />
                      {o}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-6 text-gray">
                  No verified outcomes have been published for this project yet. Results will be added here once they have
                  been tested and approved for publication.
                </p>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <nav aria-label="Project navigation" className="border-t border-line bg-white">
        <div className="container-site flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-red">
            <ArrowLeft aria-hidden className="size-4" /> All projects
          </Link>
          <Link href={`/projects/${next.slug}`} className="group inline-flex min-h-11 items-center gap-3 text-right">
            <span className="eyebrow text-gray">Next</span>
            <span className="text-xl font-medium tracking-tight group-hover:text-red">{next.title}</span>
            <ArrowUpRight aria-hidden className="size-5 text-red" />
          </Link>
        </div>
      </nav>

      <CTASection title="Working on something similar?" />
    </article>
  );
}
