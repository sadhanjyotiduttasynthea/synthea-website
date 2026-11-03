import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { expertise } from "@/content/expertise";
import { projects } from "@/content/projects";

/** Generated once at build time (static export). */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/expertise", priority: 0.9 },
    ...expertise.map((e) => ({ path: `/expertise/${e.slug}`, priority: 0.9 })),
    { path: "/technologies", priority: 0.8 },
    { path: "/projects", priority: 0.8 },
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, priority: 0.6 })),
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.2 },
    { path: "/legal", priority: 0.2 },
  ];
  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "/" : `${r.path}/`}`,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
