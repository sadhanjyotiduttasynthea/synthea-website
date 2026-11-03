import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { MagneticButton } from "./MagneticButton";

type Variant = "primary" | "secondary" | "ghost" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-red text-white hover:bg-red-dark",
  secondary: "border border-ink/15 bg-white text-ink hover:border-ink",
  ghost: "text-ink hover:text-red px-0",
  light: "border border-white/25 text-white hover:border-white hover:bg-white hover:text-ink",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  icon?: "arrow" | "up-right" | "none";
  magnetic?: boolean;
  className?: string;
  prefetch?: boolean;
};

export function ButtonLink({ href, children, variant = "primary", icon = "arrow", magnetic = false, className }: Props) {
  const Icon = icon === "up-right" ? ArrowUpRight : ArrowRight;
  const link = (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-colors duration-300",
        styles[variant],
        className,
      )}
    >
      <span>{children}</span>
      {icon !== "none" && (
        <Icon
          aria-hidden
          className={cn(
            "size-4 transition-transform duration-300 ease-[var(--ease-precise)]",
            icon === "up-right" ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1",
          )}
        />
      )}
    </Link>
  );
  return magnetic ? <MagneticButton>{link}</MagneticButton> : link;
}
