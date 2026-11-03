import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceIllustration } from "@/components/illustrations/ServiceIllustrations";
import type { IllustrationKey } from "@/content/expertise";

type Props = { index: string; title: string; summary: string; href: string; illustration: IllustrationKey };

export function ServiceCard({ index, title, summary, href, illustration }: Props) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-500 ease-[var(--ease-precise)] hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_30px_60px_-30px_rgba(17,17,17,0.25)]"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-red transition-transform duration-700 ease-[var(--ease-precise)] group-hover:scale-x-100"
      />
      <div className="relative aspect-[16/11] overflow-hidden border-b border-line bg-surface">
        <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-0 p-6 transition-transform duration-700 ease-[var(--ease-precise)] group-hover:scale-[1.03]">
          <ServiceIllustration name={illustration} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <span className="font-mono text-xs tracking-[0.14em] text-red">{index}</span>
        <h3 className="mt-3 text-h3 font-medium">{title}</h3>
        <p className="mt-3 flex-1 leading-relaxed text-gray">{summary}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
          Explore
          <span className="grid size-8 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-red group-hover:bg-red group-hover:text-white">
            <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
          </span>
        </span>
      </div>
    </Link>
  );
}
