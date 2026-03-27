/* eslint-disable react-refresh/only-export-components */
import * as THREE from "three";
import type {
  Page,
  PageBlockColor,
  PageHtmlStyleConfigs,
  Skill,
} from "../types/types";

// type PageHtmlStyleConfig = {
//   bg: string;
//   text: string;
//   border: string;
//   scrollBar0: string;
//   scrollBar1: string;
//   navigation?: {
//     bg?: string;
//     text?: string;
//     border?: string;
//     tabBg?: string;
//     tabText?: string;
//   };
// };
export const PAGE_HTML_STYLE_CONFIGS: PageHtmlStyleConfigs = {
  home: {
    bg: "#ef07171a",
    text: "#ffffff",
    border: "#f43f5eff",
  },
  about: {
    bg: "#fbbf241a",
    text: "#373737",
    border: "#fbbf24ff",
  },
  skills: {
    bg: "#a3e6351a",
    text: "#373737",
    border: "#a3e635ff",
  },
  projects: {
    bg: "#14b8a64d",
    text: "#ffffff",
    border: "#14b8a680",
    scrollBar0: "#f0fdfaff",
    scrollBar1: "#99f6e41a",
  },
  contact: {
    bg: "#a78bfa1a",
    text: "#ffffff",
    border: "#a78bfaff",
  },
};

export const PAGE_NAMES: Page[] = [
  "home",
  "about",
  "skills",
  "projects",
  "contact",
] as const;

export const DEFAULT_CAMERA_POSITION = new THREE.Vector3(6.6, 8.8, 6.6);

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
  "Alright, we're out of text now...",
];

export const CONTENT_CONTAINER_CLASS_NAME =
  "pointer-events-auto m-auto flex flex-col justify-center overflow-hidden rounded-lg border p-2 backdrop-blur-sm";

export const PAGE_BLOCK_COLORS: PageBlockColor = {
  home: new THREE.Color("#ef0717"),
  about: new THREE.Color("#e27a0b"),
  skills: new THREE.Color("#84cc16"),
  projects: new THREE.Color("#14b8a6"),
  contact: new THREE.Color("#820ce8"),
};

export const PAGE_PATTERN_NUMBERS: Record<Page, number> = {
  home: 1,
  about: 2,
  skills: 3,
  projects: 4,
  contact: 5,
};

export const SKILLS: Skill[] = [
  {
    name: "Python",
    flavorText: "Language",
    proficiency: 0.887,
    enjoyment: 0.812,
    experience: 0.893,
  },
  {
    name: "Snowflake",
    flavorText: "Data warehouse",
    proficiency: 0.591,
    enjoyment: 0.672,
    experience: 0.468,
  },
  {
    name: "dbt Cloud",
    flavorText: "Data transformation",
    proficiency: 0.709,
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
    proficiency: 0.712,
    enjoyment: 0.605,
    experience: 0.427,
  },
  {
    name: "Hex",
    flavorText: "BI platform",
    proficiency: 0.793,
    enjoyment: 0.892,
    experience: 0.491,
  },
  {
    name: "SQL",
    flavorText: "Language",
    proficiency: 0.732,
    enjoyment: 0.613,
    experience: 0.711,
  },
  {
    name: "Google Sheets",
    flavorText: "Save me from my nightmare",
    proficiency: 0.999,
    enjoyment: 0.064,
    experience: 0.999,
  },
  {
    name: "TypeScript",
    flavorText: "Language",
    proficiency: 0.736,
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
    proficiency: 0.759,
    enjoyment: 0.924,
    experience: 0.746,
  },
  {
    name: "GLSL",
    flavorText: "Shader language",
    proficiency: 0.546,
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
    flavorText: "[TODO: Find time to write flavor text]",
    proficiency: 0.748,
    enjoyment: 0.521,
    experience: 0.884,
  },
];

export const PROJECTS = [
  {
    name: "Spherical Trochoids",
    description:
      "Like a Spirograph, but in 3D. I came up with the math to describe this independently!",
    url: "https://claytonmain.github.io/spherical-trochoids/",
  },
  {
    name: "Slime Clock",
    description: "A slime mold simulation that's also a clock! Why? Why not?!",
    url: "https://www.slimeclock.com",
  },
  {
    name: "Conway's Symphony of Life",
    description:
      "A synthesizer powered by Conway's Game of Life. Try it out! (Not recommended on mobile, sorry!)",
    url: "https://conways-symphony-of-life.vercel.app/",
  },
  {
    name: "React Three Fiber Experiments",
    description: "Various experiments and projects using React Three Fiber.",
    url: "https://claytonmain-r3f-experiments.vercel.app/attractor",
  },
  {
    name: "Clock Envy (Very Early WIP)",
    description:
      "A bunch of clocks to showcase different shaders, techniques, ideas and whatnot. It's very much a WIP, but check it out if you want! Desktop recommended!\n\nI will not apologize for the name. :P",
    url: "https://www.clockenvy.com",
  },
];
