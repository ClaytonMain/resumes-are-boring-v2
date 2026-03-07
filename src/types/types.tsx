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
}

export type SceneBackgroundColors = Record<Page, string>;

export type StatsPosition = "tl" | "tr" | "bl" | "br";

type PageThreeColorConfig = Record<"diffuse" | "subsurface", THREE.Color>;
export type PageThreeColor = Record<Page, PageThreeColorConfig>;
export type PageBlockColor = Record<Page, THREE.Color>;

export type SkillName =
  | "Python"
  | "SQL"
  | "TypeScript"
  | "React"
  | "GLSL"
  | "Communication"
  | "Problem Solving"
  | "Time Management"
  | "Creativity"
  | "Snowflake"
  | "dbt Cloud"
  | "Fivetran"
  | "Hex"
  | "VS Code"
  | "Google Sheets";

export type TypeCategory = "Language" | "Tool" | "Framework" | "Softskill";

export type SkillCategory =
  | "Data Vis."
  | "Data Eng."
  | "Data An."
  | "Data Wrang."
  | "Frontend"
  | "Backend"
  | "Graphics"
  | "General Prog."
  | "Softskill";

export type Skill = {
  name: SkillName;
  proficiency: number; // 1-10 scale
  enjoyment: number; // 1-10 scale
  experience: number; // 1-10 scale
};
