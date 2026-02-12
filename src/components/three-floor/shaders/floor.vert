// Credit to Bruno Simon's Wobbly Sphere Shader tutorial, upon
// which this shader is based.
// https://threejs-journey.com/lessons/wobbly-sphere-shader#compute-the-normal

uniform float uTime;

// uniform float uBasePosFreq;
// uniform float uBaseTimeFreq;
// uniform float uBaseStrength;
uniform float uShift;

uniform float uBigElevation;
uniform float uBigFrequency;
uniform float uBigSpeed;

uniform float uSmallElevation;
uniform float uSmallFrequency;
uniform float uSmallSpeed;
uniform float uSmallIterations;

attribute vec4 tangent;

varying vec2 vUv;

#include ../../../shaders/includes/perlinClassic3d.glsl
#include ../../../shaders/includes/simplexNoise3d.glsl

// float getWobble(vec3 pos) {
//   vec3 adjustedPos = pos + vec3(0.0, 0.0, uTime * 0.015);
//   float wobble = simplexNoise4d(vec4(adjustedPos * uBasePosFreq * 0.01, // XYZ
//   uTime * uBaseTimeFreq // W
//   )) *
//     uBaseStrength;

//   float finalWobble = (wobble + 0.5) * smoothstep(100.0, 200.0, distance(pos.xz, vec2(0.0)));
//   return finalWobble;
// }

// float getWobble(vec3 pos) {
//   float bowlFactor = cos(distance(pos.xz * 0.0005, vec2(0.0)) * 3.14159);

//   float yOffset = (simplexNoise3d(
//     vec3(pos.xz * uBasePosFreq * 0.01,
//     uTime * uBaseTimeFreq)
//   ) + 1.0) * uBaseStrength * 5.0;
//   yOffset += 

//   yOffset *= (1.0 - bowlFactor) * bowlFactor;

//   return yOffset;
// }

float getWobble(vec3 pos) {

  // float yOffset = sin(pos.x * uBigFrequency.x + uTime * uBigSpeed) * sin(pos.z * uBigFrequency.y + uTime * uBigSpeed) * uBigElevation;
  // float yOffset = perlinClassic3d(vec3(pos.xz * uBigFrequency, uTime * uBigSpeed)) * uBigElevation;
  vec3 adjustedPos = pos + sign(pos) * vec3(1.0, 0.0, 1.0) * 0.005 * uTime;
  float yOffset = (simplexNoise3d(vec3(adjustedPos.xz * uBigFrequency * 0.01, uTime * uBigSpeed)) + 0.5) * uBigElevation;
  for (float i = 1.0; i < uSmallIterations; i += 1.0) {
    yOffset += (perlinClassic3d(vec3(pos.xz * uSmallFrequency * i, uTime * uSmallSpeed)) * uSmallElevation / i);
  }

  // float bowlFactor = cos(distance(pos.xz / 500.0, vec2(0.0)) * 3.14159);
  // yOffset *= (1.0 - bowlFactor) * bowlFactor;
  yOffset *= smoothstep(10.0, 450.0, distance(pos.xz, vec2(0.0)));
  yOffset *= smoothstep(450.0, 400.0, distance(pos.xz, vec2(0.0)));

  return yOffset;
}

void main() {
  vec3 biTangent = cross(normal, tangent.xyz);

  // Neighbors positions
  vec3 positionA = csm_Position + tangent.xyz * uShift;
  vec3 positionB = csm_Position + biTangent * uShift;

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

  vUv = uv;
}
