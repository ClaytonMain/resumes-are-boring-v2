import { useVideoTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useAppStore from "../stores/useAppStore";

function Project00() {
  const texture = useVideoTexture("/videos/sphericalTrochoids.mkv");
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ camera, clock }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() / 3.0) * 0.12;
      meshRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() / 3.1) * 0.12;
      meshRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() / 3.2) * 0.12;
      meshRef.current.position.y =
        Math.sin(clock.getElapsedTime() / 2.6) * 0.09;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <planeGeometry args={[1.08, 1.92]} attach="geometry" />
        <meshBasicMaterial map={texture} toneMapped={false} attach="material" />
      </mesh>
    </group>
  );
}

function Project01() {
  const texture = useVideoTexture("/videos/slimeClock.mkv");
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ camera, clock }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() / 3.0) * 0.12;
      meshRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() / 3.1) * 0.12;
      meshRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() / 3.2) * 0.12;
      meshRef.current.position.y =
        Math.sin(clock.getElapsedTime() / 2.6) * 0.09;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <planeGeometry args={[1.08, 1.92]} attach="geometry" />
        <meshBasicMaterial map={texture} toneMapped={false} attach="material" />
      </mesh>
    </group>
  );
}

function Project02() {
  const texture = useVideoTexture("/videos/symphonyOfLife.mkv");
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ camera, clock }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() / 3.0) * 0.12;
      meshRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() / 3.1) * 0.12;
      meshRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() / 3.2) * 0.12;
      meshRef.current.position.y =
        Math.sin(clock.getElapsedTime() / 2.6) * 0.09;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <planeGeometry args={[1.08, 1.92]} attach="geometry" />
        <meshBasicMaterial map={texture} toneMapped={false} attach="material" />
      </mesh>
    </group>
  );
}
function Project03() {
  const texture = useVideoTexture("/videos/r3fExperiments.mkv");
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ camera, clock }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() / 3.0) * 0.12;
      meshRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() / 3.1) * 0.12;
      meshRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() / 3.2) * 0.12;
      meshRef.current.position.y =
        Math.sin(clock.getElapsedTime() / 2.6) * 0.09;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <planeGeometry args={[1.08, 1.92]} attach="geometry" />
        <meshBasicMaterial map={texture} toneMapped={false} attach="material" />
      </mesh>
    </group>
  );
}
function Project04() {
  const texture = useVideoTexture("/videos/clockEnvy.mkv");
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ camera, clock }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(clock.getElapsedTime() / 3.0) * 0.12;
      meshRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() / 3.1) * 0.12;
      meshRef.current.rotation.z =
        Math.sin(clock.getElapsedTime() / 3.2) * 0.12;
      meshRef.current.position.y =
        Math.sin(clock.getElapsedTime() / 2.6) * 0.09;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <planeGeometry args={[1.08, 1.92]} attach="geometry" />
        <meshBasicMaterial map={texture} toneMapped={false} attach="material" />
      </mesh>
    </group>
  );
}

export default function ProjectsDisplay() {
  const [states, setStates] = useState({
    pageActive: useAppStore.getState().currentPage === "projects",
    springsActive: false,
    activeProjectIndex: useAppStore.getState().activeProjectIndex,
  });

  const project00Spring = useSpring(
    states.activeProjectIndex === 0 ? 1.0 : -4.0,
  );
  const project01Spring = useSpring(
    states.activeProjectIndex === 1 ? 1.0 : -4.0,
  );
  const project02Spring = useSpring(
    states.activeProjectIndex === 2 ? 1.0 : -4.0,
  );
  const project03Spring = useSpring(
    states.activeProjectIndex === 3 ? 1.0 : -4.0,
  );
  const project04Spring = useSpring(
    states.activeProjectIndex === 4 ? 1.0 : -4.0,
  );

  // const outerGroupRef = useRef<THREE.Group>(null!);
  const innerGroupRef = useRef<THREE.Group>(null!);
  const project00GroupRef = useRef<THREE.Group>(null!);
  const project01GroupRef = useRef<THREE.Group>(null!);
  const project02GroupRef = useRef<THREE.Group>(null!);
  const project03GroupRef = useRef<THREE.Group>(null!);
  const project04GroupRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    const unsubActiveProjectIndex = useAppStore.subscribe(
      (state) => state.activeProjectIndex,
      (value, previous) => {
        const newStates = { ...states };
        if (value === previous) return;
        project00Spring.set(-4.0);
        project01Spring.set(-4.0);
        project02Spring.set(-4.0);
        project03Spring.set(-4.0);
        project04Spring.set(-4.0);
        const timeoutId = setTimeout(() => {
          switch (value) {
            case 0:
              project00Spring.set(1.0);
              project01Spring.set(-4.0);
              project02Spring.set(-4.0);
              project03Spring.set(-4.0);
              project04Spring.set(-4.0);
              break;
            case 1:
              project00Spring.set(-4.0);
              project01Spring.set(1.0);
              project02Spring.set(-4.0);
              project03Spring.set(-4.0);
              project04Spring.set(-4.0);
              break;
            case 2:
              project00Spring.set(-4.0);
              project01Spring.set(-4.0);
              project02Spring.set(1.0);
              project03Spring.set(-4.0);
              project04Spring.set(-4.0);
              break;
            case 3:
              project00Spring.set(-4.0);
              project01Spring.set(-4.0);
              project02Spring.set(-4.0);
              project03Spring.set(1.0);
              project04Spring.set(-4.0);
              break;
            case 4:
              project00Spring.set(-4.0);
              project01Spring.set(-4.0);
              project02Spring.set(-4.0);
              project03Spring.set(-4.0);
              project04Spring.set(1.0);
              break;
          }
          newStates.activeProjectIndex = value;
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
  }, [
    project00Spring,
    project01Spring,
    project02Spring,
    project03Spring,
    project04Spring,
    states,
  ]);

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
    if (states.springsActive) {
      switch (states.activeProjectIndex) {
        case 0:
          project00Spring.set(1.0);
          break;
        case 1:
          project01Spring.set(1.0);
          break;
        case 2:
          project02Spring.set(1.0);
          break;
        case 3:
          project03Spring.set(1.0);
          break;
        case 4:
          project04Spring.set(1.0);
          break;
      }
    } else {
      project00Spring.set(-4.0);
      project01Spring.set(-4.0);
      project02Spring.set(-4.0);
      project03Spring.set(-4.0);
      project04Spring.set(-4.0);
    }
  }, [
    states.springsActive,
    states.activeProjectIndex,
    project00Spring,
    project01Spring,
    project02Spring,
    project03Spring,
    project04Spring,
  ]);

  const clampedDeltaRef = useRef(0);
  const timeRef = useRef(0);
  useFrame((_, delta) => {
    clampedDeltaRef.current = Math.min(delta, 0.1);
    timeRef.current += clampedDeltaRef.current;

    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.x = Math.sin(timeRef.current / 5) * 0.05;
      innerGroupRef.current.rotation.y = Math.sin(timeRef.current / 4) * 0.05;
      innerGroupRef.current.rotation.z = Math.sin(timeRef.current / 3) * 0.05;
    }
    if (project00GroupRef.current) {
      project00GroupRef.current.position.y = project00Spring.get();
    }
    if (project01GroupRef.current) {
      project01GroupRef.current.position.y = project01Spring.get();
    }
    if (project02GroupRef.current) {
      project02GroupRef.current.position.y = project02Spring.get();
    }
    if (project03GroupRef.current) {
      project03GroupRef.current.position.y = project03Spring.get();
    }
    if (project04GroupRef.current) {
      project04GroupRef.current.position.y = project04Spring.get();
    }
  });

  return (
    <>
      <group ref={innerGroupRef}>
        <group ref={project00GroupRef}>
          <Project00 />
        </group>
        <group ref={project01GroupRef}>
          <Project01 />
        </group>
        <group ref={project02GroupRef}>
          <Project02 />
        </group>
        <group ref={project03GroupRef}>
          <Project03 />
        </group>
        <group ref={project04GroupRef}>
          <Project04 />
        </group>
      </group>
    </>
  );
}
