/* eslint-disable react-refresh/only-export-components */
import * as THREE from "three";
import type { Page, SceneBackgroundColors } from "../types/types";

export const RUBIK_MONO_ONE_TTF = "fonts/RubikMonoOne-Regular.ttf";

export const PAGE_NAMES: Page[] = [
  "home",
  "about",
  "skills",
  "projects",
  "history",
  "contact",
] as const;

export const SCENE_BACKGROUND_COLORS: SceneBackgroundColors = {
  about: "#1a1817",
  contact: "#1a1817",
  history: "#1a1817",
  home: "#1a1817",
  projects: "#1a1817",
  skills: "#1a1817",
};

export const DEFAULT_CAMERA_POSITION = new THREE.Vector3(-0.8, -0.5, 3.5);
export const DEFAULT_CAMERA_LOOK_AT = new THREE.Vector3(0.0, 0.0, 0.0);
export const DEFAULT_CAMERA_FOV = 60;
export const DEFAULT_SPRING_POSITION_CONFIG = {
  tension: 100,
  friction: 36,
  mass: 30,
};
export const DEFAULT_SPRING_LOOK_AT_CONFIG = {
  tension: 100,
  friction: 16,
  mass: 1,
};
export const DEFAULT_SPRING_FOV_CONFIG = {
  tension: 100,
  friction: 36,
  mass: 10,
};

export const STATS_CLASS_NAME =
  "if-it-works-then-it-aint-25783154-7c53-4f0f-bb9c-5b6813dc653e";
