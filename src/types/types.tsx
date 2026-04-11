import * as THREE from "three";

export type Page = "about" | "contact" | "home" | "projects" | "skills";

export interface AppStore {
  currentPage: Page;
  debug: boolean;

  introState: "initial" | "showingText" | "transitioning" | "final";

  threeBackgroundComponentReady: boolean;
  initialComponentsReady: boolean;

  flavorTextIndex: number;

  activeSkillIndex: number;

  activeProjectIndex: number;
}

export type StatsPosition = "tl" | "tr" | "bl" | "br";

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

type PageHtmlStyleConfig = {
  pageBg: string;
  bg: string;
  text: string;
  border: string;
  scrollBar0?: string;
  scrollBar1?: string;
  navigation?: {
    bg?: string;
    text?: string;
    border?: string;
    tabBg?: string;
    tabText?: string;
  };
};
export type PageHtmlStyleConfigs = Record<Page, PageHtmlStyleConfig>;
