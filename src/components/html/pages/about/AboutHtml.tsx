import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { AnimatePresence, motion, wrap } from "motion/react";
import { useState } from "react";
import { PAGE_HTML_STYLE_CONFIGS } from "../../../../constants/constants";

const ABOUT_COMPONENT_CONTENT_CLASS_NAME = "indent-4 text-base/6";
const ABOUT_COMPONENT_CONTENT_EMPHASIS_CLASS_NAME = "font-normal";
const ABOUT_COMPONENT_CONTENT_LINK_CLASS_NAME =
  "underline decoration-1 font-normal";

function AboutComponentAboutContent() {
  return (
    <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
      I'm a{" "}
      <span className={ABOUT_COMPONENT_CONTENT_EMPHASIS_CLASS_NAME}>
        data person
      </span>{" "}
      professionally, a{" "}
      <span className={ABOUT_COMPONENT_CONTENT_EMPHASIS_CLASS_NAME}>
        graphics programmer & web developer
      </span>{" "}
      personally, and frankly, just someone who wants to{" "}
      <span className={ABOUT_COMPONENT_CONTENT_EMPHASIS_CLASS_NAME}>
        make cool stuff, learn new things, and make the most of it all
      </span>
      .
    </div>
  );
}

function AboutComponentDataPersonContent() {
  return (
    <div className="flex flex-col">
      <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
        When I started with my current employer over eight years ago, I worked
        in IT, had no real data experience, and they had{" "}
        <span className={ABOUT_COMPONENT_CONTENT_EMPHASIS_CLASS_NAME}>
          no existing data infrastructure
        </span>{" "}
        to speak of. Things were inefficient, to say the least (picture 40-page
        printed reports with highlighters inefficient).
      </div>
      <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME + " " + "text-center"}>
        <span className={"font-semibold text-amber-100"}>
          I could not allow this.
        </span>
        <br />
      </div>
      <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
        It's taken a lot of effort, and a lot of growth over the years, but
        today, my team offers{" "}
        <span className={ABOUT_COMPONENT_CONTENT_EMPHASIS_CLASS_NAME}>
          self-serve, conversational analytics
        </span>{" "}
        to select departments, powered by{" "}
        <span className={ABOUT_COMPONENT_CONTENT_EMPHASIS_CLASS_NAME}>
          a modern data stack.
        </span>{" "}
      </div>
    </div>
  );
}

function AboutComponentGraphicsContent() {
  return (
    <div className={ABOUT_COMPONENT_CONTENT_CLASS_NAME}>
      A few years back, I decided to learn React, Three.js, and Typescript so I
      could showcase{" "}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://claytonmain.github.io/spherical-trochoids/"
        className={ABOUT_COMPONENT_CONTENT_LINK_CLASS_NAME}
      >
        some math I came up with
      </a>{" "}
      for fun. I really enjoyed the process and kept learning and building more
      projects in my free time. Eventually, I came to realize how much overlap
      there is between graphics programming and many of my past and present
      hobbies and interests (programming, math, art, animation, games, etc.).
      Plus, it's been nice to finally have something to which I can apply my
      (somewhat rusty) linear algebra skills.
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
    header: "Lorem Ipsum",
    content: <div>"This should be displayed for 'Lorem Ipsum'"</div>,
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
      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
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
        className="pointer-events-auto flex w-full flex-col items-center overflow-hidden rounded-lg border px-2 backdrop-blur-sm sm:w-120"
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
          <div className="pointer-events-auto flex h-60 w-full justify-center overflow-hidden">
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
                className="w-full text-base font-normal tracking-tight"
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
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
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
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
              <ChevronLeftIcon className="h-10 w-10 -scale-x-100" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
