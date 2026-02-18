import { useSpringValue } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { produce } from "immer";
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

const COLOR_SPRING_COUNT = 10;
const COLOR_SPRING_CONFIG = { config: { duration: 400 } };
const COLOR_SPRING_DELAY_FACTOR = 200;

function ColorSpringComponent({
  index,
  colors,
  colorType,
}: {
  index: number;
  colors: Array<THREE.Color>;
  colorType: "diffuse" | "subsurface";
}) {
  const colorSpring = useSpringValue(
    `#${colors[index].getHexString()}`,
    COLOR_SPRING_CONFIG,
  );

  useEffect(() => {
    const unsubDiffuse = useAppStore.subscribe(
      (state) => state.targetBackgroundDiffuseUpdatedAt,
      () => {
        if (colorType !== "diffuse") return;
        const targetColor = useAppStore.getState().targetBackgroundDiffuse;
        colorSpring.start(`#${targetColor.getHexString()}`, {
          delay: index * COLOR_SPRING_DELAY_FACTOR,
        });
      },
    );
    const unsubSubsurface = useAppStore.subscribe(
      (state) => state.targetBackgroundSubsurfaceUpdatedAt,
      () => {
        if (colorType !== "subsurface") return;
        const targetColor = useAppStore.getState().targetBackgroundSubsurface;
        colorSpring.start(`#${targetColor.getHexString()}`, {
          delay: index * COLOR_SPRING_DELAY_FACTOR,
        });
      },
    );
    return () => {
      unsubDiffuse();
      unsubSubsurface();
    };
  }, [colorType, colorSpring, index]);

  useFrame(() => {
    if (colorSpring.idle) return;

    colors[index].set(colorSpring.get());
  });

  return null;
}

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
          useAppStore.setState(
            produce((state) => {
              state.targetBackgroundDiffuse.set(
                PAGE_THREE_COLORS[value].diffuse,
              );
              state.targetBackgroundDiffuseUpdatedAt = Date.now();
              state.targetBackgroundSubsurface.set(
                PAGE_THREE_COLORS[value].subsurface,
              );
              state.targetBackgroundSubsurfaceUpdatedAt = Date.now();
            }),
          );
        }
      },
    );
    return () => {
      unsubDisplayThreeBackground();
      unsubCurrentPage();
    };
  }, []);

  const diffuseColors = Array.from(
    { length: COLOR_SPRING_COUNT },
    () => new THREE.Color("#ffa9a9"),
  );
  const subsurfaceColors = Array.from(
    { length: COLOR_SPRING_COUNT },
    () => new THREE.Color("#ef0717"),
  );

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

      uDiffuseColors: { value: diffuseColors },
      uSubsurfaceColors: { value: subsurfaceColors },
    };
  }, [diffuseColors, subsurfaceColors]);

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

    // Array.from({length: 10}).forEach()

    uniforms.uDiffuseColors.value = diffuseColors;
    uniforms.uSubsurfaceColors.value = subsurfaceColors;
  });

  return (
    <>
      <ThreeBackgroundComponent uniforms={uniforms} />
      {Array.from({ length: COLOR_SPRING_COUNT }).map((_, index) => (
        <ColorSpringComponent
          key={`color-spring-diffuse-${index}`}
          index={index}
          colors={diffuseColors}
          colorType="diffuse"
        />
      ))}
      {Array.from({ length: COLOR_SPRING_COUNT }).map((_, index) => (
        <ColorSpringComponent
          key={`color-spring-subsurface-${index}`}
          index={index}
          colors={subsurfaceColors}
          colorType="subsurface"
        />
      ))}
    </>
  );
}
