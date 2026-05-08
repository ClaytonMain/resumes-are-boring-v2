/* eslint-disable react-refresh/only-export-components */
import * as THREE from "three";
import type {
  Page,
  PageBlockColor,
  PageHtmlStyleConfigs,
  Skill,
} from "../types/types";

export const PAGE_HTML_STYLE_CONFIGS: PageHtmlStyleConfigs = {
  home: {
    pageBg: "#E41225",
    bg: "#ef07171a",
    text: "#ffffffff",
    border: "#ef07174d",
  },
  about: {
    pageBg: "#DB8727",
    bg: "#fbbf241a",
    text: "#373737ff",
    border: "#373737ff",
    scrollBar0: "#373737ff",
    scrollBar1: "#3737371a",
    navigation: {
      tabBg: "#373737ff",
      tabText: "#cf8d3fff",
    },
  },
  skills: {
    pageBg: "#97C83D",
    bg: "#a3e6351a",
    text: "#373737ff",
    border: "#373737ff",
    navigation: {
      tabBg: "#373737ff",
      tabText: "#a3e635ff",
    },
  },
  projects: {
    pageBg: "#2B3435",
    bg: "#d1fae51a",
    text: "#ffffffff",
    border: "#ffffff33",
    scrollBar0: "#252627ff",
    scrollBar1: "#2526271a",
    navigation: {
      bg: "#252627e6",
      text: "#ffffffff",
      border: "#25262700",
      tabBg: "#ffffffff",
      tabText: "#252627ff",
    },
  },
  contact: {
    pageBg: "#7816D2",
    bg: "#a78bfa1a",
    text: "#ffffffff",
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
  "Look at these snazzy graphics though...",
  "What if you interviewed me...? ha ha jk... unless.....?",
  "I'm pretty good at making pies!",
  "7675747 is the 519367th prime number!",
  "Mathematical!",
  "I have two cats!",
  "I'll owe you a homemade key lime pie if you hire me full-time! Seriously!",
  "Pining for the fjords...",
  "Alright, we're out of text now...",
  "For real.",
  "...",
  "....",
  ".....",
  "...y tho...?",
  "What are you doing?",
  "Go away?",
  "You could be doing something else right now, you know?",
  "Like reading a book or something?",
  "That'd be nice, right?",
  "Or maybe you could play a game or something?",
  "Like, I can't just keep coming up with blurbs here.",
  "This has to end at some point.",
  "But no.",
  "You're still here.",
  "So I have to keep writing.",
  "Thanks for that, btw.",
  "That was sarcasm.",
  "I've got other things to do too!",
  "...",
  ".....",
  "......",
  ".......",
  "........",
  "Please...",
  "i beg of you",
  "...idea...",
  "But at least my website is cool.",
  "Does this count as a résumé?",
  "Hello again!",
  "Look at these snazzy graphics though...",
  "What if you interviewed me...? ha ha jk... unless.....?",
  "...",
  "...seriously???",
  "You were supposed to think the flavor text was looping!",
  "I can't stop typing until you stop reading!",
  "Although...",
  "Wouldn't it be funny if I just stopped writing these?",
  "But, like, I didn't indicate that I was done?",
  "And so you'd keep looping through these thinking there'd be another easter egg",
];

export const PAGE_BLOCK_COLORS: PageBlockColor = {
  home: new THREE.Color("#ef0717"),
  about: new THREE.Color("#e27a0b"),
  skills: new THREE.Color("#84cc16"),
  projects: new THREE.Color("#14b8a6"),
  contact: new THREE.Color("#820ce8"),
};
export const PAGE_BLOCK_COLORS_YOFFSET: PageBlockColor = {
  home: new THREE.Color("#ffffff"),
  about: new THREE.Color("#373737"),
  skills: new THREE.Color("#373737"),
  projects: new THREE.Color("#ffffff"),
  contact: new THREE.Color("#ffffff"),
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
    proficiency: 0.691,
    enjoyment: 0.672,
    experience: 0.468,
  },
  {
    name: "dbt Cloud",
    flavorText: "Data transformation",
    proficiency: 0.789,
    enjoyment: 0.742,
    experience: 0.572,
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
    proficiency: 0.762,
    enjoyment: 0.605,
    experience: 0.427,
  },
  {
    name: "Hex",
    flavorText: "BI platform",
    proficiency: 0.903,
    enjoyment: 0.892,
    experience: 0.591,
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
    proficiency: 0.796,
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
    proficiency: 0.809,
    enjoyment: 0.924,
    experience: 0.746,
  },
  {
    name: "GLSL",
    flavorText: "Shader language",
    proficiency: 0.646,
    enjoyment: 0.951,
    experience: 0.507,
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
  // {
  //   name: "Communication",
  //   flavorText: "Please just let me work",
  //   proficiency: 0.895,
  //   enjoyment: 0.518,
  //   experience: 0.98,
  // },
  // {
  //   name: "Time Management",
  //   flavorText: "[TODO: Find time to write flavor text]",
  //   proficiency: 0.748,
  //   enjoyment: 0.521,
  //   experience: 0.884,
  // },
];

export const PROJECTS = [
  {
    name: "Spherical Trochoids",
    description:
      "Like a Spirograph, but in 3D. I came up with the math to describe this independently!",
    url: "https://claytonmain.github.io/spherical-trochoids/",
    videoSrc: "/videos/sphericalTrochoids.mp4",
  },
  {
    name: "Slime Clock",
    description:
      "A slime mold simulation that's also a clock! I spent way too much time on this!",
    url: "https://www.slimeclock.com",
    videoSrc: "/videos/slimeClock.mp4",
  },
  {
    name: "Conway's Symphony of Life",
    description:
      "A synthesizer powered by Conway's Game of Life. Try it out! Not recommended on mobile, sorry!",
    url: "https://conways-symphony-of-life.vercel.app/",
    videoSrc: "/videos/symphonyOfLife.mp4",
  },
  {
    name: "React Three Fiber Experiments",
    description: "Various experiments and projects using React Three Fiber.",
    url: "https://claytonmain-r3f-experiments.vercel.app/attractor",
    videoSrc: "/videos/r3fExperiments.mp4",
  },
  {
    name: "Clock Envy (WIP)",
    description:
      "A bunch of different clocks to showcase different shaders, techniques, ideas and whatnot. Desktop recommended.",
    url: "https://www.clockenvy.com",
    videoSrc: "/videos/clockEnvy.mp4",
  },
];
