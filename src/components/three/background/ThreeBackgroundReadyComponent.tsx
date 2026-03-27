import { useEffect } from "react";
import useAppStore from "../../../stores/useAppStore";

export default function ThreeBackgroundReadyComponent() {
  useEffect(() => {
    useAppStore.setState({ threeBackgroundComponentReady: true });
  }, []);
  return null;
}
