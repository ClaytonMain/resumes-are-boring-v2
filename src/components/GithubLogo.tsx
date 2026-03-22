import { useLoader } from "@react-three/fiber";
import type { JSX } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

// import { useGLTF } from "@react-three/drei";
// import { type GLTF } from "three-stdlib";

// type GLTFResult = GLTF & {
//   nodes: {
//     BézierCurve: THREE.Mesh;
//   };
// };

// export function GithubLogo({
//   material,
//   children,
//   ...props
// }: {
//   material?: THREE.MeshStandardMaterial;
//   children?: React.ReactNode;
// } & Omit<JSX.IntrinsicElements["group"], "material">) {
//   const { nodes } = useGLTF("/models/GithubLogo.glb") as unknown as GLTFResult;
//   return (
//     <group {...props}>
//       <mesh
//         castShadow
//         receiveShadow
//         geometry={nodes.BézierCurve.geometry}
//         material={material || nodes.BézierCurve.material}
//       />
//       {children}
//     </group>
//   );
// }

// useGLTF.preload("/models/GithubLogo.glb");

export function GithubLogo({
  material,
  ...props
}: {
  material?: THREE.Material;
} & Omit<JSX.IntrinsicElements["mesh"], "material">) {
  const obj = useLoader(OBJLoader, "/models/GithubLogo.obj");
  // const geometry = (obj.children[0] as THREE.Mesh).geometry;
  // return (
  //   <mesh
  //     {...props}
  //     castShadow
  //     receiveShadow
  //     geometry={geometry}
  //     material={material || new THREE.MeshStandardMaterial({ color: "white" })}
  //   />
  // );
  return null;
}
