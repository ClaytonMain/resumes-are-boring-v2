import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type JSX, type RefObject } from "react";

const CONTACT_COMPONENT_CONTENT_CLASS_NAME =
  "my-auto flex flex-col text-base/6 gap-2 tracking-tight text-violet-100";

function ContactComponentContactContent() {
  return (
    <div className={CONTACT_COMPONENT_CONTENT_CLASS_NAME}>
      <span>
        If you're liking what you're seeing and want to chat about potential
        opportunities, here are my links!
      </span>
      <span>
        I've gotten this far on my own; Imagine what we could do together!
      </span>
      <span className="w-full text-right text-[0.5rem] text-violet-50/80">
        Bonus points if you're willing to help relocate me to Scotland, Ireland,
        Iceland, or New Zealand. Hey, I can dream, can't I?
      </span>
    </div>
  );
}

type ContactConfig = {
  displayValues: [string, string];
  content: string | JSX.Element;
};

const CONTACT_CONFIGS: Record<string, ContactConfig> = {
  contact: {
    displayValues: ["", "Contact"],
    content: <ContactComponentContactContent />,
  },
};

function ContactComponent({
  viewportRef,
  configKey,
}: {
  viewportRef: RefObject<HTMLDivElement>;
  configKey: keyof typeof CONTACT_CONFIGS;
}) {
  const divRef = useRef<HTMLDivElement>(null!);
  const config = CONTACT_CONFIGS[configKey];

  return (
    <motion.div
      ref={divRef}
      className="mr-2 flex shrink-0 snap-center rounded bg-violet-500/10 p-2"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { duration: 0.5 } }}
      viewport={{ root: viewportRef }}
    >
      {config.content}
    </motion.div>
  );
}

export default function ContactHtml() {
  const viewportRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    viewportRef.current.scrollTo({ top: 0 });
  }, []);

  return (
    <motion.div
      key="contact-html-content-div"
      className="pointer-events-auto mx-auto mb-24 flex flex-col justify-center self-end overflow-hidden rounded-lg border border-violet-400 bg-violet-400/10 p-2 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex gap-2">
        <div className="flex gap-2 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key="contact-html-title"
              className="text-4xl font-bold tracking-tight text-violet-100"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
            >
              Contact
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
      <span className="w-full border-b border-violet-400" />
      <div
        ref={viewportRef}
        className="relative top-0 right-0 bottom-0 left-0 mt-1.5 flex w-150 snap-y snap-mandatory flex-col gap-2"
        style={{
          scrollbarColor: "#f5f3ff #8b5cf61a",
        }}
      >
        <ContactComponent
          key="contact"
          viewportRef={viewportRef}
          configKey="contact"
        />
      </div>
    </motion.div>
  );
}
