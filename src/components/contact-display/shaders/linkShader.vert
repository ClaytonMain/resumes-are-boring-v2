varying float vNormalDotDown;

void main() {
  vNormalDotDown =
    dot(
      (modelViewMatrix * vec4(csm_Normal, 0.0)).xyz,
      (viewMatrix * vec4(0.0, -1.0, 0.0, 0.0)).xyz
    ) *
      0.5 +
    0.5;
}
