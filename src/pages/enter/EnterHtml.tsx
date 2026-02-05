import { motion } from "motion/react";

export default function EnterHtml() {
  return (
    <motion.div
      className="flex h-full w-full items-center justify-center bg-slate-950/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="flex h-full w-full items-center justify-center rounded-2xl bg-amber-700/20 sm:h-10/12 sm:w-7/12">
        test
      </motion.div>
    </motion.div>
  );
}
