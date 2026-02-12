import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useSpring } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import useAppStore from "../../stores/useAppStore";
import { Suzanne } from "../Suzanne";
import floorFragmentShader from "./shaders/floor.frag";
import floorVertexShader from "./shaders/floor.vert";

const FLOOR_SIZE = 1000;
const FLOOR_SEGMENTS = 100;

const uniforms = {
  uTime: { value: 0 },
  uShift: { value: 0.01 },

  uBigElevation: { value: 40.0 },
  uBigFrequency: { value: 1.3 },
  uBigSpeed: { value: 0.03 },

  uSmallElevation: { value: 11.2 },
  uSmallFrequency: { value: 6.5 },
  uSmallSpeed: { value: 0.02 },
  uSmallIterations: { value: 3 },

  uVisibility: { value: 0.0 },
};

export default function ThreeFloor() {
  const floorRef = useRef<THREE.Mesh>(null!);
  const suzanneRef = useRef<THREE.Group>(null!);
  const suzanneTargetRef = useRef<THREE.Object3D>(null!);
  const displayThreeBackgroundRef = useRef(
    useAppStore.getState().displayThreeBackground,
  );
  const enterSuzanneRef = useRef(useAppStore.getState().enterSuzanne);
  const suzanneYSpring = useSpring(-150, {
    mass: 100,
    stiffness: 20,
    damping: 20,
  });

  useEffect(() => {
    const unsubDisplayThreeBackground = useAppStore.subscribe(
      (state) => state.displayThreeBackground,
      (displayThreeBackground) => {
        displayThreeBackgroundRef.current = displayThreeBackground;
      },
    );
    return () => unsubDisplayThreeBackground();
  }, []);

  useEffect(() => {
    useAppStore.setState({ threeFloorReady: true });
  }, []);

  const floorGeometry = useMemo(() => {
    const geometry = mergeVertices(
      new THREE.PlaneGeometry(
        FLOOR_SIZE,
        FLOOR_SIZE,
        FLOOR_SEGMENTS,
        FLOOR_SEGMENTS,
      ),
    );
    geometry.rotateX(-Math.PI / 2);
    geometry.computeTangents();
    return geometry;
  }, []);

  const controls = useControls({
    // basePosFreq: {
    //   value: uniforms.uBasePosFreq.value,
    //   min: 0.01,
    //   max: 1,
    //   step: 0.01,
    //   onChange: (value) => (uniforms.uBasePosFreq.value = value),
    // },
    // baseTimeFreq: {
    //   value: uniforms.uBaseTimeFreq.value,
    //   min: 0.01,
    //   max: 1,
    //   step: 0.01,
    //   onChange: (value) => (uniforms.uBaseTimeFreq.value = value),
    // },
    // baseStrength: {
    //   value: uniforms.uBaseStrength.value,
    //   min: 0,
    //   max: 100,
    //   step: 0.01,
    //   onChange: (value) => (uniforms.uBaseStrength.value = value),
    // },
    bigElevation: {
      value: uniforms.uBigElevation.value,
      min: 0,
      max: 80,
      step: 0.1,
      onChange: (value) => (uniforms.uBigElevation.value = value),
    },
    bigFrequency: {
      value: uniforms.uBigFrequency.value,
      min: 0,
      max: 10,
      step: 0.1,
      onChange: (value) => (uniforms.uBigFrequency.value = value),
    },
    bigSpeed: {
      value: uniforms.uBigSpeed.value,
      min: 0,
      max: 5,
      step: 0.01,
      onChange: (value) => (uniforms.uBigSpeed.value = value),
    },
    smallElevation: {
      value: uniforms.uSmallElevation.value,
      min: 0,
      max: 20,
      step: 0.1,
      onChange: (value) => (uniforms.uSmallElevation.value = value),
    },
    smallFrequency: {
      value: uniforms.uSmallFrequency.value,
      min: 0,
      max: 10,
      step: 0.1,
      onChange: (value) => (uniforms.uSmallFrequency.value = value),
    },
    smallSpeed: {
      value: uniforms.uSmallSpeed.value,
      min: 0,
      max: 5,
      step: 0.01,
      onChange: (value) => (uniforms.uSmallSpeed.value = value),
    },
    smallIterations: {
      value: uniforms.uSmallIterations.value,
      min: 0,
      max: 10,
      step: 1,
      onChange: (value) => (uniforms.uSmallIterations.value = value),
    },
    materialColor: {
      value: "#a0183a",
      // value: "#1a0409",
    },
    materialRoughness: {
      value: 0.75,
      min: 0,
      max: 1,
      step: 0.01,
    },
    materialMetalness: {
      value: 0.05,
      min: 0,
      max: 1,
      step: 0.01,
    },
    materialReflectivity: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    materialClearcoat: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    materialClearcoatRoughness: {
      value: 0.48,
      min: 0,
      max: 1,
      step: 0.01,
    },
    // uVisibility: {
    //   value: 0.1,
    //   min: 0,
    //   max: 1,
    //   step: 0.01,
    //   onChange: (value) => (uniforms.uVisibility.value = value),
    // },
    uShift: {
      value: uniforms.uShift.value,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (value) => (uniforms.uShift.value = value),
    },
  });

  const uDeltaRef = useRef(0);
  const uTimeRef = useRef(0);
  useFrame((_, delta) => {
    uDeltaRef.current = Math.min(delta, 0.01);
    uTimeRef.current = (uTimeRef.current + uDeltaRef.current) % 100000;
    uniforms.uTime.value = uTimeRef.current;

    if (displayThreeBackgroundRef.current && uniforms.uVisibility.value < 1) {
      uniforms.uVisibility.value = Math.min(
        uniforms.uVisibility.value +
          uDeltaRef.current *
            ((0.25 * 1) / Math.pow(uniforms.uVisibility.value + 1.3, 4)),
        1,
      );
    }
    if (uniforms.uVisibility.value >= 0.25 && !enterSuzanneRef.current) {
      useAppStore.setState({ enterSuzanne: true });
      enterSuzanneRef.current = true;
      suzanneYSpring.set(100);
      console.log("Suzanne cometh...");
    }
    if (enterSuzanneRef.current && suzanneRef.current) {
      suzanneRef.current.position.y = suzanneYSpring.get();
      suzanneRef.current.lookAt(suzanneTargetRef.current.position);
    }
  });

  return (
    <>
      <mesh
        ref={floorRef}
        geometry={floorGeometry}
        receiveShadow
        castShadow
        position={[0, -2, 0]}
      >
        <CustomShaderMaterial
          transparent
          flatShading
          attach="material"
          baseMaterial={THREE.MeshPhysicalMaterial}
          vertexShader={floorVertexShader}
          fragmentShader={floorFragmentShader}
          uniforms={uniforms}
          color={controls.materialColor}
          roughness={controls.materialRoughness}
          metalness={controls.materialMetalness}
          reflectivity={controls.materialReflectivity}
          clearcoat={controls.materialClearcoat}
          clearcoatRoughness={controls.materialClearcoatRoughness}
        />
        <CustomShaderMaterial
          attach="customDepthMaterial"
          baseMaterial={THREE.MeshDepthMaterial}
          vertexShader={floorVertexShader}
          fragmentShader={floorFragmentShader}
          uniforms={uniforms}
          depthPacking={THREE.RGBADepthPacking}
        />
      </mesh>
      <Suzanne ref={suzanneRef} position={[-200, -200, -500]} scale={90} />
      <object3D ref={suzanneTargetRef} />
    </>
  );
}
