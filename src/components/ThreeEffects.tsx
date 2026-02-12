import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";

export default function ThreeEffects() {
  const controls = useControls({
    focalLength: {
      value: 0.2,
      min: 0.01,
      max: 100,
      step: 0.01,
    },
    bokehScale: {
      value: 1.0,
      min: 0.1,
      max: 10,
      step: 0.1,
    },
  });

  return (
    <EffectComposer>
      <DepthOfField
        focusDistance={3.5}
        focalLength={controls.focalLength}
        bokehScale={controls.bokehScale}
      />
    </EffectComposer>
  );
}
