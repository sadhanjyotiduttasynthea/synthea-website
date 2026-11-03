import { cn } from "@/lib/cn";

type Props = { index?: string; children: React.ReactNode; tone?: "light" | "dark"; className?: string };

/** Eyebrow label, e.g. "01 / ABOUT SYNTHEA". */
export function SectionLabel({ index, children, tone = "light", className }: Props) {
  return (
    <p
      className={cn(
        "eyebrow flex items-center gap-3",
        tone === "dark" ? "text-metal" : "text-gray",
        className,
      )}
    >
      <span aria-hidden className="h-px w-8 bg-red" />
      {index && <span className="text-red">{index}</span>}
      {index && <span aria-hidden>/</span>}
      <span>{children}</span>
    </p>
  );
}
