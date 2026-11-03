# Deployment — syntheatech.com on Hostinger (Premium plan)

The site is built as **static files** (Next.js static export) plus one **PHP script** for the contact
form. This runs on every Hostinger plan, including **Premium** (PHP/HTML websites). No Node.js
hosting is required.

```
GitHub main ──(GitHub Action: npm run build)──► branch hostinger-deploy ──(Hostinger Git)──► public_html
```

What ends up in `public_html`:

```
public_html/
  index.html, about/, contact/, expertise/ …   static pages
  _next/                                       scripts, styles, fonts (content-hashed)
  images/                                      robot renders
  api/contact.php                              contact form backend
  api/.htaccess                                blocks access to any config file
  .htaccess                                    HTTPS, security headers, 404 page, caching
  404.html  sitemap.xml  robots.txt  opengraph-image
```

## 1. One-time: get the code into `main`

Merge the pull request into `main` on GitHub. Every push to `main` then runs the workflow
**Build & publish for Hostinger** (`.github/workflows/deploy-hostinger.yml`), which builds the site
and publishes the result to the branch **`hostinger-deploy`**. Check its progress in the repository's
**Actions** tab; the first run creates the branch.

> If the Actions tab says workflows need approval, click **Enable / I understand** once.
> In **Settings → Actions → General → Workflow permissions** choose **Read and write permissions**.

## 2. One-time: connect Hostinger to GitHub

In hPanel open the existing PHP/HTML website (`syntheatech-com-….hostingersite.com` / `syntheatech.com`):

1. **Empty `public_html` first.** Hostinger's Git deployment only works into an empty folder:
   *Files → File Manager → public_html* → select everything (including the default
   `default.php`/`index.html`) → Delete.
2. Go to **Advanced → Git** (on the website's dashboard sidebar).
3. **Create a new repository**:
   - Repository: `https://github.com/sadhanjyotiduttasynthea/synthea-website.git`
   - Branch: **`hostinger-deploy`**
   - Directory: leave empty (deploys into `public_html`)
   - Click **Create**.
4. **Private repository?** Hostinger shows an **SSH key** on the same page. Copy it, then on GitHub
   go to the repository → **Settings → Deploy keys → Add deploy key**, paste it (read-only), save.
   Use the SSH URL `git@github.com:sadhanjyotiduttasynthea/synthea-website.git` in step 3 instead.
5. Click **Deploy** next to the repository in hPanel. The site files appear in `public_html`.
6. **Auto deployment:** click **Auto Deployment** in hPanel and copy the **Webhook URL**. On GitHub:
   repository → **Settings → Webhooks → Add webhook** → paste it as *Payload URL*,
   content type `application/json`, *Just the push event* → **Add webhook**.

From now on: merge/push to `main` → GitHub Action builds → `hostinger-deploy` updates → webhook →
Hostinger pulls the new files. Usually live within 2–3 minutes.

### Manual alternative (no Git)

Download the `hostinger-deploy` branch as a ZIP from GitHub (*Code → Download ZIP*, choosing that
branch), or use the `synthea-website-static.zip` provided, and in **File Manager → public_html**
upload and **Extract** it so that `index.html` sits directly inside `public_html` (not in a sub-folder).

## 3. One-time: contact form email

The form sends through a Hostinger mailbox using authenticated SMTP.

1. **Create a mailbox** in hPanel → **Emails** → `syntheatech.com`, e.g. `noreply@syntheatech.com`
   (or use `sadhan-jyoti.dutta@syntheatech.com` itself). Note its password.
2. Take `deploy/synthea-contact-config.example.php` from the repository, fill in `from_email`,
   `smtp_user` (the mailbox address) and `smtp_pass` (its password), and save it as
   **`synthea-contact-config.php`**.
3. In **File Manager**, go **one level above `public_html`** (the folder that *contains*
   `public_html`, typically `domains/syntheatech.com/`) and upload the file there.
   It is then outside the website — it cannot be downloaded and deployments never overwrite it.
4. Check: open `https://syntheatech.com/api/contact.php` — it should show
   `{"attachmentsEnabled":false,"configured":true}`. `configured:false` means the file was not found
   or a value is missing.
5. To accept file attachments, set `'attachments_enabled' => true` in the same file.

**Deliverability:** in hPanel → Emails → *Email deliverability* (or DNS), make sure SPF, DKIM and DMARC
records for `syntheatech.com` are enabled so inquiries do not land in spam.

## 4. Domain and HTTPS

- In hPanel → the website → **Domains**, make sure `syntheatech.com` is connected to this website
  (not only the temporary `…hostingersite.com` address).
- **Security → SSL**: install the free SSL certificate for `syntheatech.com` and `www.syntheatech.com`.
- `.htaccess` already redirects `http://` and `www.` to `https://syntheatech.com`.
  If the site shows a redirect loop, the SSL certificate is not active yet — wait until it is issued.

## 5. Checklist after deployment

- [ ] `https://syntheatech.com` loads; the 3D robot appears and REAL / CAD / ANALYSIS switch works.
- [ ] Navigation, Expertise dropdown and mobile menu work; every page opens.
- [ ] `https://syntheatech.com/does-not-exist` shows the SYNTHEA 404 page.
- [ ] `https://syntheatech.com/api/contact.php` shows `"configured":true`.
- [ ] A real test inquiry from `/contact/` arrives at `sadhan-jyoti.dutta@syntheatech.com`, and replying
      goes to the sender.
- [ ] `https://syntheatech.com/sitemap.xml` lists `https://syntheatech.com/…` URLs.

Only consider the launch complete once the test inquiry has arrived.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| "Unable to identify your website" on import | The ZIP contained source code, not the built site. Deploy the `hostinger-deploy` branch (or the static ZIP) so `index.html` is directly in `public_html`. |
| Git deploy fails: directory not empty | Empty `public_html` completely (§2 step 1), then deploy again. |
| Form says "temporarily unavailable" | `synthea-contact-config.php` missing or incomplete — see §3 step 4. |
| Form says "could not send" | Wrong mailbox password or SMTP blocked; check *File Manager → logs* / PHP error log for `[contact] Email delivery failed`. As a fallback set `'transport' => 'mail'`. |
| Old version still showing | Hard-refresh the browser; HTML is never cached long, so this clears after a reload. |

## Moving to Node.js hosting later

If the plan is upgraded to one with Web Apps (Node.js), the site can keep running exactly as it is
(static + PHP). Nothing needs to change.
