"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { mainNav, site } from "@/content/site";
import { expertise } from "@/content/expertise";
import { cn } from "@/lib/cn";

/**
 * Mobile menu built on the native <dialog> element: showModal() provides a
 * focus trap, Escape to close and an inert background. Focus returns to the
 * menu button when the dialog closes.
 */
export function MobileNavigation({ pathname }: { pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setOpen(false);
      document.documentElement.style.overflow = "";
      buttonRef.current?.focus();
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  // Close if the viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Site menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 text-ink backdrop:bg-ink/30 open:animate-[menu-in_0.35s_cubic-bezier(0.22,1,0.36,1)]"
      >
        <style>{`@keyframes menu-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
        <div className="container-site flex h-[var(--header-h)] items-center justify-between">
          <Link href="/" onClick={() => setOpen(false)} aria-label="SYNTHEA — home">
            <Logo />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid size-11 place-items-center rounded-full border border-line"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile" className="container-site flex h-[calc(100dvh-var(--header-h))] flex-col overflow-y-auto pb-8 pt-6">
          <ul className="border-t border-line">
            {mainNav.map((item, i) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex min-h-16 items-center justify-between py-3 text-2xl font-medium tracking-tight"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="eyebrow text-gray">0{i + 1}</span>
                    <span className={cn(isActive(item.href) && "text-red")}>{item.label}</span>
                  </span>
                  <ArrowUpRight aria-hidden className="size-5 text-gray" />
                </Link>
                {item.href === "/expertise" && (
                  <ul className="mb-4 grid grid-cols-2 gap-2">
                    {expertise.map((e) => (
                      <li key={e.slug}>
                        <Link
                          href={`/expertise/${e.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex min-h-11 items-center rounded-lg bg-surface px-3 text-sm"
                        >
                          {e.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-red text-base font-medium text-white"
            >
              Start a Project <ArrowUpRight aria-hidden className="size-4" />
            </Link>
            <a href={`mailto:${site.email}`} className="mt-4 block break-all text-center text-sm text-gray">
              {site.email}
            </a>
          </div>
        </nav>
      </dialog>
    </>
  );
}
