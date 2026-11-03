/**
 * Illustrative scalar fields for the simulation viewer.
 *
 * These are lightweight, qualitative computations (a steady diffusion solve,
 * a beam-bending stress approximation and a potential-flow solution). They
 * produce physically shaped pictures for explanation only — they are NOT
 * engineering simulation results and carry no numerical meaning.
 */

export const GRID_W = 240;
export const GRID_H = 150;

export type Field = {
  values: Float32Array; // normalised 0..1
  mask: Uint8Array; // 1 = inside solid / domain
};

type RGB = [number, number, number];

function hex(h: string): RGB {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function makeColormap(stops: string[]) {
  const cols = stops.map(hex);
  const lut = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = (i / 255) * (cols.length - 1);
    const k = Math.min(cols.length - 2, Math.floor(t));
    const f = t - k;
    for (let c = 0; c < 3; c++) lut[i * 3 + c] = cols[k][c] + (cols[k + 1][c] - cols[k][c]) * f;
  }
  return lut;
}

export const colormaps = {
  thermal: makeColormap(["#1B1D22", "#4A1222", "#9E1528", "#D71932", "#F2735A", "#F9C9A3", "#FFF4E8"]),
  structural: makeColormap(["#24344A", "#5C7894", "#AEB6C2", "#F3D9C4", "#F2735A", "#D71932"]),
  fluid: makeColormap(["#101114", "#1F2733", "#3A4A60", "#6F8299", "#B8C4D2", "#F2F4F7"]),
};

/* --------------------------------------------------------------------- */
/* Thermal: heat diffusing from a source through a finned heat sink        */
/* --------------------------------------------------------------------- */

export function thermalMask() {
  const mask = new Uint8Array(GRID_W * GRID_H);
  const baseTop = Math.round(GRID_H * 0.66);
  const baseBottom = Math.round(GRID_H * 0.8);
  const x0 = Math.round(GRID_W * 0.12);
  const x1 = Math.round(GRID_W * 0.88);
  const fins = 7;
  const finW = Math.round(GRID_W * 0.034);
  const finTop = Math.round(GRID_H * 0.16);
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      let inside = x >= x0 && x <= x1 && y >= baseTop && y <= baseBottom;
      if (!inside && y >= finTop && y < baseTop) {
        for (let f = 0; f < fins; f++) {
          const cx = x0 + ((f + 0.5) / fins) * (x1 - x0);
          // fins taper slightly towards the tip
          const half = finW / 2 + ((y - finTop) / (baseTop - finTop)) * 1.5;
          if (Math.abs(x - cx) <= half) inside = true;
        }
      }
      mask[y * GRID_W + x] = inside ? 1 : 0;
    }
  }
  return mask;
}

/** Run `iterations` of an in-place SOR diffusion solve with convective loss. */
export function thermalStep(T: Float32Array, mask: Uint8Array, iterations: number) {
  const srcY = Math.round(GRID_H * 0.8);
  const srcX0 = Math.round(GRID_W * 0.4);
  const srcX1 = Math.round(GRID_W * 0.6);
  const h = 0.0018; // convective loss to ambient
  const omega = 1.85;
  for (let it = 0; it < iterations; it++) {
    for (let y = 1; y < GRID_H - 1; y++) {
      for (let x = 1; x < GRID_W - 1; x++) {
        const i = y * GRID_W + x;
        if (!mask[i]) continue;
        if (y >= srcY - 1 && x >= srcX0 && x <= srcX1) {
          T[i] = 1;
          continue;
        }
        let sum = 0;
        let n = 0;
        let exposed = 0;
        for (const j of [i - 1, i + 1, i - GRID_W, i + GRID_W]) {
          if (mask[j]) {
            sum += T[j];
            n++;
          } else exposed++;
        }
        const target = n ? sum / (n + h * (1 + exposed * 8)) : 0;
        T[i] += omega * (target - T[i]);
      }
    }
  }
}

/* --------------------------------------------------------------------- */
/* Structural: cantilever plate with a hole, tip load                     */
/* --------------------------------------------------------------------- */

export const structuralGeometry = {
  x0: 0.12,
  x1: 0.86,
  yTop: 0.32,
  yBot: 0.66,
  hole: { cx: 0.42, cy: 0.49, r: 0.075 },
};

export function structuralField(): Field {
  const { x0, x1, yTop, yBot, hole } = structuralGeometry;
  const values = new Float32Array(GRID_W * GRID_H);
  const mask = new Uint8Array(GRID_W * GRID_H);
  const aspect = GRID_W / GRID_H;
  let max = 0;
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const u = x / (GRID_W - 1);
      const v = y / (GRID_H - 1);
      // plate tapers towards the loaded tip
      const taper = (u - x0) / (x1 - x0);
      const top = yTop + taper * 0.06;
      const bot = yBot - taper * 0.06;
      const dx = (u - hole.cx) * aspect;
      const dy = v - hole.cy;
      const r = Math.hypot(dx, dy);
      const inside = u >= x0 && u <= x1 && v >= top && v <= bot && r > hole.r;
      if (!inside) continue;
      const i = y * GRID_W + x;
      mask[i] = 1;
      // bending: moment grows towards the fixed support; stress grows with distance from the neutral axis
      const mid = (top + bot) / 2;
      const halfH = (bot - top) / 2;
      const moment = 1 - taper;
      const bending = (moment * Math.abs(v - mid)) / (halfH * halfH) * 0.12;
      // stress concentration around the hole (Kirsch-like shape)
      const theta = Math.atan2(dy, dx);
      const a2 = (hole.r * hole.r) / (r * r);
      const kt = 1 + 0.5 * a2 + 1.5 * a2 * a2 * Math.cos(2 * theta) * -1;
      const nominal = 0.55 * (1 - Math.abs(taper - 0.4));
      const s = Math.abs(bending + nominal * 0.35 * Math.max(0, kt));
      values[i] = s;
      if (s > max) max = s;
    }
  }
  for (let i = 0; i < values.length; i++) values[i] = Math.pow(values[i] / max, 0.75);
  return { values, mask };
}

/* --------------------------------------------------------------------- */
/* Fluid: potential flow around a cylinder with a perturbed wake           */
/* --------------------------------------------------------------------- */

export const cylinder = { cx: 0.32, cy: 0.5, r: 0.11 };

/** Velocity at normalised coordinates (u,v) in [0,1], time t. */
export function velocity(u: number, v: number, t: number): [number, number] {
  const aspect = GRID_W / GRID_H;
  const x = (u - cylinder.cx) * aspect;
  const y = v - cylinder.cy;
  const r2 = x * x + y * y;
  const a2 = cylinder.r * cylinder.r;
  if (r2 < a2) return [0, 0];
  const r4 = r2 * r2;
  let vx = 1 - (a2 * (x * x - y * y)) / r4;
  let vy = (-2 * a2 * x * y) / r4;
  // Illustrative wake: oscillation downstream of the cylinder
  if (x > 0) {
    const decay = Math.exp(-(y * y) / 0.02) * Math.min(1, x / 0.25);
    vy += 0.35 * decay * Math.sin(x * 14 - t * 2.2);
    vx -= 0.45 * decay * Math.exp(-x * 1.4);
  }
  return [vx, vy];
}

export function fluidField(t: number): Field {
  const values = new Float32Array(GRID_W * GRID_H);
  const mask = new Uint8Array(GRID_W * GRID_H);
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const i = y * GRID_W + x;
      const [vx, vy] = velocity(x / (GRID_W - 1), y / (GRID_H - 1), t);
      const s = Math.hypot(vx, vy);
      mask[i] = s > 0 ? 1 : 0;
      values[i] = Math.min(1, s / 1.9);
    }
  }
  return { values, mask };
}

/** Render a field into RGBA pixels, with optional iso-contour lines. */
export function paintField(
  image: ImageData,
  field: Field,
  lut: Uint8ClampedArray,
  { contours = 0, background = [0, 0, 0, 0] as [number, number, number, number] } = {},
) {
  const d = image.data;
  for (let i = 0; i < field.values.length; i++) {
    const o = i * 4;
    if (!field.mask[i]) {
      d[o] = background[0];
      d[o + 1] = background[1];
      d[o + 2] = background[2];
      d[o + 3] = background[3];
      continue;
    }
    const val = Math.max(0, Math.min(1, field.values[i]));
    const k = Math.round(val * 255) * 3;
    let r = lut[k];
    let g = lut[k + 1];
    let b = lut[k + 2];
    if (contours) {
      const f = (val * contours) % 1;
      if (f < 0.06) {
        r *= 0.82;
        g *= 0.82;
        b *= 0.82;
      }
    }
    d[o] = r;
    d[o + 1] = g;
    d[o + 2] = b;
    d[o + 3] = 255;
  }
}
