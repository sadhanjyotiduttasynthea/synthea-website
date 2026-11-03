import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FeaturedProduct } from "@/components/products/FeaturedProduct";
import { ProductCard } from "@/components/products/ProductCard";
import { rentalProducts } from "@/content/products";

export function ProductsSection({ index = "05" }: { index?: string }) {
  const others = rentalProducts.filter((p) => p.id !== "chocolate-printer");
  return (
    <section aria-labelledby="products-title" className="section-y bg-surface">
      <div className="container-site">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index={index}>Our products</SectionLabel>
            <AnimatedHeading id="products-title" text="Machines You Can Rent." className="mt-6 text-h2 font-semibold" />
          </div>
          <Reveal className="lg:col-span-5">
            <p className="text-lead text-gray">
              Food-tech and service robotics designed by Synthea — available to rent for restaurants, hospitality, retail
              and production, with a minimum rental period of 6 months.
            </p>
          </Reveal>
        </div>
        <div className="mt-14">
          <FeaturedProduct />
        </div>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {others.map((p, i) => (
            <li key={p.id}>
              <Reveal delay={i * 0.06} className="h-full">
                <ProductCard product={p} />
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray">Product pictures are illustrations, not photographs.</p>
          <ButtonLink href="/products" variant="secondary">
            All products
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
