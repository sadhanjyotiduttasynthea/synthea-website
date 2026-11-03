import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { engineeringServices } from "@/content/home";
import { projectLink } from "@/lib/contact-schema";

export function ServicesSection({ index = "06" }: { index?: string }) {
  return (
    <section aria-labelledby="services-title" className="section-y border-t border-line bg-white">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index={index}>Work with us</SectionLabel>
            <AnimatedHeading
              id="services-title"
              text="Your Challenge. Our Engineering Expertise."
              className="mt-6 text-h2 font-semibold"
            />
          </div>
          <Reveal className="lg:col-span-5">
            <p className="text-lead text-gray">
              Synthea designs machines and provides engineering services to companies, entrepreneurs, research
              institutions and industrial partners — from a focused study to a complete development programme.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {engineeringServices.map((s, i) => (
            <li key={s.title} className="group relative bg-white">
              <Reveal delay={(i % 4) * 0.05} className="flex h-full flex-col p-6 sm:p-7">
                <span aria-hidden className="absolute left-0 top-0 h-0.5 w-0 bg-red transition-all duration-700 ease-[var(--ease-precise)] group-hover:w-full" />
                <span className="font-mono text-xs tracking-[0.14em] text-gray">{s.index}</span>
                <h3 className="mt-5 text-xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray">{s.text}</p>
                <Link
                  href={projectLink(s.type)}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-ink hover:text-red"
                  aria-label={`${s.cta} — ${s.title}`}
                >
                  {s.cta}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
