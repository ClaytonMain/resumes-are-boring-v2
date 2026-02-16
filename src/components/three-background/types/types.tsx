import * as THREE from "three";

export type ThreeBackgroundUniforms = {
  uTime: { value: number };
  uCameraPosition: { value: THREE.Vector3 };
  uInverseViewMatrix: { value: THREE.Matrix4 };
  uResolution: { value: THREE.Vector2 };
  uGlZ: { value: number };
  uVisibility: { value: number };
  uZSpacing: { value: number };
  uLightColor: { value: THREE.Color };
  uSubsurfaceRadius: { value: number };
  uRoughness: { value: number };
  uRefractionIndex: { value: number };

  uDiffuseColors: { value: THREE.Color[] };
  uSubsurfaceColors: { value: THREE.Color[] };
};
