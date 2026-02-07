import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from "zustand/middleware";
import {
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_POSITION,
} from "../constants/constants";
import type { AppStore } from "../types/types";

const persistList: (keyof AppStore)[] = [
  "firstVisit",
  "disableStrobeEffects",
  "skipIntro",
];

const useAppStore = create<AppStore>()(
  subscribeWithSelector(
    persist(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (_set) => ({
        currentPage: "enter",
        firstVisit: true,
        disableStrobeEffects: false,
        skipIntro: false,
        debug: false,
        enterState: "idleBoring",
        cameraPositionTarget: DEFAULT_CAMERA_POSITION.clone(),
        cameraLookAtTarget: DEFAULT_CAMERA_LOOK_AT.clone(),
        cameraFovTarget: DEFAULT_CAMERA_FOV,
        cameraPositionUpdateRequestedAt: Date.now(),
        cameraLookAtUpdateRequestedAt: Date.now(),
        cameraFovUpdateRequestedAt: Date.now(),
        cameraPositionSpringConfig: null,
        cameraLookAtSpringConfig: null,
        cameraFovSpringConfig: null,
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
