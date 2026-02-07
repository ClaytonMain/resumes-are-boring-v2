import { Bounds, Loader, OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_POSITION,
  SCENE_BACKGROUND_COLORS,
} from "../constants/constants";
import EnterThree from "../pages/enter/EnterThree";
import useAppStore from "../stores/useAppStore";
import CameraController from "./CameraController";

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
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{
          position: DEFAULT_CAMERA_POSITION,
          fov: DEFAULT_CAMERA_FOV,
        }}
        style={{
          touchAction: "none",
          height: "100vh",
          background: SCENE_BACKGROUND_COLORS["enter"],
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        <Suspense fallback={null}>
          <Bounds>
            <EnterThree />
          </Bounds>
          {/* <ambientLight intensity={0.5} /> */}
          <Stats />
          <OrbitControls makeDefault />
          <CameraController />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
