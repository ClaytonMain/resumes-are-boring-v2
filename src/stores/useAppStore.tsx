import * as THREE from "three";
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
        currentPage: "home",
        firstVisit: true,
        disableStrobeEffects: false,
        skipIntro: false,
        debug: false,
        cameraPositionTarget: DEFAULT_CAMERA_POSITION,
        cameraLookAtTarget: DEFAULT_CAMERA_LOOK_AT,
        cameraFovTarget: DEFAULT_CAMERA_FOV,
        cameraPositionUpdateRequestedAt: undefined,
        cameraLookAtUpdateRequestedAt: undefined,
        cameraFovUpdateRequestedAt: undefined,
        cameraPositionSpringConfig: undefined,
        cameraLookAtSpringConfig: undefined,
        cameraFovSpringConfig: undefined,
        cameraAtPositionTarget: false,
        cameraAtLookAtTarget: false,
        cameraAtFovTarget: false,

        displayThreeBackground: false,

        threeBackgroundComponentReady: false,
        initialComponentsReady: false,

        isBoring: true,

        flavorTextIndex: 0,

        targetBackgroundDiffuse: new THREE.Color("#ffa9a9"),
        targetBackgroundDiffuseUpdatedAt: Date.now(),
        targetBackgroundSubsurface: new THREE.Color("#ef0717"),
        targetBackgroundSubsurfaceUpdatedAt: Date.now(),

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
