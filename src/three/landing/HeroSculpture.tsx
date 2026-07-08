"use client";

import {
  Environment,
  Lightformer,
  Sparkles,
  Float,
  ContactShadows,
  useGLTF,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BRONZE = "#8a6a3c";
const PERIWINKLE = "#6e7bf2";
const MODEL = "/models/bust.glb";

useGLTF.preload(MODEL);

/** Busto low-poly ("Bust" por Eric Wilson, CC-BY 3.0) con material de bronce. */
function Bust() {
  const { scene } = useGLTF(MODEL);
  const ref = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();

  const model = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const scale = 2.35 / size.y;
    const bronze = new THREE.MeshStandardMaterial({
      color: BRONZE,
      metalness: 1,
      roughness: 0.36,
      flatShading: true,
      envMapIntensity: 1.35,
    });
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.material = bronze;
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    // recentrar (el modelo no está centrado en el origen) y escalar
    s.position.set(-center.x, -center.y, -center.z);
    return { object: s, scale };
  }, [scene]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    // oscilación suave que muestra siempre la cara (no giro completo)
    const baseY = reduce ? 0 : Math.sin(t * 0.3) * 0.32;
    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      baseY + state.pointer.x * 0.18,
      0.05,
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      -state.pointer.y * 0.08,
      0.05,
    );
  });

  // asiento: escala 2.35 de alto → busto abarca ±1.175; con groupY 0.05 la base
  // queda en y=-1.125, justo sobre la tapa del pedestal.
  return (
    <group ref={ref} position={[0, 0.05, 0]} scale={model.scale}>
      <primitive object={model.object} />
    </group>
  );
}

/** Pedestal oscuro (tapa en y ≈ -1.15). */
function Plinth() {
  return (
    <mesh position={[0, -1.9, 0]} receiveShadow castShadow>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#0b0f1a" metalness={0.4} roughness={0.7} />
    </mesh>
  );
}

/** Anillo orbital tenue detrás de la escultura. */
function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2.1, 0.2, 0]} position={[0, 0.1, -0.3]}>
      <torusGeometry args={[2.3, 0.004, 16, 128]} />
      <meshBasicMaterial color={PERIWINKLE} transparent opacity={0.4} />
    </mesh>
  );
}

export function HeroSculpture() {
  const reduce = useReducedMotion();

  return (
    <>
      {/* iluminación de estudio (env procedural, sin HDR externo) */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={2.6}
          position={[4, 4, 4]}
          scale={[5, 5, 1]}
          color="#fff1d8"
        />
        <Lightformer
          intensity={1.8}
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

      <ambientLight intensity={0.28} />
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.8}
        color="#ffe9c7"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 2, -3]} intensity={40} color={PERIWINKLE} />

      <Float
        speed={reduce ? 0 : 1}
        rotationIntensity={0}
        floatIntensity={reduce ? 0 : 0.18}
      >
        <Bust />
      </Float>
      <Plinth />
      <OrbitRing />

      <Sparkles
        count={45}
        scale={[7, 6, 4]}
        size={2.2}
        speed={0.28}
        opacity={0.5}
        color="#aab4ff"
      />

      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.5}
        scale={9}
        blur={2.6}
        far={4}
        color="#000000"
      />

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.72}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.7} />
      </EffectComposer>
    </>
  );
}
