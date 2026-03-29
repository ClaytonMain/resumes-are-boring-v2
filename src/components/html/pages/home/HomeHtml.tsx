import { motion, type Easing } from "motion/react";
import { useEffect, useState } from "react";
import {
  FLAVOR_TEXT_VALUES,
  PAGE_HTML_STYLE_CONFIGS,
} from "../../../../constants/constants";
import useAppStore from "../../../../stores/useAppStore";

const VARIANT_EASE_IN: Easing = "easeIn";
const CONTAINER_INTRO_STATE_VARIANTS = {
  initial: { opacity: 0, color: "#0000001a", borderColor: "#ffffff1a" },
  showingText: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.5, when: "beforeChildren" },
    backgroundColor: "#0000001a",
    borderColor: "#ffffff1a",
  },
  transitioning: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.5, when: "beforeChildren" },
    backgroundColor: "#0000001a",
    borderColor: "#ffffff1a",
  },
  final: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: VARIANT_EASE_IN,
    },
    backgroundColor: PAGE_HTML_STYLE_CONFIGS.home.bg,
    color: PAGE_HTML_STYLE_CONFIGS.home.text,
    borderColor: PAGE_HTML_STYLE_CONFIGS.home.border,
  },
};
const TEXT_INTRO_STATE_VARIANTS = {
  initial: { opacity: 0 },
  showingText: (custom: number) => ({
    opacity: 1,
    transition: {
      duration: 0.35,
      delay: 0.5 + 0.75 * custom,
      ease: VARIANT_EASE_IN,
    },
  }),
  transitioning: {
    opacity: 1,
  },
  final: {
    opacity: 1,
  },
};
const FLAVOR_TEXT_INTRO_STATE_VARIANTS = {
  initial: { opacity: 0 },
  showingText: {
    opacity: 0,
  },
  transitioning: {
    opacity: 0,
  },
  final: {
    opacity: 1,
    transition: { duration: 1.5, ease: VARIANT_EASE_IN },
  },
};

export default function HomeHtml() {
  const variant = useAppStore((state) => state.introState);
  const [flavorTextIndex] = useState(useAppStore.getState().flavorTextIndex);

  useEffect(() => {
    useAppStore.setState({
      flavorTextIndex: (flavorTextIndex + 1) % FLAVOR_TEXT_VALUES.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (useAppStore.getState().introState === "initial") {
        useAppStore.setState({ introState: "showingText" });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <motion.div
      key="home-html-content-div"
      className="pointer-events-auto m-auto flex flex-col justify-center overflow-hidden rounded-lg border p-1 text-3xl backdrop-blur-sm sm:p-1.5 sm:text-4xl md:p-2 md:text-6xl"
      variants={CONTAINER_INTRO_STATE_VARIANTS}
      initial={{ opacity: 0 }}
      animate={variant}
      exit={{ opacity: 0 }}
    >
      <motion.div
        key="enter-html-content-resumes-are-boring-div"
        className="m-1 flex items-center justify-center gap-2 sm:m-1.5 sm:gap-2.5 md:m-2 md:gap-4"
      >
        <motion.h1
          key="enter-resumes-h1"
          className="leading-none font-bold tracking-tighter text-gray-300/50"
          custom={0}
          variants={TEXT_INTRO_STATE_VARIANTS}
          initial={variant}
          animate={variant}
        >
          RÉSUMÉS
        </motion.h1>
        <motion.h1
          key="enter-are-h1"
          className="leading-none font-bold tracking-tighter text-gray-300/50"
          custom={1}
          variants={TEXT_INTRO_STATE_VARIANTS}
          initial={variant}
          animate={variant}
        >
          ARE
        </motion.h1>
        <motion.h1
          key="enter-boring-h1"
          className="leading-none font-bold tracking-tighter text-white"
          style={{
            WebkitTextStroke: "1px white",
          }}
          custom={2}
          variants={TEXT_INTRO_STATE_VARIANTS}
          initial={variant}
          animate={variant}
          onAnimationComplete={(a) => {
            if (a === "showingText") {
              useAppStore.setState({ introState: "transitioning" });
            }
          }}
        >
          BORING.
        </motion.h1>
      </motion.div>
      <motion.div
        key="enter-html-content-subtitle-div"
        className="m-1 flex justify-end italic sm:m-1.5 md:m-2"
      >
        <motion.p
          key="enter-subtitle-p"
          className="text-[10px] tracking-wide text-white sm:text-xs md:text-sm"
          variants={FLAVOR_TEXT_INTRO_STATE_VARIANTS}
          animate={variant}
        >
          {FLAVOR_TEXT_VALUES[flavorTextIndex]}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
