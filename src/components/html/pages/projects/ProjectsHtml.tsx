import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion, wrap } from "motion/react";
import { useEffect, useState } from "react";
import {
  PAGE_HTML_STYLE_CONFIGS,
  PROJECTS,
} from "../../../../constants/constants";
import useAppStore from "../../../../stores/useAppStore";

export default function ProjectsHtml() {
  const [projectIndex, setProjectIndex] = useState(
    useAppStore.getState().activeProjectIndex,
  );
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const unsubActiveProjectIndex = useAppStore.subscribe(
      (state) => state.activeProjectIndex,
      (value) => {
        if (value !== projectIndex) {
          setProjectIndex(value);
        }
      },
    );
    return () => {
      unsubActiveProjectIndex();
    };
  }, [projectIndex]);

  function handleClick(newDirection: 1 | -1) {
    const nextProjectIndex = wrap(
      0,
      PROJECTS.length,
      projectIndex + newDirection,
    );
    setDirection(newDirection);
    setProjectIndex(nextProjectIndex);
    useAppStore.setState({ activeProjectIndex: nextProjectIndex });
  }

  return (
    <motion.div
      key="projects-html-content-div"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.95, duration: 0.8 } }}
      exit={{ opacity: 0 }}
      className="flex h-full w-full items-end justify-center gap-2"
    >
      <div
        className="pointer-events-auto mb-10 flex gap-2 rounded-lg border backdrop-blur-sm"
        style={{
          backgroundColor: PAGE_HTML_STYLE_CONFIGS.projects.bg,
          color: PAGE_HTML_STYLE_CONFIGS.projects.text,
          borderColor: PAGE_HTML_STYLE_CONFIGS.projects.border,
        }}
      >
        <motion.button
          initial={false}
          onClick={() => handleClick(-1)}
          className="cursor-pointer rounded-l-lg"
          whileHover={{ backgroundColor: "#ffffff1a" }}
        >
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <ChevronLeftIcon className="h-14 w-12" />
          </motion.div>
        </motion.button>
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={PROJECTS[projectIndex].name}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0, transition: { type: "spring" } }}
            exit={{ opacity: 0, x: direction * -50 }}
            className="my-auto w-72 text-center text-xl font-bold tracking-tight"
          >
            <motion.a
              href={PROJECTS[projectIndex].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base italic underline"
            >
              {PROJECTS[projectIndex].name}
            </motion.a>
            <motion.div
              className="my-1 max-h-12 overflow-y-auto text-left text-xs font-light tracking-tighter"
              style={{
                scrollbarColor: `${PAGE_HTML_STYLE_CONFIGS.projects.scrollBar0} ${PAGE_HTML_STYLE_CONFIGS.projects.scrollBar1}`,
              }}
            >
              {PROJECTS[projectIndex].description}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <motion.button
          initial={false}
          onClick={() => handleClick(1)}
          className="cursor-pointer rounded-r-lg"
          whileHover={{ backgroundColor: "#ffffff1a" }}
        >
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <ChevronLeftIcon className="h-14 w-12 rotate-180" />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}
