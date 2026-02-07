import { useSpring } from "@react-spring/three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { DEFAULT_CAMERA_POSITION } from "../constants/constants";
import useAppStore from "../stores/useAppStore";

export default function CameraController() {
  const [springInControl, setSpringInControl] = useState(true);
  const debug = useAppStore((state) => state.debug);

  const [springs, api] = useSpring(() => ({
    x: DEFAULT_CAMERA_POSITION.x,
    y: DEFAULT_CAMERA_POSITION.y,
    z: DEFAULT_CAMERA_POSITION.z,
    config: {
      mass: 2,
      friction: 5,
      tension: 80,
    },
  }));

  useEffect(() => {
    const handleOnClick = () => {
      api.start({
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
        z: Math.random() * 10 - 5,
      });
    };
    const handleShiftKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift" && debug) {
        setSpringInControl((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleShiftKeyDown);
    window.addEventListener("click", handleOnClick);
    return () => {
      window.removeEventListener("click", handleOnClick);
      window.removeEventListener("keydown", handleShiftKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  useFrame(({ camera }) => {
    if (springInControl) {
      camera.position.set(springs.x.get(), springs.y.get(), springs.z.get());
    }
  });

  return null;
}
