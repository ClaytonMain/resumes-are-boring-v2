import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type JSX, type RefObject } from "react";
import { PAGE_HTML_STYLE_CONFIGS } from "../../../../constants/constants";

function ContactComponentContactContent() {
  return (
    <div className="my-auto flex flex-col gap-2 indent-4 text-base/6 tracking-tight">
      <span>
        Click on my links! Pay me $200k USD annually! Provide me with benefits
        and holidays! Relocate me and my family to Iceland, New Zealand,
        Ireland, or Scotland! Do it!
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
      className="mr-1 flex h-full shrink-0 snap-center rounded p-2"
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
      className="flex h-svh w-full items-end justify-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.95, duration: 0.8 } }}
      exit={{ opacity: 0 }}
    >
      <div
        className="pointer-events-auto mb-15 flex w-11/12 flex-col overflow-hidden rounded-md border p-1.5 backdrop-blur-sm sm:w-auto sm:rounded-lg sm:p-2"
        style={{
          backgroundColor: PAGE_HTML_STYLE_CONFIGS.contact.bg,
          color: PAGE_HTML_STYLE_CONFIGS.contact.text,
          borderColor: PAGE_HTML_STYLE_CONFIGS.contact.border,
        }}
      >
        <div className="flex gap-1 sm:gap-1.5 md:gap-2">
          <div className="flex gap-1 overflow-hidden sm:gap-1.5 md:gap-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key="contact-html-title"
                className="text-2xl font-bold tracking-tight md:text-4xl"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
              >
                Contact
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>
        <span className="w-full border-b border-inherit" />
        <div
          ref={viewportRef}
          className="relative top-0 right-0 bottom-0 left-0 mt-1.5 flex h-auto w-full snap-y snap-mandatory flex-col gap-2 sm:h-40 sm:w-150"
        >
          <ContactComponent
            key="contact"
            viewportRef={viewportRef}
            configKey="contact"
          />
        </div>
      </div>
    </motion.div>
  );
}
