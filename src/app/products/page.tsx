import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FeaturedProduct } from "@/components/products/FeaturedProduct";
import { ProductCard } from "@/components/products/ProductCard";
import { CTASection } from "@/components/home/CTASection";
import { rentalProducts } from "@/content/products";
import { projectLink } from "@/lib/contact-schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Products to Rent — Chocolate 3D Printer, Ice-Cream & Delivery Robots",
  description:
    "Rent Synthea machines: chocolate 3D food printer, robotic ice-cream delivery machine, cookie automation machine and delivery robots for restaurants, cruise ships, hotels and events.",
  path: "/products",
});

const steps = [
  { title: "Tell us your need", text: "Choose a product, a rental period (minimum 6 months) and your venue in the request form." },
  { title: "We confirm availability", text: "You receive a reply with availability, conditions and a quote." },
  { title: "Delivery & setup", text: "We agree on delivery, installation and support for your event or site." },
];

export default function ProductsPage() {
  const others = rentalProducts.filter((p) => p.id !== "chocolate-printer");
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Machines You Can Rent."
        crumbs={[{ label: "Products", href: "/products" }]}
        intro={
          <p>
            Synthea designs food-tech and service robotics. Rent our machines for restaurants, hospitality, cruise ships,
            retail and production — from 6 months — or ask us to design a machine for you.
          </p>
        }
      >
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={projectLink("rent")} magnetic>
            Request a rental
          </ButtonLink>
          <ButtonLink href={projectLink("engineering-design")} variant="secondary" icon="up-right">
            Design a machine with us
          </ButtonLink>
        </div>
      </PageHero>

      <section aria-labelledby="featured-title" className="section-y bg-surface">
        <div className="container-site">
          <h2 id="featured-title" className="sr-only">
            Featured product
          </h2>
          <FeaturedProduct />
          <h2 className="sr-only">More products</h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {others.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray">Product pictures are illustrations, not photographs.</p>
        </div>
      </section>

      <section aria-labelledby="rent-title" className="section-y bg-white">
        <div className="container-site">
          <SectionLabel index="01">How renting works</SectionLabel>
          <AnimatedHeading id="rent-title" text="Simple, from request to setup." className="mt-6 max-w-3xl text-h2 font-semibold" />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="bg-white p-8">
                <Reveal delay={i * 0.06}>
                  <span className="font-mono text-xs text-red">0{i + 1}</span>
                  <h3 className="mt-4 text-h3 font-medium">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CTASection
        title="Need a different machine?"
        text="We design custom machines too — from concept and 3D CAD to a working prototype."
        primary={{ label: "Get engineering design help", href: projectLink("engineering-design") }}
        secondary={{ label: "Request a rental", href: projectLink("rent") }}
      />
    </>
  );
}
