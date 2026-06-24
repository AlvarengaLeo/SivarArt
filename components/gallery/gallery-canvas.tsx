"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SceneCanvas } from "@/src/three/canvas/SceneCanvas";
import { GalleryScene } from "@/src/three/gallery/GalleryScene";
import type { Artwork } from "@/lib/types";

function Inner({ artworks }: { artworks: Artwork[] }) {
  const router = useRouter();

  return (
    <SceneCanvas
      className="!absolute inset-0"
      camera={{ position: [0, 1.5, 6], fov: 50 }}
    >
      <GalleryScene
        artworks={artworks}
        onSelect={(slug) => router.push(`/obra/${slug}`)}
      />
    </SceneCanvas>
  );
}

// El Canvas R3F toca window → sólo en cliente.
const Lazy = dynamic(() => Promise.resolve(Inner), { ssr: false });

export function GalleryCanvas({ artworks }: { artworks: Artwork[] }) {
  return <Lazy artworks={artworks} />;
}
