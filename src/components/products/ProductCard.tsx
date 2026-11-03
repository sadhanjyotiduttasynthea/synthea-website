import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/content/products";
import { ProductIllustrationView } from "@/components/illustrations/ProductIllustrations";
import { projectLink } from "@/lib/contact-schema";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export function ProductVisual({
  product,
  sizes = "(min-width: 1024px) 40vw, 100vw",
}: {
  product: Product;
  sizes?: string;
}) {
  return (
    <figure className="relative h-full overflow-hidden bg-surface">
      <div aria-hidden className="tech-grid absolute inset-0 opacity-60" />
      <div className="relative h-full p-5">
        {product.photo ? (
          <Image
            src={product.photo.src}
            alt={product.photo.alt}
            fill
            sizes={sizes}
            className="object-contain"
          />
        ) : (
          <ProductIllustrationView name={product.illustration} />
        )}
      </div>
      {!product.photo && (
        <figcaption className="sr-only">
          Illustration — not a photograph of the product.
        </figcaption>
      )}
    </figure>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <SpotlightCard className="rounded-3xl" tilt={3}>
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-500 hover:shadow-[0_30px_70px_-35px_rgba(17,17,17,0.3)]">
        <div className="aspect-[4/3] border-b border-line">
          <ProductVisual
            product={product}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-h3 font-medium">{product.name}</h3>
          <p className="mt-2 text-sm font-medium text-red">{product.tagline}</p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-gray">
            {product.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {product.uses.map((u) => (
              <Link
                key={u.rent}
                href={projectLink("rent", u.rent)}
                aria-label={
                  product.uses.length > 1
                    ? `Rent a delivery robot for ${u.label.toLowerCase()}`
                    : `Rent the ${product.name}`
                }
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium transition-colors hover:border-red hover:bg-red hover:text-white"
              >
                {product.uses.length > 1 ? u.label : "Rent this"}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
