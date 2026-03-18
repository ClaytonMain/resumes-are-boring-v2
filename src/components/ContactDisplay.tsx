import { Icosahedron, MeshTransmissionMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ContactDisplay() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <>
      <Icosahedron ref={meshRef} args={[0.5, 2]} position={[0, 1, 0]}>
        <MeshTransmissionMaterial
          roughness={0.1}
          resolution={32}
          thickness={1}
          ior={1.53}
          flatShading
        />
      </Icosahedron>
    </>
  );
}
