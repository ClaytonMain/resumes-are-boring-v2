import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  DEFAULT_CAMERA_FOV,
  PAGE_THREE_COLORS,
} from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";
import ThreeBackgroundComponent from "./ThreeBackgroundComponent";
import type { ThreeBackgroundUniforms } from "./types/types";

export default function ThreeBackground() {
  const displayThreeBackgroundRef = useRef(
    useAppStore.getState().displayThreeBackground,
  );
  const kickItUpANotchRef = useRef(useAppStore.getState().kickItUpANotch);

  useEffect(() => {
    const unsubDisplayThreeBackground = useAppStore.subscribe(
      (state) => state.displayThreeBackground,
      (value) => {
        displayThreeBackgroundRef.current = value;
      },
    );
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value !== previousValue) {
          uniforms.uColorProgress.value = 0;
          uniforms.uPreviousDiffuseColor.value.copy(
            uniforms.uCurrentDiffuseColor.value,
          );
          uniforms.uPreviousSubsurfaceColor.value.copy(
            uniforms.uCurrentSubsurfaceColor.value,
          );
          uniforms.uCurrentDiffuseColor.value.copy(
            PAGE_THREE_COLORS[value].diffuse,
          );
          uniforms.uCurrentSubsurfaceColor.value.copy(
            PAGE_THREE_COLORS[value].subsurface,
          );
        }
      },
    );
    return () => {
      unsubDisplayThreeBackground();
      unsubCurrentPage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniforms: ThreeBackgroundUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uCameraPosition: { value: new THREE.Vector3() },
      uInverseViewMatrix: { value: new THREE.Matrix4() },
      uResolution: { value: new THREE.Vector2() },
      uGlZ: {
        value: -1 / (2 * Math.tan(DEFAULT_CAMERA_FOV * (Math.PI / 180) * 0.5)),
      },
      uVisibility: { value: 0 },
      uZSpacing: { value: 4 },
      uLightColor: { value: new THREE.Color("#ffffff") },
      uSubsurfaceRadius: { value: 0.8 },
      uRoughness: { value: 1.0 },
      uRefractionIndex: { value: 1.57 },

      uColorProgress: { value: 1 },
      uCurrentDiffuseColor: { value: new THREE.Color("#ffa9a9") },
      uPreviousDiffuseColor: { value: new THREE.Color("#ffa9a9") },
      uCurrentSubsurfaceColor: { value: new THREE.Color("#ef0717") },
      uPreviousSubsurfaceColor: { value: new THREE.Color("#ef0717") },
    };
  }, []);

  useControls({
    resetBackgroundVisibility: button(() => (uniforms.uVisibility.value = 0)),
    uZSpacing: {
      value: uniforms.uZSpacing.value,
      min: 0.1,
      max: 20,
      step: 0.1,
      onChange: (value) => (uniforms.uZSpacing.value = value),
    },
    uLightColor: {
      value: `#${uniforms.uLightColor.value.getHexString()}`,
      onChange: (value) => {
        const color = new THREE.Color(value);
        uniforms.uLightColor.value.copy(color);
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
  const mouseVector = new THREE.Vector3();

  useFrame(({ camera, pointer }, delta) => {
    uDeltaRef.current = Math.min(delta, 0.1);
    uTimeRef.current = (uTimeRef.current + uDeltaRef.current) % 100000;

    camera.getWorldPosition(cameraPosition);
    mouseVector.lerp(
      new THREE.Vector3(-pointer.x * 0.1, -pointer.y * 0.1, 0),
      0.01,
    );
    cameraPosition.copy(cameraPosition.clone().add(mouseVector));

    uniforms.uInverseViewMatrix.value.copy(camera.matrixWorld);

    uniforms.uTime.value = uTimeRef.current;
    uniforms.uCameraPosition.value.copy(cameraPosition);
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);

    if (displayThreeBackgroundRef.current && uniforms.uVisibility.value < 1) {
      uniforms.uVisibility.value = Math.min(
        uniforms.uVisibility.value + uDeltaRef.current * 0.1,
        1,
      );
    }

    if (
      uniforms.uVisibility.value > 0.35 &&
      kickItUpANotchRef.current !== "BAM!"
    ) {
      useAppStore.setState({ kickItUpANotch: "BAM!" });
      kickItUpANotchRef.current = "BAM!";
    }

    if (uniforms.uColorProgress.value < 1) {
      uniforms.uColorProgress.value = Math.min(
        uniforms.uColorProgress.value + uDeltaRef.current * 0.1,
        1,
      );
    }
  });

  return (
    <>
      <ThreeBackgroundComponent uniforms={uniforms} />
    </>
  );
}
