"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useImperativeHandle, useMemo, useRef, type Ref } from "react";
import * as THREE from "three";
import { makeRadialTexture } from "./textures";

const SNOW_COLOR = "#e8eef7";

const BOX = { x: 9, yMin: -0.2, yMax: 4.2, zMin: -6, zMax: 4 };

function useFlakeTexture() {
  const texture = useMemo(
    () =>
      makeRadialTexture(64, [
        [0, 1],
        [0.45, 0.8],
        [1, 0],
      ]),
    [],
  );
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

type SnowfallProps = { count: number; reducedMotion: boolean };

/** Slow snowfall around the scene. Far flakes fade into the fog. */
export function Snowfall({ count, reducedMotion }: SnowfallProps) {
  const points = useRef<THREE.Points>(null);
  const texture = useFlakeTexture();

  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * BOX.x;
      positions[i * 3 + 1] = BOX.yMin + Math.random() * (BOX.yMax - BOX.yMin);
      positions[i * 3 + 2] = BOX.zMin + Math.random() * (BOX.zMax - BOX.zMin);
      speeds[i] = 0.12 + Math.random() * 0.16;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, phases };
  }, [count]);

  useFrame((state, delta) => {
    if (reducedMotion || !points.current) return;
    const dt = Math.min(delta, 1 / 20);
    const t = state.clock.elapsedTime;
    const attribute = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      array[ix] += Math.sin(t * 0.5 + phases[i]) * 0.06 * dt + 0.02 * dt;
      array[ix + 1] -= speeds[i] * dt;
      array[ix + 2] += Math.cos(t * 0.4 + phases[i]) * 0.04 * dt;
      if (array[ix + 1] < BOX.yMin) {
        array[ix + 1] = BOX.yMax;
        array[ix] = (Math.random() - 0.5) * BOX.x;
      }
      if (array[ix] > BOX.x / 2) array[ix] -= BOX.x;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color={SNOW_COLOR}
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

export type SnowPuffHandle = { burst: () => void };

const PUFF_COUNT = 44;
const PUFF_LIFE = 0.9;

/** A small puff of snow, kicked up when the Nisse is poked. */
export function SnowPuff({ ref, origin }: { ref?: Ref<SnowPuffHandle>; origin: [number, number, number] }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const texture = useFlakeTexture();
  const state = useRef({ age: PUFF_LIFE });
  const positions = useMemo(() => new Float32Array(PUFF_COUNT * 3), []);
  const velocities = useMemo(() => new Float32Array(PUFF_COUNT * 3), []);

  useImperativeHandle(ref, () => ({
    burst() {
      for (let i = 0; i < PUFF_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.12 + Math.random() * 0.12;
        positions[i * 3] = origin[0] + Math.cos(angle) * radius;
        positions[i * 3 + 1] = origin[1] + Math.random() * 0.04;
        positions[i * 3 + 2] = origin[2] + Math.sin(angle) * radius;
        const speed = 0.35 + Math.random() * 0.5;
        velocities[i * 3] = Math.cos(angle) * speed;
        velocities[i * 3 + 1] = 0.7 + Math.random() * 0.8;
        velocities[i * 3 + 2] = Math.sin(angle) * speed;
      }
      state.current.age = 0;
      if (points.current) points.current.visible = true;
    },
  }));

  useFrame((_, delta) => {
    const s = state.current;
    if (!points.current || !material.current) return;
    if (s.age >= PUFF_LIFE) {
      points.current.visible = false;
      return;
    }
    const dt = Math.min(delta, 1 / 20);
    s.age += dt;
    for (let i = 0; i < PUFF_COUNT; i++) {
      const ix = i * 3;
      velocities[ix + 1] -= 3.2 * dt;
      velocities[ix] *= 1 - 2.2 * dt;
      velocities[ix + 2] *= 1 - 2.2 * dt;
      positions[ix] += velocities[ix] * dt;
      positions[ix + 1] = Math.max(0.01, positions[ix + 1] + velocities[ix + 1] * dt);
      positions[ix + 2] += velocities[ix + 2] * dt;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
    const life = s.age / PUFF_LIFE;
    material.current.opacity = 0.95 * (1 - life * life);
  });

  return (
    <points ref={points} visible={false} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        map={texture}
        color={SNOW_COLOR}
        size={0.065}
        sizeAttenuation
        transparent
        depthWrite={false}
      />
    </points>
  );
}
