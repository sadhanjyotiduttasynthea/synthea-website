"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import type { VisualizationMode } from "./RobotScene";
import { cn } from "@/lib/cn";

const MODES: { id: VisualizationMode; label: string; description: string }[] = [
  { id: "real", label: "Real", description: "Solid metallic model" },
  { id: "cad", label: "CAD", description: "Engineering wireframe" },
  { id: "analysis", label: "Analysis", description: "Conceptual motion-path visualization" },
];

/** Accessible radio-group style segmented control (arrow keys supported). */
export function VisualizationModeSelector({
  mode,
  onChange,
}: {
  mode: VisualizationMode;
  onChange: (mode: VisualizationMode) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (index + dir + MODES.length) % MODES.length;
    onChange(MODES[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label="Visualization mode"
      className="inline-flex items-center gap-1 rounded-full border border-line bg-white/85 p-1 shadow-sm backdrop-blur"
    >
      {MODES.map((m, i) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${m.label} — ${m.description}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(m.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative min-h-9 rounded-full px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors",
              active ? "text-white" : "text-gray hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId="viz-mode-pill"
                className="absolute inset-0 -z-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
