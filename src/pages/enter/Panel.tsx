import { Box } from "@react-three/drei";
import type { JSX } from "react";

export default function Panel(props: JSX.IntrinsicElements["group"]) {
  return (
    <group {...props} dispose={null}>
      <Box
        castShadow
        receiveShadow
        args={[0.025, 1.14, 0.77]}
        position={[0, 1.14 / 2, 0]}
      >
        <meshStandardMaterial color={"#999999"} />
      </Box>
      <Box
        castShadow
        receiveShadow
        args={[0.032, 1.11, 0.74]}
        position={[0, 1.14 / 2, 0]}
      >
        <meshStandardMaterial color={"#aabbcc"} />
      </Box>
    </group>
  );
}
