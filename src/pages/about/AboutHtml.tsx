import { AnimatePresence, motion } from "motion/react";
import {
  useRef,
  useState,
  type Dispatch,
  type JSX,
  type RefObject,
  type SetStateAction,
} from "react";
import { CONTENT_CONTAINER_CLASS_NAME } from "../../constants/constants";

// const WHO_AM_I = [
//   "Data Person",
//   "Frontend Dev.",
//   "Math Nerd",
//   "Shader Maker",
//   "Tinkerer",
//   "Problem Solver",
//   "Lifelong Learner",
//   "Creative Coder",
//   "3D Artist",
//   "Code Poet",
//   "Pixel Pusher",
//   "Performance Optimizer",
//   "Bug Squasher",
//   "Framework Explorer",
//   "Tech Storyteller",
//   "Continuous Improver",
//   "Curious Mind",
//   "Passionate Coder",
//   "Innovator",
//   "Collaborator",
//   "Mentor",
//   "Creative Thinker",
// ];

type WhoAmI = [string, string];

type AboutConfig = {
  displayValues: [string, string];
  content: string | JSX.Element;
};

const ABOUT_CONFIGS: Record<string, AboutConfig> = {
  about: {
    displayValues: ["", "About"],
    content: "This should be displayed for 'About'",
  },
  coder: {
    displayValues: ["I am a", "Coder"],
    content: <div>"This should be displayed for 'I am a Coder'"</div>,
  },
};

function AboutComponent({
  scrollRef,
  setWhoAmI,
  configKey,
}: {
  scrollRef: RefObject<HTMLDivElement>;
  setWhoAmI: Dispatch<SetStateAction<WhoAmI>>;
  configKey: keyof typeof ABOUT_CONFIGS;
}) {
  const config = ABOUT_CONFIGS[configKey];
  function handleViewportEnter() {
    setWhoAmI(config.displayValues);
  }

  return (
    <motion.div
      className="h-full bg-amber-900/40"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ root: scrollRef }}
      onViewportEnter={handleViewportEnter}
    >
      {config.content}
    </motion.div>
  );
}

export default function AboutHtml() {
  const [whoAmI, setWhoAmI] = useState<WhoAmI>(["", "About"]);

  const scrollRef = useRef<HTMLDivElement>(null!);

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
        <div className="flex gap-2 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={whoAmI[0]}
              className="text-4xl font-bold tracking-tight text-white"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              {whoAmI[0]}
            </motion.h1>
          </AnimatePresence>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={whoAmI[1]}
              className="text-4xl font-bold tracking-tight text-amber-100"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              {whoAmI[1]}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
      <span className="w-full border-b border-amber-400" />
      <div
        ref={scrollRef}
        className="absolute top-0 right-0 bottom-0 left-0 my-2 flex h-64 max-h-64 w-150 flex-col gap-5 overflow-x-hidden overflow-y-auto bg-amber-500 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 [&::-webkit-scrollbar-track]:rounded-none [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-700"
      >
        <AboutComponent
          key="about"
          configKey="about"
          scrollRef={scrollRef}
          setWhoAmI={setWhoAmI}
        />
        <AboutComponent
          key="coder"
          configKey="coder"
          scrollRef={scrollRef}
          setWhoAmI={setWhoAmI}
        />
      </div>
    </motion.div>
  );
}
