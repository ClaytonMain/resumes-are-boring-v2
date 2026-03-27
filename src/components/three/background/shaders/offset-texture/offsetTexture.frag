uniform float uDelta;
uniform vec2 uPointerUv;
uniform float uPointerVelocity;
uniform sampler2D uOffsetTexture;

uniform vec2 uProficiencyUv;
uniform vec2 uEnjoymentUv;
uniform vec2 uExperienceUv;

uniform float uProficiencyValue;
uniform float uEnjoymentValue;
uniform float uExperienceValue;

varying vec2 vUv;

void main() {
  vec4 trailData = texture2D(uOffsetTexture, vUv);
  trailData.r *= 1.0 - uDelta * 2.0;
  float distToPointer = distance(vUv, uPointerUv);
  float pointerStrength = smoothstep(0.025, 0.0, distToPointer) *
    smoothstep(0.05, 8.0, uPointerVelocity);
  trailData.r += pointerStrength;

  // Add proficiency/enjoyment/experience "blobs"
  float proficiencyDist = distance(vUv, uProficiencyUv);
  float enjoymentDist = distance(vUv, uEnjoymentUv);
  float experienceDist = distance(vUv, uExperienceUv);
  float proficiencyStrength = smoothstep(0.013, 0.008, proficiencyDist) * uProficiencyValue;
  float enjoymentStrength = smoothstep(0.013, 0.008, enjoymentDist) * uEnjoymentValue;
  float experienceStrength = smoothstep(0.013, 0.008, experienceDist) * uExperienceValue;
  trailData.g = proficiencyStrength + enjoymentStrength + experienceStrength;

  gl_FragColor = clamp(trailData, 0.0, 1.0);
}
