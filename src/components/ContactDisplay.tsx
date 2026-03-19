import {
  Decal,
  Icosahedron,
  MeshTransmissionMaterial,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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

  useFrame(({ camera }, delta) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
    if (githubOrbMeshRef.current) {
      githubOrbMeshRef.current.rotation.x +=
        delta * 0.1 * (Math.random() - 0.5);
      githubOrbMeshRef.current.rotation.y += delta * 0.1;
    }
    if (linkedinOrbMeshRef.current) {
      linkedinOrbMeshRef.current.rotation.x += delta * 0.1;
      linkedinOrbMeshRef.current.rotation.y += delta * 0.1;
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
        <meshStandardMaterial color="#2e1065" roughness={0.2} metalness={0.5} />
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
            // side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-500}
          />
        </Decal>
      </Icosahedron>
      <Icosahedron
        ref={linkedinOrbMeshRef}
        args={[0.45, 0]}
        position={[0.6, 1, 0]}
        renderOrder={2}
      >
        <meshPhysicalMaterial
          roughness={0.1}
          // thickness={0.15}
          ior={1.0}
          flatShading
          // color="#ede9fe"
          color="#2e1065"
          transparent
          // opacity={0.5}
          transmission={0.2}
        />
        <mesh
          ref={linkedinTextureMeshRef}
          position={[0, 0, 0.01]}
          renderOrder={1}
        >
          <planeGeometry args={[0.4, 0.4]} />
          <meshPhysicalMaterial
            map={linkedinTexture}
            transparent
            side={THREE.DoubleSide}
            transmission={1}
          />
          {/* <meshBasicMaterial
            map={linkedinTexture}
            transparent
            side={THREE.DoubleSide}
          /> */}
        </mesh>
      </Icosahedron>
    </group>
  );
}
