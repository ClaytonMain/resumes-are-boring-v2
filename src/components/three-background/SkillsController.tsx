import { useFrame } from "@react-three/fiber";
import { useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { SKILLS } from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";
import { SkillsHtmlComponent } from "./SkillsHtmlComponent";
import type { OffsetTextureUniforms } from "./types/types";

export default function SkillsController({
  offsetTextureUniforms,
  proficiencyRef,
  enjoymentRef,
  experienceRef,
  hexagonXSpacing,
  hexagonZSpacing,
}: {
  offsetTextureUniforms: OffsetTextureUniforms;
  proficiencyRef: RefObject<THREE.Object3D>;
  enjoymentRef: RefObject<THREE.Object3D>;
  experienceRef: RefObject<THREE.Object3D>;
  hexagonXSpacing: number;
  hexagonZSpacing: number;
}) {
  const [states, setStates] = useState({
    pageActive: useAppStore.getState().currentPage === "skills",
    springsActive: false,
    activeSkillIndex: useAppStore.getState().activeSkillIndex,
    proficiencyMarkerValue: 0,
    enjoymentMarkerValue: 0,
    experienceMarkerValue: 0,
  });
  const objectsGroupRef = useRef<THREE.Group>(null!);
  const proficiencySpring = useSpring(
    states.springsActive ? SKILLS[states.activeSkillIndex].proficiency : 0,
  );
  const enjoymentSpring = useSpring(
    states.springsActive ? SKILLS[states.activeSkillIndex].enjoyment : 0,
  );
  const experienceSpring = useSpring(
    states.springsActive ? SKILLS[states.activeSkillIndex].experience : 0,
  );

  const markerGeometry = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(0.025, 0);
    geometry.deleteAttribute("normal");
    geometry.deleteAttribute("uv");
    return geometry;
  }, []);

  const proficiencyMarkerGroupRef = useRef<THREE.Group>(null!);
  const proficiencyMarkerRef = useRef<THREE.Mesh>(null!);
  const proficiencyMarkerSpring = useTransform(proficiencySpring, (value) => {
    return value * 1.5 + 0.2;
  });

  const enjoymentMarkerGroupRef = useRef<THREE.Group>(null!);
  const enjoymentMarkerRef = useRef<THREE.Mesh>(null!);
  const enjoymentMarkerSpring = useTransform(enjoymentSpring, (value) => {
    return value * 1.5 + 0.2;
  });

  const experienceMarkerGroupRef = useRef<THREE.Group>(null!);
  const experienceMarkerRef = useRef<THREE.Mesh>(null!);
  const experienceMarkerSpring = useTransform(experienceSpring, (value) => {
    return value * 1.5 + 0.2;
  });

  const markerScaleRef = useRef(states.pageActive ? 1.0 : 0);

  useEffect(() => {
    const unsubActiveSkillIndex = useAppStore.subscribe(
      (state) => state.activeSkillIndex,
      (value) => {
        const newStates = { ...states };
        newStates.activeSkillIndex = value;
        if (
          useAppStore.getState().currentPage === "skills" &&
          states.springsActive
        ) {
          proficiencySpring.set(SKILLS[value].proficiency);
          enjoymentSpring.set(SKILLS[value].enjoyment);
          experienceSpring.set(SKILLS[value].experience);
          newStates.proficiencyMarkerValue = SKILLS[value].proficiency * 100;
          newStates.enjoymentMarkerValue = SKILLS[value].enjoyment * 100;
          newStates.experienceMarkerValue = SKILLS[value].experience * 100;
        }
        setStates(newStates);
      },
    );
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value) => {
        const newStates = { ...states };
        if (value === "skills") {
          newStates.pageActive = true;
        } else {
          newStates.pageActive = false;
          newStates.springsActive = false;
        }
        setStates(newStates);
      },
    );
    return () => {
      unsubActiveSkillIndex();
      unsubCurrentPage();
    };
  }, [enjoymentSpring, experienceSpring, proficiencySpring, states]);

  useEffect(() => {
    if (states.pageActive) {
      const timeoutId = setTimeout(() => {
        setStates((prev) => ({ ...prev, springsActive: true }));
      }, 2000);
      return () => clearTimeout(timeoutId);
    } else {
      setStates((prev) => ({ ...prev, springsActive: false }));
    }
  }, [states.pageActive]);

  useEffect(() => {
    const newStates = { ...states };
    if (states.springsActive) {
      proficiencySpring.set(SKILLS[states.activeSkillIndex].proficiency);
      enjoymentSpring.set(SKILLS[states.activeSkillIndex].enjoyment);
      experienceSpring.set(SKILLS[states.activeSkillIndex].experience);
      newStates.proficiencyMarkerValue =
        SKILLS[states.activeSkillIndex].proficiency * 100;
      newStates.enjoymentMarkerValue =
        SKILLS[states.activeSkillIndex].enjoyment * 100;
      newStates.experienceMarkerValue =
        SKILLS[states.activeSkillIndex].experience * 100;
    } else {
      proficiencySpring.set(0);
      enjoymentSpring.set(0);
      experienceSpring.set(0);
      newStates.proficiencyMarkerValue = 0;
      newStates.enjoymentMarkerValue = 0;
      newStates.experienceMarkerValue = 0;
    }
    setStates(newStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    states.springsActive,
    states.activeSkillIndex,
    enjoymentSpring,
    experienceSpring,
    proficiencySpring,
  ]);

  const randomFactors = useMemo(() => {
    return [
      Math.random() * 0.2 + 0.9,
      Math.random() * 0.2 + 0.9,
      Math.random() * 0.2 + 0.9,
    ];
  }, []);

  const clampedDeltaRef = useRef(0);
  useFrame(({ camera }, delta) => {
    clampedDeltaRef.current = Math.min(delta, 0.1);

    objectsGroupRef.current.lookAt(
      camera
        .getWorldDirection(new THREE.Vector3())
        .multiply(new THREE.Vector3(-1, 0, -1)),
    );

    // Marker opacity
    if (
      states.pageActive &&
      markerScaleRef.current < 1.0 &&
      states.springsActive
    ) {
      markerScaleRef.current += clampedDeltaRef.current * 5;
      if (markerScaleRef.current > 1.0) {
        markerScaleRef.current = 1.0;
      }
    } else if (!states.pageActive && markerScaleRef.current > 0) {
      markerScaleRef.current -= clampedDeltaRef.current * 5;
      if (markerScaleRef.current < 0) {
        markerScaleRef.current = 0;
      }
    }

    // Proficiency
    if (proficiencyRef.current) {
      offsetTextureUniforms.uProficiencyValue.value = proficiencySpring.get();
    }
    if (proficiencyMarkerRef.current) {
      proficiencyMarkerRef.current.rotation.y +=
        clampedDeltaRef.current * 0.5 * randomFactors[0];
      proficiencyMarkerRef.current.rotation.x +=
        clampedDeltaRef.current * 0.25 * randomFactors[0];
    }
    if (proficiencyMarkerGroupRef.current) {
      proficiencyMarkerGroupRef.current.position.y =
        proficiencyMarkerSpring.get();
      proficiencyMarkerGroupRef.current.scale.setScalar(markerScaleRef.current);
    }

    // Enjoyment
    if (enjoymentRef.current) {
      offsetTextureUniforms.uEnjoymentValue.value = enjoymentSpring.get();
    }
    if (enjoymentMarkerRef.current) {
      enjoymentMarkerRef.current.rotation.y +=
        clampedDeltaRef.current * 0.5 * randomFactors[1];
      enjoymentMarkerRef.current.rotation.x +=
        clampedDeltaRef.current * 0.25 * randomFactors[1];
    }
    if (enjoymentMarkerGroupRef.current) {
      enjoymentMarkerGroupRef.current.position.y = enjoymentMarkerSpring.get();
      enjoymentMarkerGroupRef.current.scale.setScalar(markerScaleRef.current);
    }

    // Experience
    if (experienceRef.current) {
      offsetTextureUniforms.uExperienceValue.value = experienceSpring.get();
    }
    if (experienceMarkerRef.current) {
      experienceMarkerRef.current.rotation.y +=
        clampedDeltaRef.current * 0.5 * randomFactors[2];
      experienceMarkerRef.current.rotation.x +=
        clampedDeltaRef.current * 0.25 * randomFactors[2];
    }
    if (experienceMarkerGroupRef.current) {
      experienceMarkerGroupRef.current.position.y =
        experienceMarkerSpring.get();
      experienceMarkerGroupRef.current.scale.setScalar(markerScaleRef.current);
    }
  });

  return (
    <>
      <group ref={objectsGroupRef}>
        <group position={[-hexagonXSpacing * 3, 0.0, hexagonZSpacing * 2]}>
          <object3D ref={proficiencyRef} />
          <group ref={proficiencyMarkerGroupRef}>
            <mesh ref={proficiencyMarkerRef} geometry={markerGeometry}>
              <meshStandardMaterial color="#112211" flatShading />
            </mesh>
            <SkillsHtmlComponent
              index={0}
              springsActive={states.springsActive}
              value={states.proficiencyMarkerValue}
              label="Proficiency"
            />
          </group>
        </group>
        <group position={[0, 0.0, hexagonZSpacing * 2]}>
          <object3D ref={enjoymentRef} />
          <group ref={enjoymentMarkerGroupRef}>
            <mesh ref={enjoymentMarkerRef} geometry={markerGeometry}>
              <meshStandardMaterial color="#112211" flatShading />
            </mesh>
            <SkillsHtmlComponent
              index={1}
              springsActive={states.springsActive}
              value={states.enjoymentMarkerValue}
              label="Enjoyment"
            />
          </group>
        </group>
        <group position={[hexagonXSpacing * 3, 0.0, hexagonZSpacing * 2]}>
          <object3D ref={experienceRef} />
          <group ref={experienceMarkerGroupRef}>
            <mesh ref={experienceMarkerRef} geometry={markerGeometry}>
              <meshStandardMaterial color="#112211" flatShading />
            </mesh>
            <SkillsHtmlComponent
              index={2}
              springsActive={states.springsActive}
              value={states.experienceMarkerValue}
              label="Experience"
            />
          </group>
        </group>
      </group>
    </>
  );
}
