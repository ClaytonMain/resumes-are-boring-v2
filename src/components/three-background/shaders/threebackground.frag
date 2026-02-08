uniform vec3 uCameraPosition;
uniform vec2 uResolution;
uniform float uGlZ;

varying mat4 vViewMatrix;

const int MAX_STEPS = 128;
const float MAX_TRAVEL_DIST = 100.0;

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

vec4 sdgSphere(in vec3 p, in float r) {
  float l = length(p);
  return vec4(l - r, p / l);
}

vec4 getMap(vec3 pos) {
  return sdgSphere(pos, 0.5);
}

// vec3 palette(float t) {
//   return uPaletteA + uPaletteB * cos(PI2 * (uPaletteC * t + uPaletteD));
// }

struct HitInfo {
  float t;
  vec3 normal;
  vec3 pos;
  int steps;
};

bool raycast(in vec3 rayOrigin, in vec3 rayDir, out HitInfo oHitInfo, const float tMax) {
  float t = 0.0;
  int i;

  for (i = 0; i < MAX_STEPS; i++) {
    vec3 pos = rayOrigin + rayDir * t;
    pos = mod(pos + 3.0, 6.0) - 3.0;
    vec4 d = getMap(pos);

    if (d.x < 0.01) {
      oHitInfo.t = t;
      oHitInfo.pos = pos;
      oHitInfo.normal = normalize(d.yzw);
      oHitInfo.steps = i;
      return true;
    } else {
      t += d.x;
    }

    if (t >= tMax) {
      return false;
    }
  }

  return false;
}

vec3 render(vec3 rayOrigin, vec3 rayDirection) {
  HitInfo hitInfo;
  bool isHit = raycast(rayOrigin, rayDirection, hitInfo, MAX_TRAVEL_DIST);

  vec3 color;
  if (isHit) {
    color = vec3(0.0);
  } else {
    color = vec3(0.8);
  }

  // Tone mapping. Why tho?
  color = 2.0 * color / (0.8 + 2.5 * color);
  // Gamma correction. Also why tho?
  color = pow(color, vec3(0.4545));

  return color;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  uv -= 0.5;
  uv.x *= uResolution.x / uResolution.y;

  vec3 rayOrigin = uCameraPosition;
  vec4 directionOffset = inverse(vViewMatrix) * vec4(uv.x, uv.y, uGlZ, 1.0);
  vec3 rayDirection = normalize(directionOffset.xyz - rayOrigin);

  vec3 color = render(rayOrigin, rayDirection);

  gl_FragColor = vec4(color, 1.0);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}