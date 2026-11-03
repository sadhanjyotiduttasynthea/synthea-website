import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { mainNav, site } from "@/content/site";
import { expertise } from "@/content/expertise";

export function SiteFooter() {
  return (
    <footer className="dark-surface border-t border-line-dark bg-night text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-5">
          <Logo tone="light" size="lg" />
          <p className="mt-6 max-w-sm text-2xl font-medium leading-tight tracking-tight">{site.tagline}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-metal">{site.positioning}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block break-all text-sm text-white underline decoration-white/30 underline-offset-4 hover:decoration-red"
          >
            {site.email}
          </a>
          <address className="mt-3 text-sm not-italic leading-relaxed text-metal">
            {site.address.building}
            <br />
            {site.address.street}, {site.address.postalCode} {site.address.city}
            <br />
            {site.address.country}
          </address>
        </div>

        <nav aria-label="Footer — site" className="md:col-span-2">
          <h2 className="eyebrow text-metal">Company</h2>
          <ul className="mt-5 space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-9 items-center text-sm text-white/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer — expertise" className="md:col-span-3">
          <h2 className="eyebrow text-metal">Expertise</h2>
          <ul className="mt-5 space-y-1">
            {expertise.map((e) => (
              <li key={e.slug}>
                <Link href={`/expertise/${e.slug}`} className="inline-flex min-h-9 items-center text-sm text-white/85 hover:text-white">
                  {e.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="inline-flex min-h-9 items-center text-sm text-white/85 hover:text-white">
                Products &amp; rentals
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-2">
          <h2 className="eyebrow text-metal">Start</h2>
          <Link
            href="/contact"
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-red px-5 text-sm font-medium text-white hover:bg-red-dark"
          >
            Start a Project ↗
          </Link>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-site flex flex-col gap-3 py-6 text-xs text-metal sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="inline-flex min-h-9 items-center hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal" className="inline-flex min-h-9 items-center hover:text-white">
                Legal Notice
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/** Year of the last build (static site — rebuilt on every deploy). */
function CopyrightYear() {
  return <>{new Date().getFullYear()}</>;
}
