import { motion } from "motion/react";

export default function ContactHtml() {
  return (
    <motion.div
      className="flex h-full w-full items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl font-bold text-white">Contact Page</h1>
    </motion.div>
  );
}
