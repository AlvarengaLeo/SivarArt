"use client";

import dynamic from "next/dynamic";
import { SceneCanvas } from "@/src/three/canvas/SceneCanvas";
import { HeroScene } from "@/src/three/landing/HeroScene";

// El Canvas toca window → sólo en cliente.
const Lazy = dynamic(() => Promise.resolve(Inner), { ssr: false });

function Inner() {
  return (
    <SceneCanvas className="!absolute inset-0">
      <HeroScene />
    </SceneCanvas>
  );
}

export function HeroCanvas() {
  return <Lazy />;
}
