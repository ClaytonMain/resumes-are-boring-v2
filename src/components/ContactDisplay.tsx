import {
  Box,
  Cylinder,
  Environment,
  Fbo,
  useEnvironment,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PAGE_BLOCK_COLORS } from "../constants/constants";
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

  console.log("test");

  const clampedDeltaRef = useRef(0);
  const timeRef = useRef(0);
  useFrame(({ camera }, delta) => {
    clampedDeltaRef.current = Math.min(delta, 0.1);
    timeRef.current += clampedDeltaRef.current;

    raycaster.setFromCamera(pointer, camera);
    if (githubLogoGroupRef.current) {
      const currentPointerOverGithub =
        raycaster.intersectObject(githubLogoGroupRef.current).length > 0;
      if (currentPointerOverGithub !== pointerOverGithubRef.current) {
        pointerOverGithubRef.current = currentPointerOverGithub;
        if (currentPointerOverGithub) {
          document.body.style.cursor = "pointer";
        } else {
          document.body.style.cursor = "default";
        }
      }
    }

    if (linkedinLogoGroupRef.current) {
      const currentPointerOverLinkedin =
        raycaster.intersectObject(linkedinLogoGroupRef.current).length > 0;
      if (currentPointerOverLinkedin !== pointerOverLinkedinRef.current) {
        pointerOverLinkedinRef.current = currentPointerOverLinkedin;
        if (currentPointerOverLinkedin) {
          document.body.style.cursor = "pointer";
        } else {
          document.body.style.cursor = "default";
        }
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
          1 *
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
          1 * (pointerOverLinkedinRef.current ? 1.05 : 1.0),
          0.1,
        ),
      );
    }
  });

  // Plan:
  //  - Load `/textures/citrus_orchard_road_puresky_1k.hdr`
  //  - Use as background in a scene rendered separately from the main scene
  //  - Load in a plane that's the same color as the floor blocks for this page
  //    - Use same material properties as the floor blocks
  //  - Plane will be positioned at the same height as the floor.
  //  - Plane will extend to horizon (or at least really far)
  //  - Render scene for single frame (using primary scene lighting).
  //  - Use texture from rendered scene as env map for logos.
  const renderTargetRef = useRef<THREE.WebGLRenderTarget>(null!);

  return (
    <>
      <Fbo ref={renderTargetRef} width={512} height={512}>
        {(fbo) => {
          const cubeCamera = new THREE.CubeCamera(0.1, 100, 512);
          return (
            <Environment
              files="/textures/citrus_orchard_road_puresky_1k.hdr"
              background={true}
              near={0.1}
              far={100}
              resolution={64}
              frames={1}
            >
              <mesh position={[0, -2, 0]}>
                <boxGeometry args={[100, 1, 100]} />
                <meshBasicMaterial color={PAGE_BLOCK_COLORS["contact"]} />
              </mesh>
            </Environment>
          );
        }}
      </Fbo>
      <group ref={groupRef}>
        {states.showLinks && (
          <>
            <group
              ref={githubLogoGroupRef}
              renderOrder={1}
              position={[-0.5, 1, 0]}
              onClick={() => {
                window
                  .open("https://github.com/ClaytonMain", "_blank")
                  ?.focus();
              }}
            >
              <GithubLogo material={material} />
              <Cylinder
                args={[0.33, 0.33, 0.15, 16]}
                position={[0, 0.06, 0]}
                visible={debug}
              >
                <meshStandardMaterial wireframe />
              </Cylinder>
            </group>
            <group
              ref={linkedinLogoGroupRef}
              renderOrder={1}
              position={[0.5, 1, 0]}
              onClick={() => {
                window
                  .open("https://www.linkedin.com/in/clayton-main/", "_blank")
                  ?.focus();
              }}
            >
              <LinkedinLogo material={material} />
              <Box
                args={[0.66, 0.66, 0.15]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0.06, 0]}
                visible={debug}
              >
                <meshStandardMaterial wireframe />
              </Box>
            </group>
          </>
        )}
      </group>
    </>
  );
}
