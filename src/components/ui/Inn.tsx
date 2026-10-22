"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// Fades its children in and lifts them 10px, once, when they come into view.
// With prefers-reduced-motion the children show at once, without movement.
export function Inn({
  children,
  className,
  forsinkelse = 0,
  straks = false,
}: {
  children: ReactNode;
  className?: string;
  forsinkelse?: number;
  // Animate on load instead of on scroll, for content above the fold.
  straks?: boolean;
}) {
  const redusert = useReducedMotion();
  const synlig = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      {...(straks ? { animate: synlig } : { whileInView: synlig, viewport: { once: true, margin: "0px 0px -40px 0px" } })}
      transition={redusert ? { duration: 0 } : { duration: 0.5, delay: forsinkelse, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
