import { useSpring } from "@react-spring/three";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_SPRING_FOV_CONFIG,
  DEFAULT_SPRING_LOOK_AT_CONFIG,
  DEFAULT_SPRING_POSITION_CONFIG,
} from "../constants/constants";
import useAppStore from "../stores/useAppStore";
import * as UTILS from "../utils/utils";

export default function CameraController() {
  const springInControlRef = useRef(true);
  const debug = useAppStore((state) => state.debug);

  const orbitControlsRef = useRef<OrbitControlsImpl>(null!);

  const cameraAtTargetPositionRef = useRef(
    useAppStore.getState().cameraAtPositionTarget,
  );
  const cameraAtTargetLookAtRef = useRef(
    useAppStore.getState().cameraAtLookAtTarget,
  );
  const cameraAtTargetFovRef = useRef(useAppStore.getState().cameraAtFovTarget);

  const [positionSprings, positionApi] = useSpring(() => ({
    x:
      useAppStore.getState().cameraPositionTarget?.x ||
      DEFAULT_CAMERA_POSITION.x,
    y:
      useAppStore.getState().cameraPositionTarget?.y ||
      DEFAULT_CAMERA_POSITION.y,
    z:
      useAppStore.getState().cameraPositionTarget?.z ||
      DEFAULT_CAMERA_POSITION.z,
    config:
      useAppStore.getState().cameraPositionSpringConfig ||
      DEFAULT_SPRING_POSITION_CONFIG,
  }));
  const [lookAtSprings, lookAtApi] = useSpring(() => ({
    x: useAppStore.getState().cameraLookAtTarget?.x || DEFAULT_CAMERA_LOOK_AT.x,
    y: useAppStore.getState().cameraLookAtTarget?.y || DEFAULT_CAMERA_LOOK_AT.y,
    z: useAppStore.getState().cameraLookAtTarget?.z || DEFAULT_CAMERA_LOOK_AT.z,
    config:
      useAppStore.getState().cameraLookAtSpringConfig ||
      DEFAULT_SPRING_LOOK_AT_CONFIG,
  }));
  const [fovSpring, fovApi] = useSpring(() => ({
    fov: useAppStore.getState().cameraFovTarget || DEFAULT_CAMERA_FOV,
    config:
      useAppStore.getState().cameraFovSpringConfig || DEFAULT_SPRING_FOV_CONFIG,
  }));

  useEffect(() => {
    const unsubCameraPositionRequest = useAppStore.subscribe(
      (state) => state.cameraPositionUpdateRequestedAt,
      (value) => {
        if (value) {
          const positionTarget =
            useAppStore.getState().cameraPositionTarget ||
            DEFAULT_CAMERA_POSITION;
          const springConfig =
            useAppStore.getState().cameraPositionSpringConfig ||
            DEFAULT_SPRING_POSITION_CONFIG;
          positionApi.start({
            x: positionTarget.x,
            y: positionTarget.y,
            z: positionTarget.z,
            config: springConfig,
          });
          cameraAtTargetPositionRef.current = false;
          useAppStore.setState({ cameraAtPositionTarget: false });
        }
      },
    );
    const unsubCameraLookAtRequest = useAppStore.subscribe(
      (state) => state.cameraLookAtUpdateRequestedAt,
      (value) => {
        if (value) {
          const lookAtTarget =
            useAppStore.getState().cameraLookAtTarget || DEFAULT_CAMERA_LOOK_AT;
          const springConfig =
            useAppStore.getState().cameraLookAtSpringConfig ||
            DEFAULT_SPRING_LOOK_AT_CONFIG;
          lookAtApi.start({
            x: lookAtTarget.x,
            y: lookAtTarget.y,
            z: lookAtTarget.z,
            config: springConfig,
          });
          cameraAtTargetLookAtRef.current = false;
          useAppStore.setState({ cameraAtLookAtTarget: false });
        }
      },
    );
    const unsubCameraFovRequest = useAppStore.subscribe(
      (state) => state.cameraFovUpdateRequestedAt,
      (value) => {
        if (value) {
          const fovTarget =
            useAppStore.getState().cameraFovTarget || DEFAULT_CAMERA_FOV;
          const springConfig =
            useAppStore.getState().cameraFovSpringConfig ||
            DEFAULT_SPRING_FOV_CONFIG;
          fovApi.start({
            fov: fovTarget,
            config: springConfig,
          });
          cameraAtTargetFovRef.current = false;
          useAppStore.setState({ cameraAtFovTarget: false });
        }
      },
    );
    return () => {
      unsubCameraPositionRequest();
      unsubCameraLookAtRequest();
      unsubCameraFovRequest();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const threeCamera = useThree((state) => state.camera);
  useEffect(() => {
    const handleShiftKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift" && debug) {
        springInControlRef.current = !springInControlRef.current;
        cameraAtTargetPositionRef.current = false;
        cameraAtTargetLookAtRef.current = false;
        cameraAtTargetFovRef.current = false;
        useAppStore.setState({
          cameraAtPositionTarget: false,
          cameraAtLookAtTarget: false,
          cameraAtFovTarget: false,
        });
        if (springInControlRef.current) {
          positionApi.set({
            x: threeCamera.position.x,
            y: threeCamera.position.y,
            z: threeCamera.position.z,
          });
          lookAtApi.set({
            x: orbitControlsRef.current?.target.x || threeCamera.position.x,
            y: orbitControlsRef.current?.target.y || threeCamera.position.y,
            z: orbitControlsRef.current?.target.z || threeCamera.position.z,
          });
          if (threeCamera instanceof THREE.PerspectiveCamera) {
            fovApi.set({ fov: threeCamera.fov });
          }

          UTILS.requestCameraUpdate({
            position: useAppStore.getState().cameraPositionTarget,
            lookAt: useAppStore.getState().cameraLookAtTarget,
            fov: useAppStore.getState().cameraFovTarget,
          });
        }
      }
    };
    window.addEventListener("keydown", handleShiftKeyDown);
    return () => {
      window.removeEventListener("keydown", handleShiftKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(({ camera }) => {
    if (!springInControlRef.current) {
      if (orbitControlsRef.current) {
        if (!orbitControlsRef.current.enableDamping) {
          orbitControlsRef.current.enableDamping = true;
        }
        if (!orbitControlsRef.current.enablePan) {
          orbitControlsRef.current.enablePan = true;
        }
        if (!orbitControlsRef.current.enableRotate) {
          orbitControlsRef.current.enableRotate = true;
        }
        if (!orbitControlsRef.current.enableZoom) {
          orbitControlsRef.current.enableZoom = true;
        }
      }
      return;
    }

    if (orbitControlsRef.current) {
      if (orbitControlsRef.current.enableDamping) {
        orbitControlsRef.current.enableDamping = false;
      }
      if (orbitControlsRef.current.enablePan) {
        orbitControlsRef.current.enablePan = false;
      }
      if (orbitControlsRef.current.enableRotate) {
        orbitControlsRef.current.enableRotate = false;
      }
      if (orbitControlsRef.current.enableZoom) {
        orbitControlsRef.current.enableZoom = false;
      }
    }

    // if (!cameraAtTargetPositionRef.current) {
    const currentSpringPosition = new THREE.Vector3(
      positionSprings.x.get(),
      positionSprings.y.get(),
      positionSprings.z.get(),
    );
    camera.position.set(
      currentSpringPosition.x,
      currentSpringPosition.y,
      currentSpringPosition.z,
    );
    const positionTarget = useAppStore.getState().cameraPositionTarget;
    if (
      positionTarget &&
      currentSpringPosition.distanceTo(positionTarget) < 0.01
    ) {
      cameraAtTargetPositionRef.current = true;
      useAppStore.setState({ cameraAtPositionTarget: true });
    }
    // }
    // if (!cameraAtTargetLookAtRef.current) {
    const currentSpringLookAt = new THREE.Vector3(
      lookAtSprings.x.get(),
      lookAtSprings.y.get(),
      lookAtSprings.z.get(),
    );
    camera.lookAt(currentSpringLookAt);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.target.copy(currentSpringLookAt);
    }
    const lookAtTarget = useAppStore.getState().cameraLookAtTarget;
    if (lookAtTarget && currentSpringLookAt.distanceTo(lookAtTarget) < 0.01) {
      cameraAtTargetLookAtRef.current = true;
      useAppStore.setState({ cameraAtLookAtTarget: true });
    }
    // }
    // if (!cameraAtTargetFovRef.current) {
    if (camera instanceof THREE.PerspectiveCamera) {
      const currentSpringFov = fovSpring.fov.get();
      camera.fov = currentSpringFov;
      camera.updateProjectionMatrix();
      const fovTarget = useAppStore.getState().cameraFovTarget;
      if (fovTarget && Math.abs(currentSpringFov - fovTarget) < 0.1) {
        cameraAtTargetFovRef.current = true;
        useAppStore.setState({ cameraAtFovTarget: true });
      }
    }

    if (useAppStore.getState().enterState === "waitForCameraToReachPosition") {
      if (
        cameraAtTargetPositionRef.current &&
        cameraAtTargetLookAtRef.current &&
        cameraAtTargetFovRef.current
      ) {
        useAppStore.setState({ enterState: "rearBackAndExpandFov" });
      }
    }
    // }
  });

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enablePan={false}
      enableRotate={false}
      enableZoom={false}
      enableDamping={false}
      makeDefault
    />
  );
}
