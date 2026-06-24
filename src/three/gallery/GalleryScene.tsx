"use client";

import { Suspense, useMemo } from "react";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Artwork } from "@/lib/types";

const CREAM = "#f3efe4";
const WALL = "#efe9da";
const FRAME = "#1a1410";
const EYE_LEVEL = 1.5;
const SPACING = 2.4;
const WALL_Z = -0.05;

/** Una obra enmarcada en la pared: marco oscuro + plano con la textura. */
function FramedArtwork({
  artwork,
  position,
  onSelect,
}: {
  artwork: Artwork;
  position: [number, number, number];
  onSelect?: (slug: string) => void;
}) {
  const texture = useTexture(artwork.image, (tex) => {
    const t = tex as THREE.Texture;
    t.colorSpace = THREE.SRGBColorSpace;
  });

  // Mantener proporción de la obra (alto fijo, ancho derivado).
  const ratio = artwork.widthCm / artwork.heightCm || 0.8;
  const h = 1.4;
  const w = h * ratio;
  const framePad = 0.12;

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(artwork.slug);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* marco oscuro */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[w + framePad, h + framePad, 0.06]} />
        <meshStandardMaterial color={FRAME} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* passe-partout crema */}
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[w + framePad * 0.5, h + framePad * 0.5]} />
        <meshStandardMaterial color={CREAM} roughness={0.95} />
      </mesh>
      {/* lienzo con textura */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={texture} roughness={0.85} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Room({ width }: { width: number }) {
  return (
    <group>
      {/* piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} receiveShadow>
        <planeGeometry args={[width + 8, 12]} />
        <meshStandardMaterial color={CREAM} roughness={1} />
      </mesh>
      {/* pared trasera (donde cuelgan las obras) */}
      <mesh position={[0, 2.4, WALL_Z - 0.1]}>
        <planeGeometry args={[width + 8, 6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      {/* pared izquierda */}
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[-(width / 2 + 4), 2.4, 2]}
      >
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      {/* pared derecha */}
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={[width / 2 + 4, 2.4, 2]}
      >
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
    </group>
  );
}

export function GalleryScene({
  artworks,
  onSelect,
}: {
  artworks: Artwork[];
  onSelect?: (slug: string) => void;
}) {
  const totalWidth = useMemo(
    () => Math.max(artworks.length - 1, 0) * SPACING,
    [artworks.length],
  );
  const startX = -totalWidth / 2;

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[0, 8, 6]}
        intensity={1.2}
        color="#fff7e8"
      />
      <directionalLight position={[-6, 4, 2]} intensity={0.35} color="#cdd6ff" />

      <Room width={totalWidth} />

      <Suspense fallback={null}>
        {artworks.map((artwork, i) => (
          <FramedArtwork
            key={artwork.id}
            artwork={artwork}
            position={[startX + i * SPACING, EYE_LEVEL, WALL_Z]}
            onSelect={onSelect}
          />
        ))}
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={2.5}
        maxDistance={9}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        target={[0, EYE_LEVEL, WALL_Z]}
      />
    </>
  );
}
