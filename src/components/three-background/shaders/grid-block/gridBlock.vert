uniform float uTime;
uniform sampler2D uPointerTrailTexture;
// uniform float uVisibilityPct;

uniform int uActiveRadii;
uniform float uRadiiPcts[10];
uniform int uRadiiPatterns[10];
// uniform float uRadiiColors[10]; // Will move to fragment later.

attribute float aDistPctFromCenter;
attribute vec2 aPointerTrailUv;
attribute float aRandomOffset;

// varying float vColorMix;

varying float vDistPctFromCenter;

float easeInQuad(float x) {
  return x * x;
}

void main() {
  // float distanceFromCenterOffset =
  //   smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) * 0.1;

  // Min active radii is 2.
  // Will loop through radii pcts to mix offset height based on pct from center.
  // Need to get heights for radii patterns though.
  float patternOffsets[7];
  // Default pattern: Slight negative offset.
  patternOffsets[0] = -0.1;
  // Pattern 1: Slowly propagating waves from center.
  patternOffsets[1] = smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) *
    0.1;
  // Patterns 2-6: Zero for now.
  patternOffsets[2] = 0.0;
  patternOffsets[3] = 0.0;
  patternOffsets[4] = 0.0;
  patternOffsets[5] = 0.0;
  patternOffsets[6] = 0.0;

  float offset = 0.0;
  for (int i = 0; i < 10; i++) {
    if (i + 2 > uActiveRadii)
      break;
    float patternMix = smoothstep(aDistPctFromCenter, aDistPctFromCenter + 0.25, easeInQuad(uRadiiPcts[i] * 1.25));
    offset += mix(patternOffsets[uRadiiPatterns[i + 1]], patternOffsets[uRadiiPatterns[i]], patternMix);
  }

  float pointerTrailStrength = texture2D(uPointerTrailTexture, aPointerTrailUv).r;
  float pointerTrailOffset = pointerTrailStrength * 0.25;

  // float colorMix = smoothstep(
  //   aDistPctFromCenter,
  //   aDistPctFromCenter + 0.25,
  //   easeInQuad(uVisibilityPct * 1.25)
  // );
  // float initialFastOffset = smoothstep(0.0, 0.3, colorMix);
  // initialFastOffset = min(
  //   1.0 - smoothstep(0.3, 0.6, colorMix),
  //   initialFastOffset
  // );
  // initialFastOffset *= 0.25;

  // vec3 offset =
  //   initialFastOffset +
  //   mix(
  //     0.0,
  //     distanceFromCenterOffset + pointerTrailOffset + aRandomNumber * 0.01,
  //     colorMix
  //   ) *
  //     vec3(0.0, 1.0, 0.0);
  // // offset.y += aRandomNumber * 0.1;

  csm_Position.y += offset + pointerTrailOffset + aRandomOffset;

  // vColorMix = colorMix;
  vDistPctFromCenter = aDistPctFromCenter;
}
