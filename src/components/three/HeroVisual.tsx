"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { VisualizationMode } from "./RobotScene";
import { VisualizationModeSelector } from "./VisualizationModeSelector";

const RobotScene = dynamic(() => import("./RobotScene"), { ssr: false });

const CAPTIONS: Record<VisualizationMode, string> = {
  real: "Articulated robotic mechanism — solid model",
  cad: "Engineering wireframe — feature edges",
  analysis: "Conceptual tool-path visualization — illustrative",
};

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
}

function useMedia(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

const noop = () => () => {};

/**
 * Hero visualization: lazily loads the WebGL robot scene and shows a
 * pre-rendered image of the same model until it is ready (and as the
 * fallback when WebGL is unavailable).
 */
export function HeroVisual() {
  const [mode, setMode] = useState<VisualizationMode>("real");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const wrapper = useRef<HTMLDivElement>(null);

  const finePointer = useMedia("(hover: hover) and (pointer: fine)");
  const wide = useMedia("(min-width: 768px)");
  const reducedMotion = useMedia("(prefers-reduced-motion: reduce)");
  const webgl = useSyncExternalStore(noop, hasWebGL, () => false);

  // Pause rendering when the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const quality = wide && finePointer ? "high" : "low";

  return (
    <div ref={wrapper} className="relative h-full w-full">
      {/* Poster / fallback: a render of the same model */}
      <Image
        src={`/images/robot-${mode === "real" ? "real" : mode}.png`}
        alt=""
        aria-hidden
        fill
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        className={`object-contain transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />

      {webgl && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <RobotScene
            mode={mode}
            interactive={finePointer}
            quality={quality}
            still={reducedMotion}
            paused={!visible}
            onReady={() => setReady(true)}
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div className="pointer-events-auto">
          <VisualizationModeSelector mode={mode} onChange={setMode} />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={mode}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-gray"
            aria-live="polite"
          >
            {CAPTIONS[mode]}
          </motion.p>
        </AnimatePresence>
      </div>

      {webgl && finePointer && ready && (
        <p className="pointer-events-none absolute right-4 top-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-gray/80 sm:right-6 sm:top-6">
          Drag to rotate
        </p>
      )}
    </div>
  );
}
