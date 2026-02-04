import { Center, ContactShadows, Plane, useBounds } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useAppStore from "../../stores/useAppStore";
import type { Page } from "../../types/types";
import Chair from "./Chair";
import Cubicle from "./Cubicle";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import { PottedPlant } from "./PottedPlant";
import floorFragmentShader from "./shaders/floor/floor.frag";
import floorVertexShader from "./shaders/floor/floor.vert";

const BACKGROUND_COLOR = "#45abde";
const PAGE_NAME: Page = "enter";

export default function EnterThree() {
  const boundsGroupRef = useRef<THREE.Group>(null!);
  const bounds = useBounds();

  const uniforms = {
    color: { value: new THREE.Color(BACKGROUND_COLOR) },
  };

  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value === PAGE_NAME && previousValue !== PAGE_NAME) {
          bounds.refresh(boundsGroupRef.current).fit().clip();
        }
      },
    );
    return () => {
      unsubCurrentPage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (useAppStore.getState().currentPage === PAGE_NAME) {
      bounds.refresh(boundsGroupRef.current).fit().clip();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <group position={[0, -1, -4]}>
        <Plane
          args={[10, 10]}
          receiveShadow
          position={[0, -0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={floorVertexShader}
            fragmentShader={floorFragmentShader}
          />
        </Plane>
        <group ref={boundsGroupRef}>
          <Center top rotation={[0, 2.2, 0]} position={[-0.5, 0, 0.6]}>
            <Chair scale={[1.7, 1.7, 1.7]} />
          </Center>
          <Cubicle position={[0, 0, 0]} />
          <Keyboard scale={[1.6, 1.6, 1.6]} position={[-0.25, 0.7, 0.17]} />
          <Mouse scale={[1.6, 1.6, 1.6]} position={[0.4, 0.7, 0.16]} />
          <PottedPlant position={[-0.66, 0.7, -0.3]} scale={0.5} />
        </group>
        {/* TODO: consider baking shadows */}
        <directionalLight
          // castShadow
          position={[1, 5, 5]}
          shadow-mapSize={[256, 256]}
          shadow-camera-near={1}
          shadow-camera-far={8}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-camera-right={5}
          shadow-camera-left={-5}
          shadow-radius={2}
        />
      </group>
      <ContactShadows
        position={[0, -1.0, 0]}
        opacity={0.45}
        scale={15}
        blur={0.3}
        far={15}
      />
      <ambientLight intensity={0.4} />
    </>
  );
}
