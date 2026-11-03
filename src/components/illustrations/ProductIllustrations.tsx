import type { ProductIllustration } from "@/content/products";

/*
 * Illustrative product drawings (not photographs). Same technical line-art
 * language as the rest of the site: ink strokes, light fills, red accents,
 * chocolate tones only where the product itself is chocolate or dough.
 */

const INK = "#111111";
const LIGHT = "#F5F6F7";
const MID = "#E5E7EB";
const METAL = "#AEB6C2";
const RED = "#D71932";
const CHOC = "#5B3424";
const CHOC_LIGHT = "#8A5A3C";
const s = { stroke: INK, strokeWidth: 1.4, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Label({ text = "ILLUSTRATION" }: { text?: string }) {
  return (
    <text x="20" y="28" fill={RED} className="font-mono" fontSize="11" letterSpacing="1.4">
      {text}
    </text>
  );
}

function Callout({ x, y, tx, ty, text }: { x: number; y: number; tx: number; ty: number; text: string }) {
  return (
    <g className="font-mono" fontSize="10" letterSpacing="1" fill="#646B78">
      <circle cx={x} cy={y} r="3" fill={RED} />
      <path d={`M${x} ${y} L ${tx} ${ty} H ${tx + 110}`} stroke={INK} strokeOpacity="0.35" fill="none" />
      <text x={tx + 4} y={ty - 6}>
        {text}
      </text>
    </g>
  );
}

export function ChocolatePrinterIllustration() {
  return (
    <svg viewBox="0 0 540 360" className="h-full w-full" role="img" aria-label="Illustration of a chocolate 3D food printer">
      <Label />
      <ellipse cx="220" cy="326" rx="170" ry="12" fill={INK} opacity="0.08" />
      {/* base */}
      <path d="M70 290 L 220 318 L 370 290 L 370 306 L 220 334 L 70 306 Z" fill={LIGHT} {...s} />
      <path d="M70 290 L 220 262 L 370 290 L 220 318 Z" fill="#fff" {...s} />
      {/* frame */}
      <path d="M86 290 V 92 M354 290 V 92 M220 262 V 64" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M86 92 L 220 64 L 354 92 L 220 120 Z" fill="none" {...s} />
      {/* gantry rails */}
      <path d="M118 104 L 250 76 M190 120 L 322 92" {...s} fill="none" />
      <path d="M150 112 L 286 140" stroke={INK} strokeWidth="8" strokeLinecap="round" />
      <path d="M150 112 L 286 140" stroke={METAL} strokeWidth="5" strokeLinecap="round" />
      {/* print head with chocolate cartridge */}
      <rect x="206" y="104" width="34" height="56" rx="5" fill="#fff" {...s} />
      <rect x="211" y="112" width="24" height="34" rx="3" fill={CHOC} />
      <rect x="206" y="150" width="34" height="5" fill={RED} />
      <path d="M216 160 L 230 160 L 226 182 L 220 182 Z" fill={INK} />
      {/* printed chocolate piece: stacked layers */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ellipse key={i} cx="223" cy={268 - i * 9} rx={44 - i * 3} ry={13 - i * 0.8} fill={i % 2 ? CHOC_LIGHT : CHOC} stroke="#3A2016" strokeWidth="0.8" />
      ))}
      <path d="M223 186 V 200" stroke={RED} strokeDasharray="3 3" />
      <Callout x={240} y={128} tx={372} ty={176} text="HEATED CARTRIDGE" />
      <Callout x={262} y={250} tx={372} ty={236} text="LAYER BY LAYER" />
      <Callout x={280} y={139} tx={372} ty={96} text="MOTION SYSTEM" />
    </svg>
  );
}

export function IceCreamRobotIllustration() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" role="img" aria-label="Illustration of a robotic ice-cream delivery machine">
      <Label />
      <ellipse cx="230" cy="330" rx="170" ry="12" fill={INK} opacity="0.08" />
      {/* kiosk */}
      <rect x="90" y="190" width="280" height="134" rx="10" fill="#fff" {...s} />
      <rect x="90" y="190" width="280" height="18" rx="6" fill={LIGHT} {...s} />
      <rect x="112" y="226" width="80" height="80" rx="6" fill={LIGHT} {...s} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={130 + i * 22} cy="246" r="8" fill={["#F6D8C8", "#F3E6B5", "#D9B4A0"][i]} {...s} />
      ))}
      <path d="M118 270 H 186 M118 288 H 186" stroke={MID} />
      <rect x="300" y="226" width="50" height="34" rx="4" fill={INK} />
      <path d="M308 236 H 336 M308 246 H 326" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      {/* glass dome */}
      <path d="M110 190 C 110 80, 350 80, 350 190" fill="#AEB6C2" fillOpacity="0.12" {...s} />
      {/* robot arm */}
      <rect x="208" y="166" width="44" height="24" rx="4" fill="#2B2E34" />
      <circle cx="230" cy="160" r="12" fill="#fff" {...s} />
      <path d="M226 152 L 202 108 L 214 102 L 238 148 Z" fill="#fff" {...s} />
      <circle cx="208" cy="104" r="9" fill={LIGHT} {...s} />
      <path d="M212 96 L 268 84 L 271 96 L 214 110 Z" fill="#fff" {...s} />
      <circle cx="270" cy="90" r="5" fill={RED} />
      {/* cone held by the gripper */}
      <path d="M276 96 L 292 96 L 284 128 Z" fill="#D9A066" {...s} />
      <circle cx="284" cy="90" r="11" fill="#F6D8C8" {...s} />
      {/* serving hatch */}
      <rect x="236" y="226" width="48" height="34" rx="4" fill={LIGHT} {...s} />
      <path d="M236 243 H 284" stroke={RED} />
      <Callout x={270} y={90} tx={330} ty={70} text="ROBOTIC SERVING" />
      <Callout x={260} y={243} tx={300} ty={292} text="SERVING HATCH" />
    </svg>
  );
}

export function CookieAutomationIllustration() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" role="img" aria-label="Illustration of a cookie automation machine">
      <Label />
      <ellipse cx="240" cy="326" rx="200" ry="12" fill={INK} opacity="0.08" />
      {/* frame legs */}
      <path d="M70 230 V 316 M410 230 V 316" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      {/* conveyor */}
      <rect x="50" y="214" width="380" height="26" rx="13" fill={LIGHT} {...s} />
      <circle cx="63" cy="227" r="9" fill="#fff" {...s} />
      <circle cx="417" cy="227" r="9" fill="#fff" {...s} />
      <path d="M80 222 H 400" stroke={MID} strokeDasharray="10 8" className="animate-dash" />
      {/* cookies: dough → dosed → decorated */}
      <ellipse cx="110" cy="210" rx="20" ry="6" fill={CHOC_LIGHT} {...s} />
      <ellipse cx="190" cy="210" rx="22" ry="7" fill="#C89260" {...s} />
      <ellipse cx="290" cy="210" rx="22" ry="7" fill="#C89260" {...s} />
      <path d="M276 208 C 284 202, 296 214, 304 206" stroke={CHOC} strokeWidth="2.5" fill="none" />
      <ellipse cx="370" cy="210" rx="22" ry="7" fill="#C89260" {...s} />
      <path d="M356 208 C 364 202, 376 214, 384 206" stroke={CHOC} strokeWidth="2.5" fill="none" />
      {/* gantry */}
      <path d="M150 214 V 70 M330 214 V 70" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <rect x="140" y="60" width="200" height="20" rx="4" fill="#fff" {...s} />
      {/* dosing head */}
      <rect x="170" y="80" width="40" height="70" rx="5" fill="#fff" {...s} />
      <rect x="176" y="88" width="28" height="40" rx="3" fill={CHOC_LIGHT} />
      <path d="M182 150 L 198 150 L 193 172 L 187 172 Z" fill={INK} />
      <path d="M190 176 V 198" stroke={RED} strokeDasharray="3 3" />
      {/* decorating head */}
      <rect x="270" y="80" width="40" height="70" rx="5" fill="#fff" {...s} />
      <rect x="276" y="88" width="28" height="40" rx="3" fill={CHOC} />
      <rect x="270" y="142" width="40" height="5" fill={RED} />
      <path d="M282 150 L 298 150 L 293 172 L 287 172 Z" fill={INK} />
      <Callout x={170} y={110} tx={40} ty={130} text="DOSING" />
      <Callout x={310} y={110} tx={340} ty={110} text="DECORATING" />
      <text x="190" y="280" className="font-mono" fontSize="10" letterSpacing="1" fill="#646B78">
        CONVEYOR →
      </text>
    </svg>
  );
}

export function DeliveryRobotIllustration() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" role="img" aria-label="Illustration of a restaurant delivery robot">
      <Label />
      {/* floor path */}
      <path d="M40 318 C 140 290, 300 340, 450 300" stroke={RED} strokeDasharray="6 6" fill="none" className="animate-dash" />
      <ellipse cx="200" cy="320" rx="80" ry="10" fill={INK} opacity="0.1" />
      {/* table */}
      <path d="M330 220 H 440 M350 220 V 300 M420 220 V 300" {...s} fill="none" strokeWidth="3" />
      <ellipse cx="372" cy="214" rx="16" ry="5" fill="#fff" {...s} />
      {/* robot base */}
      <rect x="140" y="270" width="120" height="44" rx="18" fill="#2B2E34" />
      <circle cx="162" cy="314" r="7" fill={INK} />
      <circle cx="238" cy="314" r="7" fill={INK} />
      <rect x="146" y="284" width="108" height="4" fill={RED} />
      {/* body */}
      <path d="M160 270 L 172 92 H 228 L 240 270 Z" fill="#fff" {...s} />
      {/* trays */}
      {[140, 190, 240].map((y) => (
        <g key={y}>
          <rect x="128" y={y} width="144" height="10" rx="5" fill={LIGHT} {...s} />
        </g>
      ))}
      <ellipse cx="172" cy="136" rx="20" ry="6" fill="#fff" {...s} />
      <path d="M160 132 C 166 124, 178 124, 184 132" stroke={CHOC_LIGHT} strokeWidth="3" fill="none" />
      <rect x="214" y="122" width="14" height="18" rx="2" fill="#fff" {...s} />
      <ellipse cx="226" cy="186" rx="22" ry="6" fill="#fff" {...s} />
      <path d="M212 182 C 220 172, 232 172, 240 182" stroke="#E7A07A" strokeWidth="3" fill="none" />
      {/* head display */}
      <rect x="164" y="48" width="72" height="46" rx="10" fill={INK} />
      <rect x="172" y="56" width="56" height="30" rx="5" fill="#1F2733" />
      <path d="M180 66 H 210 M180 76 H 200" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="220" cy="70" r="3" fill={RED} />
      {/* sensors */}
      <rect x="182" y="256" width="36" height="8" rx="4" fill={INK} />
      <path d="M218 260 L 300 236 M218 260 L 300 284" stroke={RED} strokeOpacity="0.4" strokeDasharray="2 4" />
      <Callout x={200} y={70} tx={260} ty={50} text="DISPLAY & STATUS" />
      <Callout x={272} y={195} tx={290} ty={160} text="MULTI-TRAY" />
      <Callout x={200} y={260} tx={20} ty={250} text="SENSORS" />
    </svg>
  );
}

export function ProductIllustrationView({ name }: { name: ProductIllustration }) {
  switch (name) {
    case "chocolate-printer":
      return <ChocolatePrinterIllustration />;
    case "icecream-robot":
      return <IceCreamRobotIllustration />;
    case "cookie-automation":
      return <CookieAutomationIllustration />;
    case "delivery-robot":
      return <DeliveryRobotIllustration />;
  }
}
