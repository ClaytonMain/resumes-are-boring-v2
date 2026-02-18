import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CONTENT_CONTAINER_CLASS_NAME } from "../../constants/constants";

const WHO_AM_I = [
  "Data Person",
  "Frontend Developer",
  "Math Nerd",
  "Lorem Ipsum",
  "Something Dolores",
  "Quasi Something Something idk",
];

export default function AboutHtml() {
  const [whoAmIIndex, setWhoAmIIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWhoAmIIndex((prevIndex) => (prevIndex + 1) % WHO_AM_I.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="about-html-content-div"
      className={
        CONTENT_CONTAINER_CLASS_NAME + " " + "border-amber-400 bg-amber-400/10"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">I am a</h1>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h1
              key={whoAmIIndex}
              className="w-[700px] text-4xl font-bold tracking-tight text-amber-100"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              {WHO_AM_I[whoAmIIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
      <span className="w-full border-b border-amber-400" />
      <div>lorem ipsum lorem ipsum</div>
    </motion.div>
  );
}
