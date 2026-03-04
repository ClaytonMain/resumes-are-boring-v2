import { motion, type Easing } from "motion/react";
import { useEffect, useState } from "react";
import {
  CONTENT_CONTAINER_CLASS_NAME,
  FLAVOR_TEXT_VALUES,
} from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";

const VARIANT_EASE_IN: Easing = "easeIn";
// const baseDelay = 1.0;
// const delayFactor = 0.75;
// const animateDuration = 0.35;
// const animateEase = "easeIn";
const CONTAINER_VARIANTS = {
  hide: { opacity: 0, color: "#0000001a", borderColor: "#ffffff1a" },
  showBoring: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.5, when: "beforeChildren" },
    backgroundColor: "#0000001a",
    borderColor: "#ffffff1a",
  },
  showFun: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: VARIANT_EASE_IN,
    },
    backgroundColor: "#f43f5e1a",
    borderColor: "#f43f5eff",
  },
};
const RESUMES_ARE_BORING_VARIANTS = {
  hide: { opacity: 0 },
  showBoring: (custom: number) => ({
    opacity: 1,
    transition: {
      duration: 0.35,
      delay: 0.5 + 0.75 * custom,
      ease: VARIANT_EASE_IN,
    },
  }),
  showFun: {
    opacity: 1,
  },
};
const FLAVOR_TEXT_VARIANTS = {
  hide: { opacity: 0 },
  showBoring: {
    opacity: 0,
  },
  showFun: {
    opacity: 1,
    transition: { duration: 1.5, ease: VARIANT_EASE_IN },
  },
};

export default function HomeHtml() {
  const [variant, setVariant] = useState(
    useAppStore.getState().isBoring ? "hide" : "showFun",
  );
  const [flavorTextIndex] = useState(useAppStore.getState().flavorTextIndex);

  useEffect(() => {
    useAppStore.setState({
      flavorTextIndex: (flavorTextIndex + 1) % FLAVOR_TEXT_VALUES.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (useAppStore.getState().isBoring === true) {
        setVariant("showBoring");
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const unsubIsBoring = useAppStore.subscribe(
      (state) => state.isBoring,
      (value, previousValue) => {
        if (value === false && previousValue === true) {
          setVariant("showFun");
        }
      },
    );
    return () => {
      unsubIsBoring();
    };
  }, []);

  return (
    <motion.div
      key="home-html-content-div"
      className={CONTENT_CONTAINER_CLASS_NAME}
      variants={CONTAINER_VARIANTS}
      initial={{ opacity: 0 }}
      animate={variant}
      exit={{ opacity: 0 }}
    >
      <motion.div
        key="enter-html-content-resumes-are-boring-div"
        className="m-2 flex items-center justify-center gap-4"
      >
        <motion.h1
          key="enter-resumes-h1"
          className="text-6xl leading-none font-bold tracking-tighter"
          style={{
            WebkitTextStroke: "1px white",
            color: "transparent",
          }}
          custom={0}
          variants={RESUMES_ARE_BORING_VARIANTS}
          initial={variant}
          animate={variant}
        >
          RÉSUMÉS
        </motion.h1>
        <motion.h1
          key="enter-are-h1"
          className="text-6xl leading-none font-bold tracking-tighter"
          style={{
            WebkitTextStroke: "1px white",
            color: "transparent",
          }}
          custom={1}
          variants={RESUMES_ARE_BORING_VARIANTS}
          initial={variant}
          animate={variant}
        >
          ARE
        </motion.h1>
        <motion.h1
          key="enter-boring-h1"
          className="text-6xl leading-none font-bold tracking-tighter text-white"
          style={{
            WebkitTextStroke: "1px white",
          }}
          custom={2}
          variants={RESUMES_ARE_BORING_VARIANTS}
          initial={variant}
          animate={variant}
          onAnimationComplete={(a) => {
            if (a === "showBoring") {
              useAppStore.setState({ displayThreeBackground: true });
            }
          }}
        >
          BORING.
        </motion.h1>
      </motion.div>
      <motion.div
        key="enter-html-content-subtitle-div"
        className="m-2 flex justify-end italic"
      >
        <motion.p
          key="enter-subtitle-p"
          className="text-sm tracking-wide text-white"
          variants={FLAVOR_TEXT_VARIANTS}
          animate={variant}
        >
          {FLAVOR_TEXT_VALUES[flavorTextIndex]}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
