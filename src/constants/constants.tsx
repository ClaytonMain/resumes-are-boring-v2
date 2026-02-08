/* eslint-disable react-refresh/only-export-components */
import * as THREE from "three";
import type { SceneBackgroundColors } from "../types/types";

export const RUBIK_MONO_ONE_TTF = "fonts/RubikMonoOne-Regular.ttf";

export const SCENE_BACKGROUND_COLORS: SceneBackgroundColors = {
  about: "#ffffff",
  contact: "#ffffff",
  enter: "#1a1817",
  history: "#ffffff",
  home: "#ffffff",
  projects: "#ffffff",
  skills: "#ffffff",
};

export const DEFAULT_CAMERA_POSITION = new THREE.Vector3(1.5, 1.25, 3.5);
export const DEFAULT_CAMERA_LOOK_AT = new THREE.Vector3(0, 0, 0);
export const DEFAULT_CAMERA_FOV = 65;
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
