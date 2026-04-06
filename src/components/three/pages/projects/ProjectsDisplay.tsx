import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring } from "motion/react";
import { Suspense, use, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PROJECTS } from "../../../../constants/constants";
import useAppStore from "../../../../stores/useAppStore";

function isMouse1Down(event: MouseEvent) {
  return (event.buttons & 1) === 1;
}

const videoPromiseCache = new Map<string, Promise<HTMLVideoElement>>();

function getVideoPromise(src: string): Promise<HTMLVideoElement> {
  if (!videoPromiseCache.has(src)) {
    const video = document.createElement("video");
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.appendChild(
      document.createTextNode(
        "If you're seeing this message, it means the video textures aren't working. You can check out the projects by clicking on the display, or by clicking on the links below! Sorry for the inconvenience! :(",
      ),
    );

    const promise = new Promise<HTMLVideoElement>((resolve) => {
      video.addEventListener("canplaythrough", () => resolve(video), {
        once: true,
      });
      video.src = src;
      video.load();
    });

    videoPromiseCache.set(src, promise);
  }

  return videoPromiseCache.get(src)!;
}

function VideoComponents({ currentSrc }: { currentSrc: string }) {
  const video = use(getVideoPromise(currentSrc));

  const divRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const container = divRef.current;
    container.appendChild(video);
    video.play().catch(() => {});
    return () => {
      video.pause();
      container.removeChild(video);
    };
  }, [video]);

  return <div ref={divRef} className="h-full w-full" />;
}

function VideoSuspenseComponent({ currentSrc }: { currentSrc: string }) {
  return (
    <Suspense
      fallback={
        <div className="h-full w-full bg-amber-500 text-indigo-950">
          Loading...
        </div>
      }
    >
      <VideoComponents currentSrc={currentSrc} />
    </Suspense>
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
  });
  const pointerOverRef = useRef(false);
  const pointerDownRef = useRef(false);

  const groupSpring = useSpring(states.springsActive ? 1.0 : -4.0);

  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

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

  const geometry = useMemo(() => new THREE.PlaneGeometry(1.08, 1.92), []);

  return (
    <group ref={groupRef} name="projects-display-group">
      {states.showDisplays && (
        // <mesh
        //   ref={meshRef}
        //   name="projects-display-mesh"
        //   onClick={() => {
        //     const url = PROJECTS[states.activeProjectIndex].url;
        //     window.open(url, "_blank")?.focus();
        //   }}
        // >
        //   <planeGeometry args={[1.08, 1.92]} attach="geometry" />
        //   {/* <Suspense
        //     fallback={
        //       <meshBasicMaterial
        //         map={fallbackTextures[states.activeProjectIndex]}
        //         // toneMapped={false}
        //         attach="material"
        //       />
        //     }
        //   >
        //     <VideoMaterial src={states.videoTextureSource} />
        //   </Suspense> */}
        <mesh ref={meshRef} geometry={geometry}>
          <meshBasicMaterial
            toneMapped={false}
            attach="material"
            transparent
            opacity={0}
          />

          <Html
            // occlude
            transform
            style={{
              width: "324px",
              height: "576px",
            }}
            distanceFactor={1.35}
          >
            <VideoSuspenseComponent
              key={states.activeProjectIndex}
              currentSrc={states.videoTextureSource}
            />
          </Html>
        </mesh>
      )}
    </group>
  );
}
