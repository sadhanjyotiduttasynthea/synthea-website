"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { simulationModes, type SimulationMode } from "@/content/home";
import { cn } from "@/lib/cn";
import {
  GRID_H,
  GRID_W,
  colormaps,
  cylinder,
  fluidField,
  paintField,
  structuralField,
  structuralGeometry,
  thermalMask,
  thermalStep,
  velocity,
  type Field,
} from "./fields";

const CANVAS_W = 960;
const CANVAS_H = 600;
const LEGEND: Record<SimulationMode, string> = {
  thermal: "linear-gradient(to right,#1B1D22,#9E1528,#D71932,#F2735A,#F9C9A3,#FFF4E8)",
  structural: "linear-gradient(to right,#24344A,#5C7894,#AEB6C2,#F3D9C4,#F2735A,#D71932)",
  fluid: "linear-gradient(to right,#101114,#3A4A60,#6F8299,#B8C4D2,#F2F4F7)",
};

/** Draws an illustrative field for the active mode, animating where useful. */
function SimulationCanvas({ mode }: { mode: SimulationMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const off = document.createElement("canvas");
    off.width = GRID_W;
    off.height = GRID_H;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;
    const image = offCtx.createImageData(GRID_W, GRID_H);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const blit = () => {
      offCtx.putImageData(image, 0, 0);
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, CANVAS_W, CANVAS_H);
    };

    const sx = CANVAS_W / (GRID_W - 1);
    const sy = CANVAS_H / (GRID_H - 1);

    // ---------------- Thermal ----------------
    const tMask = thermalMask();
    const T = new Float32Array(GRID_W * GRID_H);
    let thermalIters = 0;
    const thermalDisplay: Field = { values: new Float32Array(T.length), mask: tMask };

    const drawThermal = () => {
      for (let i = 0; i < T.length; i++) thermalDisplay.values[i] = Math.pow(T[i], 0.55);
      paintField(image, thermalDisplay, colormaps.thermal, { contours: 12 });
      blit();
      // source marker
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(GRID_W * 0.4 * sx, GRID_H * 0.8 * sy - 2, GRID_W * 0.2 * sx, 10);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.font = "500 18px ui-monospace, monospace";
      ctx.fillText("HEAT SOURCE", GRID_W * 0.4 * sx, GRID_H * 0.8 * sy + 38);
    };

    // ---------------- Structural ----------------
    const sField = structuralField();
    const drawStructural = (time: number) => {
      paintField(image, sField, colormaps.structural, { contours: 10 });
      blit();
      const g = structuralGeometry;
      // fixed support hatch
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 2;
      const fx = g.x0 * CANVAS_W;
      ctx.beginPath();
      ctx.moveTo(fx, g.yTop * CANVAS_H - 20);
      ctx.lineTo(fx, g.yBot * CANVAS_H + 20);
      ctx.stroke();
      for (let y = g.yTop * CANVAS_H - 20; y < g.yBot * CANVAS_H + 20; y += 16) {
        ctx.beginPath();
        ctx.moveTo(fx, y);
        ctx.lineTo(fx - 14, y + 14);
        ctx.stroke();
      }
      // load arrow (gently pulsing)
      const pulse = reduce ? 0 : Math.sin(time * 2) * 4;
      const ax = g.x1 * CANVAS_W - 8;
      const ay = (g.yTop + 0.06) * CANVAS_H;
      ctx.strokeStyle = "#ffffff";
      ctx.fillStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ax, ay - 110 + pulse);
      ctx.lineTo(ax, ay - 14 + pulse);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax - 9, ay - 24 + pulse);
      ctx.lineTo(ax, ay - 6 + pulse);
      ctx.lineTo(ax + 9, ay - 24 + pulse);
      ctx.fill();
      ctx.font = "500 18px ui-monospace, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText("LOAD", ax - 70, ay - 90);
      ctx.fillText("FIXED", fx - 30, g.yBot * CANVAS_H + 56);
      // exaggerated deformed outline
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const u = g.x0 + (i / 40) * (g.x1 - g.x0);
        const s = (i / 40) ** 2 * 0.07;
        const top = g.yTop + (i / 40) * 0.06 + s;
        if (i === 0) ctx.moveTo(u * CANVAS_W, top * CANVAS_H);
        else ctx.lineTo(u * CANVAS_W, top * CANVAS_H);
      }
      for (let i = 40; i >= 0; i--) {
        const u = g.x0 + (i / 40) * (g.x1 - g.x0);
        const s = (i / 40) ** 2 * 0.07;
        const bot = g.yBot - (i / 40) * 0.06 + s;
        ctx.lineTo(u * CANVAS_W, bot * CANVAS_H);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // ---------------- Fluid ----------------
    type Particle = { u: number; v: number; age: number; trail: [number, number][] };
    const particles: Particle[] = [];
    const spawn = (p?: Particle): Particle => {
      const np = p ?? { u: 0, v: 0, age: 0, trail: [] };
      np.u = Math.random() * 0.05;
      np.v = 0.04 + Math.random() * 0.92;
      np.age = 0;
      np.trail = [];
      return np;
    };
    for (let i = 0; i < 170; i++) {
      const p = spawn();
      p.u = Math.random();
      particles.push(p);
    }
    let fluidT = 0;
    let lastFieldUpdate = -1;
    let fField = fluidField(0);

    const drawFluid = (dt: number) => {
      fluidT += dt;
      if (fluidT - lastFieldUpdate > 0.08 || lastFieldUpdate < 0) {
        fField = fluidField(fluidT);
        lastFieldUpdate = fluidT;
      }
      paintField(image, fField, colormaps.fluid, { contours: 14 });
      blit();
      // cylinder
      ctx.fillStyle = "#101114";
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cylinder.cx * CANVAS_W, cylinder.cy * CANVAS_H, cylinder.r * CANVAS_H, cylinder.r * CANVAS_H, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // particles
      const speed = 0.12;
      for (const p of particles) {
        if (!reduce) {
          const [vx, vy] = velocity(p.u, p.v, fluidT);
          p.u += vx * speed * dt;
          p.v += vy * speed * dt * (GRID_W / GRID_H);
          p.age += dt;
          p.trail.push([p.u, p.v]);
          if (p.trail.length > 14) p.trail.shift();
        }
        if (p.u > 1.02 || p.v < -0.02 || p.v > 1.02 || (vxZero(p) && p.age > 0.5)) spawn(p);
        if (p.trail.length > 1) {
          ctx.strokeStyle = "rgba(215,25,50,0.85)";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(p.trail[0][0] * CANVAS_W, p.trail[0][1] * CANVAS_H);
          for (const [u, v] of p.trail) ctx.lineTo(u * CANVAS_W, v * CANVAS_H);
          ctx.stroke();
        }
      }
      ctx.font = "500 18px ui-monospace, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText("FLOW →", 28, 40);
    };
    const vxZero = (p: Particle) => {
      const [vx, vy] = velocity(p.u, p.v, fluidT);
      return Math.hypot(vx, vy) < 0.02;
    };

    // ---------------- Loop ----------------
    let last = performance.now();
    function loop(now: number) {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let keepGoing = !reduce;
      if (mode === "thermal") {
        if (reduce) {
          thermalStep(T, tMask, 700);
          thermalIters = 700;
        } else if (thermalIters < 700) {
          thermalStep(T, tMask, 10);
          thermalIters += 10;
        } else keepGoing = false;
        drawThermal();
      } else if (mode === "structural") {
        drawStructural(now / 1000);
      } else {
        drawFluid(dt);
      }
      if (keepGoing && visible) raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [mode, reduce]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="h-full w-full"
      role="img"
      aria-label={`Illustrative ${mode} visualization`}
    />
  );
}

export function SimulationTabs() {
  const [active, setActive] = useState<SimulationMode>("thermal");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = simulationModes.find((m) => m.id === active)!;

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % simulationModes.length;
    if (e.key === "ArrowLeft") next = (index - 1 + simulationModes.length) % simulationModes.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = simulationModes.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(simulationModes[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-4">
        <div role="tablist" aria-label="Simulation type" className="flex flex-wrap gap-2 lg:flex-col lg:gap-0">
          {simulationModes.map((m, i) => {
            const selected = m.id === active;
            return (
              <button
                key={m.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`sim-tab-${m.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`sim-panel-${m.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(m.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "group relative flex min-h-12 items-center gap-4 rounded-full border px-5 text-left font-mono text-xs uppercase tracking-[0.16em] transition-colors lg:rounded-none lg:border-0 lg:border-t lg:border-line-dark lg:px-0 lg:py-6",
                  selected ? "border-red text-white" : "border-line-dark text-metal hover:text-white",
                )}
              >
                <span className={cn("hidden h-px transition-all duration-500 lg:block", selected ? "w-10 bg-red" : "w-4 bg-metal/40")} />
                <span className="text-red-bright">0{i + 1}</span>
                {m.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 lg:mt-10"
          >
            <h3 className="text-h3 font-medium text-white">{current.title}</h3>
            <p className="mt-4 leading-relaxed text-metal">{current.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="lg:col-span-8">
        <div
          id={`sim-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`sim-tab-${active}`}
          className="relative overflow-hidden rounded-2xl border border-line-dark bg-[#0c0d10]"
        >
          <div className="relative aspect-[8/5]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <SimulationCanvas mode={active} />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="tech-grid-dark pointer-events-none absolute inset-0 opacity-40" />
          </div>
          <div className="flex flex-col gap-3 border-t border-line-dark px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-metal">
              <span>{current.legend[0]}</span>
              <span aria-hidden className="h-1.5 w-28 rounded-full" style={{ background: LEGEND[active] }} />
              <span>{current.legend[1]}</span>
            </div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-red-bright">
              Illustrative visualization — not validated simulation data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
