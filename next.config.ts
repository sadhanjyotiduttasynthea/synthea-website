import type { NextConfig } from "next";

/**
 * Static export: `npm run build` writes a complete static site to `out/`,
 * which is uploaded to Hostinger's public_html (PHP/HTML hosting).
 *
 * Server-side behaviour that Next.js cannot provide in a static export lives
 * in `public/` instead:
 *   - contact form backend  → public/api/contact.php
 *   - security headers, 404 → public/.htaccess
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Hostinger shared hosting has no Next.js image optimizer.
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
