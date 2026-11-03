import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { site } from "@/content/site";
import { jsonLd, organizationJsonLd } from "@/lib/seo";
import "./globals.css";

/* Self-hosted fonts (bundled at build time, no requests to third-party servers). */
const display = localFont({
  src: "../../node_modules/@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2",
  variable: "--font-display",
  weight: "200 900",
  display: "swap",
});
const body = localFont({
  src: "../../node_modules/@fontsource-variable/sora/files/sora-latin-wght-normal.woff2",
  variable: "--font-body",
  weight: "100 800",
  display: "swap",
});
const mono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-code",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand} — Robotics, Engineering Design & Simulation | France`,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "Robotics Engineering France",
    "Engineering Design Services",
    "Custom Robotics",
    "Mechanical Design",
    "Computational Simulation",
    "Multiphysics Engineering",
    "Industrial Automation",
    "Engineering R&D",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    url: "/",
    title: `${site.brand} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: `${site.brand} — ${site.tagline}`, description: site.description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationJsonLd())} />
        <MotionProvider>
          <ScrollProgress />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
