import { monitor, useControls } from "leva";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
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

const ABOUT_COMPONENT_CONTENT_CLASS_NAME = "my-auto indent-4 text-base/6";
// "my-auto indent-4 text-lg font-normal";
const ABOUT_COMPONENT_CONTENT_EMPHASIS_CLASS_NAME =
  "text-amber-100 font-normal";
const ABOUT_COMPONENT_CONTENT_LINK_CLASS_NAME =
  "text-amber-200 underline decoration-amber-200 decoration-1 font-normal";

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
    <div className="my-auto flex flex-col gap-2">
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

type WhoAmI = [string, string];

type AboutConfig = {
  displayValues: [string, string];
  content: string | JSX.Element;
};

const ABOUT_CONFIGS: Record<string, AboutConfig> = {
  about: {
    displayValues: ["", "About"],
    content: <AboutComponentAboutContent />,
  },
  dataPerson: {
    displayValues: ["I am a", "Data Person"],
    content: <AboutComponentDataPersonContent />,
  },
  graphics: {
    displayValues: ["I do", "Graphics & Web Stuff"],
    content: <AboutComponentGraphicsContent />,
  },
  doingMyBest: {
    displayValues: ["I'm just", "Doing My Best"],
    content: <div>"This should be displayed for 'I'm just Doing My Best'"</div>,
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

  const { scrollYProgress } = useScroll({
    target: divRef,
    container: viewportRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.3 && latest < 0.7) {
      setWhoAmI(config.displayValues);
    }
  });

  useControls({
    [configKey]: monitor(() => scrollYProgress.get(), {
      graph: true,
      interval: 30,
    }),
  });

  return (
    <motion.div
      ref={divRef}
      className="mr-2 flex h-64 shrink-0 snap-center rounded bg-amber-500/10 p-2"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { duration: 0.5 } }}
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

  useEffect(() => {
    viewportRef.current.scrollTo({ top: 0 });
  }, []);

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
        className="relative top-0 right-0 bottom-0 left-0 mt-1.5 flex h-64 w-150 snap-y snap-mandatory flex-col gap-2 overflow-y-scroll"
        style={{
          scrollbarColor: "#fffbeb #f59e0b1a",
        }}
      >
        <AboutComponent
          key="about"
          viewportRef={viewportRef}
          setWhoAmI={setWhoAmI}
          configKey="about"
        />
        <AboutComponent
          key="dataPerson"
          viewportRef={viewportRef}
          setWhoAmI={setWhoAmI}
          configKey="dataPerson"
        />
        <AboutComponent
          key="graphics"
          viewportRef={viewportRef}
          setWhoAmI={setWhoAmI}
          configKey="graphics"
        />
        <AboutComponent
          key="doingMyBest"
          viewportRef={viewportRef}
          setWhoAmI={setWhoAmI}
          configKey="doingMyBest"
        />
      </div>
    </motion.div>
  );
}
