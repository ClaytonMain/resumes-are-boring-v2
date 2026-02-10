// Credit to Bruno Simon's Wobbly Sphere Shader tutorial, upon
// which this shader is based.
// https://threejs-journey.com/lessons/wobbly-sphere-shader#compute-the-normal

uniform float uTime;

uniform float uBasePosFreq;
uniform float uBaseTimeFreq;
uniform float uBaseStrength;

attribute vec4 tangent;

varying float vDistanceToCenter;

#include ../../../shaders/includes/simplexNoise4d.glsl

float getWobble(vec3 pos) {
  vec3 adjustedPos = pos + vec3(0.0, 0.0, uTime * 0.015);
  float wobble = simplexNoise4d(vec4(adjustedPos * uBasePosFreq * 0.01, // XYZ
  uTime * uBaseTimeFreq // W
  )) *
    uBaseStrength;

  float finalWobble = (wobble + 0.5) * smoothstep(100.0, 200.0, distance(pos.xz, vec2(0.0)));
  return finalWobble;
}

void main() {
  vec3 biTangent = cross(normal, tangent.xyz);

  // Neighbors positions
  float shift = 0.06;
  vec3 positionA = csm_Position + tangent.xyz * shift;
  vec3 positionB = csm_Position + biTangent * shift;

  // Wobble
  float wobble = getWobble(csm_Position);
  // wobble *= smoothstep(0.0, 1.0, pow(dot(normal, vec3(0.0, 0.0, -1.0)) * 0.5 + 0.5, 0.5));
  csm_Position += wobble * normal;
  positionA += getWobble(positionA) * normal;
  positionB += getWobble(positionB) * normal;
  // Compute normal
  vec3 toA = normalize(positionA - csm_Position);
  vec3 toB = normalize(positionB - csm_Position);
  csm_Normal = cross(toA, toB);

  vDistanceToCenter = distance(csm_Position, vec3(0.0));
}
