/* eslint-disable react-refresh/only-export-components */
import * as THREE from "three";
import type {
  Page,
  PageBlockColor,
  PageThreeColor,
  SceneBackgroundColors,
  Skill,
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

export const DEFAULT_CAMERA_POSITION = new THREE.Vector3(5, 7, 5);
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

export const PAGE_BLOCK_COLORS: PageBlockColor = {
  home: new THREE.Color("#ef0717"),
  about: new THREE.Color("#e27a0b"),
  skills: new THREE.Color("#aeff16"),
  projects: new THREE.Color("#0ce8d8"),
  history: new THREE.Color("#820ce8"),
  contact: new THREE.Color("#e80c77"),
};

export const PAGE_PATTERN_NUMBERS: Record<Page, number> = {
  home: 1,
  about: 2,
  skills: 3,
  projects: 4,
  history: 5,
  contact: 6,
};

export const SKILLS: Skill[] = [
  {
    name: "Python",
    flavorText: "Language",
    proficiency: 0.817,
    enjoyment: 0.842,
    experience: 0.803,
  },
  {
    name: "Snowflake",
    flavorText: "Data warehouse",
    proficiency: 0.491,
    enjoyment: 0.672,
    experience: 0.468,
  },
  {
    name: "dbt Cloud",
    flavorText: "Data transformation",
    proficiency: 0.689,
    enjoyment: 0.742,
    experience: 0.542,
  },
  {
    name: "Pie making",
    flavorText: "Tasty",
    proficiency: 0.824,
    enjoyment: 0.994,
    experience: 0.873,
  },
  {
    name: "Fivetran",
    flavorText: "Extract / load",
    proficiency: 0.692,
    enjoyment: 0.605,
    experience: 0.427,
  },
  {
    name: "Hex",
    flavorText: "BI platform",
    proficiency: 0.763,
    enjoyment: 0.892,
    experience: 0.491,
  },
  {
    name: "SQL",
    flavorText: "Language",
    proficiency: 0.672,
    enjoyment: 0.613,
    experience: 0.711,
  },
  {
    name: "Google Sheets",
    flavorText: "Save me",
    proficiency: 0.999,
    enjoyment: 0.134,
    experience: 0.999,
  },
  {
    name: "TypeScript",
    flavorText: "Language",
    proficiency: 0.636,
    enjoyment: 0.902,
    experience: 0.718,
  },
  {
    name: "Cat petting",
    flavorText: "Soft skill (pun)",
    proficiency: 0.999,
    enjoyment: 0.999,
    experience: 0.999,
  },
  {
    name: "React",
    flavorText: "Framework",
    proficiency: 0.539,
    enjoyment: 0.924,
    experience: 0.546,
  },
  {
    name: "GLSL",
    flavorText: "Shader language",
    proficiency: 0.446,
    enjoyment: 0.951,
    experience: 0.407,
  },
  {
    name: "Problem Solving",
    flavorText: "Love a challenge",
    proficiency: 0.934,
    enjoyment: 0.989,
    experience: 0.988,
  },
  {
    name: "Creativity",
    flavorText: "Uhh... what do I put here?",
    proficiency: 0.994,
    enjoyment: 0.951,
    experience: 0.998,
  },
  {
    name: "Communication",
    flavorText: "Please just let me work",
    proficiency: 0.895,
    enjoyment: 0.518,
    experience: 0.98,
  },
  {
    name: "Time Management",
    flavorText: "[TODO: Write flavor text]",
    proficiency: 0.748,
    enjoyment: 0.521,
    experience: 0.884,
  },
];

export const PROJECTS = [
  {
    name: "Project A",
    description: "Description for Project A",
  },
  {
    name: "Project B",
    description: "Description for Project B",
  },
  {
    name: "Project C",
    description: "Description for Project C",
  },
];
