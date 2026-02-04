uniform vec3 color;

varying vec2 vUv;

void main() {
  float centerDistance = distance(vUv, vec2(0.5));
  float alpha = 1.0 - centerDistance * 2.0;
  gl_FragColor = vec4(vec3(alpha), 1.0);
}
