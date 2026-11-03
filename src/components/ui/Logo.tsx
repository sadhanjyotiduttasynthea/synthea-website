import Image from "next/image";
import { brandAssets } from "@/content/brand-assets.generated";
import { cn } from "@/lib/cn";

/**
 * SYNTHEA logo. Uses the official logo file when it has been uploaded to
 * public/images/brand/ (see scripts/prepare-brand-assets.mjs); otherwise a
 * simple wordmark. `size="lg"` is used in the footer.
 */
export function Logo({ className, tone = "dark", size = "md" }: { className?: string; tone?: "dark" | "light"; size?: "md" | "lg" }) {
  const asset = brandAssets.synthea;
  if (asset) {
    return (
      <Image
        src={asset.src}
        alt="SYNTHEA Advanced Technologies"
        width={asset.width}
        height={asset.height}
        priority={size === "md"}
        className={cn(
          "w-auto",
          size === "lg" ? "h-14" : "h-10",
          // The processed logo is dark; invert it on dark backgrounds.
          tone === "light" && "invert",
          className,
        )}
      />
    );
  }
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
