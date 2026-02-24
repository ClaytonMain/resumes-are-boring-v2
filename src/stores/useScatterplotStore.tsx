import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import type { ScatterplotStore } from "../types/types";

const persistList: (keyof ScatterplotStore)[] = [];

const useScatterplotStore = create<ScatterplotStore>()(
  subscribeWithSelector(
    persist(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_set) => ({
        selectedTypeCategories: [],
        selectedSkillCategories: [],
        selectedXAxisOption: "Years Professional",
        selectedYAxisOption: "Proficiency",
        activeSkillName: null,
        activeAccordion: null,
      }),
      {
        name: "resumes-are-boring-scatterplot-store",
        version: 0,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(([key]) =>
              persistList.includes(key as keyof ScatterplotStore),
            ),
          ),
      },
    ),
  ),
);

export default useScatterplotStore;
