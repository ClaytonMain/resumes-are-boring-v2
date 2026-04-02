import { useTexture, useVideoTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring } from "motion/react";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PROJECTS } from "../../../../constants/constants";
import useAppStore from "../../../../stores/useAppStore";

function isMouse1Down(event: MouseEvent) {
  return (event.buttons & 1) === 1;
}

// export default function ProjectsDisplay() {
//   const [states, setStates] = useState({
//     pageActive: useAppStore.getState().currentPage === "projects",
//     springsActive: false,
//     activeProjectIndex: useAppStore.getState().activeProjectIndex,
//     showDisplays: useAppStore.getState().currentPage === "projects",
//   });
//   const pointerOverRef = useRef(false);
//   const pointerDownRef = useRef(false);

//   const project00Texture = useVideoTexture("/videos/sphericalTrochoids.mp4", {
//     playsInline: true,
//   });
//   const project01Texture = useVideoTexture("/videos/slimeClock.mp4", {
//     playsInline: true,
//   });
//   const project02Texture = useVideoTexture("/videos/symphonyOfLife.mp4", {
//     playsInline: true,
//   });
//   const project03Texture = useVideoTexture("/videos/r3fExperiments.mp4", {
//     playsInline: true,
//   });
//   const project04Texture = useVideoTexture("/videos/clockEnvy.mp4", {
//     playsInline: true,
//   });

//   const projectTextures = useMemo(
//     () => [
//       project00Texture,
//       project01Texture,
//       project02Texture,
//       project03Texture,
//       project04Texture,
//     ],
//     [
//       project00Texture,
//       project01Texture,
//       project02Texture,
//       project03Texture,
//       project04Texture,
//     ],
//   );

//   const groupSpring = useSpring(states.springsActive ? 1.0 : -4.0);

//   const groupRef = useRef<THREE.Group>(null!);
//   const meshRef = useRef<THREE.Mesh>(null!);
//   const materialRef = useRef<THREE.MeshBasicMaterial>(null!);

//   useEffect(() => {
//     const unsubActiveProjectIndex = useAppStore.subscribe(
//       (state) => state.activeProjectIndex,
//       (value, previous) => {
//         const newStates = { ...states };
//         if (value === previous) return;
//         groupSpring.set(-4.0);
//         const timeoutId = setTimeout(() => {
//           groupSpring.set(1.0);
//           newStates.activeProjectIndex = value;
//           setStates(newStates);
//         }, 500);
//         return () => clearTimeout(timeoutId);
//       },
//     );

//     const unsubCurrentPage = useAppStore.subscribe(
//       (state) => state.currentPage,
//       (value, previous) => {
//         if (value === previous) return;
//         const newStates = { ...states };
//         if (value === "projects") {
//           newStates.pageActive = true;
//         } else {
//           newStates.pageActive = false;
//           newStates.springsActive = false;
//         }
//         setStates(newStates);
//       },
//     );

//     return () => {
//       unsubActiveProjectIndex();
//       unsubCurrentPage();
//     };
//   }, [
//     groupSpring,
//     project00Texture,
//     project01Texture,
//     project02Texture,
//     project03Texture,
//     project04Texture,
//     states,
//   ]);

//   useEffect(() => {
//     if (states.pageActive) {
//       const timeoutId = setTimeout(() => {
//         setStates((prev) => ({ ...prev, springsActive: true }));
//       }, 1000);
//       return () => clearTimeout(timeoutId);
//     } else {
//       setStates((prev) => ({ ...prev, springsActive: false }));
//     }
//   }, [states.pageActive]);

//   useEffect(() => {
//     if (states.springsActive) {
//       groupSpring.set(1.0);
//       setStates((prev) => ({ ...prev, showDisplays: true }));
//     } else {
//       groupSpring.set(-4.0);
//       const timeoutId = setTimeout(() => {
//         setStates((prev) => ({ ...prev, showDisplays: false }));
//       }, 500);
//       return () => clearTimeout(timeoutId);
//     }
//   }, [groupSpring, states.springsActive]);

//   useEffect(() => {
//     function handleMouseMove(event: MouseEvent) {
//       if (isMouse1Down(event) !== pointerDownRef.current) {
//         pointerDownRef.current = isMouse1Down(event);
//       }
//     }
//     function handleMouseDown(event: MouseEvent) {
//       if (isMouse1Down(event) !== pointerDownRef.current) {
//         pointerDownRef.current = isMouse1Down(event);
//       }
//     }
//     function handleMouseUp(event: MouseEvent) {
//       if (isMouse1Down(event) !== pointerDownRef.current) {
//         pointerDownRef.current = isMouse1Down(event);
//       }
//     }
//     window.addEventListener("mousedown", handleMouseDown);
//     window.addEventListener("mouseup", handleMouseUp);
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mousedown", handleMouseDown);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, []);

//   const pointer = useThree((state) => state.pointer);
//   const raycaster = new THREE.Raycaster();

//   const clampedDeltaRef = useRef(0);
//   const timeRef = useRef(0);
//   useFrame(({ camera }, delta) => {
//     clampedDeltaRef.current = Math.min(delta, 0.1);
//     timeRef.current += clampedDeltaRef.current;

//     raycaster.setFromCamera(pointer, camera);
//     const currentPointerOver =
//       raycaster.intersectObject(groupRef.current).length > 0;
//     if (currentPointerOver !== pointerOverRef.current) {
//       pointerOverRef.current = currentPointerOver;
//       if (currentPointerOver) {
//         document.body.style.cursor = "pointer";
//       } else {
//         document.body.style.cursor = "default";
//       }
//     }

//     if (groupRef.current) {
//       groupRef.current.lookAt(camera.position);
//       groupRef.current.position.y = groupSpring.get();
//     }
//     if (meshRef.current) {
//       meshRef.current.rotation.x = Math.sin(timeRef.current / 3.0) * 0.12;
//       meshRef.current.rotation.y = Math.sin(timeRef.current / 3.1) * 0.12;
//       meshRef.current.rotation.z = Math.sin(timeRef.current / 3.2) * 0.12;
//       meshRef.current.position.y = Math.sin(timeRef.current / 2.6) * 0.09;

//       meshRef.current.scale.setScalar(
//         THREE.MathUtils.lerp(
//           meshRef.current.scale.x,
//           1.0 *
//             (pointerOverRef.current ? 1.05 : 1.0) *
//             (pointerOverRef.current && pointerDownRef.current ? 0.9 : 1.0),
//           clampedDeltaRef.current * 5,
//         ),
//       );
//     }
//   });

//   return (
//     <group ref={groupRef} name="projects-display-group">
//       {states.showDisplays && (
//         <mesh
//           ref={meshRef}
//           name="projects-display-mesh"
//           onClick={() => {
//             const url = PROJECTS[states.activeProjectIndex].url;
//             window.open(url, "_blank")?.focus();
//           }}
//         >
//           <planeGeometry args={[1.08, 1.92]} attach="geometry" />
//           <meshBasicMaterial
//             ref={materialRef}
//             map={projectTextures[states.activeProjectIndex]}
//             toneMapped={false}
//             attach="material"
//           />
//         </mesh>
//       )}
//     </group>
//   );
// }

function FallbackTexture({ src }: { src: string }) {
  const texture = useTexture(src);
  return (
    <meshBasicMaterial map={texture} toneMapped={false} attach="material" />
  );
}

function VideoMaterial({ src }: { src: string }) {
  const texture = useVideoTexture(src, { playsInline: true });
  return (
    <meshBasicMaterial map={texture} toneMapped={false} attach="material" />
  );
}

export default function ProjectsDisplay() {
  const [states, setStates] = useState({
    pageActive: useAppStore.getState().currentPage === "projects",
    springsActive: false,
    activeProjectIndex: useAppStore.getState().activeProjectIndex,
    showDisplays: useAppStore.getState().currentPage === "projects",
    videoTextureSource:
      PROJECTS[useAppStore.getState().activeProjectIndex].videoSrc,
    fallbackImageSource:
      PROJECTS[useAppStore.getState().activeProjectIndex].fallbackImageSrc,
  });
  const pointerOverRef = useRef(false);
  const pointerDownRef = useRef(false);

  // const project00Texture = useVideoTexture("/videos/sphericalTrochoids.mp4", {
  //   playsInline: true,
  // });
  // const project01Texture = useVideoTexture("/videos/slimeClock.mp4", {
  //   playsInline: true,
  // });
  // const project02Texture = useVideoTexture("/videos/symphonyOfLife.mp4", {
  //   playsInline: true,
  // });
  // const project03Texture = useVideoTexture("/videos/r3fExperiments.mp4", {
  //   playsInline: true,
  // });
  // const project04Texture = useVideoTexture("/videos/clockEnvy.mp4", {
  //   playsInline: true,
  // });

  // const projectTextures = useMemo(
  //   () => [
  //     project00Texture,
  //     project01Texture,
  //     project02Texture,
  //     project03Texture,
  //     project04Texture,
  //   ],
  //   [
  //     project00Texture,
  //     project01Texture,
  //     project02Texture,
  //     project03Texture,
  //     project04Texture,
  //   ],
  // );

  const groupSpring = useSpring(states.springsActive ? 1.0 : -4.0);

  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  // const materialRef = useRef<THREE.MeshBasicMaterial>(null!);

  useEffect(() => {
    const unsubActiveProjectIndex = useAppStore.subscribe(
      (state) => state.activeProjectIndex,
      (value, previous) => {
        const newStates = { ...states };
        if (value === previous) return;
        groupSpring.set(-4.0);
        const timeoutId = setTimeout(() => {
          groupSpring.set(1.0);
          newStates.activeProjectIndex = value;
          newStates.videoTextureSource = PROJECTS[value].videoSrc;
          newStates.fallbackImageSource = PROJECTS[value].fallbackImageSrc;
          setStates(newStates);
        }, 500);
        return () => clearTimeout(timeoutId);
      },
    );

    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previous) => {
        if (value === previous) return;
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
  }, [groupSpring, states]);

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
      groupSpring.set(1.0);
      setStates((prev) => ({ ...prev, showDisplays: true }));
    } else {
      groupSpring.set(-4.0);
      const timeoutId = setTimeout(() => {
        setStates((prev) => ({ ...prev, showDisplays: false }));
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

  const pointer = useThree((state) => state.pointer);
  const raycaster = new THREE.Raycaster();

  const clampedDeltaRef = useRef(0);
  const timeRef = useRef(0);
  useFrame(({ camera }, delta) => {
    clampedDeltaRef.current = Math.min(delta, 0.1);
    timeRef.current += clampedDeltaRef.current;

    raycaster.setFromCamera(pointer, camera);
    const currentPointerOver =
      raycaster.intersectObject(groupRef.current).length > 0;
    if (currentPointerOver !== pointerOverRef.current) {
      pointerOverRef.current = currentPointerOver;
      if (currentPointerOver) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    }

    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
      groupRef.current.position.y = groupSpring.get();
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(timeRef.current / 3.0) * 0.12;
      meshRef.current.rotation.y = Math.sin(timeRef.current / 3.1) * 0.12;
      meshRef.current.rotation.z = Math.sin(timeRef.current / 3.2) * 0.12;
      meshRef.current.position.y = Math.sin(timeRef.current / 2.6) * 0.09;

      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          1.0 *
            (pointerOverRef.current ? 1.05 : 1.0) *
            (pointerOverRef.current && pointerDownRef.current ? 0.9 : 1.0),
          clampedDeltaRef.current * 5,
        ),
      );
    }
  });

  return (
    <group ref={groupRef} name="projects-display-group">
      {states.showDisplays && (
        <mesh
          ref={meshRef}
          name="projects-display-mesh"
          onClick={() => {
            const url = PROJECTS[states.activeProjectIndex].url;
            window.open(url, "_blank")?.focus();
          }}
        >
          <planeGeometry args={[1.08, 1.92]} attach="geometry" />
          <Suspense fallback={null}>
            <Suspense
              fallback={<FallbackTexture src={states.fallbackImageSource} />}
            >
              <VideoMaterial src={states.videoTextureSource} />
            </Suspense>
          </Suspense>
        </mesh>
      )}
    </group>
  );
}
