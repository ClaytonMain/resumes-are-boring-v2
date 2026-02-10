import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import floorFragmentShader from "./shaders/floor.frag";
import floorVertexShader from "./shaders/floor.vert";

const FLOOR_SIZE = 100;
const FLOOR_SEGMENTS = 200;

const uniforms = {
  uTime: { value: 0 },
  uBasePosFreq: { value: 0.05 },
  uBaseTimeFreq: { value: 0.01 },
  uBaseStrength: { value: 4.09 },
  uVisibility: { value: 0 },
};

export default function ThreeFloor() {
  const floorRef = useRef<THREE.Mesh>(null!);

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
    basePosFreq: {
      value: uniforms.uBasePosFreq.value,
      min: 0.01,
      max: 5,
      step: 0.01,
      onChange: (value) => (uniforms.uBasePosFreq.value = value),
    },
    baseTimeFreq: {
      value: uniforms.uBaseTimeFreq.value,
      min: 0.01,
      max: 5,
      step: 0.01,
      onChange: (value) => (uniforms.uBaseTimeFreq.value = value),
    },
    baseStrength: {
      value: uniforms.uBaseStrength.value,
      min: 0,
      max: 5,
      step: 0.01,
      onChange: (value) => (uniforms.uBaseStrength.value = value),
    },
    materialColor: {
      value: "#2a0012",
    },
    materialRoughness: {
      value: 0.61,
      min: 0,
      max: 1,
      step: 0.01,
    },
    materialMetalness: {
      value: 0.31,
      min: 0,
      max: 1,
      step: 0.01,
    },
    materialReflectivity: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
    },
    materialClearcoat: {
      value: 0.17,
      min: 0,
      max: 1,
      step: 0.01,
    },
    materialClearcoatRoughness: {
      value: 0.72,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  const uTimeRef = useRef(0);
  useFrame((_, delta) => {
    uTimeRef.current = (uTimeRef.current + Math.min(delta, 0.01)) % 100000;
    uniforms.uTime.value = uTimeRef.current;
  });

  return (
    <mesh
      ref={floorRef}
      geometry={floorGeometry}
      receiveShadow
      position={[0, -2, 0]}
    >
      <CustomShaderMaterial
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
  );
}
