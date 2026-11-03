import { z } from "zod";

/** Project categories — `value` is used in URLs (?category=...) and payloads. */
export const projectCategories = [
  { value: "robotics", label: "Robotics Engineering" },
  { value: "mechanical-design", label: "Mechanical Design" },
  { value: "simulation", label: "Simulation & Modeling" },
  { value: "automation", label: "Industrial Automation" },
  { value: "prototype", label: "Prototype Development" },
  { value: "research", label: "Research Collaboration" },
  { value: "other", label: "Other" },
] as const;

export const budgetOptions = [
  { value: "under-1k", label: "Under €1,000" },
  { value: "1k-5k", label: "€1,000–€5,000" },
  { value: "5k-20k", label: "€5,000–€20,000" },
  { value: "over-20k", label: "Above €20,000" },
  { value: "not-defined", label: "Not defined" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "Within 1–3 months" },
  { value: "3-6-months", label: "Within 3–6 months" },
  { value: "6-months-plus", label: "More than 6 months" },
  { value: "exploring", label: "Exploring options" },
] as const;

type Values<T extends readonly { value: string }[]> = T[number]["value"];
export type ProjectCategory = Values<typeof projectCategories>;

const categoryValues = projectCategories.map((c) => c.value) as [ProjectCategory, ...ProjectCategory[]];
const budgetValues = budgetOptions.map((c) => c.value) as [Values<typeof budgetOptions>, ...Values<typeof budgetOptions>[]];
const timelineValues = timelineOptions.map((c) => c.value) as [
  Values<typeof timelineOptions>,
  ...Values<typeof timelineOptions>[],
];

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return typeof value === "string" && (categoryValues as string[]).includes(value);
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

/** Shared by the browser (React Hook Form) and the server (route handler). */
export const contactSchema = z.object({
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
  category: z.enum(categoryValues, { error: "Please select a project category." }),
  budget: z.enum(budgetValues).optional().or(z.literal("")),
  timeline: z.enum(timelineValues).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(30, "Please describe your project in at least 30 characters.")
    .max(5000, "Please keep the description under 5,000 characters."),
  consent: z.literal(true, { error: "Please confirm you agree to the processing of your data." }),
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
