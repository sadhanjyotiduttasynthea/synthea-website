import { Plus } from "lucide-react";
import { jsonLd } from "@/lib/seo";

/** Accessible FAQ built on native <details>, with FAQPage structured data. */
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="border-t border-line">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
      {items.map((f) => (
        <details key={f.q} className="group border-b border-line">
          <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-lg font-medium tracking-tight hover:text-red">
            {f.q}
            <Plus aria-hidden className="size-5 shrink-0 text-red transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-gray">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
