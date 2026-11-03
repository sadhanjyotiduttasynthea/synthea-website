import type { ProcessStage } from "@/content/home";

/**
 * Conceptual precision dispensing mechanism, drawn in the visual language of
 * each engineering stage. Illustrative only — not a depiction of a verified
 * Synthea project result.
 */
export function DispenserIllustration({ stage, uid = "dsp" }: { stage: ProcessStage; uid?: string }) {
  const sketch = stage === "discover";
  const solid = stage === "prototype" || stage === "validate";
  const sim = stage === "simulate";

  const line = sketch
    ? { stroke: "#6B7280", strokeWidth: 1.4, strokeDasharray: "5 4" }
    : { stroke: "#111111", strokeWidth: 1.25 };
  const fill = (light: string, dark: string) => (solid ? dark : sim ? "#FFFFFF" : sketch ? "none" : light);

  return (
    <svg viewBox="0 0 560 420" className="h-full w-full" role="img" aria-label={`Conceptual dispensing mechanism — ${stage} stage`}>
      <defs>
        <linearGradient id={`${uid}-metal-v`} x1="0" x2="1">
          <stop offset="0" stopColor="#8E97A3" />
          <stop offset="0.45" stopColor="#E8EBEF" />
          <stop offset="1" stopColor="#9AA3AE" />
        </linearGradient>
        <linearGradient id={`${uid}-metal-h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EEF0F2" />
          <stop offset="1" stopColor="#A7AFBA" />
        </linearGradient>
        <linearGradient id={`${uid}-beam-stress`} x1="0" x2="1">
          <stop offset="0" stopColor="#AEB6C2" />
          <stop offset="0.35" stopColor="#F7C7A8" />
          <stop offset="0.5" stopColor="#D71932" />
          <stop offset="0.65" stopColor="#F7C7A8" />
          <stop offset="1" stopColor="#AEB6C2" />
        </linearGradient>
        <radialGradient id={`${uid}-barrel-heat`} cx="0.5" cy="0.7" r="0.7">
          <stop offset="0" stopColor="#D71932" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#F2735A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F7C7A8" stopOpacity="0.1" />
        </radialGradient>
        <pattern id={`${uid}-blueprint`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H 0 V 20" fill="none" stroke="#111" strokeOpacity="0.06" />
        </pattern>
      </defs>

      {stage === "design" && <rect width="560" height="420" fill={`url(#${uid}-blueprint)`} />}

      {/* Shadow for physical stages */}
      {solid && <ellipse cx="280" cy="372" rx="210" ry="14" fill="#111" opacity="0.12" />}

      {/* Build plate */}
      <path d="M90 340 L 470 340 L 500 362 L 60 362 Z" fill={fill("#F5F6F7", `url(#${uid}-metal-h)`)} {...line} />
      <path d="M60 362 V 370 H 500 V 362" fill={solid ? "#8E97A3" : "none"} {...line} />

      {/* Deposited pattern on the plate */}
      <path
        d="M170 350 C 210 338, 250 362, 290 350 S 370 338, 400 350"
        fill="none"
        stroke={stage === "validate" ? "#D71932" : solid ? "#C9A27A" : "#AEB6C2"}
        strokeWidth={solid ? 4 : 2}
        strokeLinecap="round"
        opacity={sketch ? 0.5 : 1}
      />

      {/* Gantry posts */}
      <rect x="96" y="96" width="28" height="244" fill={fill("#FFFFFF", `url(#${uid}-metal-v)`)} {...line} />
      <rect x="436" y="96" width="28" height="244" fill={fill("#FFFFFF", `url(#${uid}-metal-v)`)} {...line} />

      {/* Gantry beam (stress colored in simulation) */}
      <rect
        x="84"
        y="78"
        width="392"
        height="30"
        rx="3"
        fill={sim ? `url(#${uid}-beam-stress)` : fill("#FFFFFF", `url(#${uid}-metal-h)`)}
        {...line}
      />
      {sim && (
        <path d="M84 86 Q 280 106 476 86" fill="none" stroke="#111" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
      )}
      {/* Linear rail */}
      <path d="M96 116 H 464" fill="none" {...line} />

      {/* Carriage */}
      <rect x="244" y="104" width="72" height="40" rx="4" fill={fill("#F5F6F7", "#2B2E34")} {...line} />
      {solid && <rect x="250" y="110" width="60" height="5" fill="#D71932" />}

      {/* Z axis */}
      <rect x="268" y="144" width="24" height="70" fill={fill("#FFFFFF", `url(#${uid}-metal-v)`)} {...line} />

      {/* Dosing barrel */}
      <rect
        x="256"
        y="212"
        width="48"
        height="72"
        rx="6"
        fill={sim ? `url(#${uid}-barrel-heat)` : fill("#FFFFFF", "#EEF0F2")}
        {...line}
      />
      {!sketch && <path d="M256 236 H 304 M256 260 H 304" stroke={solid ? "#AEB6C2" : "#E5E7EB"} />}
      {solid && <rect x="256" y="226" width="48" height="5" fill="#D71932" />}

      {/* Nozzle */}
      <path d="M270 284 L 290 284 L 283 318 L 277 318 Z" fill={fill("#FFFFFF", "#2B2E34")} {...line} />

      {/* Flow streamlines in simulation */}
      {sim &&
        [-6, 0, 6].map((dx, i) => (
          <path
            key={dx}
            d={`M${280 + dx * 2} 222 C ${280 + dx * 2} 270, ${280 + dx * 0.6} 300, ${280 + dx * 0.3} 330`}
            fill="none"
            stroke={i === 1 ? "#D71932" : "#F2735A"}
            strokeWidth="1.25"
            strokeDasharray="3 5"
            className="animate-dash"
          />
        ))}

      {/* Motors */}
      <rect x="54" y="80" width="30" height="26" rx="3" fill={fill("#F5F6F7", "#2B2E34")} {...line} />
      <rect x="476" y="80" width="30" height="26" rx="3" fill={fill("#F5F6F7", "#2B2E34")} {...line} />

      {/* Discover annotations */}
      {sketch && (
        <g className="font-mono" fill="#6B7280" fontSize="11" letterSpacing="1.2">
          <path d="M60 60 H 500" stroke="#D71932" strokeWidth="1" />
          <path d="M60 54 V 66 M500 54 V 66" stroke="#D71932" />
          <text x="230" y="48">WORKSPACE?</text>
          <circle cx="280" cy="320" r="34" fill="none" stroke="#D71932" strokeDasharray="3 4" />
          <text x="326" y="306">PRECISION</text>
          <text x="326" y="320">REQUIRED?</text>
          <text x="330" y="232">MATERIAL</text>
          <text x="330" y="246">FLOW BEHAVIOUR</text>
          <path d="M318 238 H 306" stroke="#6B7280" />
          <text x="130" y="398">PRODUCTION CONTEXT · CONSTRAINTS · HYGIENE</text>
        </g>
      )}

      {/* Design annotations */}
      {stage === "design" && (
        <g className="font-mono" fill="#6B7280" fontSize="10" letterSpacing="1.2">
          <path d="M84 52 H 476 M84 46 V 58 M476 46 V 58" stroke="#111" strokeWidth="0.75" />
          <text x="244" y="42">X AXIS TRAVEL</text>
          <path d="M520 144 V 318 M514 144 H 526 M514 318 H 526" stroke="#111" strokeWidth="0.75" />
          <text x="512" y="236" transform="rotate(-90 512 236)">Z AXIS</text>
          <circle cx="328" cy="248" r="3" fill="#D71932" />
          <path d="M331 248 H 376" stroke="#111" strokeWidth="0.75" />
          <text x="380" y="252">DOSING HEAD</text>
          <circle cx="292" cy="314" r="3" fill="#D71932" />
          <path d="M295 314 H 376" stroke="#111" strokeWidth="0.75" />
          <text x="380" y="318">NOZZLE</text>
          <text x="20" y="410">CONCEPT CAD · ISO VIEW · REV A</text>
        </g>
      )}

      {sim && (
        <g className="font-mono" fill="#6B7280" fontSize="10" letterSpacing="1.2">
          <text x="84" y="66">BEAM DEFLECTION (EXAGGERATED)</text>
          <text x="330" y="232">THERMAL FIELD</text>
          <text x="330" y="300">FLOW PATH</text>
          <text x="20" y="410">ILLUSTRATIVE — NOT SIMULATION RESULTS</text>
        </g>
      )}

      {stage === "prototype" && (
        <g className="font-mono" fill="#6B7280" fontSize="10" letterSpacing="1.2">
          <text x="20" y="410">CONCEPTUAL PROTOTYPE RENDERING</text>
        </g>
      )}

      {stage === "validate" && (
        <g>
          {/* inspection camera */}
          <rect x="356" y="150" width="44" height="26" rx="4" fill="#2B2E34" stroke="#111" strokeWidth="1.25" />
          <circle cx="378" cy="163" r="7" fill="#111" stroke="#AEB6C2" />
          <path d="M370 176 L 330 340 M386 176 L 420 340" stroke="#D71932" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
          <g className="font-mono" fill="#6B7280" fontSize="10" letterSpacing="1.2">
            <text x="410" y="166">INSPECTION</text>
            <text x="20" y="410">TEST REPRESENTATION — EVALUATION IN PROGRESS</text>
          </g>
        </g>
      )}
    </svg>
  );
}
