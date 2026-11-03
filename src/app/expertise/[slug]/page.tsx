import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { expertise, getExpertise } from "@/content/expertise";
import { ServicePage } from "@/components/service/ServicePage";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return expertise.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/expertise/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getExpertise(slug);
  if (!service) return {};
  return pageMetadata({ title: service.seoTitle, description: service.seoDescription, path: `/expertise/${slug}` });
}

export default async function ExpertiseDetailPage({ params }: PageProps<"/expertise/[slug]">) {
  const { slug } = await params;
  const service = getExpertise(slug);
  if (!service) notFound();
  return <ServicePage service={service} />;
}
