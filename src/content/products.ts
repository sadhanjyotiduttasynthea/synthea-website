import type { RentalProduct } from "@/lib/contact-schema";

/**
 * Synthea products (shown on /products and the homepage).
 *
 * Pictures are illustrations, not photographs. To show a real, approved
 * photo later, add it to public/images/products/ and set `photo`.
 * Avoid adding numerical specifications until they are verified.
 */
export type ProductIllustration = "chocolate-printer" | "icecream-robot" | "cookie-automation" | "delivery-robot";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  uses: { label: string; rent: RentalProduct }[];
  illustration: ProductIllustration;
  photo?: { src: string; alt: string };
};

export const featuredProduct: Product = {
  id: "chocolate-printer",
  name: "Chocolate 3D Food Printer",
  tagline: "Personalised chocolate, printed layer by layer.",
  description:
    "A 3D food printer designed for chocolate. Digital designs — shapes, names, logos, patterns — are turned into precise chocolate pieces, built up layer by layer with controlled deposition.",
  features: [
    "Temperature-controlled chocolate deposition",
    "Layer-by-layer printing from digital designs",
    "Personalised shapes, lettering and logos",
    "Designed for events, pastry studios, retail and education",
  ],
  uses: [{ label: "Rent the chocolate printer", rent: "chocolate-printer" }],
  illustration: "chocolate-printer",
};

export const rentalProducts: Product[] = [
  featuredProduct,
  {
    id: "icecream-robot",
    name: "Robotic Ice-Cream Delivery Machine",
    tagline: "Automated ice-cream serving that draws a crowd.",
    description:
      "A robotic serving station that prepares and hands out ice cream automatically — a memorable attraction for events, festivals, shopping centres and hospitality venues.",
    features: ["Automated serving sequence", "Hygienic, enclosed handling", "Eye-catching robotic motion", "Suited to events and venues"],
    uses: [{ label: "Rent the ice-cream robot", rent: "icecream-robot" }],
    illustration: "icecream-robot",
  },
  {
    id: "cookie-automation",
    name: "Cookie Automation Machine",
    tagline: "Consistent cookies, automated dosing and decorating.",
    description:
      "An automation machine for cookie production steps such as dough dosing, placement and decoration — bringing repeatability to bakeries, pastry workshops and food demonstrations.",
    features: ["Automated dosing and placement", "Repeatable decoration patterns", "Compact footprint", "For bakeries, workshops and demos"],
    uses: [{ label: "Rent the cookie machine", rent: "cookie-automation" }],
    illustration: "cookie-automation",
  },
  {
    id: "delivery-robot",
    name: "Delivery Robots",
    tagline: "Autonomous service from kitchen to table.",
    description:
      "Service robots that carry dishes, drinks and items between kitchen and guests — supporting staff in restaurants, on cruise ships, in hotels and at events.",
    features: ["Autonomous navigation between stations", "Multi-tray delivery", "Supports service staff", "Restaurants, cruise ships, hotels & events"],
    uses: [
      { label: "Restaurants", rent: "delivery-robot-restaurant" },
      { label: "Cruise ships", rent: "delivery-robot-cruise" },
      { label: "Hotels & events", rent: "delivery-robot-events" },
    ],
    illustration: "delivery-robot",
  },
];
