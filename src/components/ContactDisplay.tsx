import { Decal, Icosahedron, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { color } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";
import useAppStore from "../stores/useAppStore";

export default function ContactDisplay() {
  const debug = useAppStore.getState().debug;
  const groupRef = useRef<THREE.Group>(null!);

  const githubOrbMeshRef = useRef<THREE.Mesh>(null!);
  const githubTextureMeshRef = useRef<THREE.Mesh>(null!);
  const githubTexture = useTexture("textures/github-logo.png");

  const linkedinOrbMeshRef = useRef<THREE.Mesh>(null!);
  const linkedinTextureMeshRef = useRef<THREE.Mesh>(null!);
  const linkedinTexture = useTexture("textures/linkedin-logo.png");

  const controls = useControls({
    anisotropy: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    clearcoat: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    clearcoatRoughness: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    opacity: {
      value: 0.8,
      min: 0,
      max: 1,
      step: 0.01,
    },
    color: "#2e1065",
    emissiveColor: "#000000",
    roughness: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    metalness: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    ior: {
      value: 1.1,
      min: 1,
      max: 2.66,
      step: 0.01,
    },
    reflectivity: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    iridescence: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
    },
    iridescenceIOR: {
      value: 1.3,
      min: 1,
      max: 2.66,
      step: 0.01,
    },
    sheen: {
      value: 0.0,
      min: 0,
      max: 1,
      step: 0.01,
    },
    sheenRoughness: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    sheenColor: "#000000",
    specularIntensity: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    specularColor: "#ffffff",
  });

  useFrame(({ camera }, delta) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
    if (githubOrbMeshRef.current) {
      githubOrbMeshRef.current.rotation.x += delta * 0.2 * Math.random();
      githubOrbMeshRef.current.rotation.y += delta * 0.2 * Math.random();
    }
    if (linkedinOrbMeshRef.current) {
      linkedinOrbMeshRef.current.rotation.x += delta * 0.2 * Math.random();
      linkedinOrbMeshRef.current.rotation.y += delta * 0.2 * Math.random();
    }
    if (githubTextureMeshRef.current) {
      githubTextureMeshRef.current.lookAt(camera.position);
    }
    if (linkedinTextureMeshRef.current) {
      linkedinTextureMeshRef.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={groupRef}>
      <Icosahedron
        ref={githubOrbMeshRef}
        args={[0.45, 0]}
        position={[-0.6, 1, 0]}
        renderOrder={1}
      >
        <meshPhysicalMaterial
          anisotropy={controls.anisotropy}
          roughness={controls.roughness}
          metalness={controls.metalness}
          ior={controls.ior}
          reflectivity={controls.reflectivity}
          iridescence={controls.iridescence}
          iridescenceIOR={controls.iridescenceIOR}
          sheen={controls.sheen}
          sheenRoughness={controls.sheenRoughness}
          sheenColor={controls.sheenColor}
          clearcoat={controls.clearcoat}
          clearcoatRoughness={controls.clearcoatRoughness}
          specularIntensity={controls.specularIntensity}
          specularColor={controls.specularColor}
          color={controls.color}
          transparent
          opacity={controls.opacity}
          flatShading
        />
        <Decal
          ref={githubTextureMeshRef}
          debug={debug}
          position={[0, 0, 0.3]}
          rotation={[0, 0, 0]}
          scale={0.45}
          renderOrder={2}
        >
          <meshBasicMaterial
            map={githubTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-500}
            opacity={0.9}
          />
        </Decal>
      </Icosahedron>
      <Icosahedron
        ref={linkedinOrbMeshRef}
        args={[0.45, 1]}
        position={[0.6, 1, 0]}
        renderOrder={1}
      >
        <meshPhysicalMaterial
          // anisotropy={controls.anisotropy}
          roughness={controls.roughness}
          metalness={controls.metalness}
          // ior={controls.ior}
          reflectivity={controls.reflectivity}
          // iridescence={controls.iridescence}
          // iridescenceIOR={controls.iridescenceIOR}
          // sheen={controls.sheen}
          // sheenRoughness={controls.sheenRoughness}
          // sheenColor={controls.sheenColor}
          clearcoat={controls.clearcoat}
          clearcoatRoughness={controls.clearcoatRoughness}
          // specularIntensity={controls.specularIntensity}
          // specularColor={controls.specularColor}
          color={controls.color}
          transparent
          opacity={controls.opacity}
          flatShading
        />
        <Decal
          ref={linkedinTextureMeshRef}
          debug={debug}
          position={[0, 0, 0.3]}
          rotation={[0, 0, 0]}
          scale={0.45}
          renderOrder={2}
        >
          <meshBasicMaterial
            map={linkedinTexture}
            transparent
            polygonOffset
            polygonOffsetFactor={-500}
            opacity={0.9}
          />
        </Decal>
      </Icosahedron>
    </group>
  );
}
