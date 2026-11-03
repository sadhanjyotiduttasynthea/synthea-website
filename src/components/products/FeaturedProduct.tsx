import { featuredProduct } from "@/content/products";
import { projectLink } from "@/lib/contact-schema";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { ProductVisual } from "./ProductCard";

/** Large presentation of the Chocolate 3D Food Printer. */
export function FeaturedProduct() {
  const p = featuredProduct;
  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-12">
      <div className="aspect-[4/3] border-b border-line lg:col-span-7 lg:aspect-auto lg:min-h-[30rem] lg:border-b-0 lg:border-r">
        <ProductVisual product={p} sizes="(min-width: 1024px) 55vw, 100vw" />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-5 lg:p-12">
        <Reveal>
          <p className="eyebrow text-red">Featured product</p>
          <h3 className="mt-4 text-h2 font-semibold">{p.name}</h3>
          <p className="mt-3 text-lg font-medium">{p.tagline}</p>
          <p className="mt-4 leading-relaxed text-gray">{p.description}</p>
          <ul className="mt-6 space-y-2.5">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-red" />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={projectLink("rent", "chocolate-printer")} magnetic>
              Rent the printer
            </ButtonLink>
            <ButtonLink href={projectLink("other")} variant="secondary" icon="up-right">
              Ask a question
            </ButtonLink>
          </div>
          <p className="mt-6 text-xs text-gray">Illustration — not a photograph of the product.</p>
        </Reveal>
      </div>
    </div>
  );
}
