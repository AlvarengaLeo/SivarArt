"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  PerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useState, type ReactNode } from "react";

/**
 * Harness 3D compartido para toda la app.
 * - ssr:false debe aplicarse donde se importe (Canvas toca window).
 * - PerformanceMonitor = gobernador de FPS: baja el DPR si el dispositivo sufre.
 * - AdaptiveDpr/Events recortan trabajo bajo carga.
 */
export function SceneCanvas({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & Partial<CanvasProps>) {
  const [dpr, setDpr] = useState<number>(1.5);

  return (
    <Canvas
      className={className}
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 45 }}
      {...props}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(2)}
        onDecline={() => setDpr(1)}
      />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}
