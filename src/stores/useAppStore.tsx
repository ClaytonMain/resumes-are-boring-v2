import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import type { AppStore } from "../types/types";

const persistList: (keyof AppStore)[] = [
  // "firstVisit",
  // "disableStrobeEffects",
  // "skipIntro",
];

const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    persist(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_set) => ({
        currentPage: "home",
        debug: false,

        introState: "initial",

        threeBackgroundComponentReady: false,
        initialComponentsReady: false,

        flavorTextIndex: 0,

        activeSkillIndex: 0,

        activeProjectIndex: 0,
      }),
      {
        name: "resumes-are-boring-app-store",
        version: 0,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) =>
              persistList.includes(key as keyof AppStore),
            ),
          ),
      },
    ),
  ),
);

export default useAppStore;
