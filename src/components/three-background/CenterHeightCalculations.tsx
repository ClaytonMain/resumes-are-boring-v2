// A component that duplicates the calculations the shader does
// for the height of the blocks, but only for the center block.
// This will be used to help with syncronizing the visuals
// output by the shader with other visual effects in the app.
// The value will be calculated here and set in the centerHeightRef.

// We'll ignore the heights present in the offset texture for now,
// but check the proficiency, enjoyment, and experience offset
// values directly.

// We'll assume the aDistPctFromCenter is 0 for the center block.

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import { SKILLS } from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";
import type { GridBlockUniforms } from "./types/types";

// I know this is silly, but I just want to make this easy to cross-reference.
const aDistPctFromCenter = 0.05;
// Pretty sure it's 0.5, 0.5.
const aPointerTrailUv = new THREE.Vector2(0.5, 0.5);

function smoothstep(edge0: number, edge1: number, x: number) {
  const edge1MinusEdge0Raw = edge1 - edge0;
  const edge1MinusEdge0 =
    edge1MinusEdge0Raw === 0
      ? 0.00001 * Math.sign(edge1MinusEdge0Raw)
      : edge1MinusEdge0Raw;
  const t = Math.max(0, Math.min(1, (x - edge0) / edge1MinusEdge0));
  return t * t * (3 - 2 * t);
}

function easeInQuad(x: number) {
  return x * x;
}

function mix(x: number, y: number, a: number) {
  return x * (1 - a) + y * a;
}

export default function CenterHeightCalculations({
  centerHeightRef,
  gridBlockUniforms,
}: {
  centerHeightRef: RefObject<number>;
  gridBlockUniforms: GridBlockUniforms;
}) {
  const patternOffsetsRef = useRef([-0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]);

  useFrame(() => {
    const uTime = gridBlockUniforms.uTime.value;
    const uRadiiPatterns = gridBlockUniforms.uRadiiPatterns.value;
    const activeSkillIndex = useAppStore.getState().activeSkillIndex;
    const proficiencyHeight = SKILLS[activeSkillIndex].proficiency * 0.15;
    const enjoymentHeight = SKILLS[activeSkillIndex].enjoyment * 0.15;
    const experienceHeight = SKILLS[activeSkillIndex].experience * 0.15;

    patternOffsetsRef.current[1] =
      smoothstep(0.0, 1.0, Math.sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) *
      0.1;
    patternOffsetsRef.current[2] =
      smoothstep(
        0.0,
        2.0,
        Math.sin(aPointerTrailUv.x * 15.0 * Math.PI) *
          Math.sin(uTime * 0.5 + aDistPctFromCenter * 10.0) +
          Math.cos(aPointerTrailUv.y * 15.0 * Math.PI) *
            Math.cos(uTime * 0.5 + aDistPctFromCenter * 10.0),
      ) * 0.15;
    // Taking a small liberty with pattern 3 here.
    patternOffsetsRef.current[3] = Math.max(
      proficiencyHeight,
      enjoymentHeight,
      experienceHeight,
    );
    patternOffsetsRef.current[4] =
      -smoothstep(0.3, 0.0, aDistPctFromCenter) * 4.0 +
      smoothstep(
        0.0,
        1.0,
        Math.pow(Math.sin(uTime * 0.5 + aDistPctFromCenter * 25.0), 2.0),
      ) *
        0.1;

    let offset = 0;
    let easedRadiiPct = 0;
    for (let i = 0; i < 10; i++) {
      if (i + 2 > gridBlockUniforms.uActiveRadii.value) break;
      easedRadiiPct = easeInQuad(gridBlockUniforms.uRadiiPcts.value[i] * 1.25);
      // I don't think this would ever be the case, but let's not rely on that assumption.
      if (easedRadiiPct < 0) continue;
      const patternMix = smoothstep(0, 0.25, easedRadiiPct);
      offset = mix(
        patternOffsetsRef.current[uRadiiPatterns[i + 1]],
        patternOffsetsRef.current[uRadiiPatterns[i]],
        patternMix,
      );
      break;
    }

    centerHeightRef.current = offset;
  });

  return null;
}

// vertex shader below for reference:
// uniform float uTime;
// uniform sampler2D uOffsetTexture;

// uniform int uActiveRadii;
// uniform float uRadiiPcts[10];
// uniform int uRadiiPatterns[10];

// attribute float aDistPctFromCenter;
// attribute vec2 aPointerTrailUv;
// attribute float aRandomOffset;

// varying float vDistPctFromCenter;
// flat out int vRadiiIndex; // Well, this is weird. Have to use flat to pass int from vert to frag.
// varying float vEasedRadiiPct;
// varying float vTotalOffset;
// varying float vYPos;

// float easeInQuad(float x) {
//   return x * x;
// }

// void main() {
//   vec4 offsetTextureStrength = texture2D(uOffsetTexture, aPointerTrailUv);
//   float skillsStrength = offsetTextureStrength.g * 1.5;
//   // Min active radii is 2.
//   // Will loop through radii pcts to mix offset height based on pct from center.
//   // Need to get heights for radii patterns though.
//   float patternOffsets[7];
//   // Default pattern: Slight negative offset.
//   patternOffsets[0] = -0.1;
//   // Pattern 1: Slowly propagating waves from center.
//   patternOffsets[1] = smoothstep(0.0, 1.0, sin(-uTime * 0.3 + aDistPctFromCenter * 20.0)) * 0.1;
//   // Patterns 2-6: Zero for now.
//   patternOffsets[2] = smoothstep(0.0, 2.0, sin(aPointerTrailUv.x * 15.0 * 3.14159) * sin(uTime * 0.5 + aDistPctFromCenter * 10.0) + cos(aPointerTrailUv.y * 15.0 * 3.14159) * cos(uTime * 0.5 + aDistPctFromCenter * 10.0)) * 0.15;
//   patternOffsets[3] = skillsStrength;
//   patternOffsets[4] = -smoothstep(0.3, 0.0, aDistPctFromCenter) * 4.0 + smoothstep(0.0, 1.0, pow(sin(uTime * 0.5 + aDistPctFromCenter * 25.0), 2.0)) * 0.1;
//   patternOffsets[5] = 0.0;
//   patternOffsets[6] = 0.0;

//   float offset;
//   float easedRadiiPct;
//   for (int i = 0; i < 10; i++) {
//     if (i + 2 > uActiveRadii)
//       break;
//     easedRadiiPct = easeInQuad(uRadiiPcts[i] * 1.25);
//     if (easedRadiiPct < aDistPctFromCenter)
//       continue;
//     float patternMix = smoothstep(aDistPctFromCenter, aDistPctFromCenter + 0.25, easedRadiiPct);
//     offset = mix(patternOffsets[uRadiiPatterns[i + 1]], patternOffsets[uRadiiPatterns[i]], patternMix);
//     vRadiiIndex = i;
//     vEasedRadiiPct = easedRadiiPct;
//     break;
//   }

//   float pointerTrailOffset = offsetTextureStrength.r * 0.15;

//   float totalOffset = offset + pointerTrailOffset + aRandomOffset;
//   csm_Position.y += totalOffset;

//   // vColorMix = colorMix;
//   vDistPctFromCenter = aDistPctFromCenter;
//   vTotalOffset = totalOffset;
//   vYPos = csm_Position.y;
// }
