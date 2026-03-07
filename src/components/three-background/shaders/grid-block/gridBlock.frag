uniform int uActiveRadii;
uniform float uRadiiPcts[10];
uniform vec3 uRadiiColors[10];

varying float vDistPctFromCenter;
flat in int vRadiiIndex;
varying float vEasedRadiiPct;

float easeInQuad(float x) {
  return x * x;
}

void main() {
  float colorMix = smoothstep(
    vDistPctFromCenter,
    vDistPctFromCenter + 0.25,
    vEasedRadiiPct
  );
  vec3 color = mix(
    uRadiiColors[vRadiiIndex + 1],
    uRadiiColors[vRadiiIndex],
    colorMix
  );

  csm_DiffuseColor.rgb = color;
}
