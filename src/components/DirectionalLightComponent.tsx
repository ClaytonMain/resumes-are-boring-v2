import { useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

export default function DirectionalLightComponent() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  const shadowCameraRef = useRef<THREE.OrthographicCamera>(null!);

  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, "red");
  useHelper(shadowCameraRef, THREE.CameraHelper);

  const shadowCameraControls = useControls("Shadow Camera", {
    left: {
      value: -15,
      step: 0.1,
      min: -20,
      max: 0,
      onChange: (value) => {
        shadowCameraRef.current.left = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    right: {
      value: 15,
      step: 0.1,
      min: 0,
      max: 20,
      onChange: (value) => {
        shadowCameraRef.current.right = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    top: {
      value: 5,
      step: 0.1,
      min: 0,
      max: 20,
      onChange: (value) => {
        shadowCameraRef.current.top = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    bottom: {
      value: -5,
      step: 0.1,
      min: -20,
      max: 0,
      onChange: (value) => {
        shadowCameraRef.current.bottom = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    near: {
      value: 5.0,
      step: 0.1,
      min: 0.1,
      max: 20,
      onChange: (value) => {
        shadowCameraRef.current.near = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    far: {
      value: 15,
      step: 0.1,
      min: 0.1,
      max: 100,
      onChange: (value) => {
        shadowCameraRef.current.far = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
  });

  return (
    <directionalLight
      ref={directionalLightRef}
      position={[-5, 3, 5]}
      castShadow
      // shadow-mapSize-height={1024}
      // shadow-mapSize-width={1920}
      shadow-mapSize-height={1024}
      shadow-mapSize-width={1024}
    >
      <orthographicCamera
        ref={shadowCameraRef}
        attach="shadow-camera"
        left={shadowCameraControls.left}
        right={shadowCameraControls.right}
        top={shadowCameraControls.top}
        bottom={shadowCameraControls.bottom}
        near={shadowCameraControls.near}
        far={shadowCameraControls.far}
      />
    </directionalLight>
  );
}
