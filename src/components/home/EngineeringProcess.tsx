"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { processSteps, type ProcessStage } from "@/content/home";
import { DispenserIllustration } from "@/components/illustrations/DispenserIllustration";
import { cn } from "@/lib/cn";

/**
 * Five-step workflow told through one example: a conceptual precision
 * robotic dispensing mechanism. Split layout on desktop; on mobile the steps
 * become a vertical progression with the illustration inside the active step.
 */
export function EngineeringProcess() {
  const [active, setActive] = useState<ProcessStage>("discover");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = processSteps.findIndex((s) => s.id === active);
  const step = processSteps[activeIndex];

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + processSteps.length) % processSteps.length;
    setActive(processSteps[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        {/* Progress rail */}
        <div aria-hidden className="mb-6 h-px w-full bg-line">
          <motion.div
            className="h-px bg-red"
            animate={{ width: `${((activeIndex + 1) / processSteps.length) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div role="tablist" aria-label="Engineering process stages" aria-orientation="vertical">
          {processSteps.map((s, i) => {
            const selected = s.id === active;
            return (
              <div key={s.id} className="border-b border-line">
                <button
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  id={`process-tab-${s.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls="process-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(s.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="group flex min-h-16 w-full items-center gap-5 py-4 text-left"
                >
                  <span className={cn("font-mono text-xs tracking-[0.14em] transition-colors", selected ? "text-red" : "text-gray")}>
                    {s.index}
                  </span>
                  <span
                    className={cn(
                      "text-2xl font-medium tracking-tight transition-colors sm:text-3xl",
                      selected ? "text-ink" : "text-metal group-hover:text-ink",
                    )}
                  >
                    {s.title}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "ml-auto size-2 rounded-full transition-all duration-500",
                      selected ? "scale-100 bg-red" : "scale-50 bg-line",
                    )}
                  />
                </button>

                {/* Mobile: content expands under the active step */}
                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden lg:hidden"
                    >
                      <div className="pb-6">
                        <div className="aspect-[4/3] rounded-xl bg-surface p-3">
                          <DispenserIllustration stage={s.id} uid="dsp-m" />
                        </div>
                        <p className="mt-5 leading-relaxed text-gray">{s.text}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-gray">
          Example: a conceptual precision robotic dispensing mechanism. Visuals are illustrative.
        </p>
      </div>

      {/* Desktop panel */}
      <div
        id="process-panel"
        role="tabpanel"
        aria-labelledby={`process-tab-${active}`}
        className="hidden lg:col-span-7 lg:block"
      >
        <div className="sticky top-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface">
            <div aria-hidden className="tech-grid absolute inset-0 opacity-60" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.985, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.01, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 p-8"
              >
                <DispenserIllustration stage={active} />
              </motion.div>
            </AnimatePresence>
            <span className="absolute left-5 top-5 rounded-full border border-line bg-white px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gray">
              Stage {step.index} · {step.title}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="mt-8 grid grid-cols-5 gap-8"
            >
              <p className="col-span-3 text-lead leading-relaxed text-gray">{step.text}</p>
              <ul className="col-span-2 space-y-3 border-l border-line pl-6">
                {step.detail.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-sm">
                    <span aria-hidden className="h-px w-3 bg-red" />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
