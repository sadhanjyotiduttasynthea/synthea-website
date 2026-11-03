"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const WORDS = ["Design", "Simulate", "Build"];

function Word({ word, i, progress }: { word: string; i: number; progress: MotionValue<number> }) {
  const start = i * 0.18;
  const opacity = useTransform(progress, [start, start + 0.3], [0.55, 1]);
  const x = useTransform(progress, [0, 1], [i === 1 ? 12 : 0, i === 1 ? -12 : 0]);
  return (
    <motion.span style={{ opacity, x }} className="inline-block">
      {word}
    </motion.span>
  );
}

/** Wide statement whose words respond subtly to scrolling (no scroll hijacking). */
export function DesignSimulateBuild() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const arrowScale = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);

  return (
    <div ref={ref} className="overflow-hidden py-6">
      <p className="sr-only">Design, simulate, build.</p>
      <div
        aria-hidden
        className="flex flex-col gap-y-1 text-[clamp(2.75rem,1rem+9vw,5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.05em] lg:flex-row lg:items-center lg:justify-between lg:gap-x-6 lg:text-[clamp(3rem,0.5rem+5vw,7rem)]"
      >
        {WORDS.map((w, i) => (
          <span key={w} aria-hidden className="flex items-center gap-4 whitespace-nowrap lg:gap-6">
            <Word word={w} i={i} progress={scrollYProgress} />
            {i < WORDS.length - 1 && (
              <motion.span
                style={{ scaleX: arrowScale }}
                className="hidden h-[0.06em] w-[0.7em] origin-left bg-red lg:inline-block"
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
