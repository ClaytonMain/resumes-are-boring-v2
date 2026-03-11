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

  threeBackgroundComponentReady: boolean;
  initialComponentsReady: boolean;

  isBoring: boolean;

  flavorTextIndex: number;

  targetBackgroundDiffuse: THREE.Color;
  targetBackgroundDiffuseUpdatedAt: number;
  targetBackgroundSubsurface: THREE.Color;
  targetBackgroundSubsurfaceUpdatedAt: number;

  activeSkillIndex: number;

  activeProjectIndex: number;
}

export type SceneBackgroundColors = Record<Page, string>;

export type StatsPosition = "tl" | "tr" | "bl" | "br";

type PageThreeColorConfig = Record<"diffuse" | "subsurface", THREE.Color>;
export type PageThreeColor = Record<Page, PageThreeColorConfig>;
export type PageBlockColor = Record<Page, THREE.Color>;

export type SkillName =
  // Data stuff
  | "Python"
  | "Snowflake"
  | "dbt Cloud"
  | "Pie making"
  | "Fivetran"
  | "Hex"
  | "SQL"
  | "Google Sheets"
  // Web / graphics stuff
  | "TypeScript"
  | "Cat petting"
  | "React"
  | "GLSL"
  // Soft skills
  | "Problem Solving"
  | "Creativity"
  | "Communication"
  | "Time Management";

export type Skill = {
  name: SkillName;
  flavorText: string;
  proficiency: number; // 0-1 scale
  enjoyment: number; // 0-1 scale
  experience: number; // 0-1 scale
};
