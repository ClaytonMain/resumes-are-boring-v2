import { useEffect, useMemo } from "react";
import useAppStore from "../../stores/useAppStore";
import threeBackgroundFragmentShader from "./shaders/threebackground.frag";
import threeBackgroundVertexShader from "./shaders/threebackground.vert";
import type { ThreeBackgroundUniforms } from "./types/types";

export default function ThreeBackgroundComponent({
  uniforms,
}: {
  uniforms: ThreeBackgroundUniforms;
}) {
  const renderPlanePositions = useMemo(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ]),
    [],
  );
  const renderPlaneUvs = useMemo(
    () => new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
    [],
  );

  useEffect(() => {
    useAppStore.setState({ threeBackgroundComponentReady: true });
  });

  // return (
  //   <mesh>
  //     <shaderMaterial
  //       uniforms={uniforms}
  //       vertexShader={threeBackgroundVertexShader}
  //       fragmentShader={threeBackgroundFragmentShader}
  //     />
  //     <bufferGeometry>
  //       <bufferAttribute
  //         args={[renderPlanePositions, 3]}
  //         attach="attributes-position"
  //         array={renderPlanePositions}
  //         count={renderPlanePositions.length / 3}
  //         itemSize={3}
  //       />
  //       <bufferAttribute
  //         args={[renderPlaneUvs, 2]}
  //         attach="attributes-uv"
  //         array={renderPlaneUvs}
  //         count={renderPlaneUvs.length / 2}
  //         itemSize={2}
  //       />
  //     </bufferGeometry>
  //   </mesh>
  // );
  return null;
}
