"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>+-=#";

/**
 * Text that briefly "decodes" from random glyphs when it scrolls into view.
 * The real text is always in the DOM for screen readers; the animation layer
 * is aria-hidden. Disabled for reduced motion.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0;
    const total = 18;
    const id = window.setInterval(() => {
      frame++;
      const revealed = Math.floor((frame / total) * text.length);
      setDisplay(
        text
          .split("")
          .map((ch, i) => (i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (frame >= total) {
        window.clearInterval(id);
        setDisplay(text);
      }
    }, 34);
    return () => window.clearInterval(id);
  }, [inView, reduce, text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{display}</span>
    </span>
  );
}
