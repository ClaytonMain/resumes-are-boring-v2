import { useLoader } from "@react-three/fiber";
import type { JSX } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

export function LinkedinLogo({
  material,
  ...props
}: {
  material?: THREE.Material;
} & Omit<JSX.IntrinsicElements["mesh"], "material">) {
  const obj = useLoader(OBJLoader, "/models/LinkedinLogo.obj");
  const geometry = (obj.children[0] as THREE.Mesh).geometry;
  return (
    <mesh
      {...props}
      castShadow
      receiveShadow
      geometry={geometry}
      material={material || new THREE.MeshStandardMaterial({ color: "white" })}
    />
  );
}

useLoader.preload(OBJLoader, "/models/LinkedinLogo.obj");
