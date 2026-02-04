import { Box } from "@react-three/drei";
import type { JSX } from "react";
import Panel from "./Panel";

export default function Cubicle(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props} dispose={null}>
      <Panel position={[0.782, 0, 0]} />
      <Panel position={[0.385, 0, -0.4]} rotation={[0, Math.PI / 2, 0]} />
      <Panel position={[-0.385, 0, -0.4]} rotation={[0, Math.PI / 2, 0]} />
      <Panel position={[-0.782, 0, 0]} />
      <Box
        castShadow
        receiveShadow
        args={[1.55, 0.025, 0.6]}
        position={[0, 0.7, -0.1]}
      >
        <meshStandardMaterial color={"#999999"} />
      </Box>
    </group>
  );
}
