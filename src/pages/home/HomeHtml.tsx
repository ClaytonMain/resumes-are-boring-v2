import { motion } from "motion/react";
import useAppStore from "../../stores/useAppStore";

export default function HomeHtml() {
  const baseDelay = 0.5;
  const delayFactor = 0.5;
  const animateDuration = 0.35;
  const animateEase = "easeIn";

  return (
    <motion.div
      key="enter-html-content-div"
      className="pointer-events-auto m-auto flex flex-col justify-center overflow-hidden rounded-lg border border-rose-500 p-2"
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
          onAnimationComplete={() =>
            useAppStore.setState({ displayThreeBackground: true })
          }
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
          className="text-sm tracking-wide"
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
