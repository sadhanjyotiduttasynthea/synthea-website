import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { ProjectVisual } from "./ProjectVisual";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-ink",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-red" />
      {status}
    </span>
  );
}

export function ProjectGallery() {
  return (
    <ul className="grid gap-6 lg:grid-cols-12">
      {projects.map((p, i) => (
        <li key={p.slug} className={i === 0 ? "lg:col-span-12" : "lg:col-span-6"}>
          <Reveal delay={i * 0.06} className="h-full">
            <Link
              href={`/projects/${p.slug}`}
              className={cn(
                "group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-500 hover:shadow-[0_30px_70px_-35px_rgba(17,17,17,0.3)]",
                i === 0 && "lg:grid lg:grid-cols-12",
              )}
            >
              <div className={cn("relative overflow-hidden bg-surface", i === 0 ? "aspect-[16/11] lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]" : "aspect-[16/11]")}>
                <div aria-hidden className="tech-grid absolute inset-0 opacity-60" />
                <div className="absolute inset-0 p-6 transition-transform duration-[1200ms] ease-[var(--ease-precise)] group-hover:scale-[1.04]">
                  <div className="relative h-full w-full">
                    <ProjectVisual name={p.visuals[0].key} />
                  </div>
                </div>
                <StatusBadge status={p.status} className="absolute left-5 top-5" />
              </div>
              <div className={cn("flex flex-1 flex-col p-6 sm:p-8", i === 0 && "lg:col-span-5 lg:justify-end lg:p-12")}>
                <span className="font-mono text-xs tracking-[0.14em] text-gray">0{i + 1}</span>
                <h3 className={cn("mt-3 font-semibold tracking-tight", i === 0 ? "text-h2" : "text-h3")}>{p.title}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-gray">{p.summary}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium group-hover:text-red">
                  View project <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
