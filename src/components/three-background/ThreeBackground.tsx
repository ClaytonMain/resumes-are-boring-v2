import {
  Bounds,
  Box,
  createInstances,
  InstancedAttribute,
  Plane,
  useFBO,
} from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import useAppStore from "../../stores/useAppStore";
import gridBlockFragmentShader from "./shaders/grid-block/gridBlock.frag";
import gridBlockVertexShader from "./shaders/grid-block/gridBlock.vert";
import pointerIntersectFragmentShader from "./shaders/pointer-intersect/pointerIntersect.frag";
import pointerIntersectVertexShader from "./shaders/pointer-intersect/pointerIntersect.vert";
import ThreeBackgroundReadyComponent from "./ThreeBackgroundReadyComponent";

// ********
// Hexagons
// ********

// Without rotating the hexagons, the default orientation of the cylinderGeometry
// has us using the "pointy" orientation described here:
// https://www.redblobgames.com/grids/hexagons/#spacing

// The size of the grid along the x axis in world units.
const GRID_X_SIZE = 15;
// How many hexagons along the x and z axes.
const GRID_DIVISIONS = 80;
const GRID_BLOCK_HEIGHT = 1;
const BLOCK_SCALE_FACTOR = 1.0;

const HEXAGON_X_SPACING = GRID_X_SIZE / GRID_DIVISIONS;
// The radius of the hexagon from its center to any vertex.
const HEXAGON_POINT_RADIUS =
  (HEXAGON_X_SPACING / Math.sqrt(3)) * BLOCK_SCALE_FACTOR;
const HEXAGON_Z_SPACING = (HEXAGON_POINT_RADIUS / BLOCK_SCALE_FACTOR) * 1.5;
const GRID_Z_SIZE = GRID_DIVISIONS * HEXAGON_Z_SPACING;

const MAX_RADII_COUNT = 10;

interface GridBlockInstanceAttributes {
  aDistPctFromCenter: number; // 0.0 at center, 1.0 at farthest point
  aPointerTrailUv: THREE.Vector2;
  aRandomNumber: number;
}

const [GridBlockInstances, GridBlockInstance] =
  createInstances<GridBlockInstanceAttributes>();

function GridBlock({
  position,
  aRandomNumber,
}: {
  position: THREE.Vector3;
  aRandomNumber: number;
}) {
  const uvX = (position.x + GRID_X_SIZE / 2) / GRID_X_SIZE;
  const uvZ = (-position.z + GRID_X_SIZE / 2) / GRID_X_SIZE;
  const uv = new THREE.Vector2(uvX, uvZ);
  return (
    <GridBlockInstance
      position={position}
      aDistPctFromCenter={uv
        .clone()
        .sub(new THREE.Vector2(0.5, 0.5))
        .multiplyScalar(2 / Math.sqrt(2))
        .length()}
      aPointerTrailUv={uv}
      aRandomNumber={aRandomNumber}
    />
  );
}

// ***********************
// Pointer Intersect Plane
// ***********************
const POINTER_INTERSECT_PIXELS = 256;
function getPointerIntersectDataTextureData() {
  const data = new Float32Array(
    POINTER_INTERSECT_PIXELS * POINTER_INTERSECT_PIXELS * 4,
  );
  for (
    let i = 0;
    i < POINTER_INTERSECT_PIXELS * POINTER_INTERSECT_PIXELS;
    i++
  ) {
    const i4 = i * 4;
    data[i4 + 0] = 0.0;
    data[i4 + 1] = 0.0;
    data[i4 + 2] = 0.0;
    data[i4 + 3] = 1.0;
  }
  return data;
}
function getPointerIntersectDataTexture() {
  const data = getPointerIntersectDataTextureData();
  const texture = new THREE.DataTexture(
    data,
    POINTER_INTERSECT_PIXELS,
    POINTER_INTERSECT_PIXELS,
    THREE.RGBAFormat,
    THREE.FloatType,
  );
  texture.needsUpdate = true;
  return texture;
}

// *****
// Final
// *****
export default function ThreeBackground() {
  const debug = useAppStore((state) => state.debug);

  // ***********
  // Grid Blocks
  // ***********
  const gridBlockUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uPointerTrailTexture: { value: new THREE.DataTexture() },
      uVisibilityPct: { value: 0 },
      uActiveRadii: { value: 2 },
      uRadiiPcts: { value: [1, 1] },
      uRadiiColors: {
        value: [new THREE.Color("#000"), new THREE.Color("#000")],
      },
      uRadiiPatterns: { value: [0, 0] },
    };
  }, []);
  const gridBlockRandomNumbers = useMemo(() => {
    const numbers = new Float32Array(GRID_DIVISIONS * GRID_DIVISIONS);
    for (let i = 0; i < GRID_DIVISIONS * GRID_DIVISIONS; i++) {
      // eslint-disable-next-line react-hooks/purity
      numbers[i] = Math.random();
    }
    return numbers;
  }, []);

  // ***********************
  // Pointer intersect plane
  // ***********************
  const pointerIntersectMaterialRef00 = useRef<THREE.ShaderMaterial>(null!);
  const pointerIntersectMaterialRef01 = useRef<THREE.ShaderMaterial>(null!);
  const pointerIntersectPlaneRef = useRef<THREE.Mesh>(null!);
  const pointerIntersectScene00 = useMemo(() => new THREE.Scene(), []);
  const pointerIntersectScene01 = useMemo(() => new THREE.Scene(), []);
  const pointerIntersectCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1),
    [],
  );
  const initialPointerIntersectTexture = getPointerIntersectDataTexture();
  const pointerIntersectRenderTarget00 = useFBO(
    POINTER_INTERSECT_PIXELS,
    POINTER_INTERSECT_PIXELS,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false,
      type: THREE.FloatType,
    },
  );
  const pointerIntersectRenderTarget01 = useFBO(
    POINTER_INTERSECT_PIXELS,
    POINTER_INTERSECT_PIXELS,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false,
      type: THREE.FloatType,
    },
  );
  const pointerIntersectUniforms = useMemo(() => {
    return {
      uDelta: { value: 0 },
      uPointerUv: { value: new THREE.Vector2() },
      uPointerVelocity: { value: 0 },
      uPointerTrailTexture: { value: initialPointerIntersectTexture },
    };
  }, [initialPointerIntersectTexture]);
  const renderPlanePositions = useMemo(
    () =>
      new Float32Array([
        -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
      ]),
    [],
  );
  const renderPlaneUvs = useMemo(
    () => new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]),
    [],
  );

  // ************************
  // Display Three Background
  // ************************
  const displayThreeBackgroundRef = useRef(false);
  useEffect(() => {
    const unsubDisplayThreeBackground = useAppStore.subscribe(
      (state) => state.displayThreeBackground,
      (value, prev) => {
        displayThreeBackgroundRef.current = value;
        if (value === true && prev === false) {
          gridBlockUniforms.uActiveRadii.value += 1;
          gridBlockUniforms.uRadiiPcts.value.push(0);
          gridBlockUniforms.uRadiiColors.value.push(new THREE.Color("#ef0717"));
          gridBlockUniforms.uRadiiPatterns.value.push(1);
        }
      },
    );
    return () => {
      unsubDisplayThreeBackground();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // *********
  // Animation
  // *********
  const uDeltaRef = useRef(0);
  const uTimeRef = useRef(0);

  const raycaster = new THREE.Raycaster();
  const currentIntersectUv = new THREE.Vector2();

  const prevPointer = new THREE.Vector2();
  const currentPointer = new THREE.Vector2();
  const deltaPointer = new THREE.Vector2();
  const pointerVelocityRef = useRef(-1);

  const pingPongRef = useRef(true);
  useFrame(({ pointer, camera, gl }, delta) => {
    // ******
    // Shared
    // ******
    uDeltaRef.current = Math.min(delta, 0.1);
    uTimeRef.current = (uTimeRef.current + uDeltaRef.current) % 100000;

    // **************************
    // Pointer intersection logic
    // **************************
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(
      pointerIntersectPlaneRef.current,
    );
    if (intersects.length > 0 && intersects[0].uv !== undefined) {
      const intersect = intersects[0];
      if (pointerVelocityRef.current === -1) {
        currentIntersectUv.copy(intersect.uv!);
        prevPointer.set(pointer.x, pointer.y);
        currentPointer.set(pointer.x, pointer.y);
        deltaPointer.set(0, 0);
        pointerVelocityRef.current = 0;
      }
      currentIntersectUv.lerp(intersect.uv!, 0.3);
      currentPointer.set(pointer.x, pointer.y);
      deltaPointer.subVectors(currentPointer, prevPointer);
      prevPointer.copy(currentPointer);
    } else {
      pointerVelocityRef.current = -1;
      currentIntersectUv.set(10, 10);
      deltaPointer.set(0, 0);
    }
    // eslint-disable-next-line react-hooks/immutability
    pointerIntersectUniforms.uPointerUv.value = currentIntersectUv;
    pointerVelocityRef.current = THREE.MathUtils.lerp(
      pointerVelocityRef.current,
      deltaPointer.length() / uDeltaRef.current,
      0.1,
    );
    pointerIntersectUniforms.uPointerVelocity.value = Math.max(
      0,
      pointerVelocityRef.current,
    );

    // Update shared pointer intersect uniforms
    pointerIntersectUniforms.uDelta.value = uDeltaRef.current;

    if (pingPongRef.current) {
      gl.setRenderTarget(pointerIntersectRenderTarget00);
      gl.clear();
      gl.render(pointerIntersectScene00, pointerIntersectCamera);

      // eslint-disable-next-line react-hooks/immutability
      gridBlockUniforms.uPointerTrailTexture.value =
        pointerIntersectRenderTarget00.texture as THREE.DataTexture;
      pointerIntersectUniforms.uPointerTrailTexture.value =
        pointerIntersectRenderTarget00.texture as THREE.DataTexture;
      // @ts-expect-error "map" exists.
      pointerIntersectPlaneRef.current.material.map =
        pointerIntersectRenderTarget00.texture;
    } else {
      gl.setRenderTarget(pointerIntersectRenderTarget01);
      gl.clear();
      gl.render(pointerIntersectScene01, pointerIntersectCamera);

      gridBlockUniforms.uPointerTrailTexture.value =
        pointerIntersectRenderTarget01.texture as THREE.DataTexture;
      pointerIntersectUniforms.uPointerTrailTexture.value =
        pointerIntersectRenderTarget01.texture as THREE.DataTexture;
    }
    pingPongRef.current = !pingPongRef.current;

    gridBlockUniforms.uTime.value = uTimeRef.current;

    // **************************************
    // Display background (grid blocks) logic
    // **************************************
    if (displayThreeBackgroundRef.current) {
      if (visibilityPctRef.current < 1) {
        visibilityPctRef.current = Math.min(
          1,
          visibilityPctRef.current + uDeltaRef.current * 0.25,
        );
      }
      if (
        useAppStore.getState().isBoring === true &&
        visibilityPctRef.current > 0.5
      ) {
        useAppStore.setState({ isBoring: false });
      }
      gridBlockUniforms.uVisibilityPct.value = visibilityPctRef.current;
    }

    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(
        <mesh>
          <shaderMaterial
            ref={pointerIntersectMaterialRef00}
            uniforms={pointerIntersectUniforms}
            vertexShader={pointerIntersectVertexShader}
            fragmentShader={pointerIntersectFragmentShader}
          />
          <bufferGeometry>
            <bufferAttribute
              args={[renderPlanePositions, 3]}
              attach="attributes-position"
              array={renderPlanePositions}
              count={renderPlanePositions.length / 3}
              itemSize={3}
            />
            <bufferAttribute
              args={[renderPlaneUvs, 2]}
              attach="attributes-uv"
              array={renderPlaneUvs}
              count={renderPlaneUvs.length / 2}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        pointerIntersectScene00,
      )}
      {createPortal(
        <mesh>
          <shaderMaterial
            ref={pointerIntersectMaterialRef01}
            uniforms={pointerIntersectUniforms}
            vertexShader={pointerIntersectVertexShader}
            fragmentShader={pointerIntersectFragmentShader}
          />
          <bufferGeometry>
            <bufferAttribute
              args={[renderPlanePositions, 3]}
              attach="attributes-position"
              array={renderPlanePositions}
              count={renderPlanePositions.length / 3}
              itemSize={3}
            />
            <bufferAttribute
              args={[renderPlaneUvs, 2]}
              attach="attributes-uv"
              array={renderPlaneUvs}
              count={renderPlaneUvs.length / 2}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        pointerIntersectScene01,
      )}

      <Bounds fit clip margin={1.2} maxDuration={0}>
        <Box args={[1, 2, 1]} position={[0, 1, 0]} visible={debug}>
          <meshBasicMaterial wireframe />
        </Box>
      </Bounds>

      <GridBlockInstances
        limit={GRID_DIVISIONS * GRID_DIVISIONS}
        castShadow
        receiveShadow
      >
        <InstancedAttribute name="aDistPctFromCenter" defaultValue={0} />
        <InstancedAttribute
          name="aPointerTrailUv"
          itemSize={2}
          defaultValue={[0, 0]}
        />
        <InstancedAttribute name="aRandomNumber" defaultValue={0} />
        <cylinderGeometry
          args={[
            HEXAGON_POINT_RADIUS,
            HEXAGON_POINT_RADIUS,
            GRID_BLOCK_HEIGHT,
            6,
            1,
          ]}
        />
        <CustomShaderMaterial
          attach="material"
          transparent
          flatShading
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={gridBlockVertexShader}
          fragmentShader={gridBlockFragmentShader}
          uniforms={gridBlockUniforms}
          color={"#e27a0b"}
        />
        <CustomShaderMaterial
          attach="customDepthMaterial"
          transparent
          baseMaterial={THREE.MeshDepthMaterial}
          vertexShader={gridBlockVertexShader}
          fragmentShader={gridBlockFragmentShader}
          uniforms={gridBlockUniforms}
        />
        <axesHelper args={[5]} visible={debug} position={[0, 1, 0]} />
        <Plane
          ref={pointerIntersectPlaneRef}
          args={[GRID_X_SIZE, GRID_X_SIZE]}
          position={[0, 0.0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <meshBasicMaterial transparent />
        </Plane>
        {Array.from({ length: GRID_DIVISIONS }).map((_, xIndex) =>
          Array.from({ length: GRID_DIVISIONS }).map((_, zIndex) => {
            const xOffset = zIndex % 2 === 0 ? 0 : HEXAGON_X_SPACING / 2;
            const x = xIndex * HEXAGON_X_SPACING + xOffset - GRID_X_SIZE / 2;
            const z = zIndex * HEXAGON_Z_SPACING - GRID_Z_SIZE / 2;
            return (
              <GridBlock
                key={`${x}-${z}`}
                position={new THREE.Vector3(x, -GRID_BLOCK_HEIGHT / 2, z)}
                aRandomNumber={
                  gridBlockRandomNumbers[zIndex * GRID_DIVISIONS + xIndex]
                }
              />
            );
          }),
        )}
        <ThreeBackgroundReadyComponent />
      </GridBlockInstances>
    </>
  );
}
