import { cn } from "@/lib/cn";

/** SYNTHEA wordmark with a precise mechanical mark. */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 28 28" aria-hidden className="size-7 shrink-0">
        <rect x="1" y="1" width="26" height="26" rx="6" fill={tone === "dark" ? "#111111" : "#FFFFFF"} />
        <path d="M8 18.5 L14 9.5 L20 18.5" fill="none" stroke="#D71932" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="14" cy="9.5" r="1.9" fill={tone === "dark" ? "#FFFFFF" : "#111111"} />
        <circle cx="8" cy="18.5" r="1.9" fill={tone === "dark" ? "#FFFFFF" : "#111111"} />
        <circle cx="20" cy="18.5" r="1.9" fill={tone === "dark" ? "#FFFFFF" : "#111111"} />
      </svg>
      <span className={cn("text-[1.05rem] font-semibold tracking-[0.22em]", tone === "dark" ? "text-ink" : "text-white")}>
        SYNTHEA
      </span>
    </span>
  );
}
