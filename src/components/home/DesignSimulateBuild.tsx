"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const WORDS = ["Design", "Simulate", "Build"];

function Word({ word, i, progress }: { word: string; i: number; progress: MotionValue<number> }) {
  const start = 0.12 + i * 0.12;
  const opacity = useTransform(progress, [start, start + 0.22], [0.55, 1]);
  const y = useTransform(progress, [start, start + 0.22], ["0.18em", "0em"]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {word}
    </motion.span>
  );
}

/**
 * Wide statement whose words respond subtly to scrolling (no scroll hijacking).
 * Font size is derived from the container width (cqw), so the whole line
 * always fits on one row on large screens and never clips.
 */
export function DesignSimulateBuild() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineScale = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);

  return (
    <div ref={ref} className="@container py-6">
      <p className="sr-only">Design, simulate, build.</p>
      <div
        aria-hidden
        className="font-display flex flex-col gap-y-2 text-[clamp(2rem,13cqw,4.5rem)] font-semibold uppercase leading-none tracking-[-0.01em] lg:flex-row lg:items-center lg:justify-between lg:gap-x-[0.35em] lg:text-[5.4cqw]"
      >
        {WORDS.map((w, i) => (
          <span key={w} className="flex items-center gap-[0.35em] whitespace-nowrap">
            <Word word={w} i={i} progress={scrollYProgress} />
            {i < WORDS.length - 1 && (
              <motion.span
                style={{ scaleX: lineScale }}
                className="hidden h-[0.07em] w-[0.9em] origin-left bg-red lg:inline-block"
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
