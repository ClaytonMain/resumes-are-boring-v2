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

// // Thanks to Freya Holmér for the framerate-independent lerp smoothing function
// // https://mastodon.social/@acegikmo/111931613710775864
// export function lerpSmooth(
//   a: number,
//   b: number,
//   dt: number,
//   h: number,
// ): number {
//   return b + (a - b) * Math.pow(2, -dt / h);
// }

// // "Calculating half-life (`h`) given a duration `t` until precision `p`"
// // h = -t/log2(p)
// // For example, if `p` = 1 / 100, then `h` is calculated such that the
// // lerp smooth is nominally within 1% distance to the target remaining,
// // after `t` seconds.
// export function getHalfLife(t: number, p: number): number {
//   return -t / Math.log2(p);
// }
