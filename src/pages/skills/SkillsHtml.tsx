import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion } from "motion/react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { CONTENT_CONTAINER_CLASS_NAME } from "../../constants/constants";
import {
  AXIS_OPTIONS,
  SKILL_CATEGORIES,
  SKILLS,
  TYPE_CATEGORIES,
} from "./constants";
import type {
  AxisOption,
  SkillCategory,
  SkillName,
  TypeCategory,
} from "./types";

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
    <div className="flex flex-col text-sm">
      <motion.div
        className="flex cursor-pointer items-center gap-1 p-1 font-thin"
        onClick={onTitleClick}
        whileHover={{ backgroundColor: "#365314" }}
        style={{ backgroundColor: "#1a2e05" }}
      >
        <span className="grow">{title}</span>
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
            className="flex max-h-32 flex-col gap-0.5 overflow-y-auto pl-2 text-sm font-thin"
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

function ControlsComponent({
  selectedTypeCategories,
  setSelectedTypeCategories,
  selectedSkillCategories,
  setSelectedSkillCategories,
  selectedXAxisOption,
  setSelectedXAxisOption,
  selectedYAxisOption,
  setSelectedYAxisOption,
}: {
  selectedTypeCategories: TypeCategory[];
  setSelectedTypeCategories: Dispatch<SetStateAction<TypeCategory[]>>;
  selectedSkillCategories: SkillCategory[];
  setSelectedSkillCategories: Dispatch<SetStateAction<SkillCategory[]>>;
  selectedXAxisOption: AxisOption;
  setSelectedXAxisOption: Dispatch<SetStateAction<AxisOption>>;
  selectedYAxisOption: AxisOption;
  setSelectedYAxisOption: Dispatch<SetStateAction<AxisOption>>;
}) {
  const [activeAccordion, setActiveAccordion] = useState<
    "type" | "skill" | "xAxis" | "yAxis" | null
  >(null);

  function onTypeCategorySelect(item: string) {
    setSelectedTypeCategories((prev) =>
      prev.includes(item as TypeCategory)
        ? prev.filter((i) => i !== item)
        : [...prev, item as TypeCategory],
    );
  }
  function onSkillCategorySelect(item: string) {
    setSelectedSkillCategories((prev) =>
      prev.includes(item as SkillCategory)
        ? prev.filter((i) => i !== item)
        : [...prev, item as SkillCategory],
    );
  }
  function onXAxisOptionSelect(item: string) {
    setSelectedXAxisOption(item as AxisOption);
  }
  function onYAxisOptionSelect(item: string) {
    setSelectedYAxisOption(item as AxisOption);
  }

  function onTitleClick(
    accordion: "type" | "skill" | "xAxis" | "yAxis" | null,
  ) {
    setActiveAccordion((prev) => (prev === accordion ? null : accordion));
  }

  return (
    <div className="flex w-56 flex-col justify-center bg-lime-400/10">
      <AccordionMultiSelectComponent
        isActive={activeAccordion === "type"}
        title="Type Categories"
        allItems={TYPE_CATEGORIES}
        selectedItems={selectedTypeCategories}
        onItemSelect={onTypeCategorySelect}
        onTitleClick={() => onTitleClick("type")}
      />
      <AccordionMultiSelectComponent
        isActive={activeAccordion === "skill"}
        title="Skill Categories"
        allItems={SKILL_CATEGORIES}
        selectedItems={selectedSkillCategories}
        onItemSelect={onSkillCategorySelect}
        onTitleClick={() => onTitleClick("skill")}
      />
      <AccordionMultiSelectComponent
        isActive={activeAccordion === "xAxis"}
        title="X-Axis"
        allItems={AXIS_OPTIONS}
        selectedItems={[selectedXAxisOption]}
        onItemSelect={onXAxisOptionSelect}
        onTitleClick={() => onTitleClick("xAxis")}
      />
      <AccordionMultiSelectComponent
        isActive={activeAccordion === "yAxis"}
        title="Y-Axis"
        allItems={AXIS_OPTIONS}
        selectedItems={[selectedYAxisOption]}
        onItemSelect={onYAxisOptionSelect}
        onTitleClick={() => onTitleClick("yAxis")}
      />
    </div>
  );
}

function ScatterplotDotComponent({
  skillName,
  selectedTypeCategories,
  selectedSkillCategories,
  selectedXAxisOption,
  selectedYAxisOption,
  setActiveSkillName,
}: {
  skillName: SkillName;
  selectedTypeCategories: TypeCategory[];
  selectedSkillCategories: SkillCategory[];
  selectedXAxisOption: AxisOption;
  selectedYAxisOption: AxisOption;
  setActiveSkillName: Dispatch<SetStateAction<SkillName | null>>;
}) {
  const skill = SKILLS.find((s) => s.name === skillName)!;

  const typeCategoryMatch =
    selectedTypeCategories.length === 0 ||
    selectedTypeCategories.includes(skill.typeCategory);
  const skillCategoryMatch =
    selectedSkillCategories.length === 0 ||
    skill.skillCategories === "auto" ||
    skill.skillCategories.some((sc) => selectedSkillCategories.includes(sc));

  if (!typeCategoryMatch || !skillCategoryMatch) {
    return null;
  }

  function getAxisValue(option: AxisOption) {
    switch (option) {
      case "Proficiency":
        return skill.proficiency;
      case "Years Professional":
        return skill.years.professional === -1 ? 10 : skill.years.professional;
      case "Years Personal":
        return skill.years.personal === -1 ? 10 : skill.years.personal;
      case "Personal Enjoyment":
        return skill.personalEnjoyment;
    }
  }

  const x = getAxisValue(selectedXAxisOption);
  const y = getAxisValue(selectedYAxisOption);

  return (
    <div
      className="absolute aspect-square h-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-lime-400"
      style={{
        left: `${(x / 10) * 100}%`,
        bottom: `${(y / 10) * 100}%`,
      }}
      onClick={() => setActiveSkillName(skill.name)}
      title={skill.name}
    />
  );
}

function ScatterplotComponent({
  selectedTypeCategories,
  selectedSkillCategories,
  selectedXAxisOption,
  selectedYAxisOption,
  activeSkillName,
  setActiveSkillName,
}: {
  selectedTypeCategories: TypeCategory[];
  selectedSkillCategories: SkillCategory[];
  selectedXAxisOption: AxisOption;
  selectedYAxisOption: AxisOption;
  activeSkillName: SkillName | null;
  setActiveSkillName: Dispatch<SetStateAction<SkillName | null>>;
}) {
  return (
    <div className="relative h-full w-full flex-col gap-1 rounded border border-lime-400">
      <div
        key="vertical-axis-and-dots-container"
        className="absolute top-0 right-0 bottom-0 left-0"
      >
        <div
          key="vertical-axis"
          className="absolute top-0 bottom-0 left-0 w-8"
          style={{
            writingMode: "vertical-lr",
            textOrientation: "sideways",
          }}
        >
          {selectedYAxisOption}
        </div>
        <div className="relative top-0 right-0 bottom-0 left-8 aspect-square bg-lime-400/10">
          {SKILLS.map((skill) => (
            <ScatterplotDotComponent
              key={skill.name}
              skillName={skill.name}
              selectedTypeCategories={selectedTypeCategories}
              selectedSkillCategories={selectedSkillCategories}
              selectedXAxisOption={selectedXAxisOption}
              selectedYAxisOption={selectedYAxisOption}
              setActiveSkillName={setActiveSkillName}
            />
          ))}
        </div>
      </div>
      <div
        key="empty-space-and-horizontal-axis-container"
        className="absolute right-0 bottom-0 left-0 flex h-8 items-center gap-2"
      >
        <div className="w-8" />
        <div key="horizontal-axis" className="flex-1">
          {selectedXAxisOption}
        </div>
      </div>
    </div>
  );
}

function SkillsComponent() {
  const [selectedTypeCategories, setSelectedTypeCategories] = useState<
    TypeCategory[]
  >([]);
  const [selectedSkillCategories, setSelectedSkillCategories] = useState<
    SkillCategory[]
  >([]);
  const [selectedXAxisOption, setSelectedXAxisOption] =
    useState<AxisOption>("Proficiency");
  const [selectedYAxisOption, setSelectedYAxisOption] =
    useState<AxisOption>("Years Professional");
  const [activeSkillName, setActiveSkillName] = useState<SkillName | null>(
    null,
  );

  return (
    <div className="flex h-full w-full gap-1">
      <ControlsComponent
        selectedTypeCategories={selectedTypeCategories}
        setSelectedTypeCategories={setSelectedTypeCategories}
        selectedSkillCategories={selectedSkillCategories}
        setSelectedSkillCategories={setSelectedSkillCategories}
        selectedXAxisOption={selectedXAxisOption}
        setSelectedXAxisOption={setSelectedXAxisOption}
        selectedYAxisOption={selectedYAxisOption}
        setSelectedYAxisOption={setSelectedYAxisOption}
      />
      {/* Scatterplot display square */}
      <ScatterplotComponent
        selectedTypeCategories={selectedTypeCategories}
        selectedSkillCategories={selectedSkillCategories}
        selectedXAxisOption={selectedXAxisOption}
        selectedYAxisOption={selectedYAxisOption}
        activeSkillName={activeSkillName}
        setActiveSkillName={setActiveSkillName}
      />
      {/* Area to display skill details */}
    </div>
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
