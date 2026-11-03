import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Prose } from "@/components/ui/Prose";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Synthea Advanced Technologies processes personal data submitted through this website, in line with the GDPR.",
  path: "/privacy",
});

const LAST_UPDATED = "3 November 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        crumbs={[{ label: "Privacy Policy", href: "/privacy" }]}
        intro={<p>Last updated: {LAST_UPDATED}</p>}
      />
      <section className="section-y bg-white">
        <div className="container-site">
          <Prose>
            <p>
              This policy explains how {site.name} (&ldquo;Synthea&rdquo;, &ldquo;we&rdquo;) processes personal data
              collected through this website, in accordance with the EU General Data Protection Regulation (GDPR) and the
              French Data Protection Act (Loi Informatique et Libertés).
            </p>

            <h2>1. Data controller</h2>
            <p>
              {site.name}, represented by {site.founder.name}, {site.founder.role}. Contact:{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>

            <h2>2. Data we collect</h2>
            <h3>Contact form</h3>
            <p>When you submit the project inquiry form we process:</p>
            <ul>
              <li>Identity and contact data: full name, email address, and optionally company and phone number.</li>
              <li>Project information: category, description, and optionally budget range, timeline and an attached file (when attachments are enabled).</li>
              <li>Your consent confirmation and the time of submission.</li>
            </ul>
            <h3>Technical data</h3>
            <p>
              To protect the form against abuse, your IP address is used temporarily in server memory for rate limiting. It
              is not stored in a database and is discarded automatically. Our hosting provider may keep standard server logs
              for security and operational purposes.
            </p>
            <p>
              This website does not use advertising or analytics cookies, and does not load third-party tracking scripts.
            </p>

            <h2>3. Purposes and legal bases</h2>
            <ul>
              <li>
                Responding to your inquiry and taking steps at your request before entering into a contract — Article
                6(1)(b) GDPR, and your consent given on the form — Article 6(1)(a).
              </li>
              <li>Protecting the website against spam and abuse — our legitimate interest, Article 6(1)(f).</li>
            </ul>

            <h2>4. How form submissions are handled</h2>
            <p>
              Form submissions are not stored in a database on this website. They are transmitted by email to Synthea
              through a transactional email service acting as a data processor. Attachments, when enabled, are processed in
              memory and forwarded with the email; they are not saved on the web server.
            </p>

            <h2>5. Recipients and processors</h2>
            <ul>
              <li>Our website hosting provider ({site.legal.host.name}).</li>
              <li>
                Our email delivery provider (for example Resend, or the SMTP service of our email host), used solely to
                deliver your message to us.
              </li>
            </ul>
            <p>
              Where a processor is located outside the European Economic Area, transfers are covered by appropriate
              safeguards such as the European Commission&apos;s Standard Contractual Clauses.
            </p>

            <h2>6. Retention</h2>
            <p>
              Inquiry emails are kept for as long as necessary to handle your request and any resulting business
              relationship, and no longer than three years after our last contact, unless a longer period is required by
              law.
            </p>

            <h2>7. Your rights</h2>
            <p>
              You have the right to access, rectify and erase your data, to restrict or object to processing, to data
              portability, and to withdraw your consent at any time. You may also give instructions regarding your data
              after death. To exercise these rights, email <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
            <p>
              You may lodge a complaint with the French data protection authority, the CNIL (
              <a href="https://www.cnil.fr" rel="noopener noreferrer" target="_blank">
                www.cnil.fr
              </a>
              ).
            </p>

            <h2>8. Security</h2>
            <p>
              The website is served over HTTPS. Form data is validated on the server, credentials for email delivery are
              kept server-side only, and access to inquiries is limited to Synthea.
            </p>

            <h2>9. Changes</h2>
            <p>We may update this policy. The date at the top of the page shows the latest revision.</p>
          </Prose>
        </div>
      </section>
    </>
  );
}
