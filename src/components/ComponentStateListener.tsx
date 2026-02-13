import { useEffect } from "react";
import useAppStore from "../stores/useAppStore";
import type { AppStore } from "../types/types";

export default function ComponentStateListener() {
  useEffect(() => {
    const expectedKeys: (keyof AppStore)[] = ["threeBackgroundComponentReady"];
    const intervalId = setInterval(() => {
      const state = useAppStore.getState();
      const allKeysReady = expectedKeys.every((key) => state[key]);
      if (allKeysReady) {
        useAppStore.setState({ initialComponentsReady: true });
        clearInterval(intervalId);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  return null;
}
