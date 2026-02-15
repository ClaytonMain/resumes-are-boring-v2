uniform float uTime;
uniform vec3 uCameraPosition;
uniform vec2 uResolution;
uniform float uGlZ;
uniform float uVisibility;
uniform mat3 uCenterRotation;
uniform float uXSpacing;
uniform float uYSpacing;
uniform float uZSpacing;
uniform float uZRotationAmplitude;
uniform float uZRotationFrequency;
uniform float uZRotationSpeed;
uniform vec3 uLightColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSubsurfaceColor;
uniform float uSubsurfaceRadius;
uniform float uRoughness;
uniform float uRefractionIndex;

varying mat4 vViewMatrix;

const int MAX_STEPS = 64;
const float MAX_TRAVEL_DIST = 200.0;
// const vec3 LIGHT_DIR = normalize(vec3(-0.5, 0.0, -1.0));
const vec3 LIGHT_DIR = normalize(vec3(0.0, 0.0, -1.0));

#define PI2 6.2831853

// https://iquilezles.org/articles/sdfrepetition/
// correct way to repeat space every s units
// float repeated(vec2 p, float s) {
//   vec2 id = round(p / s);
//   vec2 o = sign(p - s * id); // neighbor offset direction

//   float d = 1e20;
//   for (int j = 0; j < 2; j++) for (int i = 0; i < 2; i++) {
//       vec2 rid = id + vec2(i, j) * o;
//       vec2 r = p - s * rid;
//       d = min(d, sdf(r));
//     }
//   return d;
// }

// rotational/angular repetition
// float repetition_rotational(vec2 p, int n) {
//   float sp = 6.283185 / float(n);
//   float an = atan(p.y, p.x);
//   float id = floor(an / sp);

//   float a1 = sp * (id + 0.0);
//   float a2 = sp * (id + 1.0);
//   vec2 r1 = mat2(cos(a1), -sin(a1), sin(a1), cos(a1)) * p;
//   vec2 r2 = mat2(cos(a2), -sin(a2), sin(a2), cos(a2)) * p;

//   return min(sdf(r1, id + 0.0), sdf(r2, id + 1.0));
// }

vec4 sdgBox(in vec3 p, in vec3 b, in float r) {
  vec3 w = abs(p) - (b - r);
  float g = max(w.x, max(w.y, w.z));
  vec3 q = max(w, 0.0);
  float l = length(q);
  vec4 f = (g > 0.0) ? vec4(l, q / l) : vec4(g, w.x == g ? 1.0 : 0.0, w.y == g ? 1.0 : 0.0, w.z == g ? 1.0 : 0.0);
  return vec4(f.x - r, f.yzw * sign(p));
}

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

mat3 rotate3dX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(1, 0, 0, 0, c, -s, 0, s, c);
}

mat3 rotate3dZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, -s, 0, s, c, 0, 0, 0, 1);
}

vec4 sdgTorus(vec3 p, float ra, float rb) {
  float h = length(p.xz);
  return vec4(length(vec2(h - ra, p.y)) - rb, normalize(p * vec3(h - ra, h, h - ra)));
}

vec4 sdgSphere(vec3 p, float r) {
  float l = length(p);
  return vec4(l - r, p / l);
}

vec4 sdgSegment(in vec3 p, in vec3 a, in vec3 b, in float r) {
  vec3 ba = b - a;
  vec3 pa = p - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  vec3 q = pa - h * ba;
  float d = length(q);
  return vec4(d - r, q / d);
}

vec4 sdgMin(vec4 a, vec4 b, float k) {
  k *= 4.0;
  float h = max(k - abs(a.x - b.x), 0.0);
  float m = 0.25 * h * h / k;
  float n = 0.50 * h / k;
  return vec4(min(a.x, b.x) - m, mix(a.yzw, b.yzw, (a.x < b.x) ? n : 1.0 - n));
}

vec4 sdgRepetitionRotational(vec3 p, int n, float rad) {
  float sp = PI2 / float(n);
  float angle = atan(p.y, p.x);
  float angleId = floor(angle / sp);

  float zId = round(p.z / uZSpacing);

  float a1 = sp * (angleId + 0.0);
  float a2 = sp * (angleId + 1.0);

  mat3 rot1 = rotate3dZ(a1);
  mat3 rot2 = rotate3dZ(a2);

  vec3 r1 = rot1 * p;
  vec3 r2 = rot2 * p;

  r1 = r1 - vec3(rad, 0.0, 0.0);
  r2 = r2 - vec3(rad, 0.0, 0.0);

  mat3 animationRotation = rotate3dX(uTime * 0.1 + zId * 0.13) * rotate3dZ(uTime * 0.2 - zId * 0.6);
  // mat3 animationRotation = rotate3dX(uTime * 0.1 - zId * 0.9);

  r1 *= animationRotation;
  r2 *= animationRotation;

  // r1 = transpose(rotate3dX(uTime * 0.3 + zId * 0.13)) * transpose(rotate3dZ(uTime * 0.3 + zId * 0.13)) * r1;
  // r2 = transpose(rotate3dX(uTime * 0.3 + zId * 0.13)) * transpose(rotate3dZ(uTime * 0.3 + zId * 0.13)) * r2;

  // r1 = inverse(rotate3dZ(uTime * 0.3 + zId * 0.13)) * r1;
  // r2 = inverse(rotate3dZ(uTime * 0.3 + zId * 0.13)) * r2;

  mat3 inverseAnimationRotation = inverse(animationRotation);
  vec4 d1 = sdgBox(r1, vec3(0.2, 0.2, 0.2), 0.1);
  d1.yzw *= inverseAnimationRotation * inverse(rotate3dZ(a1));
  vec4 d2 = sdgBox(r2, vec3(0.2, 0.2, 0.2), 0.1);
  d2.yzw *= inverseAnimationRotation * inverse(rotate3dZ(a2));

  // vec4 d1 = sdgSegment(r1, animationRotation * SEGMENT_A, animationRotation * SEGMENT_B, 0.15);
  // vec4 d2 = sdgSegment(r2, animationRotation * SEGMENT_A, animationRotation * SEGMENT_B, 0.15);

  // vec4 d1 = sdgTorus(r1, 0.4, 0.1);
  // vec4 d2 = sdgTorus(r2, 0.4, 0.1);

  // vec4 d1 = sdgBox(r1, vec3(0.2), 0.2);
  // d1.yzw *= inverse(animationRotation);
  // vec4 d2 = sdgBox(r2, vec3(0.2), 0.2);
  // d2.yzw *= inverse(animationRotation);

  vec4 d = sdgMin(d1, d2, 0.1);
  // d.yzw *= inverse(animationRotation);

  // vec4 d = d1.x < d2.x ? d1 : d2;

  return d;
}

vec4 getMap(vec3 pos) {
  vec4 d = vec4(1e20, 0.0, 0.0, 0.0);
  float zId = round(pos.z / uZSpacing);
  for (float i = 0.0; i <= 1.0; i++) {
    vec3 p = pos - vec3(0.0, 0.0, zId * uZSpacing + i * uZSpacing);
    d = sdgMin(d, sdgRepetitionRotational(p, 16, sin(uTime * 0.4 + zId * 1.3) * 0.25 + 2.0), 0.1);
  }
  return d;
}

// vec3 palette(float t) {
//   return uPaletteA + uPaletteB * cos(PI2 * (uPaletteC * t + uPaletteD));
// }

struct HitInfo {
  float t;
  vec3 normal;
  vec3 pos;
  int steps;
  float zId;
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

vec3 lighting(
  int sssType, // 0 = Exponential, 1 = Gaussian
  HitInfo hitInfo,
  vec3 lightDir,
  vec3 rayDirection,
  vec3 lightColor,
  vec3 diffuseColor,
  vec3 subsurfaceColor,
  float subsurfaceRadius,
  float roughness,
  float refractionIndex
) {
  vec3 normal = hitInfo.normal;
  // normal = inverse(rotate3dZ(uTime * 0.3 + hitInfo.zId * 0.13)) * normal;
  // normal = inverse(rotate3dX(uTime * 0.3 + hitInfo.zId * 0.13)) * normal;

  float normalDotLight = dot(normal, lightDir); // Lambertian diffuse.
  float posNormalDotLight = clamp(normalDotLight, 0.0, 1.0);
  float negNormalDotLight = clamp(-normalDotLight, 0.0, 1.0);

  // Subsurface scattering
  vec3 sss;
  vec3 ssRadiusVec3 = vec3(subsurfaceRadius);
  if (sssType == 0) {
    // Exponential
    sss = 0.2 * pow(vec3(1.0 - posNormalDotLight), 3.0 / (ssRadiusVec3 + 0.001)) *
      pow(vec3(1.0 - negNormalDotLight), 3.0 / (ssRadiusVec3 + 0.001));
  } else {
    // Gaussian
    sss = 0.2 * exp(-3.0 * abs(normalDotLight) / (ssRadiusVec3 + 0.001));
  }

  // if (normalDotLight > 0.0) {
  //   vec3 offsetPos = hitInfo.pos + normal * 0.001;
  //   HitInfo hitLight;
  //   bool isHitLight = raycast(offsetPos, lightDir, hitLight, 12.0);
  //   normalDotLight *= float(!isHitLight);
  //   posNormalDotLight = clamp(normalDotLight, 0.0, 1.0);
  // }

  vec3 halfVector = normalize(lightDir - rayDirection);
  float normalDotHalf = dot(normal, halfVector);

  // ggx / Trowbridge and Reitz specular model approximation.
  // TODO: Learn what this ^ is.
  float g = normalDotHalf * normalDotHalf * (roughness * roughness - 1.0) + 1.0;
  float ggx = (roughness * roughness) / (PI2 * 0.5 * g * g);

  // Shlick approximation.
  // TODO: Learn what this ^ is.
  float fresnel = 1.0 + dot(rayDirection, normal);
  // Fresnel amount.
  float f0 = (refractionIndex - 1.0) / (refractionIndex + 1.0);
  f0 = f0 * f0;
  // float f0 = 0.04;
  float reflectivity = f0 + (1.0 - f0) * (1.0 - roughness) * (1.0 - roughness) * pow(fresnel, 5.0);

  vec3 returnColor = vec3(0.0);
  // Diffuse + sss + specular.
  returnColor = lightColor * (posNormalDotLight * (diffuseColor + reflectivity * ggx) + diffuseColor * subsurfaceColor * ssRadiusVec3 * sss);

  // float ao = smoothstep(-0.08, 0.04, getMap(hitInfo.pos).x / length(grad(hitInfo.pos)));
  // returnColor *= ao * 0.7 + 0.3;

  // Apply fog.
  float fogAmount = (1.0 - exp(-0.005 * hitInfo.t * hitInfo.t));
  returnColor = mix(returnColor, vec3(0.0), fogAmount);

  // return normal;

  return returnColor;
}

vec3 render(vec3 rayOrigin, vec3 rayDirection) {
  HitInfo hitInfo;
  bool isHit = raycast(rayOrigin, rayDirection, hitInfo, MAX_TRAVEL_DIST * uVisibility);

  vec3 color;
  if (isHit) {
    // color = vec3(hitInfo.t * 0.25 / float(MAX_TRAVEL_DIST));
    color = lighting(0, hitInfo, LIGHT_DIR, rayDirection, uLightColor, uDiffuseColor, uSubsurfaceColor, uSubsurfaceRadius, uRoughness, uRefractionIndex);
  } else {
    color = vec3(0.0);
  }

  // // Tone mapping. Why tho?
  color = 2.0 * color / (0.8 + 2.5 * color);
  // // Gamma correction. Also why tho?
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
