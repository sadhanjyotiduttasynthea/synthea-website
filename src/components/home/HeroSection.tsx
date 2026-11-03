import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVisual } from "@/components/three/HeroVisual";
import { HeroBackdrop } from "./HeroBackdrop";
import { site } from "@/content/site";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-white pt-[var(--header-h)]">
      <HeroBackdrop />
      <div className="container-site grid min-h-[calc(100svh-var(--header-h))] items-center gap-8 py-10 lg:grid-cols-12 lg:gap-6 lg:py-0">
        <div className="relative z-10 lg:col-span-6 xl:col-span-6">
          <Reveal y={10}>
            <p className="eyebrow flex items-center gap-3 text-gray">
              <span aria-hidden className="h-px w-8 bg-red" />
              {site.name}
            </p>
          </Reveal>
          <AnimatedHeading
            as="h1"
            id="hero-title"
            immediate
            delay={0.1}
            text={site.tagline}
            className="mt-7 text-[length:var(--text-display)] font-medium leading-[1.04] tracking-[-0.03em]"
          />
          <Reveal delay={0.45} y={12}>
            <p className="mt-7 font-mono text-sm uppercase tracking-[0.18em] text-ink">
              Robotics<span className="text-red">.</span> Design<span className="text-red">.</span> Simulation
              <span className="text-red">.</span>
            </p>
            <p className="mt-5 max-w-xl text-lead text-gray">
              We engineer intelligent robotic systems, advanced mechanical solutions, and simulation-driven technologies
              that turn ambitious ideas into reality.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/expertise" magnetic>
                Explore Our Expertise
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" icon="up-right">
                Start a Project
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <div className="relative h-[24rem] sm:h-[30rem] lg:col-span-6 lg:h-[min(44rem,calc(100svh-var(--header-h)-2rem))] xl:col-span-6">
          <div className="absolute inset-0 overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-surface to-white lg:-mr-[max(0px,calc((100vw-88rem)/2))] lg:rounded-r-none">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
