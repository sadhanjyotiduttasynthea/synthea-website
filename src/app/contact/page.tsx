import type { Metadata } from "next";
import { Mail, MapPin, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Start Your Project — Rentals, Machine Design & Engineering",
  description:
    "Rent a Synthea machine (chocolate 3D printer, ice-cream robot, cookie automation, delivery robots) or start an engineering project: machine design, robotics, simulation, automation.",
  path: "/contact",
});

const steps = [
  { title: "Instant confirmation", text: "You receive an automatic confirmation email as soon as you submit." },
  { title: "We read every request", text: "Your message goes directly to our CEO." },
  { title: "Initial conversation", text: "We clarify goals, constraints and what success looks like." },
  { title: "Proposal", text: "A scoped proposal with approach, deliverables and next steps." },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Start your project"
        title="Let's Build What's Next."
        crumbs={[{ label: "Contact", href: "/contact" }]}
        intro={
          <p>
            Rent one of our products, get engineering design help, or tell us about your engineering challenge. Choose
            what you are looking for, share your budget — you will receive a confirmation by email.
          </p>
        }
      />

      <section aria-label="Project inquiry" className="section-y bg-surface !pt-12 lg:!pt-16">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ContactForm contactEmail={site.email} />
          </div>

          <aside className="space-y-6 lg:col-span-4" aria-label="Other ways to reach us">
            <div id="direct" className="scroll-mt-32 rounded-3xl border border-line bg-white p-7">
              <h2 className="eyebrow text-gray">Direct contact</h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-red" />
                  <a href={`mailto:${site.email}`} className="break-all underline-offset-4 hover:text-red hover:underline">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-red" />
                  <address className="not-italic leading-relaxed">
                    {site.address.building}
                    <br />
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}
                    <br />
                    {site.address.country}
                  </address>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-line bg-white p-7">
              <h2 className="eyebrow text-gray">What happens next</h2>
              <ol className="mt-5 space-y-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="font-mono text-xs text-red">0{i + 1}</span>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="mt-1 text-sm text-gray">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl border border-line bg-white p-7 text-sm text-gray">
              <p className="flex items-center gap-2 font-medium text-ink">
                <ShieldCheck aria-hidden className="size-4 text-red" /> Confidentiality
              </p>
              <p className="mt-2 leading-relaxed">
                Please avoid sending confidential details in a first message. We are happy to sign an NDA before detailed
                technical discussions.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
