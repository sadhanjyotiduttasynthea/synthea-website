# Deployment — syntheatech.com on Hostinger

This site is a **Next.js server application**. It needs a Node.js runtime for the contact-form API
(`/api/contact`), the 404 proxy and image optimization. It is **not** a static export.

## 1. Check your Hostinger plan

Hostinger runs Node.js web apps (including Next.js deployed from GitHub) on these plans only:

| Plan | Can run this site? |
| --- | --- |
| Business Web Hosting | Yes — Node.js Web Apps |
| Cloud Startup / Professional / Enterprise / Enterprise Plus | Yes — Node.js Web Apps |
| VPS (any) | Yes — run it yourself with Node.js + PM2 + Nginx (see §6) |
| Single / Premium Web Hosting | **No** — no Node.js runtime. Upgrade, or use an alternative (see §7) |

Check this in **hPanel → Hosting → your plan**. Current reference:
<https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger>.

> Hostinger deploys Node.js apps as a *new website*. If `syntheatech.com` already exists in hPanel
> as a regular (PHP/WordPress/static) site, remove that site first, or add the domain fresh through
> the Node.js flow below. Back up anything you need beforehand. Your email mailboxes and DNS are not
> part of the website and are unaffected.

## 2. Deploy from GitHub (Business / Cloud plans)

1. In hPanel: **Websites → Add website → Node.js Apps** (labels may vary slightly).
2. Choose **Import Git repository**, authorize the Hostinger GitHub app and select
   `sadhanjyotiduttasynthea/synthea-website` (private repositories are supported once access is granted).
3. Branch: `main`.
4. Build settings (usually auto-detected for Next.js):
   - Framework preset: **Next.js**
   - Node.js version: **22.x** (20.x also works; the minimum is 20.9)
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Root / output directory: leave default (project root; Next.js uses `.next`)
5. Add the **environment variables** (next section) *before* the first build.
6. Attach the domain `syntheatech.com` (and `www.syntheatech.com`) and deploy.

After this, every push to `main` triggers an automatic redeploy. Work happens on feature branches
and is merged into `main` when approved.

## 3. Environment variables (production)

Set these in the Node.js app's **Environment variables** panel. Never commit them.

| Variable | Required | Example / notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://syntheatech.com` (used at **build** time; redeploy after changing) |
| `CONTACT_TO_EMAIL` | yes | `sadhan-jyoti.dutta@syntheatech.com` |
| `CONTACT_FROM_EMAIL` | yes | `Synthea Website <noreply@syntheatech.com>` — must be on a verified domain / your SMTP mailbox |
| `EMAIL_PROVIDER` | recommended | `resend` or `smtp` |
| `RESEND_API_KEY` | if Resend | from resend.com → API Keys |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | if SMTP | Hostinger Email: `smtp.hostinger.com`, `465`, `true` |
| `CONTACT_ATTACHMENTS_ENABLED` | optional | `true` to accept one file ≤ 8 MB per inquiry (runtime; restart only) |

See the README for Resend vs SMTP setup and DNS records (SPF/DKIM).

## 4. Domain and HTTPS

- If the domain is registered at Hostinger, attaching it to the website configures DNS automatically.
  Otherwise point the domain's **A record** (and `www` CNAME) to the values hPanel shows for the site.
- In hPanel **Security → SSL**, install the free SSL certificate for `syntheatech.com` and
  `www.syntheatech.com`, then enable **Force HTTPS**.
- The app sends `Strict-Transport-Security`; enable it only once HTTPS works on both hostnames
  (it is already in `next.config.ts` — remove the header there if you need to test over plain HTTP).
- Choose one canonical host (`syntheatech.com`) and redirect `www` to it in hPanel.

## 5. After each deployment — checklist

- [ ] `https://syntheatech.com` loads, the 3D robot appears and the REAL / CAD / ANALYSIS switch works.
- [ ] Every main navigation link and the Expertise dropdown work; mobile menu opens and closes.
- [ ] `/expertise/does-not-exist` returns 404.
- [ ] `/sitemap.xml` and `/robots.txt` show `https://syntheatech.com` URLs.
- [ ] Submit a real test inquiry on `/contact`; the email arrives at `CONTACT_TO_EMAIL` and *Reply* goes to the sender.
- [ ] Check the app logs in hPanel for `[contact]` errors.

Only consider the deployment successful once the test inquiry has actually arrived.

## 6. VPS alternative (Hostinger VPS)

```bash
git clone https://github.com/sadhanjyotiduttasynthea/synthea-website.git
```

```bash
cd synthea-website && npm ci && npm run build
```

```bash
PORT=3000 npx pm2 start npm --name synthea -- start
```

Put Nginx in front as a reverse proxy to `127.0.0.1:3000`, use Certbot for HTTPS, and store the
environment variables in an `.env.production.local` file on the server (not in git).

## 7. If the plan has no Node.js (Single / Premium)

Options that keep the working contact form:

1. **Upgrade** to Business Web Hosting or a Cloud plan (simplest; keeps everything at Hostinger).
2. **Host the app on Vercel** (free tier is sufficient to start; native Next.js support), import the
   same GitHub repository, set the same environment variables, and keep the domain + email at Hostinger:
   in Hostinger DNS add the A/CNAME records Vercel shows. Note: the in-memory rate limiter should then be
   replaced with a shared store (e.g. Upstash Redis) because Vercel runs multiple instances.

A pure static export to `public_html` is **not** recommended: it would drop the server-side contact
form, which is why it is not offered here.
