import {
  Center,
  ContactShadows,
  Plane,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useAppStore from "../../stores/useAppStore";
import type { Page } from "../../types/types";
import Chair from "./Chair";
import Cubicle from "./Cubicle";
import Keyboard from "./Keyboard";
import Monitor from "./Monitor";
import Mouse from "./Mouse";
import { PottedPlant } from "./PottedPlant";
import floorFragmentShader from "./shaders/floor/floor.frag";
import floorVertexShader from "./shaders/floor/floor.vert";
import { DEFAULT_CAMERA_FOV, DEFAULT_CAMERA_LOOK_AT, DEFAULT_CAMERA_POSITION } from "../../constants/constants";

const PAGE_NAME: Page = "enter";

export default function EnterThree() {
  // const debug = useAppStore((state) => state.debug);
  const targetRef = useRef<THREE.Mesh>(null!);

  const uniforms = {
    uColor: { value: new THREE.Color("#93a1ab") },
  };

  function requestCameraUpdate(
    position: THREE.Vector3 = DEFAULT_CAMERA_POSITION.clone(),
    lookAt: THREE.Vector3 = DEFAULT_CAMERA_LOOK_AT.clone(),
    fov: number = DEFAULT_CAMERA_FOV,
  ) {
    useAppStore.setState({
      cameraPositionTarget: position,
      cameraLookAtTarget: lookAt,
      cameraFovTarget: fov,
      cameraPositionUpdateRequestedAt: Date.now(),
      cameraLookAtUpdateRequestedAt: Date.now(),
      cameraFovUpdateRequestedAt: Date.now(),
     });
  }

  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value === PAGE_NAME && previousValue !== PAGE_NAME) {
          requestCameraUpdate();
        }
      },
    );
    return () => {
      unsubCurrentPage();
    };
  }, []);

  useEffect(() => {
    if (useAppStore.getState().currentPage === PAGE_NAME) {
      requestCameraUpdate();
    }
  }, []);

  useEffect(() => {
    const unsubEnterState = useAppStore.subscribe(
      (state) => state.enterState,
      (value, previousValue) => {
        if (value === "prepareToApproachMonitor" && previousValue === "idleBoring") {
          requestCameraUpdate(
            new THREE.Vector3(0, 1.5, 2.5),
            new THREE.Vector3(0, 1, 0),
            35,
          );
        } else if (value === "approachMonitor" && previousValue === "prepareToApproachMonitor") {

  return (
    <>
      <group position={[0, 0, 0]}>
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
            transparent
          />
        </Plane>
        <group>
          <Center top rotation={[0, 2.2, 0]} position={[-0.5, 0, 0.6]}>
            <Chair scale={[1.7, 1.7, 1.7]} />
          </Center>
          <Cubicle position={[0, 0, 0]} />
          <Keyboard
            scale={[1.6, 1.6, 1.6]}
            position={[-0.25, 0.71, 0.17]}
            rotation={[0, -0.02, 0]}
          />
          <Mouse scale={[1.6, 1.6, 1.6]} position={[0.4, 0.7, 0.16]} />
          <PottedPlant position={[0.66, 0.7, -0.28]} scale={0.55} />
          <Center position={[0, 0.92, -0.15]} rotation={[0, 0.03, 0]}>
            <Monitor scale={1.5} targetRef={targetRef} />
          </Center>
        </group>
        {/* TODO: consider baking shadows */}
        <directionalLight
          // castShadow
          position={[1, 5, 5]}
          // shadow-mapSize={[256, 256]}
          // shadow-camera-near={1}
          // shadow-camera-far={8}
          // shadow-camera-top={5}
          // shadow-camera-bottom={-5}
          // shadow-camera-right={5}
          // shadow-camera-left={-5}
          // shadow-radius={2}
        />
      </group>
      <ContactShadows
        frames={1}
        position={[0, 0, 0]}
        opacity={0.45}
        scale={15}
        blur={0.3}
        far={15}
      />
      <ambientLight intensity={0.3} />
    </>
  );
}
