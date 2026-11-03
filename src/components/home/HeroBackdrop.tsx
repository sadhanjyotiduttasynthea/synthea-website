"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/** Technical grid with a slow scan line and a faint glow that follows the pointer. */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(70), { stiffness: 60, damping: 20 });
  const y = useSpring(useMotionValue(40), { stiffness: 60, damping: 20 });
  const background = useMotionTemplate`radial-gradient(520px circle at ${x}% ${y}%, rgba(215,25,50,0.07), transparent 65%)`;

  // Listen on window: the backdrop sits behind the hero content.
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      if (e.clientY > r.bottom) return;
      x.set(((e.clientX - r.left) / r.width) * 100);
      y.set(((e.clientY - r.top) / r.height) * 100);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="tech-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black_10%,transparent_70%)]" />
      <motion.div className="absolute inset-0" style={{ background }} />
      <div className="animate-scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red/50 to-transparent" />
    </div>
  );
}
