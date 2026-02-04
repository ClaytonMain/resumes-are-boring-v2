export const rubikMonoOneJson = "fonts/RubikMonoOne-Regular.json";
export const rubikMonoOneTTF = "fonts/RubikMonoOne-Regular.ttf";
export const pixelifySansJson = "fonts/PixelifySans-Regular.json";
export const pixelifySansTTF = "fonts/PixelifySans-Regular.ttf";
export const kodeMonoTTF = "fonts/KodeMono-Regular.ttf";
export const kodeMonoJson = "fonts/KodeMono-Regular.json";
export const vt323TTF = "fonts/VT323-Regular.ttf";
export const vt323Json = "fonts/VT323-Regular.json";
export const screenTransitionMs = 1500;
export type CameraConfig = {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
};
type SceneConfig = {
    camera: CameraConfig;
};

export type SceneName =
    | "introInitial"
    | "enteringMonitor"
    | "resumeInitial"
    | "skills"
    | "workHistory"
    | "idkTwo";
export const sceneNames: SceneName[] = [
    "introInitial",
    "enteringMonitor",
    "resumeInitial",
    "skills",
    "workHistory",
    "idkTwo",
];
export const iterableSceneNames: SceneName[] = [
    "resumeInitial",
    "skills",
    "workHistory",
    "idkTwo",
];
export const sceneConfigs: { [K in SceneName]: SceneConfig } = {
    introInitial: {
        camera: {
            position: [0, 0.975, 2.23],
            target: [0, 1.25, 0],
            fov: 90,
        },
    },
    enteringMonitor: {
        camera: {
            position: [0, 0.975, 2.23],
            target: [0, 0.975, 0],
            fov: 10,
        },
    },
    resumeInitial: {
        camera: {
            position: [0, 0.975, 2.23],
            target: [0, 1.25, 0],
            fov: 90,
        },
    },
    skills: {
        camera: {
            position: [5.2, 3.5, 1.8],
            target: [9, 4.8, 1.8],
            fov: 50,
        },
    },
    workHistory: {
        camera: {
            position: [5, 2, 5],
            target: [10, 2, 10],
            fov: 35,
        },
    },
    idkTwo: {
        camera: {
            position: [0, 0.975, 2.23],
            target: [-1.7, 1.24389, 3.7],
            fov: 120,
        },
    },
};
export type SkillsNames =
    | "Google Sheets"
    | "JavaScript"
    | "Postgres"
    | "Python"
    | "Critical Thinking"
    | "Placeholder Skill 0"
    | "Placeholder Skill 1"
    | "Placeholder Skill 2"
    | "Placeholder Skill 3"
    | "Placeholder Skill 4"
    | "Placeholder Skill 5"
    | "Placeholder Skill 6"
    | "Placeholder Skill 7"
    | "Placeholder Skill 8"
    | "Placeholder Skill 9";
