uniform int uActiveRadii;
uniform float uRadiiPcts[10];
uniform vec3 uRadiiColors[10];

varying float vDistPctFromCenter;

float easeInQuad(float x) {
  return x * x;
}

void main() {
  vec3 color = vec3(0.0);

  for (int i = 0; i < 10; i++) {
    if (i + 2 > uActiveRadii)
      break;
    float colorMix = smoothstep(vDistPctFromCenter, vDistPctFromCenter + 0.25, easeInQuad(uRadiiPcts[i] * 1.25));
    color += mix(uRadiiColors[i + 1], uRadiiColors[i], colorMix);
  }
  csm_DiffuseColor.rgb = color;
}
