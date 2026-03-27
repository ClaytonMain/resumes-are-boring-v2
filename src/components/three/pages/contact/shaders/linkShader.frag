uniform vec3 uFloorColor;
varying float vNormalDotDown;

void main() {
  csm_DiffuseColor.rgb = mix(
    csm_DiffuseColor.rgb,
    uFloorColor,
    smoothstep(0.5, 0.75, vNormalDotDown)
  );
}
