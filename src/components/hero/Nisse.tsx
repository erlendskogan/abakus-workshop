"use client";

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { damp, pointer, pointerIsIdle, smoothNoise } from "./pointer";
import { SnowPuff, type SnowPuffHandle } from "./Snow";
import { makeRadialTexture } from "./textures";

const DEG = Math.PI / 180;
const MAX_YAW = 25 * DEG;
const MAX_PITCH = 10 * DEG;
const POKE_COOLDOWN_MS = 900;

type Vec3 = [number, number, number];

/** Position and rotation for a capsule that runs from one point to another. */
function limb(from: Vec3, to: Vec3) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const dir = b.clone().sub(a);
  const length = dir.length();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize(),
  );
  return { position: a.add(b).multiplyScalar(0.5), quaternion, length };
}

const LEFT_SHOULDER: Vec3 = [-0.155, 0.535, 0.0];
const LEFT_HAND: Vec3 = [-0.255, 0.33, 0.07];
const RIGHT_SHOULDER: Vec3 = [0.155, 0.535, 0.0];
const RIGHT_HAND: Vec3 = [0.255, 0.4, 0.19];
const LEFT_ARM = limb(LEFT_SHOULDER, LEFT_HAND);
const RIGHT_ARM = limb(RIGHT_SHOULDER, RIGHT_HAND);

/** The wool tunic: a bell shape turned on a lathe. */
function makeTunicGeometry() {
  const curve = new THREE.SplineCurve([
    new THREE.Vector2(0.0, 0.15),
    new THREE.Vector2(0.205, 0.15),
    new THREE.Vector2(0.238, 0.2),
    new THREE.Vector2(0.246, 0.29),
    new THREE.Vector2(0.232, 0.39),
    new THREE.Vector2(0.196, 0.48),
    new THREE.Vector2(0.15, 0.555),
    new THREE.Vector2(0.09, 0.62),
    new THREE.Vector2(0.0, 0.645),
  ]);
  const points = curve.getPoints(48);
  points[0].x = 0;
  points[points.length - 1].x = 0;
  const geometry = new THREE.LatheGeometry(points, 64);
  geometry.scale(1, 1, 0.88);
  geometry.computeVertexNormals();
  return geometry;
}

/** The beard: a soft spade, turned on a lathe and flattened front to back. */
function makeBeardGeometry() {
  const curve = new THREE.SplineCurve([
    new THREE.Vector2(0.0, 0.02),
    new THREE.Vector2(0.09, 0.0),
    new THREE.Vector2(0.13, -0.06),
    new THREE.Vector2(0.128, -0.14),
    new THREE.Vector2(0.098, -0.22),
    new THREE.Vector2(0.05, -0.28),
    new THREE.Vector2(0.0, -0.305),
  ]);
  const points = curve.getPoints(40);
  points[0].x = 0;
  points[points.length - 1].x = 0;
  const geometry = new THREE.LatheGeometry(points.reverse(), 64);
  geometry.computeVertexNormals();
  return geometry;
}

const HAT_HEIGHT = 0.6;
const HAT_RADIUS = 0.168;

function hatBend(t: number) {
  // Bends the tip back and a little to the side, and lets it droop.
  return {
    x: 0.11 * Math.pow(t, 2.2),
    y: -0.16 * Math.pow(t, 3),
    z: -0.24 * Math.pow(t, 2.4),
  };
}

/** The pointed hat: a lathe cone whose tip bends softly. */
function makeHatGeometry() {
  const points: THREE.Vector2[] = [];
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = HAT_RADIUS * Math.pow(1 - t, 0.82) * (1 + 0.06 * Math.sin(Math.PI * t));
    points.push(new THREE.Vector2(Math.max(r, 0.004), t * HAT_HEIGHT));
  }
  const geometry = new THREE.LatheGeometry(points, 64);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const t = position.getY(i) / HAT_HEIGHT;
    const bend = hatBend(t);
    position.setXYZ(
      i,
      position.getX(i) + bend.x,
      position.getY(i) + bend.y,
      position.getZ(i) + bend.z,
    );
  }
  geometry.computeVertexNormals();
  return geometry;
}

const HAT_TIP = (() => {
  const bend = hatBend(1);
  return [bend.x, HAT_HEIGHT + bend.y, bend.z] as Vec3;
})();

type NisseProps = {
  reducedMotion: boolean;
  position?: Vec3;
  rotationY?: number;
  scale?: number;
};

export function Nisse({ reducedMotion, position = [0, 0, 0], rotationY = 0, scale = 1 }: NisseProps) {
  const gl = useThree((state) => state.gl);

  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const hat = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const lanternLight = useRef<THREE.PointLight>(null);
  const lanternGlass = useRef<THREE.MeshStandardMaterial>(null);
  const lanternGlow = useRef<THREE.SpriteMaterial>(null);
  const lantern = useRef<THREE.Group>(null);
  const puff = useRef<SnowPuffHandle>(null);
  const shadow = useRef<THREE.MeshBasicMaterial>(null);

  const motion = useRef({
    yaw: 0,
    pitch: 0,
    hopY: 0,
    hopV: 0,
    squash: 0,
    squashV: 0,
    tip: 0,
    tipV: 0,
    nextBlink: 2.5,
    blinkUntil: 0,
    lastPoke: Number.NEGATIVE_INFINITY,
    hovered: false,
  });

  const geometry = useMemo(
    () => ({ tunic: makeTunicGeometry(), hat: makeHatGeometry(), beard: makeBeardGeometry() }),
    [],
  );
  const glowTexture = useMemo(() => makeRadialTexture(128), []);
  const shadowTexture = useMemo(
    () =>
      makeRadialTexture(128, [
        [0, 1],
        [0.4, 0.7],
        [1, 0],
      ]),
    [],
  );

  const materials = useMemo(
    () => ({
      wool: new THREE.MeshPhysicalMaterial({
        color: "#6f6d6a",
        roughness: 0.88,
        sheen: 1,
        sheenColor: new THREE.Color("#d8d4cc"),
        sheenRoughness: 0.75,
      }),
      hat: new THREE.MeshPhysicalMaterial({
        color: "#b3362b",
        roughness: 0.72,
        sheen: 0.8,
        sheenColor: new THREE.Color("#ff8a6e"),
        sheenRoughness: 0.6,
      }),
      hatBrim: new THREE.MeshPhysicalMaterial({
        color: "#9a2c23",
        roughness: 0.8,
        sheen: 0.7,
        sheenColor: new THREE.Color("#ff8a6e"),
        sheenRoughness: 0.6,
      }),
      beard: new THREE.MeshPhysicalMaterial({
        color: "#f1f2f4",
        roughness: 0.9,
        sheen: 1,
        sheenColor: new THREE.Color("#ffffff"),
        sheenRoughness: 0.5,
      }),
      skin: new THREE.MeshStandardMaterial({ color: "#e7b29a", roughness: 0.62 }),
      nose: new THREE.MeshStandardMaterial({ color: "#de8f78", roughness: 0.5 }),
      cheek: new THREE.MeshStandardMaterial({
        color: "#e48e7b",
        roughness: 0.7,
        transparent: true,
        opacity: 0.85,
      }),
      eye: new THREE.MeshStandardMaterial({ color: "#1a1412", roughness: 0.25 }),
      trousers: new THREE.MeshStandardMaterial({ color: "#2c3341", roughness: 0.85 }),
      boot: new THREE.MeshStandardMaterial({ color: "#3a2a22", roughness: 0.6 }),
      mitt: new THREE.MeshPhysicalMaterial({
        color: "#a3322a",
        roughness: 0.85,
        sheen: 0.8,
        sheenColor: new THREE.Color("#ff9a80"),
      }),
      hem: new THREE.MeshStandardMaterial({ color: "#4a4846", roughness: 0.9 }),
      leather: new THREE.MeshStandardMaterial({ color: "#3b2a20", roughness: 0.55 }),
      brass: new THREE.MeshStandardMaterial({ color: "#c9a25a", roughness: 0.35, metalness: 0.8 }),
      iron: new THREE.MeshStandardMaterial({ color: "#2b2826", roughness: 0.45, metalness: 0.6 }),
    }),
    [],
  );

  useEffect(() => {
    const disposables = [geometry.tunic, geometry.hat, geometry.beard, glowTexture, shadowTexture, ...Object.values(materials)];
    return () => disposables.forEach((item) => item.dispose());
  }, [geometry, glowTexture, shadowTexture, materials]);

  useEffect(() => {
    const canvas = gl.domElement;
    return () => {
      canvas.style.cursor = "";
    };
  }, [gl]);

  const setHover = (hovered: boolean) => {
    motion.current.hovered = hovered;
    if (!reducedMotion) gl.domElement.style.cursor = hovered ? "pointer" : "";
  };

  const poke = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (reducedMotion) return;
    const m = motion.current;
    const now = performance.now();
    if (now - m.lastPoke < POKE_COOLDOWN_MS) return;
    m.lastPoke = now;
    m.hopV = 1.55;
    m.squashV = -2.2;
    m.tipV = -9;
    puff.current?.burst();
  };

  useFrame((state, delta) => {
    const m = motion.current;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 1 / 20);

    // Lantern: a warm, slowly breathing flame (about ±8 %).
    const flicker = reducedMotion ? 1 : 1 + 0.08 * smoothNoise(t * 1.4, 3.1);
    if (lanternLight.current) lanternLight.current.intensity = 0.55 * flicker;
    if (lanternGlass.current) lanternGlass.current.emissiveIntensity = 2.6 * flicker;
    if (lanternGlow.current) lanternGlow.current.opacity = 0.42 * flicker;

    if (reducedMotion) return;

    // Head follows the pointer, and drifts back to centre when idle.
    const idle = pointerIsIdle();
    const targetYaw = idle ? 0 : THREE.MathUtils.clamp(pointer.x * 0.55, -MAX_YAW, MAX_YAW);
    const targetPitch = idle ? 0 : THREE.MathUtils.clamp(-pointer.y * 0.28, -MAX_PITCH, MAX_PITCH);
    const k = damp(0.05, dt);
    m.yaw += (targetYaw - m.yaw) * k;
    m.pitch += (targetPitch - m.pitch) * k;
    if (head.current) {
      head.current.rotation.y = m.yaw;
      head.current.rotation.x = m.pitch;
      head.current.rotation.z = Math.sin(t * 0.7) * 0.015;
    }
    if (eyes.current) {
      eyes.current.position.x = m.yaw * 0.02;
      eyes.current.position.y = -m.pitch * 0.015;
    }

    // Blink now and then.
    if (t > m.nextBlink) {
      m.blinkUntil = t + 0.12;
      m.nextBlink = t + 2.6 + Math.random() * 3.8;
    }
    if (eyes.current) eyes.current.scale.y = t < m.blinkUntil ? 0.12 : 1;

    // Hop: a small jump under gravity, then a squash spring on landing.
    m.hopV -= 9.8 * dt;
    m.hopY += m.hopV * dt;
    if (m.hopY <= 0) {
      if (m.hopV < -0.5) m.squashV += m.hopV * 0.9;
      m.hopY = 0;
      m.hopV = 0;
    }
    const squashAccel = -170 * m.squash - 11 * m.squashV;
    m.squashV += squashAccel * dt;
    m.squash += m.squashV * dt;
    const tipAccel = -120 * m.tip - 9 * m.tipV;
    m.tipV += tipAccel * dt;
    m.tip += m.tipV * dt;

    // Breathing.
    const breath = Math.sin(t * 1.5) * 0.012;
    if (root.current) root.current.position.y = position[1] + m.hopY;
    if (shadow.current) shadow.current.opacity = 0.7 * Math.max(0.3, 1 - m.hopY * 3);
    if (body.current) {
      const s = THREE.MathUtils.clamp(m.squash, -0.25, 0.25);
      body.current.scale.set(1 - s * 0.5, 1 + s + breath, 1 - s * 0.5);
    }
    if (hat.current) hat.current.rotation.x = 0.1 + m.tip * 0.08;
    if (lantern.current) {
      lantern.current.rotation.z = Math.sin(t * 1.1) * 0.035 - m.hopV * 0.04;
      lantern.current.rotation.x = Math.sin(t * 0.8 + 1) * 0.025;
    }
  });

  return (
    <>
    {/* Soft blob shadow on the snow; it fades while the Nisse is in the air. */}
    <mesh position={[position[0] + 0.02, position[1] + 0.004, position[2]]} rotation-x={-Math.PI / 2} scale={[0.75 * scale, 0.6 * scale, 1]} renderOrder={1}>
      <planeGeometry />
      <meshBasicMaterial ref={shadow} map={shadowTexture} color="#000000" transparent opacity={0.7} depthWrite={false} />
    </mesh>
    <group ref={root} position={position} rotation-y={rotationY} scale={scale}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
        onPointerOut={() => setHover(false)}
        onClick={poke}
      >
        <group ref={body}>
          {/* Boots and legs */}
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.085, 0, 0]}>
              <mesh material={materials.trousers} position={[0, 0.13, 0]}>
                <capsuleGeometry args={[0.055, 0.08, 8, 20]} />
              </mesh>
              <mesh
                material={materials.boot}
                position={[side * 0.006, 0.048, 0.035]}
                scale={[0.068, 0.05, 0.105]}
              >
                <sphereGeometry args={[1, 32, 20]} />
              </mesh>
            </group>
          ))}

          {/* Tunic, belt and buckle */}
          <mesh geometry={geometry.tunic} material={materials.wool} />
          <mesh material={materials.leather} position={[0, 0.27, 0]} rotation-x={Math.PI / 2} scale={[1, 0.88, 1]}>
            <torusGeometry args={[0.243, 0.016, 12, 72]} />
          </mesh>
          <mesh material={materials.hem} position={[0, 0.162, 0]} rotation-x={Math.PI / 2} scale={[1, 0.88, 1]}>
            <torusGeometry args={[0.212, 0.012, 10, 72]} />
          </mesh>
          <mesh material={materials.brass} position={[0, 0.27, 0.218]}>
            <boxGeometry args={[0.05, 0.04, 0.012]} />
          </mesh>

          {/* Arms and mitts */}
          <mesh material={materials.wool} position={LEFT_ARM.position} quaternion={LEFT_ARM.quaternion}>
            <capsuleGeometry args={[0.048, LEFT_ARM.length, 8, 20]} />
          </mesh>
          <mesh material={materials.mitt} position={LEFT_HAND} scale={[1, 1.1, 0.9]}>
            <sphereGeometry args={[0.055, 28, 20]} />
          </mesh>
          <mesh material={materials.wool} position={RIGHT_ARM.position} quaternion={RIGHT_ARM.quaternion}>
            <capsuleGeometry args={[0.048, RIGHT_ARM.length, 8, 20]} />
          </mesh>
          <mesh material={materials.mitt} position={RIGHT_HAND} scale={[1, 1.1, 0.9]}>
            <sphereGeometry args={[0.055, 28, 20]} />
          </mesh>

          {/* Head */}
          <group position={[0, 0.775, 0.02]}>
            <group ref={head}>
              <mesh material={materials.skin}>
                <sphereGeometry args={[0.148, 48, 32]} />
              </mesh>
              {[-1, 1].map((side) => (
                <mesh key={`ear${side}`} material={materials.skin} position={[side * 0.142, -0.02, 0]} scale={[0.5, 1, 0.75]}>
                  <sphereGeometry args={[0.04, 20, 16]} />
                </mesh>
              ))}

              {/* Eyes, cheeks, nose */}
              <group ref={eyes}>
                {[-1, 1].map((side) => (
                  <mesh key={`eye${side}`} material={materials.eye} position={[side * 0.052, -0.028, 0.134]} scale={[1, 1.15, 0.6]}>
                    <sphereGeometry args={[0.019, 20, 16]} />
                  </mesh>
                ))}
              </group>
              {[-1, 1].map((side) => (
                <mesh key={`cheek${side}`} material={materials.cheek} position={[side * 0.083, -0.062, 0.112]}>
                  <sphereGeometry args={[0.036, 24, 16]} />
                </mesh>
              ))}
              <mesh material={materials.nose} position={[0, -0.066, 0.158]}>
                <sphereGeometry args={[0.046, 32, 24]} />
              </mesh>

              {/* Eyebrows */}
              {[-1, 1].map((side) => (
                <mesh
                  key={`brow${side}`}
                  material={materials.beard}
                  position={[side * 0.056, 0.008, 0.137]}
                  rotation={[0, side * 0.35, side * 1.35]}
                >
                  <capsuleGeometry args={[0.013, 0.04, 6, 12]} />
                </mesh>
              ))}

              {/* Beard: one soft spade shape, side tufts and a moustache */}
              <mesh geometry={geometry.beard} material={materials.beard} position={[0, -0.075, 0.075]} scale={[1, 1, 0.62]} rotation-x={-0.12} />
              {[-1, 1].map((side) => (
                <mesh
                  key={`tuft${side}`}
                  material={materials.beard}
                  position={[side * 0.105, -0.085, 0.06]}
                  rotation-z={side * 0.3}
                  scale={[0.052, 0.075, 0.06]}
                >
                  <sphereGeometry args={[1, 32, 24]} />
                </mesh>
              ))}
              {[-1, 1].map((side) => (
                <mesh
                  key={`moustache${side}`}
                  material={materials.beard}
                  position={[side * 0.05, -0.098, 0.15]}
                  rotation={[0.25, side * 0.35, -side * 1.3]}
                >
                  <capsuleGeometry args={[0.024, 0.055, 8, 16]} />
                </mesh>
              ))}

              {/* Hat with a rolled brim and a pompom */}
              <group ref={hat} position={[0, 0.035, -0.005]} rotation-x={0.1}>
                <mesh geometry={geometry.hat} material={materials.hat} />
                <mesh material={materials.hatBrim} rotation-x={Math.PI / 2} position={[0, 0.012, 0]}>
                  <torusGeometry args={[0.16, 0.022, 20, 72]} />
                </mesh>
                <mesh material={materials.beard} position={HAT_TIP}>
                  <sphereGeometry args={[0.052, 32, 24]} />
                </mesh>
              </group>
            </group>
          </group>

          {/* Lantern, hanging from the right mitt */}
          <group ref={lantern} position={[RIGHT_HAND[0], RIGHT_HAND[1] - 0.02, RIGHT_HAND[2]]} scale={1.25}>
            <mesh material={materials.iron} position={[0, -0.03, 0]} rotation-z={Math.PI}>
              <torusGeometry args={[0.028, 0.0045, 8, 24, Math.PI]} />
            </mesh>
            <mesh material={materials.iron} position={[0, -0.055, 0]}>
              <coneGeometry args={[0.052, 0.04, 24]} />
            </mesh>
            <mesh material={materials.iron} position={[0, -0.077, 0]}>
              <cylinderGeometry args={[0.052, 0.052, 0.008, 24]} />
            </mesh>
            <mesh position={[0, -0.125, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.09, 24]} />
              <meshStandardMaterial
                ref={lanternGlass}
                color="#ffd9a0"
                emissive="#ffae45"
                emissiveIntensity={2.6}
                roughness={0.3}
              />
            </mesh>
            {[0, 1, 2, 3].map((i) => (
              <mesh
                key={i}
                material={materials.iron}
                position={[Math.cos((i * Math.PI) / 2 + Math.PI / 4) * 0.045, -0.125, Math.sin((i * Math.PI) / 2 + Math.PI / 4) * 0.045]}
              >
                <boxGeometry args={[0.008, 0.095, 0.008]} />
              </mesh>
            ))}
            <mesh material={materials.iron} position={[0, -0.176, 0]}>
              <cylinderGeometry args={[0.05, 0.054, 0.016, 24]} />
            </mesh>
            <pointLight
              ref={lanternLight}
              position={[0, -0.12, 0.02]}
              color="#ffad4d"
              intensity={0.55}
              distance={6}
              decay={1}
            />
            <sprite position={[0, -0.125, 0.01]} scale={[0.55, 0.55, 1]} renderOrder={2}>
              <spriteMaterial
                ref={lanternGlow}
                map={glowTexture}
                color="#ffb24f"
                transparent
                opacity={0.42}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                fog={false}
              />
            </sprite>
          </group>
        </group>
      </group>
      <SnowPuff ref={puff} origin={[0, 0.05, 0.05]} />
    </group>
    </>
  );
}
