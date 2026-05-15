import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type JSX } from "react";
import { PAGE_HTML_STYLE_CONFIGS } from "../../../../constants/constants";

type MinigameState = {
  minigameActive: boolean;
  componentStartTime: number | null;
  currentScore: number;
  previousScore: number | null;
  currentMinigameIndex: number;
  onAnswer?: (isCorrect: boolean) => void;
  onBegin?: () => void;
  onEnd?: () => void;
};

function DefaultContent({ minigameState }: { minigameState: MinigameState }) {
  return (
    <div className="flex h-40 w-full items-center justify-center rounded-sm border">
      Placeholder Text
      {minigameState.previousScore === null && (
        <button
          className="ml-4 rounded-sm bg-white/20 px-2 py-1"
          onClick={() => minigameState.onBegin?.()}
        >
          Begin Minigame
        </button>
      )}
      {minigameState.previousScore !== null && (
        <div className="ml-4 flex items-center gap-2 rounded-sm bg-white/20 px-2 py-1">
          <span>Previous Score: {minigameState.previousScore}</span>
          <button
            className="rounded-sm bg-white/20 px-2 py-1"
            onClick={() => minigameState.onBegin?.()}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

// Minigame screens (think "Warioware" but not nearly as complicated mostly true false with some silly stuff in there too) will be stored here. Will have title & component. Not sure how to pass minigameState to the components.
type AboutContentItem = {
  title: string;
  content: (minigameState: MinigameState) => JSX.Element;
};
const ABOUT_CONTENT: Array<AboutContentItem> = [
  {
    title: "About",
    content: (minigameState: MinigameState) => (
      <DefaultContent minigameState={minigameState} />
    ),
  },
];

export default function AboutHtml() {
  const [minigameState, setMinigameState] = useState<MinigameState>({
    minigameActive: false,
    componentStartTime: null,
    previousScore: null,
    currentScore: 0,
    currentMinigameIndex: 0,
  });

  function onAnswer(isCorrect: boolean) {
    setMinigameState((prevState) => {
      const newScore = isCorrect
        ? prevState.currentScore + 1
        : prevState.currentScore;
      return {
        ...prevState,
        currentScore: newScore,
      };
    });
  }

  function onBegin() {
    setMinigameState({
      minigameActive: true,
      componentStartTime: 0,
      currentScore: 0,
      previousScore: minigameState.previousScore,
      currentMinigameIndex: minigameState.currentMinigameIndex,
      onAnswer: minigameState.onAnswer,
      onBegin: minigameState.onBegin,
    });
  }

  function onEnd() {
    setMinigameState((prevState) => ({
      ...prevState,
      minigameActive: false,
      previousScore: prevState.currentScore,
    }));
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
        className="pointer-events-auto flex w-11/12 flex-col items-center overflow-hidden rounded-sm border px-2 backdrop-blur-sm sm:w-130 sm:rounded-lg"
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
                key={ABOUT_CONTENT[minigameState.currentMinigameIndex].title}
                className="text-2xl font-bold tracking-tight md:text-4xl"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
              >
                {ABOUT_CONTENT[minigameState.currentMinigameIndex].title}
              </motion.h1>
            </AnimatePresence>
          </div>
          <span className="w-full border-b border-inherit" />
          <div className="pointer-events-auto flex h-50 w-full justify-center overflow-hidden sm:h-40"></div>
        </div>
      </div>
    </motion.div>
  );
}
