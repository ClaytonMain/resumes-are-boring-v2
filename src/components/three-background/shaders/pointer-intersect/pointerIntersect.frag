uniform float uDelta;
uniform vec2 uPointerUv;
uniform float uPointerVelocity;
uniform sampler2D uPointerTrailTexture;

varying vec2 vUv;

void main() {
  vec4 trailData = texture2D(uPointerTrailTexture, vUv);
  trailData.rgb *= 1.0 - uDelta * 2.0;
  float distToPointer = distance(vUv, uPointerUv);
  float strength =
    smoothstep(0.025, 0.0, distToPointer) *
    smoothstep(0.05, 8.0, uPointerVelocity);
  trailData.rgb += strength;
  gl_FragColor = clamp(trailData, 0.0, 1.0);
}
