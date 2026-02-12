uniform float uVisibility;

varying vec2 vUv;

void main() {
  csm_DiffuseColor *=
    1.0 -
    smoothstep(
      0.005 - 0.0049 * uVisibility,
      0.03 - 0.0298 * uVisibility,
      distance(vUv, vec2(0.5)) - uVisibility + 0.03 - 0.0298 * uVisibility
    );
  csm_DiffuseColor.rgb +=
    (1.0 -
      smoothstep(
        0.0,
        0.005 - 0.0049 * uVisibility,
        abs(
          distance(vUv, vec2(0.5)) - uVisibility + 0.005 - 0.0049 * uVisibility
        )
      )) *
    3.0;
}
