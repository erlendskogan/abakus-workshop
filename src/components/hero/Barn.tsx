"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Barn dimensions (local units, origin at the centre of the footprint).
const W = 2.1; // width of the gable wall
const D = 2.6; // depth
const H = 1.12; // eave height
const P = 1.86; // ridge height
const BASE = 0.12; // stone foundation height
const OVERHANG = 0.16;
const ROOF_T = 0.05;

const SLOPE = Math.atan2(P - H, W / 2);
const SLOPE_LEN = Math.hypot(W / 2, P - H);

const DOOR_W = 0.92;
const DOOR_H = 0.86;

type BarnProps = {
  reducedMotion: boolean;
  position?: [number, number, number];
  rotationY?: number;
};

/** Height of the front wall (with the gable) at x. */
function frontHeight(x: number) {
  return P - (P - H) * (Math.abs(x) / (W / 2));
}

function Board({
  length,
  width = 0.06,
  depth = 0.025,
  position,
  rotationZ = 0,
  material,
}: {
  length: number;
  width?: number;
  depth?: number;
  position: [number, number, number];
  rotationZ?: number;
  material: THREE.Material;
}) {
  return (
    <mesh position={position} rotation-z={rotationZ} material={material}>
      <boxGeometry args={[width, length, depth]} />
    </mesh>
  );
}

export function Barn({ reducedMotion, position = [0, 0, 0], rotationY = 0 }: BarnProps) {
  const windowMaterials = useRef<THREE.MeshStandardMaterial[]>([]);
  const windowLight = useRef<THREE.PointLight>(null);

  const materials = useMemo(
    () => ({
      wall: new THREE.MeshStandardMaterial({ color: "#a8332a", roughness: 0.78 }),
      batten: new THREE.MeshStandardMaterial({ color: "#8f2b23", roughness: 0.8 }),
      door: new THREE.MeshStandardMaterial({ color: "#7d2620", roughness: 0.8 }),
      trim: new THREE.MeshStandardMaterial({ color: "#ece8e0", roughness: 0.7 }),
      roof: new THREE.MeshStandardMaterial({ color: "#2a2b31", roughness: 0.85 }),
      stone: new THREE.MeshStandardMaterial({ color: "#3a3e47", roughness: 0.95 }),
      snow: new THREE.MeshStandardMaterial({ color: "#e8eef7", roughness: 0.95 }),
      inside: new THREE.MeshStandardMaterial({ color: "#1a0f0c", roughness: 1 }),
    }),
    [],
  );

  const gableGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W / 2, H);
    shape.lineTo(W / 2, H);
    shape.lineTo(0, P);
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: false });
    geometry.translate(0, 0, -D / 2);
    return geometry;
  }, []);

  useEffect(() => {
    const disposables = [gableGeometry, ...Object.values(materials)];
    return () => disposables.forEach((item) => item.dispose());
  }, [gableGeometry, materials]);

  // Vertical battens: board-and-batten cladding on the front and the right wall.
  const battens = useMemo(() => {
    const list: { position: [number, number, number]; height: number; side: "front" | "right" }[] = [];
    for (let x = -W / 2 + 0.14; x < W / 2 - 0.1; x += 0.15) {
      const top = frontHeight(x) - 0.03;
      list.push({ position: [x, (BASE + top) / 2, D / 2 + 0.008], height: top - BASE, side: "front" });
    }
    for (let z = -D / 2 + 0.14; z < D / 2 - 0.1; z += 0.15) {
      list.push({ position: [W / 2 + 0.008, (BASE + H) / 2, z], height: H - BASE - 0.02, side: "right" });
    }
    return list;
  }, []);

  useFrame((state) => {
    // The windows light up shortly after the scene appears.
    const t = state.clock.elapsedTime;
    const on = reducedMotion ? 1 : THREE.MathUtils.smoothstep(t, 0.5, 1.4);
    const glow = on * (reducedMotion ? 1 : 1 + 0.03 * Math.sin(t * 2.1));
    for (const material of windowMaterials.current) {
      if (material) material.emissiveIntensity = 0.05 + 2.2 * glow;
    }
    if (windowLight.current) windowLight.current.intensity = 1.6 * glow;
  });

  const windowMaterial = (index: number) => (
    <meshStandardMaterial
      ref={(m) => {
        if (m) windowMaterials.current[index] = m;
      }}
      color="#2a1608"
      emissive="#ffb04d"
      emissiveIntensity={0.05}
      roughness={0.4}
    />
  );

  const doorY = BASE + DOOR_H / 2;
  const leafW = DOOR_W / 2;
  const leafDiagonal = Math.hypot(leafW - 0.06, DOOR_H - 0.1);
  const leafAngle = Math.atan2(DOOR_H - 0.1, leafW - 0.06);

  const roofPanel = (side: -1 | 1) => {
    const along = (SLOPE_LEN + OVERHANG) / 2;
    const cx = side * Math.cos(SLOPE) * along + side * Math.sin(SLOPE) * (ROOF_T / 2);
    const cy = P - Math.sin(SLOPE) * along + Math.cos(SLOPE) * (ROOF_T / 2);
    const snowOffset = ROOF_T / 2 + 0.03;
    return (
      <group key={`roof${side}`} position={[cx, cy, 0]} rotation-z={-side * SLOPE}>
        <mesh material={materials.roof}>
          <boxGeometry args={[SLOPE_LEN + OVERHANG, ROOF_T, D + 0.3]} />
        </mesh>
        <RoundedBox
          args={[SLOPE_LEN + OVERHANG - 0.04, 0.07, D + 0.26]}
          radius={0.03}
          smoothness={4}
          position={[0, snowOffset, 0]}
          material={materials.snow}
        />
      </group>
    );
  };

  const fascia = (side: -1 | 1) => {
    const along = (SLOPE_LEN + OVERHANG) / 2;
    const cx = side * Math.cos(SLOPE) * along - side * Math.sin(SLOPE) * 0.02;
    const cy = P - Math.sin(SLOPE) * along - Math.cos(SLOPE) * 0.02;
    return (
      <mesh key={`fascia${side}`} position={[cx, cy, D / 2 + 0.14]} rotation-z={-side * SLOPE} material={materials.trim}>
        <boxGeometry args={[SLOPE_LEN + OVERHANG, 0.08, 0.035]} />
      </mesh>
    );
  };

  return (
    <group position={position} rotation-y={rotationY}>
      {/* Walls and gables */}
      <mesh material={materials.wall} position={[0, (BASE + H) / 2, 0]}>
        <boxGeometry args={[W, H - BASE, D]} />
      </mesh>
      <mesh material={materials.wall} geometry={gableGeometry} />
      <mesh material={materials.stone} position={[0, BASE / 2, 0]}>
        <boxGeometry args={[W + 0.06, BASE, D + 0.06]} />
      </mesh>

      {battens.map((b, i) => (
        <mesh
          key={i}
          material={materials.batten}
          position={b.position}
          scale={[1, b.height, 1]}
          rotation-y={b.side === "right" ? Math.PI / 2 : 0}
        >
          <boxGeometry args={[0.032, 1, 0.018]} />
        </mesh>
      ))}

      {/* Roof with snow, and white trim */}
      {roofPanel(-1)}
      {roofPanel(1)}
      {fascia(-1)}
      {fascia(1)}
      {[-1, 1].map((side) => (
        <Board
          key={`corner-front-${side}`}
          material={materials.trim}
          length={H - BASE}
          width={0.07}
          depth={0.04}
          position={[side * (W / 2 - 0.02), (BASE + H) / 2, D / 2 + 0.01]}
        />
      ))}
      <Board
        material={materials.trim}
        length={H - BASE}
        width={0.04}
        depth={0.07}
        position={[W / 2 + 0.01, (BASE + H) / 2, -D / 2 + 0.02]}
      />
      <mesh material={materials.trim} position={[0, H, D / 2 + 0.012]}>
        <boxGeometry args={[W, 0.05, 0.03]} />
      </mesh>

      {/* Double door with X-braces */}
      <group position={[0, doorY, D / 2 + 0.025]}>
        <mesh material={materials.door}>
          <boxGeometry args={[DOOR_W, DOOR_H, 0.03]} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * (leafW / 2), 0, 0.02]}>
            <Board material={materials.trim} length={leafDiagonal} width={0.045} depth={0.018} position={[0, 0, 0]} rotationZ={Math.PI / 2 - leafAngle} />
            <Board material={materials.trim} length={leafDiagonal} width={0.045} depth={0.018} position={[0, 0, 0.001]} rotationZ={-(Math.PI / 2 - leafAngle)} />
          </group>
        ))}
        <Board material={materials.trim} length={DOOR_H} width={0.03} depth={0.03} position={[0, 0, 0.02]} />
        {/* Frame */}
        <Board material={materials.trim} length={DOOR_H + 0.06} width={0.06} depth={0.04} position={[-DOOR_W / 2, 0, 0.015]} />
        <Board material={materials.trim} length={DOOR_H + 0.06} width={0.06} depth={0.04} position={[DOOR_W / 2, 0, 0.015]} />
        <Board material={materials.trim} length={DOOR_W + 0.06} width={0.06} depth={0.04} position={[0, DOOR_H / 2, 0.015]} rotationZ={Math.PI / 2} />
        <Board material={materials.trim} length={DOOR_W} width={0.045} depth={0.03} position={[0, 0, 0.022]} rotationZ={Math.PI / 2} />
      </group>

      {/* Hayloft window in the gable */}
      <group position={[0, H + 0.26, D / 2 + 0.02]}>
        <mesh>
          <planeGeometry args={[0.3, 0.3]} />
          {windowMaterial(0)}
        </mesh>
        <Board material={materials.trim} length={0.36} width={0.04} depth={0.03} position={[-0.17, 0, 0.01]} />
        <Board material={materials.trim} length={0.36} width={0.04} depth={0.03} position={[0.17, 0, 0.01]} />
        <Board material={materials.trim} length={0.38} width={0.04} depth={0.03} position={[0, 0.17, 0.01]} rotationZ={Math.PI / 2} />
        <Board material={materials.trim} length={0.38} width={0.04} depth={0.03} position={[0, -0.17, 0.01]} rotationZ={Math.PI / 2} />
        <Board material={materials.trim} length={0.3} width={0.018} depth={0.02} position={[0, 0, 0.01]} />
        <Board material={materials.trim} length={0.3} width={0.018} depth={0.02} position={[0, 0, 0.01]} rotationZ={Math.PI / 2} />
      </group>

      {/* Side window with warm light */}
      <group position={[W / 2 + 0.02, 0.68, 0.35]} rotation-y={Math.PI / 2}>
        <mesh>
          <planeGeometry args={[0.42, 0.32]} />
          {windowMaterial(1)}
        </mesh>
        <Board material={materials.trim} length={0.38} width={0.045} depth={0.03} position={[-0.23, 0, 0.01]} />
        <Board material={materials.trim} length={0.38} width={0.045} depth={0.03} position={[0.23, 0, 0.01]} />
        <Board material={materials.trim} length={0.5} width={0.045} depth={0.03} position={[0, 0.18, 0.01]} rotationZ={Math.PI / 2} />
        <Board material={materials.trim} length={0.5} width={0.06} depth={0.05} position={[0, -0.18, 0.02]} rotationZ={Math.PI / 2} />
        <mesh material={materials.snow} position={[0, -0.205, 0.04]} scale={[0.25, 0.03, 0.04]}>
          <sphereGeometry args={[1, 24, 12]} />
        </mesh>
        <Board material={materials.trim} length={0.32} width={0.018} depth={0.02} position={[0, 0, 0.01]} />
        <Board material={materials.trim} length={0.42} width={0.018} depth={0.02} position={[0, 0, 0.01]} rotationZ={Math.PI / 2} />
        <pointLight ref={windowLight} position={[0, -0.1, 0.45]} color="#ffad55" intensity={0} distance={3} decay={2} />
      </group>

      {/* Snow drifts along the walls */}
      {[
        [-0.7, D / 2 + 0.1, 0.5, 0.09],
        [0.75, D / 2 + 0.12, 0.45, 0.1],
      ].map(([x, z, r, h], i) => (
        <mesh key={`front-drift-${i}`} material={materials.snow} position={[x, 0, z]} scale={[r, h, 0.22]}>
          <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      ))}
      {[
        [W / 2 + 0.1, -0.6, 0.6, 0.1],
        [W / 2 + 0.12, 0.6, 0.55, 0.08],
      ].map(([x, z, r, h], i) => (
        <mesh key={`side-drift-${i}`} material={materials.snow} position={[x, 0, z]} scale={[0.22, h, r]}>
          <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      ))}
    </group>
  );
}
