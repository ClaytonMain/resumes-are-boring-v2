import type {
  AxisOption,
  Skill,
  SkillCategory,
  SkillName,
  TypeCategory,
} from "./types";

export const SKILL_NAMES: SkillName[] = [
  "Python",
  "SQL",
  "TypeScript",
  "GLSL",
  "Git",
  "Communication",
  "Problem Solving",
  "Time Management",
  "Creativity",
  "Snowflake",
  "dbt Cloud",
  "Airbyte",
  "Fivetran",
  "Hex",
  "VS Code",
  "Jira",
  "Google Sheets",
  "Shell",
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  "Data Vis.",
  "Data Eng.",
  "Data An.",
  "Data Wrang.",
  "Frontend",
  "Backend",
  "Graphics",
  "General Prog.",
  "Softskill",
];

export const TYPE_CATEGORIES: TypeCategory[] = [
  "Language",
  "Tool",
  "Softskill",
];

export const AXIS_OPTIONS: AxisOption[] = [
  "Proficiency",
  "Years Professional",
  "Years Personal",
  "Personal Enjoyment",
];

export const SKILLS: Skill[] = [
  {
    name: "Python",
    typeCategory: "Language",
    proficiency: 8,
    personalEnjoyment: 8,
    years: {
      professional: 8,
      personal: 10,
    },
    libsEtAl: [
      {
        name: "Pandas",
        proficiency: 8,
        skillCategories: ["Data Eng.", "Data An.", "Data Wrang."],
      },
      {
        name: "NumPy",
        proficiency: 7,
        skillCategories: ["Data An."],
      },
      {
        name: "Matplotlib",
        proficiency: 5,
        skillCategories: ["Data Vis."],
      },
      {
        name: "Requests",
        proficiency: 7,
        skillCategories: ["Data Wrang.", "Backend"],
      },
      {
        name: "BeautifulSoup",
        proficiency: 6,
        skillCategories: ["Data Wrang."],
      },
      {
        name: "Django",
        proficiency: 4,
        skillCategories: ["Backend"],
      },
      {
        name: "Google API Python Client",
        proficiency: 6,
        skillCategories: ["Data Wrang."],
      },
    ],
    skillCategories: "auto",
  },
  {
    name: "SQL",
    typeCategory: "Language",
    proficiency: 7,
    personalEnjoyment: 6,
    years: {
      professional: 7,
      personal: 0,
    },
    skillCategories: ["Data Eng.", "Data An.", "Data Wrang.", "Backend"],
  },
  {
    name: "TypeScript",
    typeCategory: "Language",
    proficiency: 7,
    personalEnjoyment: 8,
    years: {
      professional: 2,
      personal: 5,
    },
    libsEtAl: [
      {
        name: "React",
        proficiency: 7,
        skillCategories: ["Frontend"],
      },
      {
        name: "Three.js",
        proficiency: 7,
        skillCategories: ["Frontend", "Graphics"],
      },
      {
        name: "Motion",
        proficiency: 6,
        skillCategories: ["Frontend"],
      },
      {
        name: "Tailwind",
        proficiency: 6,
        skillCategories: ["Frontend"],
      },
    ],
    skillCategories: "auto",
    miscTags: ["Animation", "UI/UX", "Design"],
  },
  {
    name: "GLSL",
    typeCategory: "Language",
    proficiency: 6,
    personalEnjoyment: 9,
    years: {
      professional: 0,
      personal: 3,
    },
    skillCategories: ["Graphics"],
    miscTags: ["Shader Programming", "WebGL", "Linear Algebra"],
  },
  {
    name: "Git",
    typeCategory: "Tool",
    proficiency: 6,
    personalEnjoyment: 5,
    years: {
      professional: 5,
      personal: 7,
    },
    skillCategories: ["General Prog."],
  },
  {
    name: "Communication",
    typeCategory: "Softskill",
    proficiency: 7,
    personalEnjoyment: 6,
    years: {
      professional: -1,
      personal: -1,
    },
    skillCategories: ["Softskill"],
  },
  {
    name: "Problem Solving",
    typeCategory: "Softskill",
    proficiency: 9,
    personalEnjoyment: 10,
    years: {
      professional: -1,
      personal: -1,
    },
    skillCategories: ["Softskill"],
  },
  {
    name: "Time Management",
    typeCategory: "Softskill",
    proficiency: 7,
    personalEnjoyment: 6,
    years: {
      professional: -1,
      personal: -1,
    },
    skillCategories: ["Softskill"],
  },
  {
    name: "Creativity",
    typeCategory: "Softskill",
    proficiency: 9,
    personalEnjoyment: 10,
    years: {
      professional: -1,
      personal: -1,
    },
    skillCategories: ["Softskill"],
    miscTags: ["Original Math", "Adaptive", "Vision"],
  },
  {
    name: "Snowflake",
    typeCategory: "Tool",
    proficiency: 5,
    personalEnjoyment: 7,
    years: {
      professional: 2,
      personal: 0,
    },
    skillCategories: ["Data Eng.", "Data An.", "Data Wrang."],
    miscTags: ["Tasks"],
  },
  {
    name: "dbt Cloud",
    typeCategory: "Tool",
    proficiency: 6,
    personalEnjoyment: 8,
    years: {
      professional: 2,
      personal: 0,
    },
    skillCategories: ["Data Eng.", "Data An.", "Data Wrang."],
    miscTags: ["Semantic Layer", "DRY", "Transformation"],
  },
  {
    name: "Airbyte",
    typeCategory: "Tool",
    proficiency: 4,
    personalEnjoyment: 5,
    years: {
      professional: 1,
      personal: 0,
    },
    skillCategories: ["Data Eng.", "Data Wrang."],
    miscTags: ["EL", "No longer Used"],
  },
  {
    name: "Fivetran",
    typeCategory: "Tool",
    proficiency: 6,
    personalEnjoyment: 6,
    years: {
      professional: 1,
      personal: 0,
    },
    skillCategories: ["Data Eng.", "Data Wrang."],
    miscTags: ["EL"],
  },
  {
    name: "Hex",
    typeCategory: "Tool",
    proficiency: 7,
    personalEnjoyment: 9,
    years: {
      professional: 2,
      personal: 0,
    },
    skillCategories: ["Data Eng.", "Data Wrang.", "Data An.", "Data Vis."],
    miscTags: ["Conversational Analytics"],
  },
  {
    name: "VS Code",
    typeCategory: "Tool",
    proficiency: 8,
    personalEnjoyment: 8,
    years: {
      professional: 5,
      personal: 5,
    },
    libsEtAl: [
      {
        name: "Prettier",
        proficiency: 7,
        skillCategories: ["General Prog."],
      },
      {
        name: "ESLint",
        proficiency: 7,
        skillCategories: ["General Prog."],
      },
      {
        name: "dbt VS Code Extension",
        proficiency: 5,
        skillCategories: ["Data Eng.", "Data Wrang.", "Data An."],
      },
    ],
    skillCategories: ["General Prog."],
  },
  {
    name: "Jira",
    typeCategory: "Tool",
    proficiency: 4,
    personalEnjoyment: 6,
    years: {
      professional: 1,
      personal: 0,
    },
    skillCategories: ["General Prog."],
    miscTags: ["Proj. Mgmt.", "Scrum", "Recent Addition"],
  },
  {
    name: "Google Sheets",
    typeCategory: "Tool",
    proficiency: 10,
    personalEnjoyment: 3,
    years: {
      professional: -1,
      personal: -1,
    },
    libsEtAl: [
      {
        name: "Google Apps Script",
        proficiency: 8,
        skillCategories: ["Data Wrang.", "Data An.", "Data Vis.", "Backend"],
      },
    ],
    skillCategories: ["Data Wrang.", "Data An.", "Data Vis."],
  },
  {
    name: "Shell",
    typeCategory: "Tool",
    proficiency: 5,
    personalEnjoyment: 3,
    years: {
      professional: -1,
      personal: -1,
    },
    skillCategories: ["General Prog."],
  },
];
