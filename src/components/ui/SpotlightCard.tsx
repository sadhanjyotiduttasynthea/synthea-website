"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Wrapper adding a cursor-following light and a very slight 3D tilt
 * (fine pointers only, off for reduced motion).
 */
export function SpotlightCard({ children, className, tilt = 4 }: { children: React.ReactNode; className?: string; tilt?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), { stiffness: 180, damping: 20 });
  const glow = useMotionValue("radial-gradient(420px circle at 50% 50%, rgba(215,25,50,0), transparent 60%)");

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    glow.set(`radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(215,25,50,0.09), transparent 60%)`);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    glow.set("radial-gradient(420px circle at 50% 50%, rgba(215,25,50,0), transparent 60%)");
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn("relative h-full", className)}
    >
      {children}
      <motion.div aria-hidden style={{ background: glow }} className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]" />
    </motion.div>
  );
}
