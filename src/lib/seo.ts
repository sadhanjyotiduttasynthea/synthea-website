import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Set to true to use the title as-is without the brand suffix */
  absoluteTitle?: boolean;
};

/** Consistent per-page metadata: canonical URL, Open Graph and Twitter cards. */
export function pageMetadata({ title, description, path, absoluteTitle }: PageMetaInput): Metadata {
  const url = path === "/" ? "/" : path;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      locale: "en_GB",
      title: absoluteTitle ? title : `${title} | ${site.brand}`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} | ${site.brand}`,
      description,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    alternateName: site.brand,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    slogan: site.tagline,
    description: site.description,
    email: site.email,
    founder: { "@type": "Person", name: site.founder.name, jobTitle: site.founder.role },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.building}, ${site.address.street}`,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: "FR",
    },
    areaServed: "Worldwide",
    knowsAbout: [
      "Robotics engineering",
      "Mechanical engineering design",
      "Computational simulation",
      "Multiphysics engineering",
      "Industrial automation",
      "Machine design",
      "3D food printing",
      "Engineering research and development",
    ],
  };
}

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
