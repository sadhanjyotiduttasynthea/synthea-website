import type { IllustrationKey } from "@/content/expertise";

/*
 * Lightweight technical line illustrations for the expertise cards.
 * They animate subtly on card hover via `group-hover` utilities.
 */

const stroke = { stroke: "#111111", strokeWidth: 1.25, fill: "none", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function RoboticArmIllustration() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
      {/* trajectory */}
      <path
        d="M70 168 C 120 60, 230 50, 268 132"
        fill="none"
        stroke="#D71932"
        strokeWidth="1.25"
        strokeDasharray="4 6"
        className="animate-dash opacity-60 transition-opacity duration-500 group-hover:opacity-100"
      />
      <circle cx="70" cy="168" r="3" fill="#D71932" />
      <circle cx="268" cy="132" r="3" fill="#D71932" />
      {/* work surface */}
      <path d="M30 196 H 300" {...stroke} stroke="#AEB6C2" />
      {/* base */}
      <rect x="120" y="176" width="64" height="20" rx="3" fill="#F5F6F7" {...{ stroke: "#111", strokeWidth: 1.25 }} />
      <rect x="132" y="160" width="40" height="18" rx="3" fill="#fff" stroke="#111" strokeWidth="1.25" />
      {/* arm group rotates gently on hover */}
      <g className="origin-[152px_158px] transition-transform duration-700 ease-[var(--ease-precise)] group-hover:-rotate-6">
        <circle cx="152" cy="158" r="11" fill="#fff" stroke="#111" strokeWidth="1.25" />
        <circle cx="152" cy="158" r="3.5" fill="#D71932" />
        <path d="M146 150 L 176 82 L 190 88 L 160 156 Z" fill="#fff" stroke="#111" strokeWidth="1.25" />
        <g className="origin-[183px_82px] transition-transform duration-700 ease-[var(--ease-precise)] group-hover:rotate-12">
          <circle cx="183" cy="82" r="9" fill="#F5F6F7" stroke="#111" strokeWidth="1.25" />
          <path d="M188 76 L 246 96 L 242 108 L 184 90 Z" fill="#fff" stroke="#111" strokeWidth="1.25" />
          <circle cx="244" cy="102" r="6" fill="#fff" stroke="#111" strokeWidth="1.25" />
          <path d="M244 108 V 122 M238 122 H 250 M241 122 L 244 130 L 247 122" {...stroke} />
        </g>
      </g>
      <text x="30" y="24" className="fill-gray font-mono text-[9px] tracking-[0.12em]">
        J1 · J2 · J3 — TRAJECTORY
      </text>
    </svg>
  );
}

export function ExplodedAssemblyIllustration() {
  const part = "transition-transform duration-700 ease-[var(--ease-precise)]";
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
      {/* center axis */}
      <path d="M160 18 V 206" stroke="#D71932" strokeWidth="1" strokeDasharray="6 4 1 4" />
      {/* cap */}
      <g className={`${part} group-hover:-translate-y-3`}>
        <ellipse cx="160" cy="40" rx="42" ry="12" fill="#fff" stroke="#111" strokeWidth="1.25" />
        <path d="M118 40 V 50 A42 12 0 0 0 202 50 V 40" fill="#F5F6F7" stroke="#111" strokeWidth="1.25" />
        <ellipse cx="160" cy="40" rx="10" ry="3" fill="none" stroke="#111" strokeWidth="1.25" />
      </g>
      {/* bearing */}
      <g className={`${part} group-hover:-translate-y-1.5`}>
        <ellipse cx="160" cy="86" rx="30" ry="9" fill="#fff" stroke="#111" strokeWidth="1.25" />
        <path d="M130 86 V 94 A30 9 0 0 0 190 94 V 86" fill="#fff" stroke="#111" strokeWidth="1.25" />
        <ellipse cx="160" cy="86" rx="18" ry="5" fill="none" stroke="#D71932" strokeWidth="1.25" />
      </g>
      {/* shaft */}
      <g className={part}>
        <rect x="152" y="100" width="16" height="56" fill="#F5F6F7" stroke="#111" strokeWidth="1.25" />
        <ellipse cx="160" cy="100" rx="8" ry="2.5" fill="#fff" stroke="#111" strokeWidth="1.25" />
      </g>
      {/* housing */}
      <g className={`${part} group-hover:translate-y-3`}>
        <path d="M96 170 L 160 150 L 224 170 L 160 190 Z" fill="#fff" stroke="#111" strokeWidth="1.25" />
        <path d="M96 170 V 186 L 160 206 V 190 Z" fill="#F5F6F7" stroke="#111" strokeWidth="1.25" />
        <path d="M224 170 V 186 L 160 206 V 190 Z" fill="#E5E7EB" stroke="#111" strokeWidth="1.25" />
        <ellipse cx="160" cy="170" rx="14" ry="4.5" fill="#fff" stroke="#111" strokeWidth="1.25" />
      </g>
      {/* fasteners */}
      <g className={`${part} group-hover:-translate-x-2`}>
        <path d="M64 120 H 92 M64 116 V 124" stroke="#111" strokeWidth="1.25" />
      </g>
      <g className={`${part} group-hover:translate-x-2`}>
        <path d="M228 120 H 256 M256 116 V 124" stroke="#111" strokeWidth="1.25" />
      </g>
      <text x="236" y="44" className="fill-gray font-mono text-[9px] tracking-[0.12em]">
        A-01
      </text>
      <text x="200" y="90" className="fill-gray font-mono text-[9px] tracking-[0.12em]">
        A-02
      </text>
      <text x="236" y="168" className="fill-gray font-mono text-[9px] tracking-[0.12em]">
        A-03
      </text>
    </svg>
  );
}

export function ThermalIllustration() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="heat" cx="0.28" cy="0.62" r="0.85">
          <stop offset="0" stopColor="#D71932" />
          <stop offset="0.28" stopColor="#F2735A" />
          <stop offset="0.55" stopColor="#F7C7A8" />
          <stop offset="0.8" stopColor="#DDE3EA" />
          <stop offset="1" stopColor="#AEB6C2" />
        </radialGradient>
        <clipPath id="bracket-clip">
          <path d="M40 180 V 60 H 100 V 130 H 280 V 180 Z" />
        </clipPath>
        <pattern id="mesh" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0 L 0 0 0 10 M0 10 L 10 0" fill="none" stroke="#111" strokeOpacity="0.12" strokeWidth="0.6" />
        </pattern>
      </defs>
      <g clipPath="url(#bracket-clip)">
        <rect x="0" y="0" width="320" height="220" fill="url(#heat)" className="transition-transform duration-1000 ease-[var(--ease-precise)] group-hover:translate-x-4" />
        <rect x="0" y="0" width="320" height="220" fill="url(#mesh)" className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </g>
      <path d="M40 180 V 60 H 100 V 130 H 280 V 180 Z" fill="none" stroke="#111" strokeWidth="1.25" />
      <circle cx="70" cy="150" r="9" fill="#fff" stroke="#111" strokeWidth="1.25" />
      <circle cx="250" cy="155" r="7" fill="#fff" stroke="#111" strokeWidth="1.25" />
      {/* legend */}
      <defs>
        <linearGradient id="legend" x1="0" x2="1">
          <stop offset="0" stopColor="#AEB6C2" />
          <stop offset="0.5" stopColor="#F7C7A8" />
          <stop offset="1" stopColor="#D71932" />
        </linearGradient>
      </defs>
      <rect x="180" y="40" width="100" height="6" fill="url(#legend)" />
      <text x="180" y="30" className="fill-gray font-mono text-[9px] tracking-[0.12em]">
        ILLUSTRATIVE FIELD
      </text>
    </svg>
  );
}

export function DesignInterfaceIllustration() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden>
      <rect x="24" y="22" width="272" height="176" rx="10" fill="#fff" stroke="#111" strokeWidth="1.25" />
      <path d="M24 44 H 296" stroke="#E5E7EB" />
      <circle cx="38" cy="33" r="3" fill="#D71932" />
      <circle cx="49" cy="33" r="3" fill="#AEB6C2" />
      <circle cx="60" cy="33" r="3" fill="#AEB6C2" />
      {/* parameter panel */}
      <path d="M100 44 V 198" stroke="#E5E7EB" />
      {[64, 92, 120, 148].map((y, i) => (
        <g key={y}>
          <path d={`M36 ${y} H 88`} stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" />
          <path
            d={`M36 ${y} H ${52 + i * 9}`}
            stroke={i === 1 ? "#D71932" : "#111"}
            strokeWidth="2"
            strokeLinecap="round"
            className="transition-all duration-700 group-hover:[stroke-dashoffset:0]"
          />
          <circle cx={52 + i * 9} cy={y} r="3.5" fill="#fff" stroke="#111" strokeWidth="1.25" />
        </g>
      ))}
      <path d="M36 176 H 88" stroke="#111" strokeWidth="1.25" strokeDasharray="2 4" />
      {/* viewport with geometry */}
      <g transform="translate(198 121)">
        <g className="animate-spin-slow" style={{ transformOrigin: "0 0", transformBox: "view-box" }}>
          <polygon points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26" fill="none" stroke="#111" strokeWidth="1.25" />
          <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" fill="#F5F6F7" stroke="#111" strokeWidth="1.25" />
          <path d="M0 -52 V -30 M45 -26 L 26 -15 M45 26 L 26 15 M0 52 V 30 M-45 26 L -26 15 M-45 -26 L -26 -15" stroke="#111" strokeWidth="1" />
          <circle cx="0" cy="-52" r="3" fill="#D71932" />
        </g>
      </g>
      <path d="M118 186 H 280" stroke="#E5E7EB" />
      <path d="M118 186 C 160 150, 200 170, 280 130" fill="none" stroke="#D71932" strokeWidth="1.25" className="animate-dash" strokeDasharray="3 5" />
    </svg>
  );
}

export function ServiceIllustration({ name }: { name: IllustrationKey }) {
  switch (name) {
    case "robotics":
      return <RoboticArmIllustration />;
    case "design":
      return <ExplodedAssemblyIllustration />;
    case "simulation":
      return <ThermalIllustration />;
    case "automation":
      return <DesignInterfaceIllustration />;
  }
}
