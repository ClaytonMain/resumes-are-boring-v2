import {
  Bounds,
  Environment,
  Loader,
  OrbitControls,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_POSITION,
  SCENE_BACKGROUND_COLORS,
} from "../constants/constants";
import useAppStore from "../stores/useAppStore";
// import CameraController from "./CameraController";
import FogController from "./FogController";
import ThreeEffects from "./ThreeEffects";
import ThreeBackground from "./three-background/ThreeBackground";

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value !== previousValue) {
          canvasRef.current.style.background = SCENE_BACKGROUND_COLORS[value];
        }
      },
    );
    return () => {
      unsubCurrentPage();
    };
  }, []);

  return (
    <>
      <Canvas
        ref={canvasRef}
        shadows={{
          enabled: true,
          type: THREE.PCFShadowMap,
        }}
        camera={{
          position: DEFAULT_CAMERA_POSITION,
          fov: DEFAULT_CAMERA_FOV,
        }}
        dpr={1}
        style={{
          touchAction: "none",
          height: "100vh",
          background: SCENE_BACKGROUND_COLORS["home"],
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        <Suspense fallback={null}>
          <Bounds>
            <ThreeBackground />
            {/* <ThreeFloor /> */}
          </Bounds>
          <Environment preset="apartment" />
          {/* <ambientLight intensity={0.5} /> */}
          <Stats />
          <directionalLight position={[5, 2, 5]} castShadow />
          {/* <CameraController /> */}
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.0} />
          <FogController />
          <ThreeEffects />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
