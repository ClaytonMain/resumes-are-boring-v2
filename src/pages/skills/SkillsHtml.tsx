import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import { CONTENT_CONTAINER_CLASS_NAME } from "../../constants/constants";
import useScatterplotStore from "../../stores/useScatterplotStore";
import {
  AXIS_OPTIONS,
  SKILL_CATEGORIES,
  SKILLS,
  TYPE_CATEGORIES,
} from "./constants";
import type {
  AxisOption,
  ScatterplotAccordionLabel,
  SkillCategory,
  SkillName,
  TypeCategory,
} from "./types";

function AccordionSelectComponent({
  accordionLabel,
  allItems,
  storePath,
}: {
  accordionLabel: ScatterplotAccordionLabel;
  allItems: string[];
  storePath:
    | "selectedTypeCategories"
    | "selectedSkillCategories"
    | "selectedXAxisOption"
    | "selectedYAxisOption";
}) {
  const activeAccordion = useScatterplotStore((state) => state.activeAccordion);
  const selectedItems = useScatterplotStore((state) => state[storePath]);

  function onTitleClick() {
    useScatterplotStore.setState({
      activeAccordion:
        activeAccordion === accordionLabel ? null : accordionLabel,
    });
  }

  function onItemSelect(e: MouseEvent<HTMLDivElement>, item: string) {
    if (typeof selectedItems === "string") {
      useScatterplotStore.setState({
        [storePath]: item,
        updatedAt: e.timeStamp,
      } as never);
    } else {
      const metaKey = e.metaKey || e.ctrlKey;
      if (metaKey) {
        if (selectedItems.includes(item as never)) {
          useScatterplotStore.setState({
            [storePath]: selectedItems.filter((i) => i !== item) as never,
            updatedAt: e.timeStamp,
          });
        } else {
          useScatterplotStore.setState({
            [storePath]: [...selectedItems, item] as never,
            updatedAt: e.timeStamp,
          });
        }
      } else {
        if (selectedItems.includes(item as never)) {
          useScatterplotStore.setState({
            [storePath]: [] as never,
            updatedAt: e.timeStamp,
          });
        } else {
          useScatterplotStore.setState({
            [storePath]: [item] as never,
            updatedAt: e.timeStamp,
          });
        }
      }
    }
  }

  return (
    <div className="flex flex-col text-sm">
      <motion.div
        className="flex cursor-pointer gap-1 p-1 font-light"
        onClick={onTitleClick}
        whileHover={{ backgroundColor: "#365314" }}
        style={{ backgroundColor: "#1a2e05" }}
      >
        <span className="grow">{accordionLabel}</span>
        <motion.div
          animate={{ rotate: activeAccordion === accordionLabel ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="h-4 w-4 text-lime-400" />
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {activeAccordion === accordionLabel && (
          <motion.div
            className="flex w-full flex-wrap items-start gap-0.5 overflow-y-auto pl-2 text-sm font-light"
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 100, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {allItems.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.2, delay: 0.2 },
                }}
                exit={{ opacity: 0 }}
                className={`cursor-pointer rounded-sm border border-lime-400/20 px-1 ${
                  selectedItems.includes(item)
                    ? "bg-lime-400 text-black"
                    : "text-lime-400"
                }`}
                onClick={(e) => onItemSelect(e, item)}
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
  return (
    <div className="flex w-56 flex-col bg-lime-400/10">
      <AccordionSelectComponent
        accordionLabel="Type Categories"
        allItems={TYPE_CATEGORIES}
        storePath="selectedTypeCategories"
      />
      <AccordionSelectComponent
        accordionLabel="Skill Categories"
        allItems={SKILL_CATEGORIES}
        storePath="selectedSkillCategories"
      />
      <AccordionSelectComponent
        accordionLabel="X Axis"
        allItems={AXIS_OPTIONS}
        storePath="selectedXAxisOption"
      />
      <AccordionSelectComponent
        accordionLabel="Y Axis"
        allItems={AXIS_OPTIONS}
        storePath="selectedYAxisOption"
      />
    </div>
  );
}

function ScatterplotDotComponent({ skillName }: { skillName: SkillName }) {
  const skill = useMemo(
    () => SKILLS.find((s) => s.name === skillName)!,
    [skillName],
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isActiveSkill, setIsActiveSkill] = useState(
    useScatterplotStore.getState().activeSkillName === skillName,
  );

  useEffect(() => {
    const unsubUpdatedAt = useScatterplotStore.subscribe(
      (state) => state.updatedAt,
      () => {
        const activeSkillName = useScatterplotStore.getState().activeSkillName;
        setIsActiveSkill(activeSkillName === skillName);
      },
    );
    return () => {
      unsubUpdatedAt();
    };
  }, [skillName]);

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
    <motion.div
      className="absolute aspect-square h-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-lime-400"
      animate={{ x: x, y: y, scale: isActiveSkill ? 2 : 1 }}
      transition={{ type: "spring" }}
      onHoverStart={() => setActiveSkillName(skill.name)}
      onHoverEnd={() => setActiveSkillName(null)}
      onClick={() => setActiveSkillName(skill.name)}
      title={skill.name}
    />
  );
}

function ScatterplotComponent() {
  const selectedXAxisOption = useScatterplotStore(
    (state) => state.selectedXAxisOption,
  );
  const selectedYAxisOption = useScatterplotStore(
    (state) => state.selectedYAxisOption,
  );

  return (
    <div className="h-full w-full flex-col items-center justify-center gap-1 rounded border border-lime-400">
      <div
        key="vertical-axis-and-dots-container"
        className="flex grow items-center border border-red-500"
      >
        <div
          key="vertical-axis"
          className="h-48 w-6 border border-orange-400 text-center text-sm font-light"
          style={{
            writingMode: "sideways-lr",
            textOrientation: "sideways",
          }}
        >
          {selectedYAxisOption}
        </div>
        <div className="h-full w-full border border-blue-400">
          <div className="relative top-0 right-0 bottom-0 left-0 m-2 h-48 w-48 border border-yellow-400 bg-lime-400/10">
            {SKILLS.map((skill) => (
              <ScatterplotDotComponent
                key={skill.name}
                skillName={skill.name}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        key="empty-space-and-horizontal-axis-container"
        className="flex h-6 items-center border border-purple-400"
      >
        <div className="flex h-6 w-6 border border-pink-400" />
        <div
          key="horizontal-axis"
          className="mx-2 h-6 w-48 border border-rose-400 text-center text-sm font-light"
        >
          {selectedXAxisOption}
        </div>
      </div>
    </div>
  );
}

function SkillsComponent() {
  return (
    <div className="flex h-full w-full gap-1">
      <ControlsComponent />
      <ScatterplotComponent />
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
