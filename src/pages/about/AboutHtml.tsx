import { AnimatePresence, motion, useScroll } from "motion/react";
import {
  useEffect,
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
    displayValues: ["I am a", "Data Person"],
    content: <div>"This should be displayed for 'I am a Data Person'"</div>,
  },
};

function AboutComponent({
  viewportRef,
  setWhoAmI,
  configKey,
}: {
  viewportRef: RefObject<HTMLDivElement>;
  setWhoAmI: Dispatch<SetStateAction<WhoAmI>>;
  configKey: keyof typeof ABOUT_CONFIGS;
}) {
  const divRef = useRef<HTMLDivElement>(null!);
  const config = ABOUT_CONFIGS[configKey];
  // function handleViewportEnter(e) {
  //   console.log(e);
  //   setWhoAmI(config.displayValues);
  // }
  const idk = useScroll({
    target: divRef,
    container: viewportRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    if (configKey !== "about") return;
    const intervalId = setInterval(() => {
      console.log(idk.scrollYProgress);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [idk, configKey]);

  return (
    <motion.div
      ref={divRef}
      className="relative h-64 items-center justify-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ root: viewportRef }}
      // onViewportEnter={handleViewportEnter}
    >
      {config.content}
    </motion.div>
  );
}

export default function AboutHtml() {
  const [whoAmI, setWhoAmI] = useState<WhoAmI>(["", "About"]);

  const viewportRef = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);

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
        ref={viewportRef}
        className="relative mt-1 h-64 max-h-64 w-150 grow flex-col items-stretch overflow-y-auto"
        style={{
          scrollbarColor: "#fffbeb #f59e0b1a",
        }}
      >
        <div
          ref={containerRef}
          className="relative my-2 flex-col items-stretch justify-center gap-4"
        >
          <AboutComponent
            key="about"
            viewportRef={viewportRef}
            setWhoAmI={setWhoAmI}
            configKey="about"
          />
          <AboutComponent
            key="coder"
            viewportRef={viewportRef}
            setWhoAmI={setWhoAmI}
            configKey="coder"
          />
        </div>
      </div>
    </motion.div>
  );
}
