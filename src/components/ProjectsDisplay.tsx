import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useAppStore from "../stores/useAppStore";

export default function ProjectsDisplay() {
  const [states, setStates] = useState({
    pageActive: useAppStore.getState().currentPage === "projects",
    springsActive: false,
    activeProjectIndex: useAppStore.getState().activeProjectIndex,
  });
  // outerYHeightSpring will control the heavy-feeling on enter and on leave
  // y value animation for the outer group.
  const outerYHeightSpring = useSpring(states.springsActive ? 1.0 : -2.0);
  // outerYRotationSpring will control which side of the project display portal
  // cube is facing the camera.
  const outerYRotationSpring = useSpring(
    (states.activeProjectIndex * Math.PI) / 2,
  );

  const outerGroupRef = useRef<THREE.Group>(null!);
  const innerGroupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    const unsubActiveProjectIndex = useAppStore.subscribe(
      (state) => state.activeProjectIndex,
      (value) => {
        const newStates = { ...states };
        newStates.activeProjectIndex = value;
        outerYRotationSpring.set((value * Math.PI) / 2);
        setStates(newStates);
      },
    );
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value) => {
        const newStates = { ...states };
        if (value === "projects") {
          newStates.pageActive = true;
        } else {
          newStates.pageActive = false;
          newStates.springsActive = false;
        }
        setStates(newStates);
      },
    );

    return () => {
      unsubActiveProjectIndex();
      unsubCurrentPage();
    };
  }, [outerYRotationSpring, states]);

  useEffect(() => {
    if (states.pageActive) {
      const timeoutId = setTimeout(() => {
        setStates((prev) => ({ ...prev, springsActive: true }));
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setStates((prev) => ({ ...prev, springsActive: false }));
    }
  }, [states.pageActive]);

  useEffect(() => {
    // const newStates = { ...states };
    if (states.springsActive) {
      outerYHeightSpring.set(1.0);
    } else {
      outerYHeightSpring.set(-2.0);
    }
  }, [states.springsActive, outerYHeightSpring]);

  const clampedDeltaRef = useRef(0);
  const timeRef = useRef(0);
  useFrame(({ camera }, delta) => {
    clampedDeltaRef.current = Math.min(delta, 0.1);
    timeRef.current += clampedDeltaRef.current;

    innerGroupRef.current.lookAt(
      camera
        .getWorldDirection(new THREE.Vector3())
        .multiply(new THREE.Vector3(-1, 0, -1)),
    );

    if (outerGroupRef.current) {
      outerGroupRef.current.position.y = outerYHeightSpring.get();
      outerGroupRef.current.rotation.y = outerYRotationSpring.get();
    }
    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.x = Math.sin(timeRef.current / 5) * 0.05;
      innerGroupRef.current.rotation.y = Math.sin(timeRef.current / 4) * 0.05;
      innerGroupRef.current.rotation.z = Math.sin(timeRef.current / 3) * 0.05;
    }
  });

  return (
    <>
      <group ref={outerGroupRef}>
        <group ref={innerGroupRef}>
          <Box>
            <meshStandardMaterial color="orange" />
          </Box>
        </group>
      </group>
    </>
  );
}
