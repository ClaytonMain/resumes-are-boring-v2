import * as THREE from "three";

export type ThreeBackgroundUniforms = {
  uTime: { value: number };
  uCameraPosition: { value: THREE.Vector3 };
  uResolution: { value: THREE.Vector2 };
  uGlZ: { value: number };
  uVisibility: { value: number };
  uZSpacing: { value: number };
  uLightColor: { value: THREE.Color };
  uSubsurfaceRadius: { value: number };
  uRoughness: { value: number };
  uRefractionIndex: { value: number };

  uNearDiffuseColor: { value: THREE.Color };
  uFarDiffuseColor: { value: THREE.Color };
  uNearSubsurfaceColor: { value: THREE.Color };
  uFarSubsurfaceColor: { value: THREE.Color };
};
