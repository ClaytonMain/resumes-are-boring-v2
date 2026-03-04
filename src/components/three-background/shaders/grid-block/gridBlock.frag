uniform float uSlowPropagationPct;

varying float vDistPctFromCenter;
varying float vColorFactor;
varying float vAlphaFactor;

void main() {
  csm_DiffuseColor.rgb = mix(vec3(0.0), csm_DiffuseColor.rgb, vColorFactor);
}
