/**
 * The pointer position relative to the centre of the hero canvas, shared by
 * the parts of the scene that react to it. x and y run from about -1 to 1
 * across the canvas (y up) and keep growing outside it.
 */
export const pointer = {
  x: 0,
  y: 0,
  /** performance.now() of the last move, or -Infinity before the first. */
  lastMove: Number.NEGATIVE_INFINITY,
};

/** Seconds without movement before the scene drifts back to centre. */
export const IDLE_AFTER = 2.5;

export function pointerIsIdle(now = performance.now()) {
  return now - pointer.lastMove > IDLE_AFTER * 1000;
}

/** Frame-rate independent version of a per-frame lerp factor tuned at 60 fps. */
export function damp(factorAt60: number, delta: number) {
  return 1 - Math.pow(1 - factorAt60, delta * 60);
}

/** Smooth value noise in [-1, 1]: a sum of slow, unrelated sines. */
export function smoothNoise(t: number, seed = 0) {
  return (
    Math.sin(t * 1.7 + seed) * 0.5 +
    Math.sin(t * 2.9 + seed * 1.3 + 1.1) * 0.3 +
    Math.sin(t * 5.3 + seed * 0.7 + 2.3) * 0.2
  );
}
