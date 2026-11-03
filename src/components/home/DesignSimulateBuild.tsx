"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const WORDS = ["Design", "Simulate", "Build"];

function Word({ word, i, progress }: { word: string; i: number; progress: MotionValue<number> }) {
  const start = i * 0.18;
  const opacity = useTransform(progress, [start, start + 0.3], [0.18, 1]);
  const x = useTransform(progress, [0, 1], [i % 2 === 0 ? -24 : 24, i % 2 === 0 ? 24 : -24]);
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
      <p
        aria-label="Design, simulate, build"
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[clamp(2.6rem,1rem+7vw,9rem)] font-semibold uppercase leading-none tracking-[-0.05em]"
      >
        {WORDS.map((w, i) => (
          <span key={w} aria-hidden className="flex items-center gap-6">
            <Word word={w} i={i} progress={scrollYProgress} />
            {i < WORDS.length - 1 && (
              <motion.span
                style={{ scaleX: arrowScale }}
                className="hidden h-[0.06em] w-[0.8em] origin-left bg-red sm:inline-block"
              />
            )}
          </span>
        ))}
      </p>
    </div>
  );
}
