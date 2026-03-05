uniform float uTime;
uniform sampler2D uPointerTrailTexture;
// uniform float uVisibilityPct;

uniform int uActiveRadii;
uniform float uRadiiPcts[10];
uniform int uRadiiPatterns[10];
uniform float uRadiiColors[10]; // Will move to fragment later.

attribute float aDistPctFromCenter;
attribute vec2 aPointerTrailUv;
attribute float aRandomNumber;

varying float vColorMix;

// easings.net/#easeInQuad
float easeInQuad(float x) {
  return x * x;
}

void main() {
  float distanceFromCenterOffset =
    smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) * 0.1;

  float pointerTrailStrength = texture2D(
    uPointerTrailTexture,
    aPointerTrailUv
  ).r;
  float pointerTrailOffset = pointerTrailStrength * 0.25;

  float colorMix = smoothstep(
    aDistPctFromCenter,
    aDistPctFromCenter + 0.25,
    easeInQuad(uVisibilityPct * 1.25)
  );
  float initialFastOffset = smoothstep(0.0, 0.3, colorMix);
  initialFastOffset = min(
    1.0 - smoothstep(0.3, 0.6, colorMix),
    initialFastOffset
  );
  initialFastOffset *= 0.25;

  vec3 offset =
    initialFastOffset +
    mix(
      0.0,
      distanceFromCenterOffset + pointerTrailOffset + aRandomNumber * 0.01,
      colorMix
    ) *
      vec3(0.0, 1.0, 0.0);
  // offset.y += aRandomNumber * 0.1;
  csm_Position += offset;

  vColorMix = colorMix;
}
