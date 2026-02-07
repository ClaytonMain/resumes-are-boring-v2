import { motion } from "motion/react";

export default function EnterHtml() {
  return (
    <motion.div
      className="flex h-full w-full items-center justify-center bg-slate-950/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="flex h-10/12 w-full flex-col rounded-xl border px-12 pt-12 pb-8 sm:w-5/12">
        <motion.h1
          className="my-0 py-0 text-7xl font-bold tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.75, delay: 0.75 },
          }}
          exit={{
            opacity: 0,
            y: 20,
            transition: { duration: 0.25, delay: 0.0 },
          }}
        >
          RÉSUMÉS
        </motion.h1>
        <motion.h1
          className="my-0 py-0 text-7xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.75, delay: 1.5 },
          }}
          exit={{
            opacity: 0,
            y: 20,
            transition: { duration: 0.25, delay: 0.25 },
          }}
        >
          ARE
        </motion.h1>
        <motion.h1
          className="my-0 py-0 text-7xl font-bold tracking-tighter"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.75, delay: 2.25 },
          }}
          exit={{
            opacity: 0,
            y: 20,
            transition: { duration: 0.25, delay: 0.5 },
          }}
        >
          BORING.
        </motion.h1>
        <motion.div
          className="mt-auto flex justify-end text-2xl font-thin tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.75, delay: 5 } }}
          exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.75 } }}
        >
          click to continue
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
