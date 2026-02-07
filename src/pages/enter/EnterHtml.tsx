import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import useAppStore from "../../stores/useAppStore";

export default function EnterHtml() {
  const [showOuter, setShowOuter] = useState(
    useAppStore.getState().currentPage === "enter" &&
      useAppStore.getState().enterState === "idleBoring",
  );
  const [showInner, setShowInner] = useState(showOuter);
  const [showText, setShowText] = useState(showOuter);

  function handleOnClick() {
    if (useAppStore.getState().enterState === "idleBoring") {
      setShowText(false);
      useAppStore.setState({ enterState: "prepareToApproachMonitor" });
    }
  }

  function handleExitComplete(label: string) {
    if (label === "outer") {
      if (useAppStore.getState().enterState === "prepareToApproachMonitor") {
        useAppStore.setState({ enterState: "approachMonitor" });
      }
    } else if (label === "inner") {
      setShowOuter(false);
    } else if (label === "text") {
      setShowInner(false);
    }
  }

  useEffect(() => {
    const onClick = () => {
      handleOnClick();
    };
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => handleExitComplete("outer")}
      mode="wait"
    >
      {showOuter && (
        <motion.div
          className="pointer-events-none fixed top-0 left-0 z-1 flex h-screen w-screen items-center justify-center bg-slate-950/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnimatePresence
            onExitComplete={() => handleExitComplete("inner")}
            mode="wait"
          >
            {showInner && (
              <motion.div
                className="pointer-events-none flex h-10/12 w-full flex-col rounded-xl border sm:w-5/12"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.75, ease: "easeOut" },
                }}
                exit={{
                  opacity: 0,
                  scaleY: 0,
                  transition: { duration: 0.5, ease: "easeIn" },
                }}
              >
                <AnimatePresence
                  onExitComplete={() => handleExitComplete("text")}
                  mode="wait"
                >
                  {showText && (
                    <>
                      <motion.h1
                        key="enter-resumes-h1"
                        className="mt-12 ml-12 text-7xl font-bold tracking-tighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.75,
                            delay: 0.75,
                            ease: "easeOut",
                          },
                        }}
                        exit={{
                          opacity: 0,
                          y: 20,
                          transition: { duration: 0.25, delay: 0.0 },
                        }}
                      >
                        RÉSUMÉS
                      </motion.h1>
                      <motion.h1
                        key="enter-are-h1"
                        className="ml-12 text-7xl font-bold tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.75,
                            delay: 1.5,
                            ease: "easeOut",
                          },
                        }}
                        exit={{
                          opacity: 0,
                          y: 20,
                          transition: { duration: 0.25, delay: 0.25 },
                        }}
                      >
                        ARE
                      </motion.h1>
                      <motion.h1
                        key="enter-boring-h1"
                        className="ml-12 text-7xl font-bold tracking-tighter"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.75,
                            delay: 2.25,
                            ease: "easeOut",
                          },
                        }}
                        exit={{
                          opacity: 0,
                          y: 20,
                          transition: { duration: 0.25, delay: 0.5 },
                        }}
                      >
                        BORING.
                      </motion.h1>
                      <motion.div
                        key="enter-click-to-continue-div"
                        className="mx-8 my-6 mt-auto flex justify-end text-2xl font-thin tracking-tight"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: 0.75, delay: 5 },
                        }}
                        exit={{
                          opacity: 0,
                          transition: { duration: 0.25, delay: 0.75 },
                        }}
                      >
                        click to continue
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
