import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { PAGE_HTML_STYLE_CONFIGS, PAGE_NAMES } from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";

type NavigationAnimate = {
  opacity: number;
  backgroundColor: string;
  color: string;
  borderColor: string;
};

type TabAnimate = {
  opacity: number;
  backgroundColor: string;
  color: string;
};

function getCurrentNavigationAnimate(): NavigationAnimate {
  const currentPage = useAppStore.getState().currentPage;
  const introState = useAppStore.getState().introState;
  const baseConfig: NavigationAnimate = {
    opacity: 0,
    backgroundColor: "#000000ff",
    color: "#000000ff",
    borderColor: "#000000ff",
  };
  const pageConfig = PAGE_HTML_STYLE_CONFIGS[currentPage];
  if (introState !== "final") {
    return baseConfig;
  } else {
    return {
      opacity: 1,
      backgroundColor: pageConfig.navigation?.bg || pageConfig.bg,
      color: pageConfig.navigation?.text || pageConfig.text,
      borderColor: pageConfig.navigation?.border || pageConfig.border,
    };
  }
}

function getCurrentTabAnimate(): TabAnimate {
  const currentPage = useAppStore.getState().currentPage;
  const introState = useAppStore.getState().introState;
  const baseConfig: TabAnimate = {
    opacity: 0,
    backgroundColor: "#000000ff",
    color: "#000000ff",
  };
  const pageConfig = PAGE_HTML_STYLE_CONFIGS[currentPage];
  if (introState !== "final") {
    return baseConfig;
  } else {
    return {
      opacity: 1,
      backgroundColor: pageConfig.navigation?.tabBg || "#ffffffff",
      color: pageConfig.navigation?.tabText || "#000000ff",
    };
  }
}

export default function Navigation() {
  const [currentPage, setCurrentPage] = useState(
    useAppStore.getState().currentPage,
  );
  const [nameHovered, setNameHovered] = useState(false);
  const [navigationAnimate, setNavigationAnimate] = useState<NavigationAnimate>(
    getCurrentNavigationAnimate(),
  );
  const [tabAnimate, setTabAnimate] = useState<TabAnimate>(
    getCurrentTabAnimate(),
  );

  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value !== previousValue) {
          setCurrentPage(value);
          useAppStore.setState({ introState: "final" });
          const timeoutId = setTimeout(() => {
            setNavigationAnimate(getCurrentNavigationAnimate());
            setTabAnimate(getCurrentTabAnimate());
          }, 1200);
          return () => clearTimeout(timeoutId);
        }
      },
    );
    const unsubIntroState = useAppStore.subscribe(
      (state) => state.introState,
      (value, previousValue) => {
        if (value !== previousValue) {
          const timeoutId = setTimeout(() => {
            setNavigationAnimate(getCurrentNavigationAnimate());
            setTabAnimate(getCurrentTabAnimate());
          }, 1200);
          return () => clearTimeout(timeoutId);
        }
      },
    );
    return () => {
      unsubCurrentPage();
      unsubIntroState();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.nav
      initial={{
        opacity: 0,
      }}
      animate={navigationAnimate}
      transition={{ duration: 1.0 }}
      className="pointer-events-auto fixed top-0 left-0 z-10 flex w-full items-stretch border-b px-8 backdrop-blur-sm select-none"
    >
      <motion.div
        className="my-3 flex items-center gap-1"
        onPointerEnter={() => setNameHovered(true)}
        onPointerLeave={() => setNameHovered(false)}
      >
        <h2 className="text-2xl font-light tracking-tight">CLAYTON MAIN</h2>
        <AnimatePresence>
          {nameHovered && (
            <motion.div
              className="text-sm tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {"👈 That's me!"}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="ml-auto flex items-center justify-center gap-2">
        {PAGE_NAMES.map((page) => (
          <motion.div
            key={page}
            className="relative top-0 flex h-[calc(100%+18px)] cursor-pointer items-center p-1 text-2xl font-light tracking-tight select-none"
            initial={false}
            animate={{
              color:
                page === currentPage
                  ? tabAnimate.color
                  : navigationAnimate.color,
            }}
            transition={{
              duration: 1.0,
            }}
            onClick={() => useAppStore.setState({ currentPage: page })}
          >
            {page.toUpperCase()}
            {page === currentPage ? (
              <motion.div
                className="absolute right-0 bottom-0 left-0 -z-1 h-full rounded-b-lg"
                layoutId="selected-page-nav-indicator"
                id="selected-page-nav-indicator"
              >
                <motion.div
                  className="h-full w-full rounded-b-lg"
                  initial={false}
                  animate={tabAnimate}
                  transition={{ duration: 1.0 }}
                />
              </motion.div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
}
