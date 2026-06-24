"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { OrbitControls, Html } from "@react-three/drei";
import { Boxes, Store } from "lucide-react";
import { SceneCanvas } from "@/src/three/canvas/SceneCanvas";

/* ──────────────────────────────────────────────────────────
 * Sala 3D simple del Hub: piso + paredes + cuadros (planos de
 * color) + estanterías (cajas). Polígonos moderados.
 * ────────────────────────────────────────────────────────── */

const CREAM = "#F3EFE4";
const WALL = "#E7E1D2";
const NAVY = "#0E1B2C";

/** Cuadro colgado: plano de color con marco navy. */
function Painting({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.25, 1.65]} />
        <meshStandardMaterial color={NAVY} />
      </mesh>
      <mesh>
        <planeGeometry args={[1.05, 1.45]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Estantería de suministros: caja + repisas. */
function Shelf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.6, 2, 0.5]} />
        <meshStandardMaterial color="#cbb994" roughness={0.7} />
      </mesh>
      {[-0.6, 0, 0.6].map((y) => (
        <mesh key={y} position={[0, y, 0.26]}>
          <boxGeometry args={[1.5, 0.06, 0.04]} />
          <meshStandardMaterial color={NAVY} />
        </mesh>
      ))}
    </group>
  );
}

function Hotspot({
  position,
  label,
}: {
  position: [number, number, number];
  label: string;
}) {
  return (
    <Html position={position} center distanceFactor={8} occlude>
      <span className="whitespace-nowrap rounded-full border border-border bg-surface/90 px-3 py-1 text-xs font-medium text-foreground shadow-e1 backdrop-blur">
        {label}
      </span>
    </Html>
  );
}

function Room() {
  return (
    <group>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 6]} intensity={1} color="#fff7e8" />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#3B54E8" />

      {/* piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color={CREAM} roughness={1} />
      </mesh>

      {/* pared de fondo */}
      <mesh position={[0, 1.2, -5]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      {/* pared lateral izquierda */}
      <mesh position={[-6, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>

      {/* cuadros en la pared de fondo */}
      <Painting position={[-2.6, 1, -4.9]} color="#C2410C" />
      <Painting position={[0, 1, -4.9]} color="#3B54E8" />
      <Painting position={[2.6, 1, -4.9]} color="#B7791F" />

      {/* cuadros en la pared izquierda */}
      <Painting
        position={[-5.9, 1, -1.5]}
        rotation={[0, Math.PI / 2, 0]}
        color="#0E7C66"
      />
      <Painting
        position={[-5.9, 1, 1.5]}
        rotation={[0, Math.PI / 2, 0]}
        color="#7C2D91"
      />

      {/* estanterías de suministros */}
      <Shelf position={[3.4, -0.6, -1]} />
      <Shelf position={[3.4, -0.6, 1.2]} />

      {/* hotspots */}
      <Hotspot position={[3.4, 1, 0]} label="Suministros" />
      <Hotspot position={[0, 2.4, -4.6]} label="Incubadora" />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 0.4, -1]}
      />
    </group>
  );
}

/** Fallback estático on-brand cuando no hay WebGL. */
function StaticRoom() {
  return (
    <div className="grid h-full w-full place-items-center bg-surface-muted p-8">
      <div className="text-center">
        <div className="mx-auto flex gap-3">
          <span className="grid h-16 w-12 place-items-center rounded bg-terracotta/80" />
          <span className="grid h-16 w-12 place-items-center rounded bg-primary/80" />
          <span className="grid h-16 w-12 place-items-center rounded bg-gold/80" />
        </div>
        <p className="mt-5 font-display text-lg font-semibold">El Hub</p>
        <p className="mt-1 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Store className="size-4" /> Suministros
          </span>
          <span className="inline-flex items-center gap-1">
            <Boxes className="size-4" /> Incubadora
          </span>
        </p>
        <p className="mt-3 max-w-xs text-xs text-muted-foreground">
          Tu dispositivo no soporta 3D, pero podés visitar el Hub en persona.
        </p>
      </div>
    </div>
  );
}

function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function HubTourInner() {
  const [supported] = useState(hasWebGL);

  return (
    <div className="h-[62vh] w-full overflow-hidden rounded-xl border border-border shadow-e1">
      {supported ? (
        <SceneCanvas camera={{ position: [0, 1.5, 9], fov: 50 }}>
          <Room />
        </SceneCanvas>
      ) : (
        <StaticRoom />
      )}
    </div>
  );
}

// El Canvas toca window → sólo en cliente.
export const HubTour = dynamic(() => Promise.resolve(HubTourInner), {
  ssr: false,
});
