import { z } from "zod";

/**
 * Contact / "Start your project" form options.
 * `value` is used in URLs (?type=…&product=…) and payloads.
 * The PHP backend (public/api/contact.php) mirrors these lists — keep them in sync.
 */
export const inquiryTypes = [
  { value: "rent", label: "Rent one of our products", hint: "Chocolate 3D printer, ice-cream robot, delivery robots…" },
  { value: "engineering-design", label: "Get engineering design help", hint: "Machine design, product design, 3D CAD, drawings" },
  { value: "robotics", label: "Custom robotics development", hint: "A robot or mechanism built for your task" },
  { value: "automation", label: "Industrial automation", hint: "Automate a process or production step" },
  { value: "simulation", label: "Simulation & analysis", hint: "Thermal, CFD, structural, multiphysics" },
  { value: "prototype", label: "Prototyping & validation", hint: "Functional prototypes and testing" },
  { value: "research", label: "R&D collaboration", hint: "Applied research and feasibility studies" },
  { value: "other", label: "Something else", hint: "Tell us what you have in mind" },
] as const;

export const rentalProducts = [
  { value: "chocolate-printer", label: "3D chocolate printer" },
  { value: "icecream-robot", label: "Robotic ice-cream delivery machine" },
  { value: "cookie-automation", label: "Cookie automation machine" },
  { value: "delivery-robot-restaurant", label: "Delivery robot — restaurants" },
  { value: "delivery-robot-cruise", label: "Delivery robot — cruise ships" },
  { value: "delivery-robot-events", label: "Delivery robot — hotels & events" },
  { value: "not-sure", label: "Not sure yet — advise me" },
] as const;

export const designFocusOptions = [
  { value: "machine-design", label: "Machine design (special-purpose machines, equipment)" },
  { value: "product-design", label: "Mechanical product design" },
  { value: "cad-drawings", label: "3D CAD models & technical drawings" },
  { value: "redesign", label: "Improve or redesign an existing machine" },
  { value: "feasibility", label: "Concept & feasibility study" },
  { value: "other", label: "Other" },
] as const;

export const budgetOptions = [
  { value: "5k-10k", label: "€5,000–€10,000" },
  { value: "10k-25k", label: "€10,000–€25,000" },
  { value: "25k-50k", label: "€25,000–€50,000" },
  { value: "over-50k", label: "Above €50,000" },
  { value: "not-defined", label: "Not defined yet" },
] as const;

/** Rentals have a minimum period of 6 months. */
export const rentalPeriodOptions = [
  { value: "6-months", label: "6 months (minimum)" },
  { value: "12-months", label: "12 months" },
  { value: "over-12-months", label: "More than 12 months" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "Within 1–3 months" },
  { value: "3-6-months", label: "Within 3–6 months" },
  { value: "6-months-plus", label: "More than 6 months" },
  { value: "exploring", label: "Exploring options" },
] as const;

type Values<T extends readonly { value: string }[]> = T[number]["value"];
type Tuple<T extends readonly { value: string }[]> = [Values<T>, ...Values<T>[]];
const values = <T extends readonly { value: string }[]>(list: T) => list.map((o) => o.value) as Tuple<T>;

export type InquiryType = Values<typeof inquiryTypes>;
export type RentalProduct = Values<typeof rentalProducts>;

export function isInquiryType(value: unknown): value is InquiryType {
  return typeof value === "string" && inquiryTypes.some((o) => o.value === value);
}
export function isRentalProduct(value: unknown): value is RentalProduct {
  return typeof value === "string" && rentalProducts.some((o) => o.value === value);
}

export function labelFor<T extends readonly { value: string; label: string }[]>(list: T, value: string | undefined) {
  return list.find((item) => item.value === value)?.label ?? "—";
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .optional()
    .or(z.literal(""));

/** Shared by the browser (React Hook Form); mirrored in public/api/contact.php. */
export const contactSchema = z
  .object({
    inquiryType: z.enum(values(inquiryTypes), { error: "Please choose what you are looking for." }),
    product: z.enum(values(rentalProducts)).optional().or(z.literal("")),
    designFocus: z.enum(values(designFocusOptions)).optional().or(z.literal("")),
    rentalPeriod: z.enum(values(rentalPeriodOptions)).optional().or(z.literal("")),
    rentalDates: optionalText(200),
    location: optionalText(200),
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(120, "Please keep your name under 120 characters."),
    email: z.string().trim().max(254, "This email address is too long.").pipe(z.email("Please enter a valid email address.")),
    company: optionalText(160),
    phone: z
      .string()
      .trim()
      .max(40, "Please enter a shorter phone number.")
      .regex(/^[+()\d\s.-]*$/, "Use digits, spaces and + ( ) - . only.")
      .optional()
      .or(z.literal("")),
    budget: z.enum(values(budgetOptions)).optional().or(z.literal("")),
    timeline: z.enum(values(timelineOptions)).optional().or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(20, "Please tell us a little more (at least 20 characters).")
      .max(5000, "Please keep the description under 5,000 characters."),
    consent: z.literal(true, { error: "Please confirm you agree to the processing of your data." }),
  })
  .superRefine((data, ctx) => {
    if (data.inquiryType === "rent" && !data.product) {
      ctx.addIssue({ code: "custom", path: ["product"], message: "Please choose which product you would like to rent." });
    }
    if (data.inquiryType === "rent" && !data.rentalPeriod) {
      ctx.addIssue({ code: "custom", path: ["rentalPeriod"], message: "Please choose a rental period (minimum 6 months)." });
    }
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** Attachment rules (only used when attachments are enabled server-side). */
export const attachmentRules = {
  maxBytes: 8 * 1024 * 1024,
  extensions: [".pdf", ".png", ".jpg", ".jpeg", ".step", ".stp", ".stl", ".dxf", ".zip", ".docx", ".xlsx"],
  accept: ".pdf,.png,.jpg,.jpeg,.step,.stp,.stl,.dxf,.zip,.docx,.xlsx",
} as const;

export type ContactResponse =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Partial<Record<keyof ContactInput | "attachment", string>> };

/** Build a link to the project form with options preselected. */
export function projectLink(type: InquiryType, product?: RentalProduct) {
  const q = new URLSearchParams({ type });
  if (product) q.set("product", product);
  return `/contact/?${q.toString()}#inquiry`;
}
