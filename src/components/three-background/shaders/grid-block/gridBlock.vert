uniform float uTime;
uniform sampler2D uMouseTrailTexture;

attribute float aDistanceFromCenter;
attribute vec2 aMouseTrailUv;

void main() {
  float distanceFromCenterOffset =
    smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistanceFromCenter * 3.0)) * 0.1;
  float mouseTrailStrength = texture2D(uMouseTrailTexture, aMouseTrailUv).r;
  float mouseTrailOffset = mouseTrailStrength * 0.25;
  vec3 offset =
    (distanceFromCenterOffset + mouseTrailOffset) * vec3(0.0, 1.0, 0.0);
  csm_Position += offset;
}
