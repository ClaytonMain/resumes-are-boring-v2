import {
  Bounds,
  Box,
  createInstances,
  InstancedAttribute,
  Plane,
  useFBO,
} from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import {
  PAGE_BLOCK_COLORS,
  PAGE_PATTERN_NUMBERS,
} from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";
import ContactDisplay from "../contact-display/ContactDisplay.tsx";
import ProjectsDisplay from "../ProjectsDisplay";
import useMousePosition from "./hooks/useMousePosition";
import gridBlockFragmentShader from "./shaders/grid-block/gridBlock.frag";
import gridBlockVertexShader from "./shaders/grid-block/gridBlock.vert";
import offsetTextureFragmentShader from "./shaders/offset-texture/offsetTexture.frag";
import offsetTextureVertexShader from "./shaders/offset-texture/offsetTexture.vert";
import SkillsController from "./SkillsController";
import ThreeBackgroundReadyComponent from "./ThreeBackgroundReadyComponent";
import type { GridBlockUniforms, OffsetTextureUniforms } from "./types/types";

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
const GRID_BLOCK_HEIGHT = 1.5;
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
  aRandomOffset: number;
}

const [GridBlockInstances, GridBlockInstance] =
  createInstances<GridBlockInstanceAttributes>();

function GridBlock({
  position,
  aRandomOffset,
}: {
  position: THREE.Vector3;
  aRandomOffset: number;
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
      aRandomOffset={aRandomOffset}
    />
  );
}

// ***********************
// Offset Texture Plane
// ***********************
const OFFSET_TEXTURE_PIXELS = 128;
function getOffsetTextureDataTextureData() {
  const data = new Float32Array(
    OFFSET_TEXTURE_PIXELS * OFFSET_TEXTURE_PIXELS * 4,
  );
  for (let i = 0; i < OFFSET_TEXTURE_PIXELS * OFFSET_TEXTURE_PIXELS; i++) {
    const i4 = i * 4;
    data[i4 + 0] = 0.0;
    data[i4 + 1] = 0.0;
    data[i4 + 2] = 0.0;
    data[i4 + 3] = 1.0;
  }
  return data;
}
function getOffsetTextureDataTexture() {
  const data = getOffsetTextureDataTextureData();
  const texture = new THREE.DataTexture(
    data,
    OFFSET_TEXTURE_PIXELS,
    OFFSET_TEXTURE_PIXELS,
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
  const gridBlockUniforms: GridBlockUniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uOffsetTexture: { value: new THREE.DataTexture() },
      uVisibilityPct: { value: 0 },
      uActiveRadii: { value: 2 },
      uRadiiPcts: { value: new Array(MAX_RADII_COUNT).fill(1) },
      uRadiiColors: {
        value: new Array(MAX_RADII_COUNT).fill(new THREE.Color("#000")),
      },
      uRadiiPatterns: { value: new Array(MAX_RADII_COUNT).fill(0) },
    };
  }, []);
  const gridBlockRandomOffsets = useMemo(() => {
    const numbers = new Float32Array(GRID_DIVISIONS * GRID_DIVISIONS);
    for (let i = 0; i < GRID_DIVISIONS * GRID_DIVISIONS; i++) {
      numbers[i] = Math.random() * 0.01;
    }
    return numbers;
  }, []);

  // ********************
  // Offset Texture Plane
  // ********************
  const offsetTextureMaterialRef00 = useRef<THREE.ShaderMaterial>(null!);
  const offsetTextureMaterialRef01 = useRef<THREE.ShaderMaterial>(null!);
  const offsetTexturePlaneRef = useRef<THREE.Mesh>(null!);
  const offsetTextureScene00 = useMemo(() => new THREE.Scene(), []);
  const offsetTextureScene01 = useMemo(() => new THREE.Scene(), []);
  const offsetTextureCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1),
    [],
  );
  const initialOffsetTextureTexture = useMemo(
    () => getOffsetTextureDataTexture(),
    [],
  );
  const offsetTextureRenderTarget00 = useFBO(
    OFFSET_TEXTURE_PIXELS,
    OFFSET_TEXTURE_PIXELS,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false,
      type: THREE.FloatType,
    },
  );
  const offsetTextureRenderTarget01 = useFBO(
    OFFSET_TEXTURE_PIXELS,
    OFFSET_TEXTURE_PIXELS,
    {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false,
      depthBuffer: false,
      type: THREE.FloatType,
    },
  );
  const offsetTextureUniforms: OffsetTextureUniforms = useMemo(() => {
    return {
      uDelta: { value: 0 },
      uPointerUv: { value: new THREE.Vector2() },
      uPointerVelocity: { value: 0 },
      uOffsetTexture: { value: initialOffsetTextureTexture },
      uProficiencyUv: { value: new THREE.Vector2() },
      uEnjoymentUv: { value: new THREE.Vector2() },
      uExperienceUv: { value: new THREE.Vector2() },
      uProficiencyValue: { value: 0 },
      uEnjoymentValue: { value: 0 },
      uExperienceValue: { value: 0 },
    };
  }, [initialOffsetTextureTexture]);
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
  const mousePosition = useMousePosition();

  // ************************
  // Display Three Background
  // ************************
  const displayThreeBackgroundRef = useRef(false);
  const initialTimeRef = useRef(0);
  useEffect(() => {
    const unsubDisplayThreeBackground = useAppStore.subscribe(
      (state) => state.displayThreeBackground,
      (value, prev) => {
        displayThreeBackgroundRef.current = value;
        if (value === true && prev === false) {
          gridBlockUniforms.uActiveRadii.value += 1;
          gridBlockUniforms.uRadiiPcts.value.unshift(0);
          gridBlockUniforms.uRadiiColors.value.unshift(
            PAGE_BLOCK_COLORS[useAppStore.getState().currentPage],
          );
          gridBlockUniforms.uRadiiPatterns.value.unshift(
            PAGE_PATTERN_NUMBERS[useAppStore.getState().currentPage],
          );
        }
      },
    );
    return () => {
      unsubDisplayThreeBackground();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // *********************
  // Current Page Listener
  // *********************
  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (currentPage, previousPage) => {
        if (
          currentPage !== previousPage &&
          displayThreeBackgroundRef.current === true
        ) {
          gridBlockUniforms.uActiveRadii.value += 1;
          gridBlockUniforms.uRadiiPcts.value.unshift(
            Math.min(0.2, gridBlockUniforms.uRadiiPcts.value[0] - 0.01),
          );
          gridBlockUniforms.uRadiiColors.value.unshift(
            PAGE_BLOCK_COLORS[currentPage],
          );
          gridBlockUniforms.uRadiiPatterns.value.unshift(
            PAGE_PATTERN_NUMBERS[currentPage],
          );
        }
      },
    );
    return () => {
      unsubCurrentPage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // **********
  // Skills Uvs
  // **********
  const proficiencyRef = useRef<THREE.Object3D>(null!);
  const enjoymentRef = useRef<THREE.Object3D>(null!);
  const experienceRef = useRef<THREE.Object3D>(null!);

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

  useFrame(({ camera, gl }, delta) => {
    // ******
    // Shared
    // ******
    uDeltaRef.current = Math.max(Math.min(delta, 0.1), 0.0001);
    uTimeRef.current = (uTimeRef.current + uDeltaRef.current) % 100000;

    // **************************
    // Pointer intersection logic
    // **************************
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObject(offsetTexturePlaneRef.current);
    if (intersects.length > 0 && intersects[0].uv !== undefined) {
      const intersect = intersects[0];
      if (pointerVelocityRef.current === -1) {
        currentIntersectUv.copy(intersect.uv!);
        prevPointer.set(mousePosition.x, mousePosition.y);
        currentPointer.set(mousePosition.x, mousePosition.y);
        deltaPointer.set(0, 0);
        pointerVelocityRef.current = 0;
      }
      currentIntersectUv.lerp(intersect.uv!, 0.3);
      currentPointer.set(mousePosition.x, mousePosition.y);
      deltaPointer.subVectors(currentPointer, prevPointer);
      prevPointer.copy(currentPointer);
    } else {
      pointerVelocityRef.current = -1;
      currentIntersectUv.set(10, 10);
      deltaPointer.set(0, 0);
    }
    offsetTextureUniforms.uPointerUv.value = currentIntersectUv;
    pointerVelocityRef.current = THREE.MathUtils.lerp(
      pointerVelocityRef.current,
      deltaPointer.length() / uDeltaRef.current,
      0.1,
    );
    offsetTextureUniforms.uPointerVelocity.value = Math.max(
      0,
      pointerVelocityRef.current,
    );

    // Update skills UVs
    const cameraWorldPosition = camera.getWorldPosition(new THREE.Vector3());
    const proficiencyWorldPosition = proficiencyRef.current.getWorldPosition(
      new THREE.Vector3(),
    );
    const enjoymentWorldPosition = enjoymentRef.current.getWorldPosition(
      new THREE.Vector3(),
    );
    const experienceWorldPosition = experienceRef.current.getWorldPosition(
      new THREE.Vector3(),
    );
    raycaster.set(
      cameraWorldPosition,
      proficiencyWorldPosition.clone().sub(cameraWorldPosition).normalize(),
    );
    const proficiencyIntersect = raycaster.intersectObject(
      offsetTexturePlaneRef.current,
    )[0];
    if (proficiencyIntersect && proficiencyIntersect.uv) {
      offsetTextureUniforms.uProficiencyUv.value = proficiencyIntersect.uv;
    }
    raycaster.set(
      cameraWorldPosition,
      enjoymentWorldPosition.clone().sub(cameraWorldPosition).normalize(),
    );
    const enjoymentIntersect = raycaster.intersectObject(
      offsetTexturePlaneRef.current,
    )[0];
    if (enjoymentIntersect && enjoymentIntersect.uv) {
      offsetTextureUniforms.uEnjoymentUv.value = enjoymentIntersect.uv;
    }
    raycaster.set(
      cameraWorldPosition,
      experienceWorldPosition.clone().sub(cameraWorldPosition).normalize(),
    );
    const experienceIntersect = raycaster.intersectObject(
      offsetTexturePlaneRef.current,
    )[0];
    if (experienceIntersect && experienceIntersect.uv) {
      offsetTextureUniforms.uExperienceUv.value = experienceIntersect.uv;
    }

    // Update shared offset texture uniforms
    offsetTextureUniforms.uDelta.value = uDeltaRef.current;

    if (pingPongRef.current) {
      gl.setRenderTarget(offsetTextureRenderTarget00);
      gl.clear();
      gl.render(offsetTextureScene00, offsetTextureCamera);

      gridBlockUniforms.uOffsetTexture.value =
        offsetTextureRenderTarget00.texture as THREE.DataTexture;
      offsetTextureUniforms.uOffsetTexture.value =
        offsetTextureRenderTarget00.texture as THREE.DataTexture;
      // @ts-expect-error "map" exists.
      offsetTexturePlaneRef.current.material.map =
        offsetTextureRenderTarget00.texture;
    } else {
      gl.setRenderTarget(offsetTextureRenderTarget01);
      gl.clear();
      gl.render(offsetTextureScene01, offsetTextureCamera);

      gridBlockUniforms.uOffsetTexture.value =
        offsetTextureRenderTarget01.texture as THREE.DataTexture;
      offsetTextureUniforms.uOffsetTexture.value =
        offsetTextureRenderTarget01.texture as THREE.DataTexture;
    }
    pingPongRef.current = !pingPongRef.current;

    gridBlockUniforms.uTime.value = uTimeRef.current;

    // **************************************
    // Display background (grid blocks) logic
    // **************************************
    if (displayThreeBackgroundRef.current) {
      if (
        initialTimeRef.current < 1 &&
        useAppStore.getState().isBoring === true
      ) {
        initialTimeRef.current = Math.min(
          1,
          initialTimeRef.current + uDeltaRef.current * 0.25,
        );
        if (initialTimeRef.current > 0.5) {
          useAppStore.setState({ isBoring: false });
        }
      }
      const radiiPcts = gridBlockUniforms.uRadiiPcts.value as number[];
      radiiPcts.forEach((pct, index) => {
        radiiPcts[index] = Math.min(1, pct + uDeltaRef.current * 0.25);
      });
      if (radiiPcts.length > MAX_RADII_COUNT) {
        radiiPcts.pop();
        (gridBlockUniforms.uRadiiColors.value as THREE.Color[]).pop();
        (gridBlockUniforms.uRadiiPatterns.value as number[]).pop();
      }
      gridBlockUniforms.uRadiiPcts.value = radiiPcts;
      gridBlockUniforms.uActiveRadii.value = radiiPcts.indexOf(1) + 2;
    }

    gl.setRenderTarget(null);
  });

  console.log("rendering three background");

  return (
    <>
      {createPortal(
        <mesh>
          <shaderMaterial
            ref={offsetTextureMaterialRef00}
            uniforms={offsetTextureUniforms}
            vertexShader={offsetTextureVertexShader}
            fragmentShader={offsetTextureFragmentShader}
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
        offsetTextureScene00,
      )}
      {createPortal(
        <mesh>
          <shaderMaterial
            ref={offsetTextureMaterialRef01}
            uniforms={offsetTextureUniforms}
            vertexShader={offsetTextureVertexShader}
            fragmentShader={offsetTextureFragmentShader}
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
        offsetTextureScene01,
      )}

      <Bounds fit margin={1.2} maxDuration={0}>
        <Box args={[1.25, 2.5, 1.25]} position={[0, 1.25, 0]} visible={debug}>
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
        <InstancedAttribute name="aRandomOffset" defaultValue={0} />
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
          ref={offsetTexturePlaneRef}
          args={[GRID_X_SIZE, GRID_X_SIZE]}
          position={[0, 0.0, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          visible={false}
        >
          <meshBasicMaterial />
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
                aRandomOffset={
                  gridBlockRandomOffsets[zIndex * GRID_DIVISIONS + xIndex]
                }
              />
            );
          }),
        )}
      </GridBlockInstances>
      <ThreeBackgroundReadyComponent />
      <SkillsController
        offsetTextureUniforms={offsetTextureUniforms}
        proficiencyRef={proficiencyRef}
        enjoymentRef={enjoymentRef}
        experienceRef={experienceRef}
        hexagonXSpacing={HEXAGON_X_SPACING}
        hexagonZSpacing={HEXAGON_Z_SPACING}
      />
      <Suspense fallback={null}>
        <ProjectsDisplay />
      </Suspense>
      <ContactDisplay />
    </>
  );
}
