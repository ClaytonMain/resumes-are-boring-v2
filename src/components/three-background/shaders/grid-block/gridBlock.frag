uniform vec3 uRadiiColors[10];

varying float vDistPctFromCenter;
flat in int vRadiiIndex;
varying float vEasedRadiiPct;
varying float vTotalOffset;

void main() {
  float colorMix = smoothstep(vDistPctFromCenter, vDistPctFromCenter + 0.25, vEasedRadiiPct);
  vec3 color = mix(uRadiiColors[vRadiiIndex + 1], uRadiiColors[vRadiiIndex], colorMix);

  csm_DiffuseColor.rgb = color + smoothstep(0.0, 0.6, vTotalOffset) * 0.5;
}
