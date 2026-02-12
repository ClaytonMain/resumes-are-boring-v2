uniform float uVisibility;

varying vec2 vUv;

void main() {
  csm_DiffuseColor *=
    1.0 -
    smoothstep(0.005, 0.03, distance(vUv, vec2(0.5)) - uVisibility + 0.03);
  csm_DiffuseColor.rgb +=
    (1.0 -
      smoothstep(
        0.0,
        0.005,
        abs(distance(vUv, vec2(0.5)) - uVisibility + 0.005)
      )) *
    3.0;
}
