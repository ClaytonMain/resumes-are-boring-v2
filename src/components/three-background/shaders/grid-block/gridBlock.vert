uniform float uTime;

attribute float aDistanceFromCenter;

void main() {
  vec3 offset = smoothstep(0.0, 1.0, sin((-uTime * 0.3 + aDistanceFromCenter * 3.0))) * 0.1 * vec3(0.0, 1.0, 0.0);
  csm_Position += offset;
}