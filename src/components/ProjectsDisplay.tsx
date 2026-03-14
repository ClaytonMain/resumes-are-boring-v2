import { Icosahedron, MeshPortalMaterial, Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useAppStore from "../stores/useAppStore";

function ProjectA() {
  return <Icosahedron args={[0.15, 0]} position={[0, 0, -1]} />;
}

export default function ProjectsDisplay() {
  const [states, setStates] = useState({
    pageActive: useAppStore.getState().currentPage === "projects",
    springsActive: false,
    activeProjectIndex: useAppStore.getState().activeProjectIndex,
    activeSide: 0,
  });
  // outerYHeightSpring will control the heavy-feeling on enter and on leave
  // y value animation for the outer group.
  const outerYHeightSpring = useSpring(states.springsActive ? 1.0 : -3.0);
  // innerYRotationSpring will control which side of the project display portal
  // is facing the camera.
  const innerYRotationSpring = useSpring(states.activeSide * Math.PI);

  const outerGroupRef = useRef<THREE.Group>(null!);
  const innerGroupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    const unsubActiveProjectIndex = useAppStore.subscribe(
      (state) => state.activeProjectIndex,
      (value) => {
        const newStates = { ...states };
        outerYHeightSpring.set(-3.0);
        // setStates(newStates);
        const timeoutId = setTimeout(() => {
          newStates.activeProjectIndex = value;
          outerYHeightSpring.set(1.0);
          innerYRotationSpring.set(0);
          newStates.activeSide = 0;
          setStates(newStates);
        }, 500);
        return () => clearTimeout(timeoutId);
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
  }, [innerYRotationSpring, states]);

  useEffect(() => {
    if (states.pageActive) {
      const timeoutId = setTimeout(() => {
        setStates((prev) => ({ ...prev, springsActive: true }));
      }, 1000);
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
      outerYHeightSpring.set(-3.0);
    }
  }, [states.springsActive, outerYHeightSpring]);

  const clampedDeltaRef = useRef(0);
  const timeRef = useRef(0);
  useFrame(({ camera }, delta) => {
    clampedDeltaRef.current = Math.min(delta, 0.1);
    timeRef.current += clampedDeltaRef.current;

    if (outerGroupRef.current) {
      outerGroupRef.current.position.y = outerYHeightSpring.get();
      outerGroupRef.current.lookAt(
        camera
          .getWorldDirection(new THREE.Vector3())
          .multiply(new THREE.Vector3(1, 1, 1)),
      );
    }
    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.x = Math.sin(timeRef.current / 5) * 0.05;
      innerGroupRef.current.rotation.y = innerYRotationSpring.get();
      innerGroupRef.current.rotation.z = Math.sin(timeRef.current / 3) * 0.05;
    }
  });

  return (
    <>
      <group ref={outerGroupRef}>
        <group rotation={[0, Math.PI, 0]}>
          <group ref={innerGroupRef}>
            <mesh position={[0, 0, 0.01]}>
              <planeGeometry args={[1.5, 2.25]} />
              <MeshPortalMaterial resolution={256} blend={0} blur={0}>
                <ProjectA />
              </MeshPortalMaterial>
            </mesh>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.5, 2.25]} />
              <meshBasicMaterial color="hotpink" side={THREE.BackSide} />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}
