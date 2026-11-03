import { ButtonLink } from "@/components/ui/ButtonLink";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";

type Props = {
  title?: string;
  text?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function CTASection({
  title = "Have an Engineering Challenge?",
  text = "Let's explore what we can design, simulate, and build together.",
  primary = { label: "Start Your Project", href: "/contact" },
  secondary = { label: "Contact Synthea", href: "/contact#direct" },
}: Props) {
  return (
    <section aria-labelledby="cta-title" className="dark-surface relative isolate overflow-hidden bg-night text-white">
      <div aria-hidden className="tech-grid-dark animate-grid-drift absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,#101114_72%)]"
      />
      <svg aria-hidden viewBox="0 0 800 800" className="animate-spin-slow absolute -right-40 -top-40 -z-10 size-[44rem] opacity-30">
        <circle cx="400" cy="400" r="380" fill="none" stroke="#AEB6C2" strokeOpacity="0.25" strokeDasharray="2 10" />
        <circle cx="400" cy="400" r="300" fill="none" stroke="#AEB6C2" strokeOpacity="0.2" />
        <path d="M400 20 A380 380 0 0 1 780 400" fill="none" stroke="#D71932" strokeWidth="1.5" />
      </svg>
      <div className="container-site section-y relative">
        <p className="eyebrow flex items-center gap-3 text-metal">
          <span aria-hidden className="h-px w-8 bg-red" /> Work with Synthea
        </p>
        <AnimatedHeading
          as="h2"
          id="cta-title"
          text={title}
          className="mt-6 max-w-4xl text-[length:var(--text-display)] font-semibold leading-[0.98] tracking-[-0.045em]"
        />
        <p className="mt-8 max-w-xl text-lead text-metal">
          {text}
        </p>
        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink href={primary.href} icon="up-right" magnetic>
            {primary.label}
          </ButtonLink>
          <ButtonLink href={secondary.href} variant="light" icon="arrow">
            {secondary.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
