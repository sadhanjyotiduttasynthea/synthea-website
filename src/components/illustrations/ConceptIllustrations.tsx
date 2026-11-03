/**
 * Concept illustrations for technologies and projects.
 * They are clearly labelled as concepts on every page they appear.
 */

export function DesignerRobotConcept({ tone = "light" }: { tone?: "light" | "dark" }) {
  const ink = tone === "dark" ? "#E5E7EB" : "#111111";
  const panel = tone === "dark" ? "#17191E" : "#FFFFFF";
  const surface = tone === "dark" ? "#22252B" : "#F5F6F7";
  return (
    <svg viewBox="0 0 640 520" className="h-full w-full" role="img" aria-label="Concept illustration of the Designer Robot deposition platform">
      <defs>
        <linearGradient id="dr-frame" x1="0" x2="1">
          <stop offset="0" stopColor={tone === "dark" ? "#2B2E34" : "#E9ECEF"} />
          <stop offset="0.5" stopColor={tone === "dark" ? "#3A3E46" : "#FFFFFF"} />
          <stop offset="1" stopColor={tone === "dark" ? "#24272D" : "#DDE1E6"} />
        </linearGradient>
        <linearGradient id="dr-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#AEB6C2" stopOpacity="0.18" />
          <stop offset="1" stopColor="#AEB6C2" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <ellipse cx="320" cy="470" rx="250" ry="16" fill="#000" opacity={tone === "dark" ? 0.5 : 0.1} />

      {/* Base cabinet */}
      <path d="M110 380 L 320 440 L 530 380 L 530 420 L 320 480 L 110 420 Z" fill="url(#dr-frame)" stroke={ink} strokeWidth="1.25" />
      <path d="M320 440 V 480" stroke={ink} strokeWidth="1.25" />
      {/* Work surface */}
      <path d="M110 380 L 320 320 L 530 380 L 320 440 Z" fill={surface} stroke={ink} strokeWidth="1.25" />

      {/* Frame posts */}
      <path d="M118 378 V 140" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      <path d="M522 378 V 140" stroke={ink} strokeWidth="5" strokeLinecap="round" />
      <path d="M320 322 V 82" stroke={ink} strokeWidth="5" strokeLinecap="round" opacity="0.5" />
      {/* Top frame */}
      <path d="M118 140 L 320 82 L 522 140 L 320 198 Z" fill="none" stroke={ink} strokeWidth="1.5" />
      {/* Glass panel */}
      <path d="M118 140 L 320 198 L 320 440 L 118 380 Z" fill="url(#dr-glass)" stroke={ink} strokeOpacity="0.25" />

      {/* Y rails */}
      <path d="M150 150 L 352 92" stroke={ink} strokeWidth="1.25" />
      <path d="M290 190 L 492 132" stroke={ink} strokeWidth="1.25" />
      {/* X gantry beam */}
      <path d="M206 168 L 404 226" stroke={ink} strokeWidth="9" strokeLinecap="round" />
      <path d="M206 168 L 404 226" stroke="url(#dr-frame)" strokeWidth="6" strokeLinecap="round" />

      {/* Head */}
      <g>
        <path d="M290 178 L 330 190 L 330 230 L 290 218 Z" fill={panel} stroke={ink} strokeWidth="1.25" />
        <path d="M330 190 L 346 184 L 346 224 L 330 230 Z" fill={surface} stroke={ink} strokeWidth="1.25" />
        <path d="M290 178 L 306 172 L 346 184 L 330 190 Z" fill={panel} stroke={ink} strokeWidth="1.25" />
        <rect x="300" y="196" width="22" height="4" fill="#D71932" transform="skewY(16) translate(0 -86)" />
        <path d="M304 222 L 304 290 L 318 294 L 318 226" fill={panel} stroke={ink} strokeWidth="1.25" />
        <path d="M306 294 L 311 318 L 316 296" fill={ink} stroke={ink} strokeWidth="1" />
      </g>

      {/* Deposition target: plate with pattern */}
      <ellipse cx="312" cy="372" rx="92" ry="26" fill={panel} stroke={ink} strokeWidth="1.25" />
      <path
        d="M248 372 C 270 356, 290 390, 312 372 S 352 356, 376 372"
        fill="none"
        stroke="#D71932"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M311 320 V 360" stroke="#D71932" strokeWidth="1" strokeDasharray="3 4" className="animate-dash" />

      {/* Callout lines */}
      <g className="font-mono" fontSize="11" letterSpacing="1.4" fill={tone === "dark" ? "#AEB6C2" : "#6B7280"}>
        <circle cx="404" cy="226" r="3.5" fill="#D71932" />
        <path d="M407 226 H 560" stroke={ink} strokeOpacity="0.4" />
        <text x="470" y="218">MOTION SYSTEM</text>

        <circle cx="346" cy="206" r="3.5" fill="#D71932" />
        <path d="M349 206 L 380 150 H 560" stroke={ink} strokeOpacity="0.4" />
        <text x="440" y="142">DEPOSITION HEAD</text>

        <circle cx="376" cy="372" r="3.5" fill="#D71932" />
        <path d="M379 372 L 420 330 H 560" stroke={ink} strokeOpacity="0.4" />
        <text x="440" y="322">DIGITAL PATTERN</text>

        <text x="40" y="40" fill="#D71932">CONCEPT ILLUSTRATION</text>
      </g>
    </svg>
  );
}

export function DeliveryConcept() {
  return (
    <svg viewBox="0 0 640 420" className="h-full w-full" role="img" aria-label="Conceptual diagram of a robotic transfer path between two stations">
      <rect width="640" height="420" fill="#F5F6F7" />
      <g stroke="#111" strokeWidth="1.25" fill="#fff">
        <rect x="60" y="250" width="140" height="90" rx="6" />
        <rect x="440" y="250" width="140" height="90" rx="6" />
        <rect x="250" y="300" width="140" height="40" rx="6" fill="#E5E7EB" />
      </g>
      <g fill="#111" opacity="0.85">
        <rect x="100" y="226" width="26" height="24" rx="3" />
        <rect x="140" y="226" width="26" height="24" rx="3" opacity="0.5" />
      </g>
      <rect x="480" y="226" width="26" height="24" rx="3" fill="none" stroke="#D71932" strokeDasharray="3 3" />
      <path d="M113 220 C 180 60, 460 60, 493 220" fill="none" stroke="#D71932" strokeWidth="1.5" strokeDasharray="6 6" className="animate-dash" />
      {[0.15, 0.35, 0.55, 0.75].map((t) => {
        const x = (1 - t) ** 3 * 113 + 3 * (1 - t) ** 2 * t * 180 + 3 * (1 - t) * t ** 2 * 460 + t ** 3 * 493;
        const y = (1 - t) ** 3 * 220 + 3 * (1 - t) ** 2 * t * 60 + 3 * (1 - t) * t ** 2 * 60 + t ** 3 * 220;
        return <circle key={t} cx={x} cy={y} r="4" fill="#fff" stroke="#D71932" strokeWidth="1.5" />;
      })}
      {/* arm */}
      <g stroke="#111" strokeWidth="1.25" fill="#fff">
        <rect x="296" y="268" width="48" height="32" rx="4" fill="#2B2E34" />
        <circle cx="320" cy="262" r="12" />
        <path d="M314 256 L 280 160 L 296 154 L 328 252 Z" />
        <circle cx="288" cy="156" r="10" />
        <path d="M292 146 L 360 120 L 366 134 L 296 162 Z" />
        <circle cx="364" cy="126" r="7" fill="#D71932" stroke="#D71932" />
      </g>
      <g className="font-mono" fontSize="11" letterSpacing="1.4" fill="#6B7280">
        <text x="60" y="366">STATION A</text>
        <text x="440" y="366">STATION B</text>
        <text x="250" y="86">PLANNED TRANSFER PATH</text>
        <text x="24" y="32" fill="#D71932">CONCEPT DIAGRAM</text>
      </g>
    </svg>
  );
}
