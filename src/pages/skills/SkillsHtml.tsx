import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { CONTENT_CONTAINER_CLASS_NAME } from "../../constants/constants";
import { TYPE_CATEGORIES } from "./constants";
import type { AxisOption, SkillCategory, TypeCategory } from "./types";

function AccordionMultiSelectComponent({
  isActive,
  title,
  allItems,
  selectedItems,
  onItemSelect,
  onTitleClick,
}: {
  isActive: boolean;
  title: string;
  allItems: string[];
  selectedItems: string[];
  onItemSelect: (item: string) => void;
  onTitleClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <motion.div
        className="flex cursor-pointer items-center gap-1"
        onClick={onTitleClick}
        whileHover={{ backgroundColor: "#365314" }}
        style={{ backgroundColor: "#1a2e05" }}
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-4 w-4 text-lime-400" />
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="flex max-h-32 flex-col gap-1 overflow-y-auto pl-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {allItems.map((item) => (
              <motion.div
                key={item}
                className={`cursor-pointer rounded px-1 ${
                  selectedItems.includes(item)
                    ? "bg-lime-400 text-black"
                    : "text-lime-400"
                }`}
                onClick={() => onItemSelect(item)}
                whileHover={{ backgroundColor: "#365314" }}
                style={{
                  backgroundColor: selectedItems.includes(item)
                    ? "#84cc16"
                    : "transparent",
                }}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ControlsComponent() {
  const [activeAccordion, setActiveAccordion] = useState<
    "type" | "skill" | "axes" | null
  >(null);
  const [selectedTypeCategories, setSelectedTypeCategories] = useState<
    TypeCategory[]
  >([]);
  const [selectedSkillCategories, setSelectedSkillCategories] = useState<
    SkillCategory[]
  >([]);
  const [selectedAxes, setSelectedAxes] = useState<{
    x: AxisOption;
    y: AxisOption;
  }>({ x: "Proficiency", y: "Years Professional" });
  return <div className="flex gap-2"></div>;
}

function SkillsComponent() {
  return (
    <>
      {/* Controls for selecting type categories, skill categories, selecting axes */}
      <ControlsComponent />
      {/* Scatterplot display square */}
      {/* Area to display skill details */}
    </>
  );
}

export default function SkillsHtml() {
  return (
    <motion.div
      key="skills-html-content-div"
      className={
        CONTENT_CONTAINER_CLASS_NAME + " " + "border-lime-400 bg-lime-400/10"
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex gap-2">
        <div className="flex gap-2 overflow-hidden">
          {/* <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={whoAmI[0]}
              className="text-4xl font-bold tracking-tight text-white"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              {whoAmI[0]}
            </motion.h1>
          </AnimatePresence> */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={"Skills"}
              className="text-4xl font-bold tracking-tight text-lime-100"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              Skills
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
      <span className="w-full border-b border-lime-400" />
      <div
        className="relative top-0 right-0 bottom-0 left-0 mt-1.5 flex h-64 w-150 snap-y snap-mandatory flex-col gap-2 overflow-y-scroll"
        style={{
          scrollbarColor: "#f7fee7 #84cc161a",
        }}
      >
        <SkillsComponent />
      </div>
    </motion.div>
  );
}
