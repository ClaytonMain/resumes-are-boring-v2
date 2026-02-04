import { Loader, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import EnterThree from "../pages/enter/EnterThree";

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <>
      <Canvas
        ref={canvasRef}
        shadows={{
          enabled: true,
          type: THREE.PCFShadowMap,
        }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{
          position: [0, 0, 0],
          fov: 45,
        }}
        style={{
          touchAction: "none",
        }}
      >
        <Suspense fallback={null}>
          <EnterThree />
          <ambientLight intensity={0.5} />
          <Stats />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
