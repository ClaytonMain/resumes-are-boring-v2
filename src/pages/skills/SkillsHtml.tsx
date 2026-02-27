import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTime,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { CONTENT_CONTAINER_CLASS_NAME } from "../../constants/constants";
import useScatterplotStore from "../../stores/useScatterplotStore";
import {
  AXIS_OPTIONS,
  SKILL_CATEGORIES,
  SKILLS,
  TYPE_CATEGORIES,
  TYPE_CATEGORY_COLORS,
} from "./constants";
import type {
  AxisOption,
  ScatterplotAccordionLabel,
  Skill,
  SkillName,
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
        if (
          selectedItems.includes(item as never) &&
          selectedItems.length === 1
        ) {
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
                  selectedItems.includes(item as never)
                    ? "bg-lime-400 text-black"
                    : "text-lime-400"
                }`}
                onClick={(e) => onItemSelect(e, item)}
                whileHover={{
                  backgroundColor: selectedItems.includes(item as never)
                    ? "#65a30d"
                    : "#365314",
                }}
                style={{
                  backgroundColor: selectedItems.includes(item as never)
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

function getAxisPercentValue(
  skill: Skill,
  option: AxisOption,
  axis: "x" | "y",
) {
  let skillValue: number;
  switch (option) {
    case "Proficiency":
      skillValue = skill.proficiency;
      break;
    case "Years Professional":
      skillValue =
        skill.years.professional === -1 ? 10 : skill.years.professional;
      break;
    case "Years Personal":
      skillValue = skill.years.personal === -1 ? 10 : skill.years.personal;
      break;
    case "Personal Enjoyment":
      skillValue = skill.personalEnjoyment;
      break;
  }
  if (axis === "x") {
    return (skillValue / 10) * 100;
  } else {
    return 100 - (skillValue / 10) * 100;
  }
}

function ScatterplotDotComponent({ skillName }: { skillName: SkillName }) {
  const skill = useMemo(
    () => SKILLS.find((s) => s.name === skillName)!,
    [skillName],
  );

  const xBase = useSpring(
    getAxisPercentValue(
      skill,
      useScatterplotStore.getState().selectedXAxisOption,
      "x",
    ),
  );
  const yBase = useSpring(
    getAxisPercentValue(
      skill,
      useScatterplotStore.getState().selectedYAxisOption,
      "y",
    ),
  );
  const time = useTime();

  const rand = useMemo(() => {
    return {
      tPhaseOffsetX: Math.random() * 1000,
      tPhaseOffsetY: Math.random() * 1000,
      tFreqOffsetX: Math.random() * 0.5 + 0.5 * Math.sign(Math.random() - 0.5),
      tFreqOffsetY: Math.random() * 0.5 + 0.5 * Math.sign(Math.random() - 0.5),
    };
  }, []);

  const x = useTransform(
    () =>
      `${xBase.get() + Math.cos((time.get() + rand.tPhaseOffsetX) * 0.0001 * rand.tFreqOffsetX) * 0.75}%`,
  );
  const y = useTransform(
    () =>
      `${yBase.get() + Math.sin((time.get() + rand.tPhaseOffsetY) * 0.0001 * rand.tFreqOffsetY) * 0.75}%`,
  );

  const [, setIsActiveSkill] = useState(
    useScatterplotStore.getState().activeSkillName === skillName,
  );

  useEffect(() => {
    const unsubUpdatedAt = useScatterplotStore.subscribe(
      (state) => state.updatedAt,
      () => {
        const activeSkillName = useScatterplotStore.getState().activeSkillName;
        setIsActiveSkill(activeSkillName === skillName);
        xBase.set(
          getAxisPercentValue(
            skill,
            useScatterplotStore.getState().selectedXAxisOption,
            "x",
          ),
        );
        yBase.set(
          getAxisPercentValue(
            skill,
            useScatterplotStore.getState().selectedYAxisOption,
            "y",
          ),
        );
      },
    );
    return () => {
      unsubUpdatedAt();
    };
  }, [skill, skillName, xBase, yBase]);

  return (
    <motion.div
      className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-80"
      style={{
        top: y,
        left: x,
        backgroundColor: TYPE_CATEGORY_COLORS[skill.typeCategory],
      }}
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
    <div className="h-full w-full flex-col items-center justify-center gap-1 rounded">
      <div
        key="vertical-axis-and-dots-container"
        className="flex grow items-center"
      >
        <div
          key="vertical-axis"
          className="h-48 w-6 text-center text-sm font-light"
          style={{
            writingMode: "sideways-lr",
            textOrientation: "sideways",
          }}
        >
          {selectedYAxisOption}
        </div>
        <div className="h-full w-full">
          <div className="m-1 h-52 w-52 rounded-sm border border-lime-400 bg-lime-400/10">
            <div className="relative m-1.75 h-48 w-48">
              {SKILLS.map((skill) => (
                <ScatterplotDotComponent
                  key={skill.name}
                  skillName={skill.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        key="empty-space-and-horizontal-axis-container"
        className="flex h-6 items-center"
      >
        <div className="flex h-6 w-6" />
        <div
          key="horizontal-axis"
          className="mx-2 h-6 w-48 text-center text-sm font-light"
        >
          {selectedXAxisOption}
        </div>
      </div>
    </div>
  );
}

function SkillListComponent() {
  return (
    <div className="flex h-auto w-full flex-col gap-1">
      {SKILLS.map((skill) => (
        <div
          key={skill.name}
          className="flex h-12 w-full items-center gap-1 rounded border border-lime-400/20 p-3 text-xl font-semibold"
        >
          <span className="grow">{skill.name}</span>
        </div>
      ))}
    </div>
  );
}

function SkillsComponent() {
  return (
    <div className="flex h-full w-full gap-1">
      <SkillListComponent />
      {/* <ControlsComponent />
      <ScatterplotComponent /> */}
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
        className="relative top-0 right-0 bottom-0 left-0 mt-1.5 flex h-150 w-250 snap-y snap-mandatory flex-col gap-2 overflow-y-auto"
        style={{
          scrollbarColor: "#f7fee7 #84cc161a",
        }}
      >
        <SkillsComponent />
      </div>
    </motion.div>
  );
}
