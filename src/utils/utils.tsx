import { type SpringConfig } from "@react-spring/core";
import { produce } from "immer";
import * as THREE from "three";
import useAppStore from "../stores/useAppStore";

export function requestCameraUpdate({
  position,
  lookAt,
  fov,
  positionSpringConfig,
  lookAtSpringConfig,
  fovSpringConfig,
}: {
  position?: THREE.Vector3;
  lookAt?: THREE.Vector3;
  fov?: number;
  positionSpringConfig?: SpringConfig;
  lookAtSpringConfig?: SpringConfig;
  fovSpringConfig?: SpringConfig;
}) {
  if (!(position || lookAt || fov)) {
    return;
  }
  useAppStore.setState(
    produce((state) => {
      if (position) {
        state.cameraPositionTarget = position;
        state.cameraPositionUpdateRequestedAt = Date.now();
        state.cameraPositionSpringConfig =
          positionSpringConfig || state.cameraPositionSpringConfig;
      }
      if (lookAt) {
        state.cameraLookAtTarget = lookAt;
        state.cameraLookAtUpdateRequestedAt = Date.now();
        state.cameraLookAtSpringConfig =
          lookAtSpringConfig || state.cameraLookAtSpringConfig;
      }
      if (fov) {
        state.cameraFovTarget = fov;
        state.cameraFovUpdateRequestedAt = Date.now();
        state.cameraFovSpringConfig =
          fovSpringConfig || state.cameraFovSpringConfig;
      }
    }),
  );
}
