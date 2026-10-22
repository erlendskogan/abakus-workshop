"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

// Soft edges, so the scene never shows the box it is drawn in.
const EDGE_MASK =
  "linear-gradient(to bottom, #000 76%, transparent 99%), linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)";

// three.js only runs in the browser, and it is heavy: load it after the page.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

/**
 * The interactive 3D hero: a fjøsnisse with a lantern in front of a red barn
 * on a snowy night. It fills its parent box and has no props. The canvas is
 * transparent, so the page background shows through.
 */
export function HeroScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = wrapper.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div ref={wrapper} aria-hidden className="relative h-full w-full select-none">
      <Poster visible={!ready} />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maskImage: EDGE_MASK,
          maskComposite: "intersect",
          WebkitMaskImage: EDGE_MASK,
          WebkitMaskComposite: "source-in",
        }}
      >
        <Scene active={inView} reducedMotion={reducedMotion} onReady={onReady} />
      </div>
    </div>
  );
}

/** A still stand-in while the 3D scene loads: a soft lantern glow on snow. */
function Poster({ visible }: { visible: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="absolute left-[38%] top-[66%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgb(245 184 74 / 0.32), rgb(245 184 74 / 0.08) 45%, transparent 70%)" }}
      />
      <div
        className="absolute left-[38%] top-[66%] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lykt"
        style={{ boxShadow: "0 0 24px 8px rgb(245 184 74 / 0.35)" }}
      />
      <div
        className="absolute inset-x-[6%] bottom-[8%] h-[34%] rounded-[50%]"
        style={{ background: "radial-gradient(ellipse at center, rgb(232 238 247 / 0.07), transparent 70%)" }}
      />
    </div>
  );
}
