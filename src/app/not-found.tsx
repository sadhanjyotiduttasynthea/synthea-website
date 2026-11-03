import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden className="tech-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-site">
        <p className="eyebrow text-red">Error 404</p>
        <h1 className="mt-6 max-w-3xl text-h1 font-semibold">This page is outside our workspace.</h1>
        <p className="mt-6 max-w-xl text-lead text-gray">The page you are looking for does not exist or has moved.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/contact" variant="secondary" icon="up-right">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
