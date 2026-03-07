import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { SKILLS } from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";
import type { OffsetTextureUniforms } from "./types/types";

export default function SkillsController({
  offsetTextureUniforms,
  proficiencyRef,
  enjoymentRef,
  experienceRef,
}: {
  offsetTextureUniforms: OffsetTextureUniforms;
  proficiencyRef: RefObject<THREE.Object3D>;
  enjoymentRef: RefObject<THREE.Object3D>;
  experienceRef: RefObject<THREE.Object3D>;
}) {
  const currentPageRef = useRef(useAppStore.getState().currentPage);
  const activeSkillIndexRef = useRef(useAppStore.getState().activeSkillIndex);
  const proficiencySpring = useSpring(
    currentPageRef.current === "skills"
      ? SKILLS[activeSkillIndexRef.current].proficiency / 10
      : 0,
  );
  const enjoymentSpring = useSpring(
    currentPageRef.current === "skills"
      ? SKILLS[activeSkillIndexRef.current].enjoyment / 10
      : 0,
  );
  const experienceSpring = useSpring(
    currentPageRef.current === "skills"
      ? SKILLS[activeSkillIndexRef.current].experience / 10
      : 0,
  );

  useEffect(() => {
    const unsubActiveSkillIndex = useAppStore.subscribe(
      (state) => state.activeSkillIndex,
      (value) => {
        activeSkillIndexRef.current = value;
        if (currentPageRef.current === "skills") {
          proficiencySpring.set(SKILLS[value].proficiency / 10);
          enjoymentSpring.set(SKILLS[value].enjoyment / 10);
          experienceSpring.set(SKILLS[value].experience / 10);
        }
      },
    );
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value) => {
        currentPageRef.current = value;
        if (value === "skills") {
          proficiencySpring.set(
            SKILLS[activeSkillIndexRef.current].proficiency / 10,
          );
          enjoymentSpring.set(
            SKILLS[activeSkillIndexRef.current].enjoyment / 10,
          );
          experienceSpring.set(
            SKILLS[activeSkillIndexRef.current].experience / 10,
          );
        } else {
          proficiencySpring.set(0);
          enjoymentSpring.set(0);
          experienceSpring.set(0);
        }
      },
    );
    return () => {
      unsubActiveSkillIndex();
      unsubCurrentPage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame(() => {
    if (proficiencyRef.current) {
      offsetTextureUniforms.uProficiencyValue.value = proficiencySpring.get();
    }
    if (enjoymentRef.current) {
      offsetTextureUniforms.uEnjoymentValue.value = enjoymentSpring.get();
    }
    if (experienceRef.current) {
      offsetTextureUniforms.uExperienceValue.value = experienceSpring.get();
    }
  });

  return (
    <Billboard>
      <object3D ref={proficiencyRef} position={[-0.6, 0.0, 0.5]} />
      <object3D ref={enjoymentRef} position={[0, 0.0, 0.5]} />
      <object3D ref={experienceRef} position={[0.6, 0.0, 0.5]} />
    </Billboard>
  );
}
