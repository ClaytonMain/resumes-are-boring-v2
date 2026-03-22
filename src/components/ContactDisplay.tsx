import { Cylinder } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import useAppStore from "../stores/useAppStore";
import { GithubLogo } from "./GithubLogo";
import { LinkedinLogo } from "./LinkedinLogo";

function isMouse1Down(event: MouseEvent) {
  return (event.buttons & 1) === 1;
}

export default function ContactDisplay() {
  const debug = useAppStore.getState().debug;
  const [states, setStates] = useState({
    pageActive: useAppStore.getState().currentPage === "contact",
    springsActive: false,
    showLinks: useAppStore.getState().currentPage === "contact",
  });

  const pointerOverGithubRef = useRef(false);
  const pointerOverLinkedinRef = useRef(false);
  const pointerDownRef = useRef(false);

  const groupRef = useRef<THREE.Group>(null!);

  const githubLogoGroupRef = useRef<THREE.Group>(null!);
  const linkedinLogoGroupRef = useRef<THREE.Group>(null!);

  const offsets = useMemo(() => {
    const offsets = [];
    for (let i = 0; i < 4 * 2; i++) {
      offsets.push(
        (Math.random() * 0.5 + 0.5) * Math.sign(Math.random() - 0.5),
      );
    }
    return offsets;
  }, []);

  const groupSpring = useSpring(states.springsActive ? 0 : 5.0, {
    damping: 12,
  });

  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previous) => {
        if (value === previous) return;
        const newStates = { ...states };
        if (value === "contact") {
          newStates.pageActive = true;
        } else {
          newStates.pageActive = false;
          newStates.springsActive = false;
        }
        setStates(newStates);
      },
    );
    return () => {
      unsubCurrentPage();
    };
  }, [states]);

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
      groupSpring.set(0);
      setStates((prev) => ({ ...prev, showLinks: true }));
    } else {
      groupSpring.set(5.0);
      const timeoutId = setTimeout(() => {
        setStates((prev) => ({ ...prev, showLinks: false }));
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [groupSpring, states.springsActive]);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      if (isMouse1Down(event) !== pointerDownRef.current) {
        pointerDownRef.current = isMouse1Down(event);
      }
    }
    function handleMouseDown(event: MouseEvent) {
      if (isMouse1Down(event) !== pointerDownRef.current) {
        pointerDownRef.current = isMouse1Down(event);
      }
    }
    function handleMouseUp(event: MouseEvent) {
      if (isMouse1Down(event) !== pointerDownRef.current) {
        pointerDownRef.current = isMouse1Down(event);
      }
    }
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const controls = useControls({
    color: "#efeaf2",
    metalness: { value: 0.32, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.05, min: 0, max: 1, step: 0.01 },
  });

  const material = new THREE.MeshStandardMaterial({
    color: controls.color,
    metalness: controls.metalness,
    roughness: controls.roughness,
  });

  const pointer = useThree((state) => state.pointer);
  const raycaster = new THREE.Raycaster();

  const clampedDeltaRef = useRef(0);
  const timeRef = useRef(0);
  useFrame(({ camera }, delta) => {
    clampedDeltaRef.current = Math.min(delta, 0.1);
    timeRef.current += clampedDeltaRef.current;

    raycaster.setFromCamera(pointer, camera);
    const currentPointerOverGithub =
      raycaster.intersectObject(githubLogoGroupRef.current).length > 0;
    const currentPointerOverLinkedin =
      raycaster.intersectObject(linkedinLogoGroupRef.current).length > 0;
    if (currentPointerOverGithub !== pointerOverGithubRef.current) {
      pointerOverGithubRef.current = currentPointerOverGithub;
      if (currentPointerOverGithub) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    }
    if (currentPointerOverLinkedin !== pointerOverLinkedinRef.current) {
      pointerOverLinkedinRef.current = currentPointerOverLinkedin;
      if (currentPointerOverLinkedin) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    }

    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
      groupRef.current.position.y = groupSpring.get();
    }

    if (githubLogoGroupRef.current) {
      githubLogoGroupRef.current.rotation.x =
        Math.PI / 2 + Math.sin((timeRef.current * offsets[0]) / 3.0) * 0.12;
      githubLogoGroupRef.current.rotation.y =
        Math.sin((timeRef.current * offsets[1]) / 3.1) * 0.12;
      githubLogoGroupRef.current.rotation.z =
        Math.sin((timeRef.current * offsets[2]) / 3.2) * 0.12;
      githubLogoGroupRef.current.position.y =
        1.1 + Math.sin((timeRef.current * offsets[3]) / 3.0) * 0.15;

      githubLogoGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(
          githubLogoGroupRef.current.scale.x,
          0.125 *
            (pointerOverGithubRef.current ? 1.05 : 1.0) *
            (pointerOverGithubRef.current && pointerDownRef.current
              ? 0.9
              : 1.0),
          clampedDeltaRef.current * 5,
        ),
      );
    }
    if (linkedinLogoGroupRef.current) {
      linkedinLogoGroupRef.current.rotation.x =
        Math.PI / 2 + Math.sin((timeRef.current * offsets[4]) / 3.0) * 0.12;
      linkedinLogoGroupRef.current.rotation.y =
        Math.sin((timeRef.current * offsets[5]) / 3.1) * 0.12;
      linkedinLogoGroupRef.current.rotation.z =
        Math.sin((timeRef.current * offsets[6]) / 3.2) * 0.12;
      linkedinLogoGroupRef.current.position.y =
        1.1 + Math.sin((timeRef.current * offsets[7]) / 3.0) * 0.15;

      linkedinLogoGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(
          linkedinLogoGroupRef.current.scale.x,
          0.125 * (pointerOverLinkedinRef.current ? 1.05 : 1.0),
          0.1,
        ),
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* <GithubLogo
        ref={githubLogoGroupRef}
        material={material}
        position={[-0.6, 1, 0]}
        scale={0.125}
        renderOrder={1}
        onClick={() => {
          window.open("https://github.com/ClaytonMain", "_blank")?.focus();
        }}
      >
        <Cylinder
          args={[0.5, 0.5, 0.1, 32]}
          position={[0, 0, -0.05]}
          visible={debug}
        >
          <meshStandardMaterial wireframe />
        </Cylinder>
      </GithubLogo> */}
      {/* <LinkedinLogo
        ref={linkedinLogoGroupRef}
        material={material}
        position={[0.6, 1, 0]}
        scale={0.125}
        renderOrder={1}
        onClick={() => {
          window
            .open("https://www.linkedin.com/in/clayton-main/", "_blank")
            ?.focus();
        }}
      /> */}
    </group>
  );
}
