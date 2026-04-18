uniform vec3 uRadiiColors[10];
uniform vec3 uRadiiYOffsetColors[10];

varying float vDistPctFromCenter;
flat in int vRadiiIndex;
varying float vEasedRadiiPct;
varying float vTotalOffset;
varying float vYPos;

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
  vec3 yOffsetColor = mix(
    uRadiiYOffsetColors[vRadiiIndex + 1],
    uRadiiYOffsetColors[vRadiiIndex],
    colorMix
  );

  csm_DiffuseColor.rgb = mix(
    color,
    yOffsetColor,
    smoothstep(0.0, 0.5, vTotalOffset)
  );
  csm_DiffuseColor.a =
    smoothstep(0.3, 0.6, vYPos) * smoothstep(0.65, 0.5, vDistPctFromCenter);
}
