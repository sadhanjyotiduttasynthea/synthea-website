/** Readable long-form text styles for legal and policy pages. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl text-[1.02rem] leading-relaxed text-ink/85 [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-red [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:font-semibold [&_h3]:text-ink [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}
