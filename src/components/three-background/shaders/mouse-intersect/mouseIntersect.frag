uniform float uDelta;
uniform vec2 uMouseUv;
uniform float uMouseVelocity;
uniform sampler2D uMouseTrailTexture;

varying vec2 vUv;

void main() {
  vec4 trailData = texture2D(uMouseTrailTexture, vUv);
  trailData.rgb *= 1.0 - uDelta * 2.0;
  float distToMouse = distance(vUv, uMouseUv);
  float strength =
    smoothstep(0.025, 0.0, distToMouse) * smoothstep(0.05, 8.0, uMouseVelocity);
  trailData.rgb += strength;
  gl_FragColor = clamp(trailData, 0.0, 1.0);
}
