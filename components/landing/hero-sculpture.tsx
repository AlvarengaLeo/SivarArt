"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { HeroSculpture } from "@/src/three/landing/HeroSculpture";

const Lazy = dynamic(() => Promise.resolve(Inner), { ssr: false });

function Inner() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6.2], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <HeroSculpture />
      </Suspense>
    </Canvas>
  );
}

export function HeroSculptureCanvas() {
  return <Lazy />;
}
