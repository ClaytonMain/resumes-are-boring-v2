uniform float uTime;
uniform sampler2D uPointerTrailTexture;

attribute float aDistPctFromCenter;
attribute vec2 aPointerTrailUv;

varying float vDistPctFromCenter;

void main() {
  vDistPctFromCenter = aDistPctFromCenter;

  float distanceFromCenterOffset =
    smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) * 0.1;
  float pointerTrailStrength = texture2D(
    uPointerTrailTexture,
    aPointerTrailUv
  ).r;
  float pointerTrailOffset = pointerTrailStrength * 0.25;
  vec3 offset =
    (distanceFromCenterOffset + pointerTrailOffset) * vec3(0.0, 1.0, 0.0);
  csm_Position += offset;
}
