import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion, wrap } from "motion/react";
import { useState } from "react";
import { PAGE_HTML_STYLE_CONFIGS } from "../../../../constants/constants";

const ABOUT_COMPONENT_CONTENT_CLASS_NAME = "indent-4 sm:text-base/6 text-sm/5";

function AboutComponentAboutContent() {
  return (
    <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
      I'm a data person professionally, and I do graphics & web stuff for fun,
      and I am just <i>absolutely horrible</i> at writing about myself formally
      without sounding as wretched as my ageing cat (she's awful). Why do I have
      an about page anyways? Go look at the other pages, they're better!
      {" :)"}
    </div>
  );
}

function AboutComponentDataPersonContent() {
  return (
    <div className="flex flex-col">
      <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
        This section used to talk about how I built up my current employer's
        Data Ops. department from scratch despite having no formal training,{" "}
        <i>but it sounded completely insufferable</i> so I deleted it.
      </div>
      <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
        It's true though, I did do that. And we use, like, an actual modern data
        stack too. Not (just) custom Python scripts & whatnot. Go look at my
        skills page to see what we use (it's a better page anyways{" "}
        <i>why are you still here???</i>).
      </div>
    </div>
  );
}

function AboutComponentGraphicsContent() {
  return (
    <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
      I learned React, Three.js, React Three Fiber ("isn't that just React &
      Three.js though?" - yes), GLSL, Typescript, etc. on my own because I
      WANTED TO. That's it. I mean, I <i>also</i> wanted to show off some cool
      math I came up with, but that's not why I stuck with it. Look at this
      website though! <i>Graphics</i>.
    </div>
  );
}

function AboutComponentBeyondScreenContent() {
  return (
    <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
      I'm obviously a nerd and I like hiking and making stuff and I'm great at
      making pies and I think math is cool what more do you want from me???
    </div>
  );
}

const aboutConfigs = [
  {
    header: "About",
    content: <AboutComponentAboutContent />,
  },
  {
    header: "I'm a Data Person",
    content: <AboutComponentDataPersonContent />,
  },
  {
    header: "I do Graphics & Web Stuff",
    content: <AboutComponentGraphicsContent />,
  },
  {
    header: "Beyond the Screen...",
    content: <AboutComponentBeyondScreenContent />,
  },
];

function IndexDotComponent({
  onClick,
  active,
}: {
  onClick: () => void;
  active: boolean;
}) {
  return (
    <motion.button
      initial={false}
      onClick={onClick}
      className="flex h-full w-9 flex-initial cursor-pointer items-center justify-center"
      whileHover={{ backgroundColor: "#ffffff1a" }}
    >
      <motion.div
        className="flex h-full w-full items-center justify-center"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          className="h-3 w-3 rounded-full"
          style={{
            backgroundColor: PAGE_HTML_STYLE_CONFIGS.about.text,
          }}
          animate={{
            opacity: active ? 1 : 0.5,
          }}
        />
      </motion.div>
    </motion.button>
  );
}

export default function AboutHtml() {
  const [aboutIndex, setAboutIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  function handleDirectionClick(newDirection: 1 | -1) {
    const nextAboutIndex = wrap(
      0,
      aboutConfigs.length,
      aboutIndex + newDirection,
    );
    setDirection(newDirection);
    setAboutIndex(nextAboutIndex);
  }

  function handleDirectClick(newIndex: number) {
    if (newIndex === aboutIndex) return;
    const newDirection = newIndex > aboutIndex ? 1 : -1;
    setDirection(newDirection);
    setAboutIndex(newIndex);
  }

  return (
    <motion.div
      key="about-html-content-div"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.95, duration: 0.8 } }}
      exit={{ opacity: 0 }}
      className="flex h-svh w-full items-center justify-center"
    >
      <div
        className="pointer-events-auto flex w-full flex-col items-center overflow-hidden rounded-sm border px-2 backdrop-blur-sm sm:w-130 sm:rounded-lg"
        style={{
          backgroundColor: PAGE_HTML_STYLE_CONFIGS.about.bg,
          color: PAGE_HTML_STYLE_CONFIGS.about.text,
          borderColor: PAGE_HTML_STYLE_CONFIGS.about.border,
        }}
      >
        <div className="mt-2 flex w-full flex-col items-center gap-2">
          <div className="w-full overflow-hidden text-left">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={aboutConfigs[aboutIndex].header}
                className="text-2xl font-bold tracking-tight md:text-4xl"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
              >
                {aboutConfigs[aboutIndex].header}
              </motion.h1>
            </AnimatePresence>
          </div>
          <span className="w-full border-b border-inherit" />
          <div className="pointer-events-auto flex h-70 w-full justify-center overflow-hidden sm:h-60">
            <AnimatePresence
              custom={direction}
              mode="popLayout"
              initial={false}
            >
              <motion.div
                key={`${aboutConfigs[aboutIndex].header}-content`}
                initial={{ opacity: 0, x: direction * 50 }}
                animate={{ opacity: 1, x: 0, transition: { type: "spring" } }}
                exit={{
                  opacity: 0,
                  x: direction * -50,
                  transition: { duration: 0.1 },
                }}
                className="my-auto w-full text-base font-normal tracking-tight"
              >
                {aboutConfigs[aboutIndex].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <span className="w-full border-b border-inherit" />
        <div className="flex h-10 w-70 items-center justify-center overflow-hidden">
          <motion.button
            initial={false}
            onClick={() => handleDirectionClick(-1)}
            className="flex h-full w-9 flex-initial cursor-pointer items-center justify-center"
            whileHover={{ backgroundColor: "#ffffff1a" }}
          >
            <motion.div
              className="flex h-full w-full items-center justify-center"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeftIcon className="h-10 w-10" />
            </motion.div>
          </motion.button>
          {Array.from({ length: aboutConfigs.length }).map((_, index) => (
            <IndexDotComponent
              key={index}
              onClick={() => handleDirectClick(index)}
              active={index === aboutIndex}
            />
          ))}
          <motion.button
            initial={false}
            onClick={() => handleDirectionClick(1)}
            className="flex h-full w-9 flex-initial cursor-pointer items-center justify-center"
            whileHover={{ backgroundColor: "#ffffff1a" }}
          >
            <motion.div
              className="flex h-full w-full items-center justify-center"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeftIcon className="h-10 w-10 -scale-x-100" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
