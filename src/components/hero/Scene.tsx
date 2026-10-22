"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Barn } from "./Barn";
import { Nisse } from "./Nisse";
import { damp, pointer, pointerIsIdle } from "./pointer";
import { Snowfall } from "./Snow";
import { makeRadialTexture } from "./textures";

const BACKGROUND = "#07090f";
const CAMERA_POSITION = new THREE.Vector3(0.1, 0.62, 5.9);
const CAMERA_TARGET = new THREE.Vector3(0.36, 0.86, -0.6);

export type SceneProps = {
  /** False while the hero is off screen: rendering pauses. */
  active: boolean;
  reducedMotion: boolean;
  /** Called after the first frame is drawn. */
  onReady: () => void;
};

/** Tracks the pointer anywhere on the page, relative to the canvas. */
function PointerTracker() {
  const canvas = useThree((state) => state.gl.domElement);
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [canvas]);
  return null;
}

/** Gentle parallax: the camera drifts a little with the pointer. */
function CameraRig({ reducedMotion }: { reducedMotion: boolean }) {
  const camera = useThree((state) => state.camera);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    camera.position.copy(CAMERA_POSITION);
    camera.lookAt(CAMERA_TARGET);
  }, [camera]);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const idle = pointerIsIdle();
    const tx = idle ? 0 : THREE.MathUtils.clamp(pointer.x, -1.5, 1.5) * 0.22;
    const ty = idle ? 0 : THREE.MathUtils.clamp(pointer.y, -1.5, 1.5) * 0.1;
    const k = damp(0.04, Math.min(delta, 1 / 20));
    offset.current.x += (tx - offset.current.x) * k;
    offset.current.y += (ty - offset.current.y) * k;
    camera.position.set(
      CAMERA_POSITION.x + offset.current.x,
      CAMERA_POSITION.y + offset.current.y,
      CAMERA_POSITION.z,
    );
    camera.lookAt(CAMERA_TARGET);
  });
  return null;
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}

/** Snowy ground that fades softly into the page background. */
function Ground() {
  const alpha = useMemo(
    () =>
      makeRadialTexture(256, [
        [0, 1],
        [0.35, 0.9],
        [0.75, 0.3],
        [1, 0],
      ], true),
    [],
  );
  useEffect(() => () => alpha.dispose(), [alpha]);

  const mounds: [number, number, number, number, number][] = [
    [-1.9, -0.6, 0.8, 0.14, 0.6],
    [-2.6, -2.2, 1.0, 0.2, 0.8],
  ];

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0.4, 0, -0.6]} renderOrder={-1}>
        <circleGeometry args={[4.6, 96]} />
        <meshStandardMaterial
          color="#dfe6f1"
          roughness={0.95}
          alphaMap={alpha}
          transparent
          depthWrite={false}
        />
      </mesh>
      {mounds.map(([x, z, r, h, d], i) => (
        <mesh key={i} position={[x, -0.01, z]} scale={[r, h, d]}>
          <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#dfe6f1" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/** A small snowy spruce made of stacked cones. */
function Spruce({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const tiers = [
    { y: 0.42, r: 0.42, h: 0.62 },
    { y: 0.78, r: 0.33, h: 0.52 },
    { y: 1.08, r: 0.23, h: 0.42 },
    { y: 1.32, r: 0.13, h: 0.32 },
  ];
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 0.24, 12]} />
        <meshStandardMaterial color="#2a1e18" roughness={0.9} />
      </mesh>
      {tiers.map((tier, i) => (
        <group key={i} position={[0, tier.y, 0]}>
          <mesh>
            <coneGeometry args={[tier.r, tier.h, 32]} />
            <meshStandardMaterial color="#16261f" roughness={0.9} />
          </mesh>
          <mesh position={[0, tier.h * 0.12, 0]} scale={[0.8, 0.55, 0.8]}>
            <coneGeometry args={[tier.r, tier.h, 32, 1, true]} />
            <meshStandardMaterial color="#d9e2ef" roughness={0.95} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Faint stars far behind the scene. They do not take fog. */
function Stars({ count }: { count: number }) {
  const texture = useMemo(() => makeRadialTexture(32), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = (Math.random() - 0.5) * 30;
      array[i * 3 + 1] = 3 + Math.random() * 9;
      array[i * 3 + 2] = -14 - Math.random() * 4;
    }
    return array;
  }, [count]);
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color="#c9d6ff"
        size={0.09}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}

function World({ reducedMotion, onReady }: Omit<SceneProps, "active">) {
  const width = useThree((state) => state.size.width);
  const small = width < 480;

  return (
    <>
      <fog attach="fog" args={[BACKGROUND, 8.5, 17]} />

      {/* Cold moonlight from the left, a soft sky fill, and a warm rim from behind. */}
      <hemisphereLight args={["#5d6f9e", "#17130f", 0.7]} />
      <directionalLight position={[-4, 5, 4]} color="#c2d0ff" intensity={1.7} />
      <directionalLight position={[3, 2.5, -3]} color="#ffb067" intensity={2.2} />
      <directionalLight position={[1.5, 1.2, 5]} color="#ffe2c2" intensity={0.35} />

      <PointerTracker />
      <CameraRig reducedMotion={reducedMotion} />
      <ReadySignal onReady={onReady} />

      <Stars count={small ? 50 : 90} />
      <Barn reducedMotion={reducedMotion} position={[1.0, 0, -2.2]} rotationY={-0.5} />
      <Spruce position={[-1.75, 0, -3.3]} scale={1.3} />
      <Spruce position={[-3.2, 0, -4.6]} scale={1.8} />
      <Spruce position={[3.0, 0, -4.3]} scale={1.5} />
      <Nisse reducedMotion={reducedMotion} position={[-0.32, 0, 1.25]} rotationY={0.2} scale={1.12} />
      <Ground />
      <Snowfall count={small ? 140 : 360} reducedMotion={reducedMotion} />
    </>
  );
}

export default function Scene({ active, reducedMotion, onReady }: SceneProps) {
  const frameloop = !active ? "never" : reducedMotion ? "demand" : "always";
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={frameloop}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, near: 0.1, far: 40, position: CAMERA_POSITION.toArray() }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <World reducedMotion={reducedMotion} onReady={onReady} />
    </Canvas>
  );
}
