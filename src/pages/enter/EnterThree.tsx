import { Bounds, Center, Plane } from "@react-three/drei";
import Chair from "./Chair";
import Cubicle from "./Cubicle";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import { PottedPlant } from "./PottedPlant";

export default function EnterThree() {
  const backgroundColor = "#45abde";
  return (
    <>
      <group position={[0, -1, -4]}>
        <Plane args={[50, 50]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial roughness={1} color={backgroundColor} />
        </Plane>
        <Bounds fit clip observe>
          <Center top rotation={[0, 2.2, 0]} position={[-0.5, 0, 0.6]}>
            <Chair scale={[1.7, 1.7, 1.7]} />
          </Center>
          <Cubicle position={[0, 0, 0]} />
          <Keyboard scale={[1.6, 1.6, 1.6]} position={[-0.25, 0.7, 0.17]} />
          <Mouse scale={[1.6, 1.6, 1.6]} position={[0.4, 0.7, 0.16]} />
          <PottedPlant position={[-0.66, 0.7, -0.3]} scale={0.5} />
          {/* TODO: consider baking shadows */}
        </Bounds>
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
    </>
  );
}
