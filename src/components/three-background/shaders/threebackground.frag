uniform float uTime;
uniform vec3 uCameraPosition;
uniform vec2 uResolution;
uniform float uGlZ;
uniform float uVisibility;
uniform mat3 uCenterRotation;

varying mat4 vViewMatrix;

const int MAX_STEPS = 128;
const float MAX_TRAVEL_DIST = 500.0;

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

vec4 sdgTorus(vec3 p, float ra, float rb) {
  float h = length(p.xz);
  return vec4(
    length(vec2(h - ra, p.y)) - rb,
    normalize(p * vec3(h - ra, h, h - ra))
  );
}

vec4 sdgSphere(vec3 p, float r) {
  float l = length(p);
  return vec4(l - r, p / l);
}

vec4 getMap(vec3 pos) {
  if (distance(pos, vec3(0.0)) < 2.0) {
    return sdgTorus(uCenterRotation * pos, 0.5, 0.2);
  }
  vec3 usePos = pos;
  usePos.xy =
    rotate2D(sin(uTime + floor((usePos.z + 2.0) / 4.0) * 4.0) * 0.01) *
    usePos.xy;
  return sdgSphere(mod(usePos + 2.0, 4.0) - 2.0, 0.5);
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

bool raycast(
  vec3 rayOrigin,
  vec3 rayDir,
  out HitInfo oHitInfo,
  const float tMax
) {
  float t = 0.0;
  int i;

  for (i = 0; i < MAX_STEPS; i++) {
    vec3 pos = rayOrigin + rayDir * t;
    // pos = mod(pos + 3.0, 6.0) - 3.0;
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
    // color = vec3(hitInfo.t * 0.25 / float(MAX_TRAVEL_DIST));
    color = hitInfo.normal * float(hitInfo.steps) / float(MAX_STEPS);
  } else {
    color = vec3(0.0);
  }

  // // Tone mapping. Why tho?
  // color = 2.0 * color / (0.8 + 2.5 * color);
  // // Gamma correction. Also why tho?
  // color = pow(color, vec3(0.4545));

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
