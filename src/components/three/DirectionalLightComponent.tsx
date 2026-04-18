import {
  PerformanceMonitor,
  useHelper,
  type PerformanceMonitorApi,
} from "@react-three/drei";
import { useControls } from "leva";
import { useRef, useState } from "react";
import * as THREE from "three";
import useAppStore from "../../stores/useAppStore";

export default function DirectionalLightComponent() {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  const shadowCameraRef = useRef<THREE.OrthographicCamera>(null!);
  const debug = useAppStore((state) => state.debug);
  const [states, setStates] = useState({
    castShadow: true,
    shadowMapSize: 512,
  });

  useHelper(
    debug && directionalLightRef,
    THREE.DirectionalLightHelper,
    1,
    "red",
  );
  useHelper(debug && shadowCameraRef, THREE.CameraHelper);

  const shadowCameraControls = useControls("Shadow Camera", {
    left: {
      value: -5,
      step: 0.1,
      min: -20,
      max: 0,
      onChange: (value) => {
        shadowCameraRef.current.left = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    right: {
      value: 5,
      step: 0.1,
      min: 0,
      max: 20,
      onChange: (value) => {
        shadowCameraRef.current.right = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    top: {
      value: 5,
      step: 0.1,
      min: 0,
      max: 20,
      onChange: (value) => {
        shadowCameraRef.current.top = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    bottom: {
      value: -5,
      step: 0.1,
      min: -20,
      max: 0,
      onChange: (value) => {
        shadowCameraRef.current.bottom = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    near: {
      value: 5.0,
      step: 0.1,
      min: 0.1,
      max: 20,
      onChange: (value) => {
        shadowCameraRef.current.near = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
    far: {
      value: 15,
      step: 0.1,
      min: 0.1,
      max: 100,
      onChange: (value) => {
        shadowCameraRef.current.far = value;
        shadowCameraRef.current.updateProjectionMatrix();
      },
    },
  });

  function getBounds(refreshrate: number): [number, number] {
    if (refreshrate > 90) {
      return [
        Math.min(Math.max(Math.floor(refreshrate * 0.8), 80), refreshrate - 30),
        Math.ceil(refreshrate * 0.95),
      ];
    } else {
      return [45, 90];
    }
  }

  function logPerformance(onType: string, api: PerformanceMonitorApi) {
    if (debug) {
      console.log(
        `onType ${onType}`,
        api,
        `averages: ${api.averages.join(", ")}`,
        `frames: ${api.frames.join(", ")}`,
        `bounds: ${getBounds(api.refreshrate).join(" - ")}`,
      );
    }
  }

  function handleOnIncline(api: PerformanceMonitorApi) {
    logPerformance("Incline", api);
    const newStates = { ...states };
    if (newStates.shadowMapSize < 1024) {
      newStates.shadowMapSize *= 2;
    }
    setStates(newStates);
  }

  function handleOnDecline(api: PerformanceMonitorApi) {
    logPerformance("Decline", api);
    const newStates = { ...states };
    if (newStates.shadowMapSize > 128) {
      newStates.shadowMapSize /= 2;
    } else {
      newStates.castShadow = false;
    }
    setStates(newStates);
  }

  function onFallback(api: PerformanceMonitorApi) {
    logPerformance("Fallback", api);
    handleOnDecline(api);
  }

  return (
    <PerformanceMonitor
      bounds={getBounds}
      flipflops={5}
      onIncline={handleOnIncline}
      onDecline={handleOnDecline}
      onFallback={onFallback}
    >
      <directionalLight
        ref={directionalLightRef}
        position={[-5, 5, 5]}
        castShadow={states.castShadow}
        shadow-mapSize-height={states.shadowMapSize}
        shadow-mapSize-width={states.shadowMapSize}
        intensity={0.5}
      >
        <orthographicCamera
          ref={shadowCameraRef}
          attach="shadow-camera"
          // @ts-expect-error This is fine 🔥
          left={shadowCameraControls.left}
          // @ts-expect-error This is fine 🔥
          right={shadowCameraControls.right}
          // @ts-expect-error This is fine 🔥
          top={shadowCameraControls.top}
          // @ts-expect-error This is fine 🔥
          bottom={shadowCameraControls.bottom}
          // @ts-expect-error This is fine 🔥
          near={shadowCameraControls.near}
          // @ts-expect-error This is fine 🔥
          far={shadowCameraControls.far}
        />
      </directionalLight>
    </PerformanceMonitor>
  );
}
