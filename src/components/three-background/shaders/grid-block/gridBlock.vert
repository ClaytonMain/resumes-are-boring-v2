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
varying float vYPos;

float easeInQuad(float x) {
  return x * x;
}

// https://iquilezles.org/articles/distfunctions2d/
float sdEquilateralTriangle(in vec2 p, in float r) {
  const float k = sqrt(3.0);
  p.x = abs(p.x) - r;
  p.y = p.y + r / k;
  if (p.x + k * p.y > 0.0)
    p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.0;
  p.x -= clamp(p.x, -2.0 * r, 0.0);
  return -length(p) * sign(p.y);
}

float sdBox(in vec2 p, in vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

vec2 rotateAAroundB(float angle, vec2 a, vec2 b) {
  float s = sin(angle);
  float c = cos(angle);

  a.x -= b.x;
  a.y -= b.y;

  float xNew = a.x * c - a.y * s;
  float yNew = a.x * s + a.y * c;

  a.x = xNew + b.x;
  a.y = yNew + b.y;

  return a;
}

float getPatternOffset3() {
  // vec2 rotatedPoint = rotateAAroundB(aDistPctFromCenter * sin(uTime * 0.1) * 10.0 + uTime, aPointerTrailUv - 0.5, vec2(0.0));
  vec2 rotatedPoint = rotateAAroundB(aDistPctFromCenter * 8.0 - uTime * 0.1, aPointerTrailUv - 0.5, vec2(0.0));
  float box1Strength = smoothstep(0.1, 0.0, sdBox(rotatedPoint, vec2(1.9, 0.001)));
  float box2Strength = smoothstep(0.1, 0.0, sdBox(rotatedPoint, vec2(0.001, 1.9)));
  return smoothstep(0.15, 0.3, aDistPctFromCenter) * 0.2 * max(box1Strength, box2Strength);
}

void main() {
  vec4 offsetTextureStrength = texture2D(uOffsetTexture, aPointerTrailUv);
  float skillsStrength = offsetTextureStrength.g * 1.5;
  // Min active radii is 2.
  // Will loop through radii pcts to mix offset height based on pct from center.
  // Need to get heights for radii patterns though.
  float patternOffsets[6];
  // Default pattern: Slight negative offset.
  patternOffsets[0] = -0.1;
  // Pattern 1: Slowly propagating waves from center.
  patternOffsets[1] = smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) * 0.1;
  // Patterns 2-6: Zero for now.
  patternOffsets[2] = smoothstep(0.0, 2.0, sin(aPointerTrailUv.x * 15.0 * PI) * sin(uTime * 0.5 + aDistPctFromCenter * 10.0) + cos(aPointerTrailUv.y * 15.0 * PI) * cos(uTime * 0.5 + aDistPctFromCenter * 10.0)) * 0.15;

  patternOffsets[3] = skillsStrength + getPatternOffset3();

  patternOffsets[4] = -smoothstep(0.3, 0.0, aDistPctFromCenter) * 4.0 + smoothstep(0.0, 1.0, pow(sin(uTime * 0.5 + aDistPctFromCenter * 25.0), 2.0)) * 0.1;
  patternOffsets[5] = sin(sdEquilateralTriangle(aPointerTrailUv - 0.5, 0.1) * 50.0 + uTime) * 0.1;

  // patternOffsets[0] = patternOffsets[3];
  // patternOffsets[1] = patternOffsets[3];

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

  float pointerTrailOffset = offsetTextureStrength.r * 0.15;

  float totalOffset = offset + pointerTrailOffset + aRandomOffset;
  csm_Position.y += totalOffset;

  // vColorMix = colorMix;
  vDistPctFromCenter = aDistPctFromCenter;
  vTotalOffset = totalOffset;
  vYPos = csm_Position.y;
}
