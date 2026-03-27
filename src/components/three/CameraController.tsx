import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export default function CameraController() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const handleResize = () => {
      if (!(camera instanceof THREE.OrthographicCamera)) return;
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = -5 * aspect;
      camera.right = 5 * aspect;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [camera]);

  return null;
}
