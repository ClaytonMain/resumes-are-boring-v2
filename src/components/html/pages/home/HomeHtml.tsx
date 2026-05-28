import { motion, type Easing } from "motion/react";
import { useEffect, useState } from "react";
import {
  FLAVOR_TEXT_VALUES,
  PAGE_HTML_STYLE_CONFIGS,
} from "../../../../constants/constants";
import useAppStore from "../../../../stores/useAppStore";

const VARIANT_EASE_IN: Easing = "easeIn";
const BACKGROUND_COVER_INTRO_STATE_VARIANTS = {
  initial: { color: "#171717ff" },
  showingText: { color: "#171717ff" },
  transitioning: {
    color: "#17171700",
    transition: { duration: 1.5, ease: VARIANT_EASE_IN },
  },
  final: { color: "#17171700" },
};
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
const TEXT_INTRO_STATE_VARIANTS_00 = {
  initial: { opacity: 0, color: "#d1d5db80" },
  showingText: (custom: number) => ({
    opacity: 1,
    transition: {
      duration: 0.35,
      delay: 0.5 + 0.75 * custom,
      ease: VARIANT_EASE_IN,
    },
    color: "#d1d5db80",
  }),
  transitioning: {
    opacity: 1,
    color: "#d1d5db80",
  },
  final: {
    opacity: 1,
    color: "#ffffffff",
    transition: { duration: 1.5, ease: VARIANT_EASE_IN },
  },
};
const TEXT_INTRO_STATE_VARIANTS_01 = {
  initial: { opacity: 0, color: "#ffffffff" },
  showingText: (custom: number) => ({
    opacity: 1,
    transition: {
      duration: 0.35,
      delay: 0.5 + 0.75 * custom,
      ease: VARIANT_EASE_IN,
    },
    color: "#ffffffff",
  }),
  transitioning: {
    opacity: 1,
    color: "#ffffffff",
  },
  final: {
    opacity: 1,
    color: "#ffffffff",
    transition: { duration: 1.5, ease: VARIANT_EASE_IN },
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
      key="home-html-background-cover-div"
      className="pointer-events-none absolute top-0 left-0 z-0 flex h-full w-full items-center justify-center"
      variants={BACKGROUND_COVER_INTRO_STATE_VARIANTS}
      initial={variant}
      animate={variant}
    >
      <motion.div
        key="home-html-content-div"
        className="pointer-events-auto m-auto flex flex-col justify-center overflow-hidden rounded-lg border p-1 text-5xl backdrop-blur-sm sm:p-1.5 md:p-2 md:text-6xl"
        variants={CONTAINER_INTRO_STATE_VARIANTS}
        initial={{ opacity: 0 }}
        animate={variant}
        exit={{ opacity: 0 }}
      >
        <motion.div
          key="enter-html-content-resumes-are-boring-div"
          className="m-1 flex flex-col items-end justify-center gap-2 sm:m-1.5 sm:flex-row sm:items-center sm:gap-2.5 md:m-2 md:gap-4"
        >
          <motion.h1
            key="enter-resumes-h1"
            className="leading-none font-bold tracking-tighter"
            custom={0}
            variants={TEXT_INTRO_STATE_VARIANTS_00}
            initial={variant}
            animate={variant}
          >
            RÉSUMÉS
          </motion.h1>
          <motion.h1
            key="enter-are-h1"
            className="leading-none font-bold tracking-tighter"
            custom={1}
            variants={TEXT_INTRO_STATE_VARIANTS_00}
            initial={variant}
            animate={variant}
          >
            ARE
          </motion.h1>
          <motion.h1
            key="enter-boring-h1"
            className="leading-none font-bold tracking-tighter"
            style={{
              WebkitTextStroke: "1px white",
            }}
            custom={2}
            variants={TEXT_INTRO_STATE_VARIANTS_01}
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
          key="enter-html-content-flavor-text-div"
          className="m-1 flex justify-end italic sm:m-1.5 md:m-2"
        >
          <motion.p
            key="enter-flavor-text-p"
            className="text-[10px] tracking-wide sm:text-xs md:text-sm"
            variants={FLAVOR_TEXT_INTRO_STATE_VARIANTS}
            animate={variant}
          >
            {FLAVOR_TEXT_VALUES[flavorTextIndex]}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
