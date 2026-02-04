import { a, easings, useSpringValue } from "@react-spring/three";
import { Center, Plane, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { rubikMonoOneTTF, screenTransitionMs } from "../Shared/shared";
import { useBoringStore } from "../Stores/useBoringStore";
import Chair from "./Chair";
import Cubicle from "./Cubicle";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import { PottedPlant } from "./PottedPlant";

const zPositions = {
  initial: 0.09,
  atMonitor: 2.0,
};

function DeskScene(props: { active: boolean }) {
  const viewportWidth = useThree((state) => state.viewport.width);
  // const [visible, setVisible] = useState(true);
  const introTransitionState = useBoringStore(
    (state) => state.introTransitionState,
  );

  const groupZ = useSpringValue(0.09, {
    config: {
      duration: screenTransitionMs,
      easing: easings.easeInBack,
    },
  });

  useEffect(() => {
    if (introTransitionState === "entering monitor") {
      groupZ.start(zPositions.atMonitor);
    } else if (introTransitionState === "exiting monitor") {
      groupZ.start(zPositions.initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introTransitionState]);

  const backgroundColor = "#45abde";

  return (
    <a.group position-z={groupZ} position-y={props.active ? 0 : 100}>
      <group
        position={[0, 1.63, -0.42]}
        scale={[0.15 + 0.745 * Math.log(viewportWidth), 1, 1]}
      >
        <Text
          castShadow
          letterSpacing={-0.05}
          scale={[0.5, 1, 1]}
          font={rubikMonoOneTTF}
          position={[0, 2, 0]}
        >
          RESUMÉS
        </Text>
        <Text
          castShadow
          letterSpacing={-0.1}
          scale={[1.3, 1.0, 1]}
          font={rubikMonoOneTTF}
          position={[0, 1.2, 0]}
        >
          ARE
        </Text>
        <Text
          castShadow
          letterSpacing={-0.1}
          scale={[0.7, 2.0, 1]}
          font={rubikMonoOneTTF}
          position={[0, 0, 0]}
        >
          BORING
        </Text>
      </group>
      <Plane
        receiveShadow
        scale={[50, 5, 1]}
        position={[0, 2.5, -0.5]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial roughness={1} color={backgroundColor} />
      </Plane>
      <Plane receiveShadow rotation={[-Math.PI / 2, 0, 0]} scale={[50, 2, 1]}>
        <meshStandardMaterial roughness={1} color={backgroundColor} />
      </Plane>
      <Center top rotation={[0, 2.2, 0]} position={[-0.5, 0, 0.6]}>
        <Chair scale={[1.7, 1.7, 1.7]} />
      </Center>
      <Cubicle position={[0, 0, 0]} />
      <Keyboard scale={[1.6, 1.6, 1.6]} position={[-0.25, 0.7, 0.17]} />
      <Mouse scale={[1.6, 1.6, 1.6]} position={[0.4, 0.7, 0.16]} />
      <PottedPlant position={[-0.66, 0.7, -0.3]} scale={0.5} />
      {/* TODO: consider baking shadows */}
      <directionalLight
        castShadow
        position={[1, 5, 2]}
        shadow-mapSize={[256, 256]}
        shadow-camera-near={1}
        shadow-camera-far={8}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-right={5}
        shadow-camera-left={-5}
        shadow-radius={10}
      />
    </a.group>
  );
}

export default DeskScene;
