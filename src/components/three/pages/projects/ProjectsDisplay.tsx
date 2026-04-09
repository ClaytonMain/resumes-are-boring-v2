import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { motion, useSpring } from "motion/react";
import { Suspense, use, useEffect, useRef, useState } from "react";
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
    video.disablePictureInPicture = true;
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

function VideoComponent({ currentSrc }: { currentSrc: string }) {
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

  return (
    <div className="h-full w-full overflow-hidden rounded-lg">
      <div className="absolute top-0 left-0 z-0 flex h-full w-full animate-pulse items-center justify-center bg-gray-500 text-center font-bold text-white opacity-40">
        Loading...
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        ref={divRef}
        className="absolute top-0 left-0 z-2 h-full w-full"
      />
    </div>
  );
}

function VideoSuspenseComponent({ currentSrc }: { currentSrc: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full animate-pulse items-center justify-center bg-gray-500 text-center font-bold text-white opacity-40">
          Loading...
        </div>
      }
    >
      <VideoComponent currentSrc={currentSrc} />
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
  const displayGroupRef = useRef<THREE.Group>(null!);

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

  const clampedDeltaRef = useRef(0);
  const timeRef = useRef(0);
  useFrame(({ camera }, delta) => {
    clampedDeltaRef.current = Math.min(delta, 0.1);
    timeRef.current += clampedDeltaRef.current;

    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
      groupRef.current.position.y = groupSpring.get();
    }
    if (displayGroupRef.current) {
      displayGroupRef.current.rotation.x =
        Math.sin(timeRef.current / 3.0) * 0.12;
      displayGroupRef.current.rotation.y =
        Math.sin(timeRef.current / 3.1) * 0.12;
      displayGroupRef.current.rotation.z =
        Math.sin(timeRef.current / 3.2) * 0.12;
      displayGroupRef.current.position.y =
        Math.sin(timeRef.current / 2.6) * 0.09;

      displayGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(
          displayGroupRef.current.scale.x,
          1.0 *
            (pointerOverRef.current ? 1.05 : 1.0) *
            (pointerOverRef.current && pointerDownRef.current ? 0.9 : 1.0),
          clampedDeltaRef.current * 5,
        ),
      );
    }
  });

  // const geometry = useMemo(() => new THREE.PlaneGeometry(1.08, 1.92), []);

  return (
    <group ref={groupRef} name="projects-display-group">
      {states.showDisplays && (
        <group ref={displayGroupRef} name="display-group">
          {/* <mesh ref={meshRef} geometry={geometry}>
           <meshBasicMaterial
             toneMapped={false}
             attach="material"
             transparent
             opacity={0}
           /> */}

          <Html
            // occlude
            transform
            style={{
              width: "324px",
              height: "576px",
            }}
            distanceFactor={1.35}
          >
            <motion.a
              href={PROJECTS[states.activeProjectIndex].url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-full w-full"
              onPointerEnter={() => (pointerOverRef.current = true)}
              onPointerLeave={() => (pointerOverRef.current = false)}
              onPointerDown={() => (pointerDownRef.current = true)}
              onPointerUp={() => (pointerDownRef.current = false)}
            >
              <VideoSuspenseComponent
                key={states.activeProjectIndex}
                currentSrc={states.videoTextureSource}
              />
            </motion.a>
          </Html>
          {/* </mesh> */}
        </group>
      )}
    </group>
  );
}
