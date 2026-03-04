varying float vColorMix;

void main() {
  csm_DiffuseColor.rgb = mix(vec3(0.0), csm_DiffuseColor.rgb, vColorMix);
}
