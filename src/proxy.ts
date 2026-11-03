import { NextResponse, type NextRequest } from "next/server";
import { expertise } from "@/content/expertise";
import { projects } from "@/content/projects";

/**
 * Return a real HTTP 404 for unknown expertise/project slugs. Pages under
 * Cache Components stream their shell first, so a notFound() thrown while
 * rendering would otherwise produce a "soft" 404 (status 200 + noindex).
 */
const known = {
  expertise: new Set(expertise.map((e) => e.slug as string)),
  projects: new Set(projects.map((p) => p.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug, ...rest] = request.nextUrl.pathname.split("/");
  const set = known[section as keyof typeof known];
  if (set && slug && (!set.has(slug) || rest.length > 0)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/expertise/:slug+", "/projects/:slug+"],
};
