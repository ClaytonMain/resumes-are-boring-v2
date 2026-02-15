/* eslint-disable react-refresh/only-export-components */
import * as THREE from "three";
import type {
  Page,
  PageThreeColor,
  SceneBackgroundColors,
} from "../types/types";

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

export const FLAVOR_TEXT_VALUES = [
  "But at least my website is cool.",
  "Does this count as a résumé?",
  "Hello again!",
  "Look at these snazzy graphics tho.",
  "What if you interviewed me...? ha ha jk... unless.....?",
  "I'm pretty good at making pies!",
  "7675747 is the 519367th prime number!",
  "Mathematical!",
  "I have two cats!",
  "I'll owe you a homemade key lime pie if you hire me full-time! Seriously!",
  "Pining for the fjords...",
  "Ight, we're out of text now...",
];

export const CONTENT_CONTAINER_CLASS_NAME =
  "pointer-events-auto m-auto flex flex-col justify-center overflow-hidden rounded-lg border p-2 backdrop-blur-sm";

export const PAGE_THREE_COLORS: PageThreeColor = {
  home: {
    diffuse: new THREE.Color("#ffa9a9"),
    subsurface: new THREE.Color("#ef0717"),
  },
  about: {
    diffuse: new THREE.Color("#ffc77e"),
    subsurface: new THREE.Color("#e27a0b"),
  },
  skills: {
    diffuse: new THREE.Color("#dbff7d"),
    subsurface: new THREE.Color("#aeff16"),
  },
  projects: {
    diffuse: new THREE.Color("#7dffc9"),
    subsurface: new THREE.Color("#0ce8d8"),
  },
  history: {
    diffuse: new THREE.Color("#9c7dff"),
    subsurface: new THREE.Color("#820ce8"),
  },
  contact: {
    diffuse: new THREE.Color("#ff7dbc"),
    subsurface: new THREE.Color("#e80c77"),
  },
};
