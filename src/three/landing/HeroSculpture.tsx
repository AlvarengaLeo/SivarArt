"use client";

import {
  Environment,
  Lightformer,
  Sparkles,
  Float,
  ContactShadows,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BRONZE = "#8a6a3c";
const PERIWINKLE = "#6e7bf2";

/** Masa escultórica facetada (low-poly) en bronce pulido. */
function Sculpture() {
  const geom = useMemo(() => {
    // detail=1 → facetas grandes, aire cubista low-poly
    const g = new THREE.IcosahedronGeometry(1, 1);
    const pos = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      // ruido pseudo-aleatorio para facetas irregulares
      const n =
        Math.sin(v.x * 2.6 + v.y * 1.9) * 0.5 +
        Math.cos(v.y * 2.2 - v.z * 2.8) * 0.5;
      v.multiplyScalar(1 + n * 0.14);
      // silueta vertical tipo busto: elongar y afinar arriba
      v.y *= 1.58;
      const taper = THREE.MathUtils.lerp(1, 0.62, Math.max(0, v.y) / 1.7);
      v.x *= taper;
      v.z *= taper * 0.92; // ligeramente más plano de frente a atrás
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <mesh geometry={geom} castShadow position={[0, 0.15, 0]}>
      <meshStandardMaterial
        color={BRONZE}
        metalness={1}
        roughness={0.32}
        flatShading
        envMapIntensity={1.35}
      />
    </mesh>
  );
}

/** Pedestal oscuro. */
function Plinth() {
  return (
    <mesh position={[0, -1.75, 0]} receiveShadow castShadow>
      <boxGeometry args={[1.7, 1.4, 1.7]} />
      <meshStandardMaterial color="#0b0f1a" metalness={0.4} roughness={0.7} />
    </mesh>
  );
}

/** Anillo orbital tenue detrás de la escultura. */
function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2.1, 0.2, 0]} position={[0, 0.1, -0.3]}>
      <torusGeometry args={[2.15, 0.004, 16, 128]} />
      <meshBasicMaterial color={PERIWINKLE} transparent opacity={0.4} />
    </mesh>
  );
}

export function HeroSculpture() {
  const group = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();

  useFrame((state, dt) => {
    if (!group.current) return;
    if (!reduce) group.current.rotation.y += dt * 0.16;
    // parallax sutil con el puntero
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.12,
      0.05,
    );
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      state.pointer.x * 0.15,
      0.05,
    );
  });

  return (
    <>
      {/* iluminación de estudio (env procedural, sin HDR externo) */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={2.4}
          position={[4, 4, 4]}
          scale={[5, 5, 1]}
          color="#fff1d8"
        />
        <Lightformer
          intensity={1.6}
          position={[-5, 1, -3]}
          scale={[4, 6, 1]}
          color={PERIWINKLE}
        />
        <Lightformer
          intensity={0.5}
          position={[0, -4, 2]}
          scale={[8, 3, 1]}
          color="#22304f"
        />
      </Environment>

      <ambientLight intensity={0.25} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.7}
        color="#ffe9c7"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* rim light frío para el borde brillante */}
      <pointLight position={[-4, 2, -3]} intensity={40} color={PERIWINKLE} />

      <Float
        speed={reduce ? 0 : 1.1}
        rotationIntensity={reduce ? 0 : 0.12}
        floatIntensity={reduce ? 0 : 0.35}
      >
        <group ref={group}>
          <Sculpture />
          <Plinth />
          <OrbitRing />
        </group>
      </Float>

      <Sparkles
        count={45}
        scale={[7, 6, 4]}
        size={2.2}
        speed={0.28}
        opacity={0.5}
        color="#aab4ff"
      />

      <ContactShadows
        position={[0, -2.45, 0]}
        opacity={0.5}
        scale={9}
        blur={2.6}
        far={4}
        color="#000000"
      />

      <EffectComposer>
        <Bloom
          intensity={0.55}
          luminanceThreshold={0.72}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>
    </>
  );
}
