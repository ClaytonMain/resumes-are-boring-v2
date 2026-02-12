import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

export default function FogController() {
  const scene = useThree((state) => state.scene);

  const controls = useControls({
    fogColor: {
      value: "#1a1817",
      onChange: (value) => {
        scene.fog!.color.set(new THREE.Color(value));
      },
    },
    fogNearFar: {
      value: [20, 600],
      min: 1,
      max: 2000,
      step: 1,
    },
  });

  return (
    <fog
      attach="fog"
      args={["#1a1817", controls.fogNearFar[0], controls.fogNearFar[1]]}
    />
  );
}
