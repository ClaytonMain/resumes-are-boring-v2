import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { DEFAULT_CAMERA_FOV } from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";
import ThreeBackgroundComponent from "./ThreeBackgroundComponent";
import type { ThreeBackgroundUniforms } from "./types/types";

export default function ThreeBackground() {
  const displayThreeBackgroundRef = useRef(
    useAppStore.getState().displayThreeBackground,
  );

  useEffect(() => {
    const unsubDisplayThreeBackground = useAppStore.subscribe(
      (state) => state.displayThreeBackground,
      (value) => {
        displayThreeBackgroundRef.current = value;
      },
    );
    return () => {
      unsubDisplayThreeBackground();
    };
  }, []);

  const uniforms: ThreeBackgroundUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uCameraPosition: { value: new THREE.Vector3() },
      uResolution: { value: new THREE.Vector2() },
      uGlZ: {
        value: -1 / (2 * Math.tan(DEFAULT_CAMERA_FOV * (Math.PI / 180) * 0.5)),
      },
      uVisibility: { value: 0 },
      uCenterRotation: { value: new THREE.Matrix3() },
      uXSpacing: { value: 4 },
      uYSpacing: { value: 4 },
      uZSpacing: { value: 4 },
      uZRotationAmplitude: { value: 0.3 },
      uZRotationFrequency: { value: 0.2 },
      uZRotationSpeed: { value: 0.1 },
      uLightColor: { value: new THREE.Color("#ffffff") },
      uDiffuseColor: { value: new THREE.Color("#ffffff") },
      uSubsurfaceColor: { value: new THREE.Color("#ff3000") },
      uSubsurfaceRadius: { value: 0.3 },
      uRoughness: { value: 0.5 },
      uRefractionIndex: { value: 1.5 },
    };
  }, []);

  useControls({
    resetBackgroundVisibility: button(() => (uniforms.uVisibility.value = 0)),
    uXSpacing: {
      value: uniforms.uXSpacing.value,
      min: 0.1,
      max: 20,
      step: 0.1,
      onChange: (value) => (uniforms.uXSpacing.value = value),
    },
    uYSpacing: {
      value: uniforms.uYSpacing.value,
      min: 0.1,
      max: 20,
      step: 0.1,
      onChange: (value) => (uniforms.uYSpacing.value = value),
    },
    uZSpacing: {
      value: uniforms.uZSpacing.value,
      min: 0.1,
      max: 20,
      step: 0.1,
      onChange: (value) => (uniforms.uZSpacing.value = value),
    },
    uZRotationAmplitude: {
      value: uniforms.uZRotationAmplitude.value,
      min: 0,
      max: Math.PI,
      step: 0.01,
      onChange: (value) => (uniforms.uZRotationAmplitude.value = value),
    },
    uZRotationFrequency: {
      value: uniforms.uZRotationFrequency.value,
      min: 0,
      max: 5,
      step: 0.01,
      onChange: (value) => (uniforms.uZRotationFrequency.value = value),
    },
    uLightColor: {
      value: "#ffffff",
      onChange: (value) => {
        const color = new THREE.Color(value);
        uniforms.uLightColor.value.copy(color);
      },
    },
    uDiffuseColor: {
      value: "#ffffff",
      onChange: (value) => {
        const color = new THREE.Color(value);
        uniforms.uDiffuseColor.value.copy(color);
      },
    },
    uSubsurfaceColor: {
      value: "#ff3000",
      onChange: (value) => {
        const color = new THREE.Color(value);
        uniforms.uSubsurfaceColor.value.copy(color);
      },
    },
    uSubsurfaceRadius: {
      value: uniforms.uSubsurfaceRadius.value,
      min: 0,
      max: 5,
      step: 0.1,
      onChange: (value) => (uniforms.uSubsurfaceRadius.value = value),
    },
    uRoughness: {
      value: uniforms.uRoughness.value,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (value) => (uniforms.uRoughness.value = value),
    },
    uRefractionIndex: {
      value: uniforms.uRefractionIndex.value,
      min: 1,
      max: 3,
      step: 0.01,
      onChange: (value) => (uniforms.uRefractionIndex.value = value),
    },
  });

  const cameraPosition = new THREE.Vector3();
  const uDeltaRef = useRef(0);
  const uTimeRef = useRef(0);
  // const centerEuler = new THREE.Euler();
  // const centerMatrix4 = new THREE.Matrix4();

  useFrame(({ camera }, delta) => {
    uDeltaRef.current = Math.min(delta, 0.1);
    uTimeRef.current = (uTimeRef.current + uDeltaRef.current) % 100000;

    camera.getWorldPosition(cameraPosition);

    uniforms.uTime.value = uTimeRef.current;
    uniforms.uCameraPosition.value.copy(cameraPosition);
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);

    // centerEuler.x += uDeltaRef.current * 0.3;
    // centerEuler.y += uDeltaRef.current * 0.5;
    // centerEuler.z += uDeltaRef.current * 0.1;

    // centerMatrix4.makeRotationFromEuler(centerEuler);
    // uniforms.uCenterRotation.value.setFromMatrix4(centerMatrix4);

    if (displayThreeBackgroundRef.current && uniforms.uVisibility.value < 1) {
      uniforms.uVisibility.value = Math.min(
        uniforms.uVisibility.value + uDeltaRef.current,
        1,
      );
    }
  });

  return <ThreeBackgroundComponent uniforms={uniforms} />;
}
