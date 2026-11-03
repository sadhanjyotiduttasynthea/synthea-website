const ITEMS = [
  "Robotics",
  "Machine design",
  "Simulation",
  "Automation",
  "Food-tech",
  "3D food printing",
  "Prototyping",
  "R&D",
];

/** Slow, infinite band of capabilities. Pauses on hover; static for reduced motion. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {ITEMS.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-[clamp(1.4rem,1rem+1.6vw,2.4rem)] font-medium uppercase tracking-[-0.01em]">
            {item}
          </span>
          <span aria-hidden className="size-2 rotate-45 bg-red" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="What Synthea does" className="dark-surface group overflow-hidden border-y border-line-dark bg-night py-7 text-white">
      <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
