/**
 * Central company facts. Everything shown publicly about Synthea comes from
 * this file so it can be verified and edited in a single place.
 *
 * Legal fields left as `null` are rendered on /legal with a visible
 * "to be completed" note — fill them in before launch (see README).
 */
export const site = {
  name: "Synthea Advanced Technologies",
  brand: "SYNTHEA",
  tagline: "Engineering What Comes Next.",
  positioning: "Robotics • Engineering Design • Simulation • Automation",
  description:
    "Synthea Advanced Technologies is a deep-tech engineering company in France developing robotic systems, mechanical engineering solutions, computational simulation and intelligent automation.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://syntheatech.com").replace(/\/$/, ""),
  locale: "en",
  country: "France",
  email: "sadhan-jyoti.dutta@syntheatech.com",
  founder: {
    name: "Dr. Sadhan Jyoti Dutta",
    role: "Founder & CEO",
  },
  legal: {
    /** e.g. "SAS", "SASU", "EURL" */
    legalForm: null as string | null,
    /** SIREN / RCS registration */
    registration: null as string | null,
    /** Registered office address */
    address: null as string | null,
    /** Share capital, e.g. "1 000 €" */
    shareCapital: null as string | null,
    /** Intra-community VAT number */
    vatNumber: null as string | null,
    publicationDirector: "Dr. Sadhan Jyoti Dutta",
    host: {
      name: "Hostinger International Ltd.",
      address: "61 Lordou Vironos Street, 6023 Larnaca, Cyprus",
      website: "https://www.hostinger.com",
    },
  },
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Expertise", href: "/expertise" },
  { label: "Technologies", href: "/technologies" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
