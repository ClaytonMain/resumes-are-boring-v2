import * as THREE from "three";

// export type ThreeBackgroundUniforms = {
//   uTime: { value: number };
//   uCameraPosition: { value: THREE.Vector3 };
//   uInverseViewMatrix: { value: THREE.Matrix4 };
//   uResolution: { value: THREE.Vector2 };
//   uGlZ: { value: number };
//   uVisibility: { value: number };
//   uZSpacing: { value: number };
//   uLightColor: { value: THREE.Color };
//   uSubsurfaceRadius: { value: number };
//   uRoughness: { value: number };
//   uRefractionIndex: { value: number };

//   uDiffuseColors: { value: THREE.Color[] };
//   uSubsurfaceColors: { value: THREE.Color[] };
// };

export type OffsetTextureUniforms = {
  uDelta: { value: number };
  uPointerUv: { value: THREE.Vector2 };
  uPointerVelocity: { value: number };
  uOffsetTexture: { value: THREE.Texture };
  uProficiencyUv: { value: THREE.Vector2 };
  uEnjoymentUv: { value: THREE.Vector2 };
  uExperienceUv: { value: THREE.Vector2 };
  uProficiencyValue: { value: number };
  uEnjoymentValue: { value: number };
  uExperienceValue: { value: number };
};

export type GridBlockUniforms = {
  uTime: { value: number };
  uOffsetTexture: { value: THREE.DataTexture };
  uVisibilityPct: { value: number };
  uActiveRadii: { value: number };
  uRadiiPcts: { value: number[] };
  uRadiiColors: { value: THREE.Color[] };
  uRadiiPatterns: { value: number[] };
};
