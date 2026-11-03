import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Expertise } from "@/content/expertise";
import { expertise } from "@/content/expertise";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ServiceIllustration } from "@/components/illustrations/ServiceIllustrations";
import { CTASection } from "@/components/home/CTASection";
import { FAQ } from "./FAQ";
import { projectLink } from "@/lib/contact-schema";

export function ServicePage({ service }: { service: Expertise }) {
  const others = expertise.filter((e) => e.slug !== service.slug);
  const consult = projectLink(service.contactType);

  return (
    <>
      <PageHero
        eyebrow={service.title}
        title={service.headline}
        intro={<p>{service.intro}</p>}
        crumbs={[
          { label: "Expertise", href: "/expertise" },
          { label: service.title, href: `/expertise/${service.slug}` },
        ]}
        aside={
          <Reveal delay={0.2}>
            <div className="relative aspect-[16/11] overflow-hidden rounded-3xl border border-line bg-surface">
              <div aria-hidden className="tech-grid absolute inset-0 opacity-70" />
              <div className="group absolute inset-0 p-8">
                <ServiceIllustration name={service.illustration} />
              </div>
            </div>
          </Reveal>
        }
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={consult} magnetic>
            Request a Consultation
          </ButtonLink>
          <ButtonLink href="/projects" variant="secondary">
            See projects
          </ButtonLink>
        </div>
      </PageHero>

      {/* Capabilities */}
      <section aria-labelledby="capabilities-title" className="section-y bg-white">
        <div className="container-site">
          <SectionLabel index="01">Capabilities</SectionLabel>
          <AnimatedHeading id="capabilities-title" text="What we engineer." className="mt-6 text-h2 font-semibold" />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((c, i) => (
              <li key={c.title} className="bg-white p-7 lg:p-9">
                <Reveal delay={(i % 3) * 0.06}>
                  <span className="font-mono text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-4 text-h3 font-medium">{c.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray">{c.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Challenges + applications */}
      <section aria-labelledby="challenges-title" className="section-y bg-surface">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="02">Typical challenges</SectionLabel>
            <AnimatedHeading id="challenges-title" text="Problems we are asked to solve." className="mt-6 text-h2 font-semibold" />
          </div>
          <ul className="space-y-0 border-t border-line lg:col-span-7">
            {service.challenges.map((c, i) => (
              <li key={c} className="flex gap-6 border-b border-line py-6">
                <span className="font-mono text-xs text-gray">{String(i + 1).padStart(2, "0")}</span>
                <p className="text-lg leading-snug">{c}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="container-site mt-24">
          <SectionLabel index="03">Example applications</SectionLabel>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {service.applications.map((a, i) => (
              <li key={a.title} className="rounded-2xl border border-line bg-white p-7">
                <Reveal delay={i * 0.06}>
                  <span aria-hidden className="block h-px w-8 bg-red" />
                  <h3 className="mt-6 font-medium">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray">{a.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray">Examples describe typical application areas, not completed client projects.</p>
        </div>
      </section>

      {/* Workflow */}
      <section aria-labelledby="workflow-title" className="section-y bg-white">
        <div className="container-site">
          <SectionLabel index="04">Engineering workflow</SectionLabel>
          <AnimatedHeading id="workflow-title" text="A clear path from question to result." className="mt-6 max-w-3xl text-h2 font-semibold" />
          <ol className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
            <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-line md:block" />
            {service.workflow.map((w, i) => (
              <li key={w.title} className="relative">
                <Reveal delay={i * 0.08}>
                  <span aria-hidden className="relative z-10 block size-[15px] rounded-full border-2 border-red bg-white" />
                  <p className="mt-6 font-mono text-xs text-gray">STEP {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-2 text-lg font-medium">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray">{w.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="section-y border-t border-line bg-white">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="05">FAQ</SectionLabel>
            <h2 id="faq-title" className="mt-6 text-h2 font-semibold">
              Questions, answered.
            </h2>
            <ButtonLink href={consult} variant="secondary" className="mt-8">
              Ask us directly
            </ButtonLink>
          </div>
          <div className="lg:col-span-8">
            <FAQ items={service.faqs} />
          </div>
        </div>
      </section>

      {/* Other expertise */}
      <section aria-labelledby="other-title" className="border-t border-line bg-surface py-16">
        <div className="container-site">
          <h2 id="other-title" className="eyebrow text-gray">
            Related expertise
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/expertise/${o.slug}`}
                  className="group flex min-h-20 items-center justify-between rounded-2xl border border-line bg-white px-6 py-5 transition-colors hover:border-ink"
                >
                  <span className="text-lg font-medium">{o.title}</span>
                  <ArrowUpRight aria-hidden className="size-5 text-gray transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-red" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection
        title="Discuss your project."
        text={`Tell us about your ${service.title.toLowerCase()} challenge — we will reply with the next steps.`}
        primary={{ label: "Request a Consultation", href: consult }}
      />
    </>
  );
}
