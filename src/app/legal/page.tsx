import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Prose } from "@/components/ui/Prose";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Legal Notice",
  description: "Legal notice (mentions légales) for the website of Synthea Advanced Technologies.",
  path: "/legal",
});

/** Shows a value or a visible note that it still has to be provided. */
function Field({ value }: { value: string | null }) {
  return value ? <>{value}</> : <em className="text-gray">to be completed</em>;
}

export default function LegalPage() {
  const { legal } = site;
  return (
    <>
      <PageHero eyebrow="Legal" title="Legal Notice" crumbs={[{ label: "Legal Notice", href: "/legal" }]} intro={<p>Mentions légales</p>} />
      <section className="section-y bg-white">
        <div className="container-site">
          <Prose>
            <h2>Website publisher</h2>
            <ul>
              <li>Company name: {site.name}</li>
              <li>
                Legal form: <Field value={legal.legalForm} />
              </li>
              <li>
                Share capital: <Field value={legal.shareCapital} />
              </li>
              <li>
                Registration (SIREN / RCS): <Field value={legal.registration} />
              </li>
              <li>
                VAT number: <Field value={legal.vatNumber} />
              </li>
              <li>
                Registered office: <Field value={legal.address} />
              </li>
              <li>
                Email: <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>Publication director: {legal.publicationDirector}</li>
            </ul>

            <h2>Hosting</h2>
            <ul>
              <li>{legal.host.name}</li>
              <li>{legal.host.address}</li>
              <li>
                <a href={legal.host.website} rel="noopener noreferrer" target="_blank">
                  {legal.host.website.replace("https://", "")}
                </a>
              </li>
            </ul>

            <h2>Intellectual property</h2>
            <p>
              The content of this website — including text, illustrations, 3D visualizations, graphics, logos and code — is
              the property of {site.name} unless stated otherwise, and is protected by intellectual property law. Any
              reproduction or use without prior written permission is prohibited.
            </p>

            <h2>Illustrations and visualizations</h2>
            <p>
              Concept illustrations, renders and simulation visualizations on this website are illustrative. They do not
              represent validated engineering results, certified products or commercially available systems unless
              explicitly stated.
            </p>

            <h2>Liability</h2>
            <p>
              We take care to provide accurate information but cannot guarantee that the website is free of errors or
              always available. External links are provided for convenience; we are not responsible for their content.
            </p>

            <h2>Personal data</h2>
            <p>
              Please see our <a href="/privacy">Privacy Policy</a>.
            </p>

            <h2>Applicable law</h2>
            <p>This website and this notice are governed by French law.</p>
          </Prose>
        </div>
      </section>
    </>
  );
}
