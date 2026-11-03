"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Animate on mount (hero) instead of on scroll into view */
  immediate?: boolean;
  delay?: number;
  id?: string;
};

/**
 * Word-by-word reveal. The full text stays in the DOM as a single heading
 * (each word is a span), so screen readers read it naturally.
 */
export function AnimatedHeading({ text, as = "h2", className, immediate = false, delay = 0, id }: Props) {
  const Tag = motion[as];
  const words = text.split(" ");
  const trigger = immediate
    ? { initial: "hidden", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "0px 0px -15% 0px" } };

  return (
    <Tag
      id={id}
      className={cn("text-balance", className)}
      {...trigger}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "105%", opacity: 0 },
                visible: { y: "0%", opacity: 1, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
