# SYNTHEA — Website

Production website for **Synthea Advanced Technologies** — *Engineering What Comes Next.*
Robotics • Engineering Design • Simulation • Automation.

Live domain: <https://syntheatech.com> (hosted on Hostinger, see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)).

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Cache Components), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with design tokens in `src/app/globals.css` |
| Motion | Motion for React (`motion/react`), respects `prefers-reduced-motion` |
| 3D | Three.js, React Three Fiber, Drei (lazy-loaded, client-only) |
| Forms | React Hook Form + Zod (same schema on client and server) |
| Email | Resend **or** SMTP (Nodemailer), server-side only |
| Icons / fonts | Lucide React, Geist (self-hosted via the `geist` package) |

## Quick start

Requirements: **Node.js 20.9 or newer** (22 LTS recommended) and npm.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open <http://localhost:3000>. Without email credentials the site works fully, and the contact form
shows a clear "temporarily unavailable — email us directly" message instead of pretending to send.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (type-checks and prerenders all pages) |
| `npm start` | Serve the production build (`PORT` env var supported) |
| `npm run lint` | ESLint (Next.js + React Hooks + TypeScript rules) |
| `npm run typecheck` | Generate route types and run `tsc --noEmit` |
| `npm run check` | Lint + typecheck + build — run before every push |

## Project structure

```
src/
  app/                      Routes (App Router)
    page.tsx                Home
    expertise/              /expertise and /expertise/[slug] (4 service pages)
    technologies/  projects/  about/  contact/  privacy/  legal/
    api/contact/route.ts    Contact form backend (validation, spam, rate limit, email)
    sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg  not-found.tsx
  proxy.ts                  Returns real 404s for unknown expertise/project slugs
  components/
    layout/                 SiteHeader, MobileNavigation, SiteFooter
    home/                   Homepage sections (Hero, Process, Services, CTA, …)
    three/                  RobotScene (R3F), HeroVisual, VisualizationModeSelector
    simulation/             SimulationTabs + illustrative field computations
    illustrations/          Lightweight SVG technical illustrations
    service/  projects/  contact/  ui/
  content/                  ALL editable copy: site facts, expertise, projects, home
  lib/                      contact schema, email, rate limit, SEO helpers
  i18n/config.ts            Locale configuration (English now, French-ready)
public/images/              Pre-rendered robot posters (WebGL fallback)
```

## Editing content

All text lives in `src/content/` — no copy is hard-coded in layout components.

- **Company facts & legal details** — `src/content/site.ts`. Fill in the `legal` fields
  (legal form, SIREN/RCS, address, share capital, VAT) before launch; until then `/legal` shows
  "to be completed" for each missing item.
- **Service pages** — `src/content/expertise.ts` (capabilities, challenges, applications, workflow, FAQ).
- **Projects** — `src/content/projects.ts`. Keep `status` honest (Prototype / Development project /
  Concept / Illustrative technical showcase). Only add `outcomes` once verified. Add approved photos
  to `public/images/projects/` and list them in `images`.
- **Homepage sections** — `src/content/home.ts` (services, process steps, simulation tabs).

### Accuracy rules followed in this codebase

- No invented clients, statistics, certifications, timelines or measurements.
- All simulation visuals are labelled *illustrative — not validated simulation data*.
- The Designer Robot is shown as a labelled **concept illustration** and described as in development,
  not commercially available.
- No founder portrait is fabricated; the About page uses a typographic card until a real photo is supplied.

## Contact form

Flow: browser validation (Zod via React Hook Form) → `POST /api/contact` (multipart) → server
re-validates with the same Zod schema → email to `CONTACT_TO_EMAIL`. The success screen appears
**only** after the server confirms delivery to the email provider.

Protections:

- **Spam:** hidden honeypot field + minimum fill time (3 s). Bots get a fake success; nothing is sent.
- **Rate limiting:** 5 submissions per IP per 15 minutes (in-memory; see note below).
- **CSRF:** cross-origin `Origin` headers are rejected.
- **Secrets:** API keys/SMTP passwords are read only on the server; nothing is exposed to the browser.
- **Attachments (optional):** off by default. With `CONTACT_ATTACHMENTS_ENABLED=true`, one file up to
  8 MB (PDF, PNG, JPG, STEP/STP, STL, DXF, ZIP, DOCX, XLSX) is checked by extension, size and file
  signature, held in memory and forwarded with the email — never written to disk. When disabled, the
  form explains how to share documents instead.
- **GDPR:** required consent checkbox linked to `/privacy`; no database storage; no tracking cookies.

The browser reads `GET /api/contact` to know at runtime whether attachments are enabled, so changing
that variable only needs a restart, not a rebuild.

> Rate limiting is in-memory, which is correct for a single Node.js process (Hostinger Node.js apps,
> a VPS with PM2). For multi-instance/serverless hosting, swap `src/lib/rate-limit.ts` for a shared store.

### Email setup — option A: Resend

1. Create an account at <https://resend.com> and add the domain `syntheatech.com`.
2. Add the DNS records Resend shows (SPF/DKIM TXT, optional MX for bounces) in
   **Hostinger hPanel → Domains → syntheatech.com → DNS / Nameservers**. Wait until Resend shows *Verified*.
3. Create an API key with *Sending access* and set:
   `EMAIL_PROVIDER=resend`, `RESEND_API_KEY=…`, `CONTACT_FROM_EMAIL="Synthea Website <noreply@syntheatech.com>"`.

### Email setup — option B: SMTP (e.g. Hostinger Email)

If `sadhan-jyoti.dutta@syntheatech.com` is a Hostinger mailbox, you can send through it directly:

```
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=noreply@syntheatech.com      # or any mailbox you own
SMTP_PASS=<mailbox password>
CONTACT_FROM_EMAIL="Synthea Website <noreply@syntheatech.com>"
```

`CONTACT_FROM_EMAIL` must be the SMTP mailbox (or an alias it may send as).

### Testing the form

1. Locally: run `npm run build && npm start` with credentials in `.env.local`, submit the form at
   `/contact`, and confirm the email arrives with a working *Reply-To*.
2. Validation: submit empty → field errors; invalid email → error; no consent → error.
3. Preselection: open `/contact?category=simulation` → *Simulation & Modeling* is preselected
   (the "Request a Consultation" links use this).
4. Failure path: use a wrong API key → the form shows an error with the direct email address
   and the server logs `[contact] Email delivery failed`.
5. Rate limit: six quick submissions from one IP → the sixth returns HTTP 429.

## Visualizations

- **Hero robot** (`components/three/RobotScene.tsx`): procedurally modelled 6-axis arm with metallic
  physical materials, studio light-formers (no external HDR downloads), slow idle articulation,
  subtle pointer reaction and drag-to-rotate on desktop. Modes: **REAL** (solid), **CAD** (feature-edge
  wireframe from low-poly proxies), **ANALYSIS** (ghosted model, joint axes, reach envelope and the
  tool-tip motion path). Loaded with `next/dynamic` (no SSR), paused when off-screen, simplified on
  phones (no orbit controls, lower resolution), frozen for reduced motion. Pre-rendered posters in
  `public/images/robot-*.png` show while loading and when WebGL is unavailable.
- **Simulation viewer** (`components/simulation`): small canvas computations (diffusion solve,
  beam-bending stress approximation, potential flow with particles). Qualitative and labelled illustrative.

To regenerate the poster images after changing the robot, screenshot the canvas for each mode
(transparent background, reduced motion) and overwrite `public/images/robot-{real,cad,analysis}.png`.

## SEO

Per-page metadata with canonical URLs, Open Graph/Twitter cards, generated OG image, `sitemap.xml`,
`robots.txt`, Organization/Person/Breadcrumb/FAQ JSON-LD, semantic heading order. No social profiles
are listed because none were provided — add them to `organizationJsonLd()` in `src/lib/seo.ts` (`sameAs`).

## Accessibility

Target WCAG 2.2 AA: skip link, visible focus rings, keyboard-operable dropdown, tabs and radio groups
(arrow keys), native `<dialog>` mobile menu (focus trap, Escape, focus return), labelled form fields
with linked error messages, ≥44 px touch targets, reduced-motion support. All pages pass an automated
axe-core scan (WCAG 2.2 AA + best practices). The secondary gray token is `#646B78` (a slightly
darker `#6B7280`) and small red text on dark backgrounds uses `#FF5A6E`, to meet contrast requirements.

## Adding French

See `src/i18n/config.ts`: add `"fr"`, create French content modules mirroring `src/content/*`,
move routes under `src/app/[lang]/`, and add `hreflang` alternates in `src/lib/seo.ts`.

## Deployment

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** for Hostinger setup, domain/HTTPS, environment
variables and alternatives.
