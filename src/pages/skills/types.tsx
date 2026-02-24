export type SkillName =
  | "Python"
  | "SQL"
  | "TypeScript"
  | "GLSL"
  | "Git"
  | "Communication"
  | "Problem Solving"
  | "Time Management"
  | "Creativity"
  | "Snowflake"
  | "dbt Cloud"
  | "Airbyte"
  | "Fivetran"
  | "Hex"
  | "VS Code"
  | "Jira"
  | "Google Sheets"
  | "Shell";

export type TypeCategory = "Language" | "Tool" | "Softskill";

type YearsExperience = {
  professional: number; // -1 if display as 10+
  personal: number;
};

type LibEtAl = {
  name: string;
  proficiency: number; // 1-10 scale
  skillCategories: SkillCategory[];
};

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
  typeCategory: TypeCategory;
  proficiency: number; // 1-10 scale
  personalEnjoyment: number; // 1-10 scale
  years: YearsExperience;
  libsEtAl?: LibEtAl[];
  skillCategories: SkillCategory[] | "auto";
  miscTags?: string[];
};

export type AxisOption =
  | "Proficiency"
  | "Years Professional"
  | "Years Personal"
  | "Personal Enjoyment";

export type ScatterplotAccordionLabel =
  | "Type Categories"
  | "Skill Categories"
  | "X Axis"
  | "Y Axis";
