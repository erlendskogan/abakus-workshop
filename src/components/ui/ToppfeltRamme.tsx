"use client";

import { useEffect, useState, type ReactNode } from "react";

// The sticky bar: transparent at the top of the page, blurred glass once the page scrolls.
export function ToppfeltRamme({ children }: { children: ReactNode }) {
  const [rullet, setRullet] = useState(false);

  useEffect(() => {
    const sjekk = () => setRullet(window.scrollY > 8);
    sjekk();
    window.addEventListener("scroll", sjekk, { passive: true });
    return () => window.removeEventListener("scroll", sjekk);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        rullet ? "border-kant bg-bakgrunn/70 backdrop-blur-xl backdrop-saturate-150" : "border-transparent"
      }`}
    >
      {children}
    </header>
  );
}
