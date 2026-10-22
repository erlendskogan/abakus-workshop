"use client";

import type { PointerEvent, ReactNode } from "react";

// A surface with a soft lantern glow that follows the pointer (see .spotlight in globals.css).
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  function flytt(e: PointerEvent<HTMLDivElement>) {
    const boks = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - boks.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - boks.top}px`);
  }

  return (
    <div onPointerMove={flytt} className={`spotlight ${className}`}>
      {children}
    </div>
  );
}
