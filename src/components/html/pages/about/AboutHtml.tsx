import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion, wrap } from "motion/react";
import { useState } from "react";
import { PAGE_HTML_STYLE_CONFIGS } from "../../../../constants/constants";

const ABOUT_COMPONENT_CONTENT_CLASS_NAME = "indent-4 sm:text-base/6 text-sm/5";
const ABOUT_COMPONENT_CONTENT_LINK_CLASS_NAME =
  "underline decoration-1 font-normal";

function AboutComponentAboutContent() {
  return (
    <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
      I'm a data person professionally, a graphics programmer & web developer
      personally, and frankly, just someone who wants to make cool stuff, learn
      new things, and try each day to improve in any way I can.
    </div>
  );
}

function AboutComponentDataPersonContent() {
  return (
    <div className="flex flex-col">
      <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
        When I started with my current employer over eight years ago, I worked
        in IT, had no real data experience, and they had no existing data
        infrastructure. People were spending hours on reports that should have
        only taken minutes
      </div>
      <div className="text-center indent-4 text-sm/5 italic sm:text-base/6">
        and I took that personally.
      </div>
      <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
        So I took it upon myself to learn, built the business case, and created
        our Data Ops. department from the ground up. Today, we offer self-serve,
        conversational analytics powered by a modern data stack. It's been a
        long road, but I'm proud of what the department has become.
      </div>
    </div>
  );
}

function AboutComponentGraphicsContent() {
  return (
    <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
      A few years back, I decided to learn React, Three.js, and Typescript to
      show off{" "}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://claytonmain.github.io/spherical-trochoids/"
        className={ABOUT_COMPONENT_CONTENT_LINK_CLASS_NAME}
      >
        some math I came up with
      </a>{" "}
      for fun. I really enjoyed the process, and so I kept on learning,
      building, and improving. It dawned on me over time that this kind of work
      sits at the center of many of my lifelong interests: art, math,
      programming, graphics, animation, etc. This is - <i>by far</i> - the most
      personally rewarding work I've ever done, and I intend to keep doing it
      for a very long time.
    </div>
  );
}

function AboutComponentBeyondScreenContent() {
  return (
    <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
      I hike. I make pies. I enjoy a good audiobook (been on a Discworld binge
      lately, I'm always revisiting Tolkien, and the Dune books are great). I
      enjoy 3D printing things and working on electronics projects with my son.
      I've got a fondness for space, and I can talk about math for hours
      (seriously, don't get me started). I could go on, but I won't. If you want
      to know more, then let's chat!
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
