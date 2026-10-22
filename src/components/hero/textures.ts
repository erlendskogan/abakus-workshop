import * as THREE from "three";

/** A soft round radial gradient, white in the middle and clear at the edge. */
export function makeRadialTexture(
  size = 128,
  stops: [number, number][] = [
    [0, 1],
    [0.35, 0.55],
    [1, 0],
  ],
  /** Draw on black, so the gradient is in the colour channels (for alphaMap). */
  onBlack = false,
) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  if (onBlack) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, size, size);
  }
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [offset, alpha] of stops) {
    gradient.addColorStop(offset, `rgba(255,255,255,${alpha})`);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
