uniform float uTime;
uniform sampler2D uOffsetTexture;

uniform int uActiveRadii;
uniform float uRadiiPcts[10];
uniform int uRadiiPatterns[10];

attribute float aDistPctFromCenter;
attribute vec2 aPointerTrailUv;
attribute float aRandomOffset;

varying float vDistPctFromCenter;
flat out int vRadiiIndex; // Well, this is weird. Have to use flat to pass int from vert to frag.
varying float vEasedRadiiPct;
varying float vTotalOffset;

float easeInQuad(float x) {
  return x * x;
}

void main() {
  // Min active radii is 2.
  // Will loop through radii pcts to mix offset height based on pct from center.
  // Need to get heights for radii patterns though.
  float patternOffsets[7];
  // Default pattern: Slight negative offset.
  patternOffsets[0] = -0.1;
  // Pattern 1: Slowly propagating waves from center.
  patternOffsets[1] = smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) * 0.1;
  // Patterns 2-6: Zero for now.
  patternOffsets[2] = smoothstep(0.0, 2.0, sin(aPointerTrailUv.x * 15.0 * 3.14159) * sin(uTime * 0.5 + aDistPctFromCenter * 10.0) + cos(aPointerTrailUv.y * 15.0 * 3.14159) * cos(uTime * 0.5 + aDistPctFromCenter * 10.0)) * 0.15;
  patternOffsets[3] = 0.0;
  patternOffsets[4] = 0.0;
  patternOffsets[5] = 0.0;
  patternOffsets[6] = 0.0;

  float offset;
  float easedRadiiPct;
  for (int i = 0; i < 10; i++) {
    if (i + 2 > uActiveRadii)
      break;
    easedRadiiPct = easeInQuad(uRadiiPcts[i] * 1.25);
    if (easedRadiiPct < aDistPctFromCenter)
      continue;
    float patternMix = smoothstep(aDistPctFromCenter, aDistPctFromCenter + 0.25, easedRadiiPct);
    offset = mix(patternOffsets[uRadiiPatterns[i + 1]], patternOffsets[uRadiiPatterns[i]], patternMix);
    vRadiiIndex = i;
    vEasedRadiiPct = easedRadiiPct;
    break;
  }

  vec4 offsetTextureStrength = texture2D(uOffsetTexture, aPointerTrailUv);
  float pointerTrailOffset = offsetTextureStrength.r * 0.15;

  float skillsStrength = offsetTextureStrength.g * 1.5;

  float totalOffset = offset + pointerTrailOffset + aRandomOffset + skillsStrength;
  csm_Position.y += totalOffset;

  // vColorMix = colorMix;
  vDistPctFromCenter = aDistPctFromCenter;
  vTotalOffset = totalOffset;
}
