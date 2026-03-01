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
import mouseIntersectFragmentShader from "./shaders/mouse-intersect/mouseIntersect.frag";
import mouseIntersectVertexShader from "./shaders/mouse-intersect/mouseIntersect.vert";

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

interface GridBlockInstanceAttributes {
  aDistanceFromCenter: number;
}

const [GridBlockInstances, GridBlockInstance] =
  createInstances<GridBlockInstanceAttributes>();

function GridBlock({ position }: { position: THREE.Vector3 }) {
  return (
    <GridBlockInstance
      position={position}
      aDistanceFromCenter={position.length()}
    />
  );
}

// *********************
// Mouse Intersect Plane
// *********************
const MOUSE_INTERSECT_PIXELS = 256;
function getMouseIntersectDataTextureData() {
  const data = new Float32Array(
    MOUSE_INTERSECT_PIXELS * MOUSE_INTERSECT_PIXELS * 4,
  );
  for (let i = 0; i < MOUSE_INTERSECT_PIXELS * MOUSE_INTERSECT_PIXELS; i++) {
    const i4 = i * 4;
    data[i4 + 0] = 0.0;
    data[i4 + 1] = 0.0;
    data[i4 + 2] = 0.0;
    data[i4 + 3] = 1.0;
  }
  return data;
}
function getMouseIntersectDataTexture() {
  const data = getMouseIntersectDataTextureData();
  const texture = new THREE.DataTexture(
    data,
    MOUSE_INTERSECT_PIXELS,
    MOUSE_INTERSECT_PIXELS,
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

  // **********
  // Background
  // **********
  const backgroundUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uMouseTrailTexture: { value: new THREE.DataTexture() },
    };
  }, []);

  // *********************
  // Mouse intersect plane
  // *********************
  const mouseIntersectMaterialRef00 = useRef<THREE.ShaderMaterial>(null!);
  const mouseIntersectMaterialRef01 = useRef<THREE.ShaderMaterial>(null!);
  const mouseIntersectPlaneRef = useRef<THREE.Mesh>(null!);
  const mouseIntersectScene00 = useMemo(() => new THREE.Scene(), []);
  const mouseIntersectScene01 = useMemo(() => new THREE.Scene(), []);
  const mouseIntersectCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1),
    [],
  );
  const initialMouseIntersectTexture = getMouseIntersectDataTexture();
  const mouseIntersectRenderTarget00 = useFBO(
    MOUSE_INTERSECT_PIXELS,
    MOUSE_INTERSECT_PIXELS,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false,
      type: THREE.FloatType,
    },
  );
  const mouseIntersectRenderTarget01 = useFBO(
    MOUSE_INTERSECT_PIXELS,
    MOUSE_INTERSECT_PIXELS,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false,
      type: THREE.FloatType,
    },
  );
  const mouseIntersectUniforms = useMemo(() => {
    return {
      uDelta: { value: 0 },
      uMouseUv: { value: new THREE.Vector2() },
      uMouseVelocity: { value: 0 },
      uMouseTrailTexture: { value: initialMouseIntersectTexture },
    };
  }, [initialMouseIntersectTexture]);
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
    uDeltaRef.current = Math.min(delta, 0.1);
    uTimeRef.current = (uTimeRef.current + uDeltaRef.current) % 100000;

    // Handle mouse intersection logic
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(
      mouseIntersectPlaneRef.current,
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
    mouseIntersectUniforms.uMouseUv.value = currentIntersectUv;
    pointerVelocityRef.current = THREE.MathUtils.lerp(
      pointerVelocityRef.current,
      deltaPointer.length() / uDeltaRef.current,
      0.1,
    );
    mouseIntersectUniforms.uMouseVelocity.value = Math.max(
      0,
      pointerVelocityRef.current,
    );

    // Update shared mouse intersect uniforms
    mouseIntersectUniforms.uDelta.value = uDeltaRef.current;

    if (pingPongRef.current) {
      gl.setRenderTarget(mouseIntersectRenderTarget00);
      gl.clear();
      gl.render(mouseIntersectScene00, mouseIntersectCamera);

      // eslint-disable-next-line react-hooks/immutability
      backgroundUniforms.uMouseTrailTexture.value =
        mouseIntersectRenderTarget00.texture as THREE.DataTexture;
      mouseIntersectUniforms.uMouseTrailTexture.value =
        mouseIntersectRenderTarget00.texture as THREE.DataTexture;
      // @ts-expect-error "map" exists.
      mouseIntersectPlaneRef.current.material.map =
        mouseIntersectRenderTarget00.texture;
    } else {
      gl.setRenderTarget(mouseIntersectRenderTarget01);
      gl.clear();
      gl.render(mouseIntersectScene01, mouseIntersectCamera);

      backgroundUniforms.uMouseTrailTexture.value =
        mouseIntersectRenderTarget01.texture as THREE.DataTexture;
      mouseIntersectUniforms.uMouseTrailTexture.value =
        mouseIntersectRenderTarget01.texture as THREE.DataTexture;
    }
    pingPongRef.current = !pingPongRef.current;

    backgroundUniforms.uTime.value = uTimeRef.current;

    gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(
        <mesh>
          <shaderMaterial
            ref={mouseIntersectMaterialRef00}
            uniforms={mouseIntersectUniforms}
            vertexShader={mouseIntersectVertexShader}
            fragmentShader={mouseIntersectFragmentShader}
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
        mouseIntersectScene00,
      )}
      {createPortal(
        <mesh>
          <shaderMaterial
            ref={mouseIntersectMaterialRef01}
            uniforms={mouseIntersectUniforms}
            vertexShader={mouseIntersectVertexShader}
            fragmentShader={mouseIntersectFragmentShader}
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
        mouseIntersectScene01,
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
        <InstancedAttribute name="aDistanceFromCenter" defaultValue={0} />
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
          flatShading
          baseMaterial={THREE.MeshStandardMaterial}
          vertexShader={gridBlockVertexShader}
          fragmentShader={gridBlockFragmentShader}
          uniforms={backgroundUniforms}
          color={"#e27a0b"}
        />
        <CustomShaderMaterial
          attach="customDepthMaterial"
          baseMaterial={THREE.MeshDepthMaterial}
          vertexShader={gridBlockVertexShader}
          fragmentShader={gridBlockFragmentShader}
          uniforms={backgroundUniforms}
        />
        <axesHelper args={[5]} visible={debug} position={[0, 1, 0]} />
        <Plane
          ref={mouseIntersectPlaneRef}
          args={[GRID_X_SIZE, GRID_X_SIZE]}
          position={[0, 0.3, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={debug}
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
              />
            );
          }),
        )}
      </GridBlockInstances>
    </>
  );
}
