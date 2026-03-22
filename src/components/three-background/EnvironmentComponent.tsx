import { Environment } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PAGE_BLOCK_COLORS } from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";

export default function EnvironmentComponent() {
  const currentPage = useAppStore((state) => state.currentPage);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null!);

  const clampedDeltaRef = useRef(0);
  const colorDiffVector = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    clampedDeltaRef.current = Math.min(delta, 0.1);

    colorDiffVector.setFromColor(
      materialRef.current.color.clone().sub(PAGE_BLOCK_COLORS[currentPage]),
    );
    if (colorDiffVector.length() < 0.01 && colorDiffVector.length() > 0) {
      materialRef.current.color.copy(PAGE_BLOCK_COLORS[currentPage]);
      colorDiffVector.set(0, 0, 0);
    } else if (colorDiffVector.length() > 0) {
      materialRef.current.color.lerp(
        PAGE_BLOCK_COLORS[currentPage],
        clampedDeltaRef.current * 0.5,
      );
    }
  });

  return (
    <Environment
      environmentIntensity={0.5}
      near={0.1}
      far={100}
      resolution={64}
      files="/textures/citrus_orchard_road_puresky_1k.hdr"
      // files="/textures/kloppenheim_07_puresky_1k.hdr"
      frames={Infinity}
    >
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[100, 1, 100]} />
        <meshBasicMaterial ref={materialRef} />
      </mesh>
    </Environment>
  );
}
