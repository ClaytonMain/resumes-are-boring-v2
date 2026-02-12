import { motion } from "motion/react";
import { useEffect, useState } from "react";
import useAppStore from "../../stores/useAppStore";

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
    transition: { duration: 0.5 },
    backgroundColor: "#f43f5e1a",
    borderColor: "#f43f5eff",
  },
};

export default function HomeHtml() {
  const [variant, setVariant] = useState("hide");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVariant("showBoring");
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const baseDelay = 1.0;
  const delayFactor = 0.75;
  const animateDuration = 0.35;
  const animateEase = "easeIn";

  return (
    <motion.div
      key="enter-html-content-div"
      className="pointer-events-auto m-auto flex flex-col justify-center overflow-hidden rounded-lg border p-2 backdrop-blur-sm"
      variants={CONTAINER_VARIANTS}
      initial="hide"
      animate={variant}
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
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: animateDuration,
              delay: baseDelay + delayFactor * 0,
              ease: animateEase,
            },
          }}
          exit={{
            opacity: 0,
            y: 20,
            transition: { duration: 0.25, delay: 0.3 },
          }}
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
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: animateDuration,
              delay: baseDelay + delayFactor * 1,
              ease: animateEase,
            },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.25, delay: 0.2 },
          }}
        >
          ARE
        </motion.h1>
        <motion.h1
          key="enter-boring-h1"
          className="text-6xl leading-none font-bold tracking-tighter text-white"
          style={{
            WebkitTextStroke: "1px white",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: animateDuration,
              delay: baseDelay + delayFactor * 2,
              ease: animateEase,
            },
          }}
          onAnimationComplete={() => {
            useAppStore.setState({ displayThreeBackground: true });
            setVariant("showFun");
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.25, delay: 0.1 },
          }}
        >
          BORING.
        </motion.h1>
      </motion.div>
      <motion.div
        key="enter-html-content-subtitle-div"
        className="m-2 flex italic"
      >
        <motion.p
          key="enter-subtitle-p"
          className="text-sm tracking-wide text-white"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: animateDuration,
              delay: baseDelay + delayFactor * 10,
              ease: animateEase,
            },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.25, delay: 0.0 },
          }}
        >
          But my website isn't.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
