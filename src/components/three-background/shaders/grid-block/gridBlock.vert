uniform float uTime;
uniform sampler2D uPointerTrailTexture;
uniform float uVisibilityPct;
uniform float uSlowPropagationPct;

attribute float aDistPctFromCenter;
attribute vec2 aPointerTrailUv;

varying float vDistPctFromCenter;
varying float vColorFactor;
varying float vAlphaFactor;

// easings.net/#easeInQuad
float easeInQuad(float x) {
  return x * x;
}

void main() {
  float distanceFromCenterOffset = smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) * 0.1;

  float pointerTrailStrength = texture2D(uPointerTrailTexture, aPointerTrailUv).r;
  float pointerTrailOffset = pointerTrailStrength * 0.25;

  float easedVisibility = smoothstep(aDistPctFromCenter, aDistPctFromCenter + 0.1, easeInQuad(uVisibilityPct * 1.1));
  float easedPosition = smoothstep(aDistPctFromCenter, aDistPctFromCenter + 0.25, easeInQuad(uVisibilityPct * 1.25));
  float slowPropagationFactor = smoothstep(vDistPctFromCenter, vDistPctFromCenter + 0.1, uSlowPropagationPct);
  vec3 offset = mix(0.0, (distanceFromCenterOffset + pointerTrailOffset), slowPropagationFactor) * vec3(0.0, 1.0, 0.0);
  csm_Position += offset;

  vDistPctFromCenter = aDistPctFromCenter;
  vColorFactor = easedPosition;
  vAlphaFactor = easedVisibility;
}
