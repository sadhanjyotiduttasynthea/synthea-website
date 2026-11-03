# SYNTHEA — Website

Production website for **Synthea Advanced Technologies** — *Engineering What Comes Next.*
Robotics • Engineering Design • Simulation • Automation.

Live domain: <https://syntheatech.com> — hosted on a Hostinger **Premium** plan as a static site with a PHP
contact-form backend. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) with **static export** (`out/`), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with design tokens in `src/app/globals.css` |
| Motion | Motion for React (`motion/react`), respects `prefers-reduced-motion` |
| 3D | Three.js, React Three Fiber, Drei (lazy-loaded, client-only) |
| Forms | React Hook Form + Zod (same schema on client and server) |
| Contact backend | `public/api/contact.php` (PHP 7.4+), authenticated SMTP via Hostinger Email |
| Hosting | Hostinger PHP/HTML website, deployed from GitHub (Actions → `hostinger-deploy` branch → hPanel Git) |
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

Open <http://localhost:3000>. The contact form needs PHP, which `next dev` does not run — to test the
form locally, build and preview the static site with PHP (see *Testing the form*).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Static production build into `out/` (type-checks and prerenders every page) |
| `npm run preview` | Serve `out/` with PHP's built-in server on <http://127.0.0.1:8080> (requires PHP) |
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
    sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg  not-found.tsx
  components/
    layout/                 SiteHeader, MobileNavigation, SiteFooter
    home/                   Homepage sections (Hero, Process, Services, CTA, …)
    three/                  RobotScene (R3F), HeroVisual, VisualizationModeSelector
    simulation/             SimulationTabs + illustrative field computations
    illustrations/          Lightweight SVG technical illustrations
    service/  projects/  contact/  ui/
  content/                  ALL editable copy: site facts, expertise, projects, home
  lib/                      contact schema (shared rules), SEO helpers
  i18n/config.ts            Locale configuration (English now, French-ready)
public/
  api/contact.php           Contact form backend (validation, spam, rate limit, SMTP)
  .htaccess                 HTTPS + canonical host, security headers, 404, caching
  images/                   Pre-rendered robot posters (WebGL fallback)
deploy/                     synthea-contact-config.example.php (SMTP settings template)
.github/workflows/          Build & publish to the hostinger-deploy branch
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

Flow: browser validation (Zod via React Hook Form) → `POST /api/contact.php` (multipart) → PHP
re-validates with the same rules as `src/lib/contact-schema.ts` → email to Synthea through Hostinger
SMTP. The success screen appears **only** after the server confirms the message was accepted by the
mail server.

Protections:

- **Spam:** hidden honeypot field + minimum fill time (3 s). Bots get a fake success; nothing is sent.
- **Rate limiting:** 5 submissions per IP per 15 minutes (hashed IPs in a folder outside `public_html`).
- **CSRF:** cross-origin `Origin` headers are rejected.
- **Secrets:** SMTP credentials live in `synthea-contact-config.php` **outside `public_html`** on the
  server — never in git, never downloadable.
- **Header injection:** all header values are stripped of line breaks; subjects are encoded.
- **Attachments (optional):** off by default. With `'attachments_enabled' => true`, one file up to
  8 MB (PDF, PNG, JPG, STEP/STP, STL, DXF, ZIP, DOCX, XLSX) is checked by extension, size and file
  signature and forwarded with the email — never kept on the server. When disabled, the form explains
  how to share documents instead. The browser asks `GET /api/contact.php` whether they are enabled.
- **GDPR:** required consent checkbox linked to `/privacy`; no database; no tracking cookies.

### Email setup

See [docs/DEPLOYMENT.md §3](docs/DEPLOYMENT.md#3-one-time-contact-form-email): create a mailbox such as
`noreply@syntheatech.com`, fill in `deploy/synthea-contact-config.example.php`, save it as
`synthea-contact-config.php` and upload it to the folder **above** `public_html`.

### Testing the form

Locally (needs PHP 7.4+):

```bash
npm run build
```

```bash
npm run preview
```

For a local test, put a `contact-config.php` (same format as the template) in `out/api/` — it is
git-ignored and blocked from the web by `api/.htaccess`. Then open <http://127.0.0.1:8080/contact/>.

On the live site:

1. `https://syntheatech.com/api/contact.php` shows `"configured":true`.
2. Submit empty → field errors; invalid email → error; no consent → error.
3. `/contact/?category=simulation` preselects *Simulation & Modeling* (used by "Request a Consultation").
4. Send a real inquiry and confirm it arrives with a working *Reply-To*.
5. Six quick submissions → the sixth is refused with HTTP 429.

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

Push/merge to `main` → GitHub Action builds `out/` → branch `hostinger-deploy` → Hostinger Git
auto-deploys into `public_html`. Full one-time setup (Git connection, webhook, email config, SSL) in
**[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.
