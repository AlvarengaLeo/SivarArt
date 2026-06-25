"use client";

import { Float, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { IMAGES } from "@/lib/mock";

const COBALT = "#2438C4";
const NAVY = "#0E1B2C";

/** Lienzo enmarcado flotante con una obra real salvadoreña. */
function ArtFrame({
  url,
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const W = 1.5;
  const H = 1.95;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* marco */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[W + 0.16, H + 0.16, 0.08]} />
        <meshStandardMaterial color={NAVY} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* passe-partout */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[W + 0.04, H + 0.04]} />
        <meshStandardMaterial color="#fbf9f2" roughness={1} />
      </mesh>
      {/* obra */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  const group = useRef<THREE.Group>(null);

  const particles = useMemo(() => {
    const n = 70;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.22,
      0.04,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.12,
      0.04,
    );
    group.current.position.y = Math.sin(t * 0.4) * 0.06;
  });

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1.15} color="#fff7e8" />
      <directionalLight position={[-6, -2, -4]} intensity={0.35} color={COBALT} />

      <group ref={group}>
        {/* obra focal */}
        <Float speed={1.3} rotationIntensity={0.18} floatIntensity={0.5}>
          <ArtFrame url={IMAGES.obraFiesta} position={[0.3, 0, 0]} scale={1.12} />
        </Float>
        {/* obra izquierda */}
        <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.7}>
          <ArtFrame
            url={IMAGES.obraPueblo}
            position={[-2.7, 0.5, -1.6]}
            rotation={[0, 0.5, 0.04]}
            scale={0.78}
          />
        </Float>
        {/* obra derecha */}
        <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.6}>
          <ArtFrame
            url={IMAGES.obraMemoria}
            position={[3.0, -0.35, -1.2]}
            rotation={[0, -0.5, -0.03]}
            scale={0.7}
          />
        </Float>

        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particles, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.035} color={NAVY} transparent opacity={0.3} />
        </points>
      </group>
    </>
  );
}
