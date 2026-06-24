"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COBALT = "#3B54E8";
const NAVY = "#0E1B2C";

/** Un marco flotante de galería en wireframe. */
function Frame({
  position,
  rotation,
  scale = 1,
  fill,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  fill?: string;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* lienzo */}
      <mesh>
        <planeGeometry args={[1.4, 1.9]} />
        <meshStandardMaterial
          color={fill ?? "#ffffff"}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
      {/* marco wireframe */}
      <lineSegments>
        <edgesGeometry
          args={[new THREE.BoxGeometry(1.55, 2.05, 0.08)]}
        />
        <lineBasicMaterial color={COBALT} />
      </lineSegments>
    </group>
  );
}

export function HeroScene() {
  const group = useRef<THREE.Group>(null);

  // partículas sutiles (polvo de galería)
  const particles = useMemo(() => {
    const n = 60;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // parallax suave siguiendo el puntero
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.25,
      0.04,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.15,
      0.04,
    );
    group.current.position.y = Math.sin(t * 0.4) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#fff7e8" />
      <directionalLight position={[-6, -2, -4]} intensity={0.3} color={COBALT} />

      <group ref={group}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
          <Frame position={[0, 0, 0]} scale={1.15} fill="#f3efe4" />
        </Float>
        <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.8}>
          <Frame
            position={[-2.6, 0.5, -1.5]}
            rotation={[0, 0.5, 0.05]}
            scale={0.8}
            fill="#ffffff"
          />
        </Float>
        <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.7}>
          <Frame
            position={[2.7, -0.3, -1.2]}
            rotation={[0, -0.5, -0.04]}
            scale={0.7}
            fill="#fbf8ef"
          />
        </Float>

        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particles, 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.04} color={NAVY} transparent opacity={0.35} />
        </points>
      </group>
    </>
  );
}
