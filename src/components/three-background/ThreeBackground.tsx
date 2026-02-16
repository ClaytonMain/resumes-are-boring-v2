import { useSprings } from "@react-spring/three";
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

  // const nearDiffuseSpring = useSpringValue("#ffa9a9", {
  //   config: { duration: 400 },
  // });
  // const farDiffuseSpring = useSpringValue("#ffa9a9", {
  //   config: { duration: 2000 },
  // });
  // const nearSubsurfaceSpring = useSpringValue("#ef0717", {
  //   config: { duration: 400, del },
  // });
  // const farSubsurfaceSpring = useSpringValue("#ef0717", {
  //   config: { duration: 2000 },
  // });

  const [diffuseSprings, diffuseApi] = useSprings(10, () => ({
    value: "#ffa9a9",
  }));
  const [subsurfaceSprings, subsurfaceApi] = useSprings(10, () => ({
    value: "#ef0717",
  }));

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
          diffuseApi.start((i) => ({
            value: `#${PAGE_THREE_COLORS[value].diffuse.getHexString()}`,
            delay: i * 200,
          }));
          subsurfaceApi.start((i) => ({
            value: `#${PAGE_THREE_COLORS[value].subsurface.getHexString()}`,
            delay: i * 200,
          }));
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

      // uNearDiffuseColor: { value: new THREE.Color("#ffa9a9") },
      // uFarDiffuseColor: { value: new THREE.Color("#ffa9a9") },
      // uNearSubsurfaceColor: { value: new THREE.Color("#ef0717") },
      // uFarSubsurfaceColor: { value: new THREE.Color("#ef0717") },

      uDiffuseColors: {
        value: Array.from({ length: 10 }, () => new THREE.Color("#ffa9a9")),
      },
      uSubsurfaceColors: {
        value: Array.from({ length: 10 }, () => new THREE.Color("#ef0717")),
      },
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
  // const cameraInverseViewMatrix = new THREE.Matrix4();
  const uDeltaRef = useRef(0);
  const uTimeRef = useRef(0);
  const mouseVector = new THREE.Vector3();

  // const nearDiffuseColor = new THREE.Color();
  // const farDiffuseColor = new THREE.Color();
  // const nearSubsurfaceColor = new THREE.Color();
  // const farSubsurfaceColor = new THREE.Color();

  useFrame(({ camera, pointer }, delta) => {
    uDeltaRef.current = Math.min(delta, 0.1);
    uTimeRef.current = (uTimeRef.current + uDeltaRef.current) % 100000;

    camera.getWorldPosition(cameraPosition);
    mouseVector.lerp(
      new THREE.Vector3(-pointer.x * 0.1, -pointer.y * 0.1, 0),
      0.01,
    );

    cameraPosition.copy(cameraPosition.clone().add(mouseVector));

    // cameraInverseViewMatrix.copy(camera.matrixWorld);
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

    // nearDiffuseColor.set(nearDiffuseSpring.get());
    // farDiffuseColor.set(farDiffuseSpring.get());
    // nearSubsurfaceColor.set(nearSubsurfaceSpring.get());
    // farSubsurfaceColor.set(farSubsurfaceSpring.get());

    // uniforms.uNearDiffuseColor.value.setHex(nearDiffuseColor.getHex());
    // uniforms.uFarDiffuseColor.value.setHex(farDiffuseColor.getHex());
    // uniforms.uNearSubsurfaceColor.value.setHex(nearSubsurfaceColor.getHex());
    // uniforms.uFarSubsurfaceColor.value.setHex(farSubsurfaceColor.getHex());

    // uniforms.uDiffuseColors.value.forEach((value, i) =>
    //   value.set(diffuseSprings[i].value.get()),
    // );
    // console.log(diffuseSprings[0].value.get());
    // console.log(diffuseSprings);
    // console.log(diffuseSprings.map((spring) => spring.value.get()));
    // console.log(uniforms.uDiffuseColors.value);
    // uniforms.uSubsurfaceColors.value = subsurfaceSprings.map(
    //   (spring) => new THREE.Color(spring.value.get()),
    // );
    // uniforms.uSubsurfaceColors.value.forEach((value, i) =>
    //   value.set(subsurfaceSprings[i].value.get()),
    // );
  });

  return <ThreeBackgroundComponent uniforms={uniforms} />;
}
