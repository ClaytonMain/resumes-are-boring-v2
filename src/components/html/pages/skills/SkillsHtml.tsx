import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion, wrap } from "motion/react";
import { useEffect, useState } from "react";
import {
  PAGE_HTML_STYLE_CONFIGS,
  SKILLS,
} from "../../../../constants/constants";
import useAppStore from "../../../../stores/useAppStore";

export default function SkillsHtml() {
  const [skillIndex, setSkillIndex] = useState(
    useAppStore.getState().activeSkillIndex,
  );
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    const unsubActiveSkillIndex = useAppStore.subscribe(
      (state) => state.activeSkillIndex,
      (value) => {
        if (value !== skillIndex) {
          setSkillIndex(value);
        }
      },
    );
    return () => {
      unsubActiveSkillIndex();
    };
  }, [skillIndex]);

  function handleClick(newDirection: 1 | -1) {
    const nextSkillIndex = wrap(0, SKILLS.length, skillIndex + newDirection);
    setDirection(newDirection);
    setSkillIndex(nextSkillIndex);
    useAppStore.setState({ activeSkillIndex: nextSkillIndex });
  }

  return (
    <motion.div
      key="skills-html-content-div"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.95, duration: 0.8 } }}
      exit={{ opacity: 0 }}
      className="flex h-svh w-full items-end justify-center gap-2"
    >
      <div
        className="pointer-events-auto mb-15 flex rounded-lg border backdrop-blur-sm"
        style={{
          backgroundColor: PAGE_HTML_STYLE_CONFIGS.skills.bg,
          color: PAGE_HTML_STYLE_CONFIGS.skills.text,
          borderColor: PAGE_HTML_STYLE_CONFIGS.skills.border,
        }}
      >
        <motion.button
          initial={false}
          onClick={() => handleClick(-1)}
          className="cursor-pointer"
          whileHover={{ backgroundColor: "#ffffff1a" }}
        >
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <ChevronLeftIcon className="h-14 w-12" />
          </motion.div>
        </motion.button>
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={SKILLS[skillIndex].name}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0, transition: { type: "spring" } }}
            exit={{ opacity: 0, x: direction * -50 }}
            className="my-auto w-64 text-center text-xl font-bold tracking-tight"
          >
            <motion.div>{SKILLS[skillIndex].name}</motion.div>
            <motion.div className="text-xs font-light tracking-tighter">
              {SKILLS[skillIndex].flavorText}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <motion.button
          initial={false}
          onClick={() => handleClick(1)}
          className="cursor-pointer"
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
