import NumberFlow from "@number-flow/react";
import { Html } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";

export function SkillsDreiHtmlComponent({
  index,
  springsActive,
  value,
  label,
}: {
  index: number;
  springsActive: boolean;
  value: number;
  label: string;
}) {
  return (
    <Html>
      <AnimatePresence>
        {springsActive && (
          <motion.div
            key={`skills-html-content-div-${index}`}
            className="top-0 bottom-0 -translate-x-1/2 -translate-y-25 transform text-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.05 * index } }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="mb-1 text-center text-sm tracking-tight">
              {label}
            </motion.div>
            <NumberFlow
              className="w-full text-center text-2xl font-bold"
              format={{ minimumFractionDigits: 1 }}
              value={value}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
}
