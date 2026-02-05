uniform vec3 uColor;

varying vec2 vUv;

void main() {
  float centerDistance = distance(vUv, vec2(0.5));
  float alpha = smoothstep(0.0, 1.0, 1.0 - centerDistance * 4.0 + 0.35);
  gl_FragColor = vec4(uColor, alpha);
}
