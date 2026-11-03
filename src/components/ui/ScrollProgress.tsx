"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin red reading-progress line at the very top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-red"
    />
  );
}
