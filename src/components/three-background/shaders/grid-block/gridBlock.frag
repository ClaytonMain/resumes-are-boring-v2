varying float vDistPctFromCenter;

void main() {
  csm_DiffuseColor = csm_DiffuseColor;
  if (vDistPctFromCenter > 0.5) {
    csm_DiffuseColor.a = 0.0;
  }
}
