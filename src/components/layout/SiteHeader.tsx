"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MobileNavigation } from "./MobileNavigation";
import { mainNav } from "@/content/site";
import { expertise } from "@/content/expertise";
import { cn } from "@/lib/cn";

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the dropdown on route change
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setDropdown(false);
  }

  useEffect(() => {
    if (!dropdown) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDropdown(false);
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setDropdown(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [dropdown]);

  const open = () => {
    window.clearTimeout(closeTimer.current);
    setDropdown(true);
  };
  const scheduleClose = () => {
    closeTimer.current = window.setTimeout(() => setDropdown(false), 140);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-line bg-white/85 backdrop-blur-md" : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" aria-label="SYNTHEA — home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              if (item.href === "/expertise") {
                return (
                  <li key={item.href} ref={dropdownRef} className="relative" onMouseEnter={open} onMouseLeave={scheduleClose}>
                    <div className="flex items-center">
                      <NavLink href={item.href} active={active}>
                        {item.label}
                      </NavLink>
                      <button
                        type="button"
                        aria-expanded={dropdown}
                        aria-controls="expertise-menu"
                        aria-label="Show expertise areas"
                        onClick={() => setDropdown((v) => !v)}
                        className="-ml-2 grid size-8 place-items-center rounded-full text-gray hover:text-ink"
                      >
                        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-300", dropdown && "rotate-180")} />
                      </button>
                    </div>
                    <AnimatePresence>
                      {dropdown && (
                        <motion.div
                          id="expertise-menu"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3"
                        >
                          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_-20px_rgba(17,17,17,0.25)]">
                            <ul className="grid grid-cols-2 gap-px bg-line">
                              {expertise.map((e, i) => (
                                <li key={e.slug} className="bg-white">
                                  <Link
                                    href={`/expertise/${e.slug}`}
                                    className="group block h-full p-5 transition-colors hover:bg-surface"
                                  >
                                    <span className="eyebrow text-red">0{i + 1}</span>
                                    <span className="mt-2 block font-medium text-ink">{e.title}</span>
                                    <span className="mt-1 block text-sm leading-snug text-gray">{e.summary}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            <Link
                              href="/expertise"
                              className="flex items-center justify-between border-t border-line px-5 py-3.5 text-sm font-medium hover:text-red"
                            >
                              All expertise <ArrowUpRight aria-hidden className="size-4" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <NavLink href={item.href} active={active}>
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <MagneticButton>
              <Link
                href="/contact"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-red"
              >
                Start a Project
                <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </MagneticButton>
          </div>
          <MobileNavigation pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex min-h-11 items-center px-3.5 text-[0.9rem] transition-colors",
        active ? "text-ink" : "text-gray hover:text-ink",
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-3.5 bottom-2 h-px origin-left bg-red transition-transform duration-500 ease-[var(--ease-precise)]",
          active ? "scale-x-100" : "scale-x-0",
        )}
      />
    </Link>
  );
}
