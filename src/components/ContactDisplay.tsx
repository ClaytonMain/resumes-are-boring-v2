import {
  Icosahedron,
  MeshTransmissionMaterial,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ContactDisplay() {
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
      githubOrbMeshRef.current.rotation.x += delta * 0.1;
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
        <MeshTransmissionMaterial
          roughness={0.1}
          thickness={0.15}
          ior={1.1}
          flatShading
          color="#ede9fe"
        />
        <mesh
          ref={githubTextureMeshRef}
          position={[0, 0, 0.01]}
          renderOrder={2}
        >
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial
            map={githubTexture}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </Icosahedron>
      <Icosahedron
        ref={linkedinOrbMeshRef}
        args={[0.45, 0]}
        position={[0.6, 1, 0]}
        renderOrder={1}
      >
        <MeshTransmissionMaterial
          roughness={0.1}
          thickness={0.15}
          ior={1.1}
          flatShading
          color="#ede9fe"
        />
        <mesh
          ref={linkedinTextureMeshRef}
          position={[0, 0, 0.01]}
          renderOrder={2}
        >
          <planeGeometry args={[0.4, 0.4]} />
          <meshBasicMaterial
            map={linkedinTexture}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </Icosahedron>
    </group>
  );
}
