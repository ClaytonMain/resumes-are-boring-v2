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

export type TypeCategory = "Language" | "Tool" | "Softskill";

export type AxisOption =
  | "Proficiency"
  | "Years Professional"
  | "Years Personal"
  | "Personal Enjoyment";

type LibEtAl = {
  name: string;
  proficiency: number; // 1-10 scale
  skillCategories: SkillCategory[];
};

type YearsExperience = {
  professional: number; // -1 if display as 10+
  personal: number;
};

export type Skill = {
  name: string;
  typeCategory: TypeCategory;
  proficiency: number; // 1-10 scale
  personalEnjoyment: number; // 1-10 scale
  years: YearsExperience;
  libsEtAl?: LibEtAl[];
  skillCategories: SkillCategory[] | "auto";
  miscTags?: string[];
};
