import { Environment, Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { DEFAULT_CAMERA_POSITION } from "../constants/constants";
import useAppStore from "../stores/useAppStore";
import CameraController from "./CameraController";
import CustomStatsComponent from "./CustomStatsComponent";
import DirectionalLightComponent from "./DirectionalLightComponent";
import ThreeBackground from "./three-background/ThreeBackground";

export default function ThreeCanvas() {
  const debug = useAppStore.getState().debug;

  return (
    <>
      <Canvas
        shadows={{
          enabled: true,
          type: THREE.PCFShadowMap,
        }}
        camera={{
          position: DEFAULT_CAMERA_POSITION,
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
          background: "#171717",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      >
        <Suspense fallback={null}>
          <ThreeBackground />
          <Environment preset="apartment" />
          {debug && <CustomStatsComponent />}
          <DirectionalLightComponent />
          <CameraController />
          <OrbitControls
            makeDefault
            autoRotate
            enableDamping
            autoRotateSpeed={0.1}
            enablePan={false}
            maxZoom={4}
            minZoom={2.5}
            maxPolarAngle={Math.PI * 0.2 + 0.2}
            minPolarAngle={Math.PI * 0.2 + 0.0}
          />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
