import { useEffect } from "react";
import { PAGE_HTML_STYLE_CONFIGS } from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";

export default function BackgroundColorController() {
  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value !== previousValue) {
          const introState = useAppStore.getState().introState;
          if (introState !== "final") {
            document.body.style.backgroundColor = "#171717";
            return;
          } else {
            document.body.style.backgroundColor =
              PAGE_HTML_STYLE_CONFIGS[value].pageBg;
          }
        }
      },
    );
    const unsubIntroState = useAppStore.subscribe(
      (state) => state.introState,
      (value, previousValue) => {
        if (value !== previousValue) {
          if (value === "final") {
            const currentPage = useAppStore.getState().currentPage;
            document.body.style.backgroundColor =
              PAGE_HTML_STYLE_CONFIGS[currentPage].pageBg;
          }
        }
      },
    );
    return () => {
      unsubCurrentPage();
      unsubIntroState();
    };
  }, []);

  return null;
}
