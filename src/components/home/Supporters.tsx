import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * "Supported by" strip. Shows each organisation's official logo when a file
 * has been provided (site.supporters[].logo); otherwise a neutral wordmark in
 * the site's typography — never an imitation of the organisation's logo.
 */
export function Supporters({ tone = "light", className }: { tone?: "light" | "surface"; className?: string }) {
  return (
    <section
      aria-labelledby="supporters-title"
      className={cn("border-y border-line", tone === "surface" ? "bg-surface" : "bg-white", className)}
    >
      <div className="container-site flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:py-12">
        <h2 id="supporters-title" className="eyebrow flex items-center gap-3 text-gray">
          <span aria-hidden className="h-px w-8 bg-red" />
          Supported by
        </h2>
        <ul className="flex flex-wrap items-center gap-x-12 gap-y-6">
          {site.supporters.map((s) => (
            <li key={s.name}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-12 items-center opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
                aria-label={`${s.name} (opens in a new tab)`}
              >
                {s.logo ? (
                  <Image src={s.logo} alt={s.name} width={180} height={56} className="h-12 w-auto object-contain" />
                ) : (
                  <span className="text-2xl font-semibold tracking-tight text-ink group-hover:text-red">{s.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
