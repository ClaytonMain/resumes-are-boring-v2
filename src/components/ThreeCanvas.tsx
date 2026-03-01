import { Bounds, Environment, Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  DEFAULT_CAMERA_POSITION,
  SCENE_BACKGROUND_COLORS,
} from "../constants/constants";
import useAppStore from "../stores/useAppStore";
import CameraController from "./CameraController";
import CustomStatsComponent from "./CustomStatsComponent";
import DirectionalLightComponent from "./DirectionalLightComponent";
import ThreeBackground from "./three-background/ThreeBackground";

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const debug = useAppStore((state) => state.debug);
  const cameraRef = useRef<THREE.OrthographicCamera>(null!);

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
          ref: cameraRef,
          position: DEFAULT_CAMERA_POSITION,
          // fov: DEFAULT_CAMERA_FOV,
          top: 5,
          bottom: -5,
          left: -5 * (window.innerWidth / window.innerHeight),
          right: 5 * (window.innerWidth / window.innerHeight),
          near: 0.1,
          far: 100,
        }}
        orthographic
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
          {debug && <CustomStatsComponent />}
          {/* <directionalLight position={[-5, 5, 5]} castShadow /> */}
          <DirectionalLightComponent />
          <CameraController />
          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.1} />
          {/* <FogController /> */}
          {/* <ThreeEffects /> */}
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
