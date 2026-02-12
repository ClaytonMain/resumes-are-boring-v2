import type { SpringConfig } from "@react-spring/three";
import * as THREE from "three";

export type Page =
  | "about"
  | "contact"
  | "history"
  | "home"
  | "projects"
  | "skills";

export interface AppStore {
  currentPage: Page;
  firstVisit: boolean;
  disableStrobeEffects: boolean;
  skipIntro: boolean;
  debug: boolean;
  cameraPositionTarget?: THREE.Vector3;
  cameraLookAtTarget?: THREE.Vector3;
  cameraFovTarget?: number;
  cameraPositionUpdateRequestedAt?: number;
  cameraLookAtUpdateRequestedAt?: number;
  cameraFovUpdateRequestedAt?: number;
  cameraPositionSpringConfig?: SpringConfig;
  cameraLookAtSpringConfig?: SpringConfig;
  cameraFovSpringConfig?: SpringConfig;
  cameraAtPositionTarget: boolean;
  cameraAtLookAtTarget: boolean;
  cameraAtFovTarget: boolean;

  displayThreeBackground: boolean;

  threeFloorReady: boolean;
  initialComponentsReady: boolean;
}

export type SceneBackgroundColors = Record<Page, string>;
