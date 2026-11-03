import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { engineeringServices } from "@/content/home";

export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="section-y border-t border-line bg-white">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="05">Work with us</SectionLabel>
            <AnimatedHeading
              id="services-title"
              text="Your Challenge. Our Engineering Expertise."
              className="mt-6 text-h2 font-semibold"
            />
          </div>
          <Reveal className="lg:col-span-5">
            <p className="text-lead text-gray">
              Synthea provides engineering services to companies, entrepreneurs, research institutions and industrial
              partners — from a focused study to a complete development programme.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {engineeringServices.map((s, i) => (
            <li
              key={s.title}
              className="group relative border-b border-line sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r"
            >
              <Reveal delay={(i % 3) * 0.06} className="flex h-full flex-col p-6 sm:p-8">
                <span aria-hidden className="absolute left-0 top-0 h-0.5 w-0 bg-red transition-all duration-700 ease-[var(--ease-precise)] group-hover:w-full" />
                <span className="font-mono text-xs tracking-[0.14em] text-gray">{s.index}</span>
                <h3 className="mt-6 text-h3 font-medium">{s.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-gray">{s.text}</p>
                <Link
                  href={`/contact?category=${s.category}#inquiry`}
                  className="mt-8 inline-flex min-h-11 items-center gap-2 self-start text-sm font-medium text-ink hover:text-red"
                  aria-label={`Request a consultation — ${s.title}`}
                >
                  Request a Consultation
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
