import { AnimatePresence, motion } from "motion/react";
import { useState, type JSX } from "react";
import { PAGE_HTML_STYLE_CONFIGS } from "../../../../constants/constants";

type MinigameState = {
  minigameActive: boolean;
  componentStartTime: number | null;
  currentScore: number;
  previousScore: number | null;
  currentMinigameIndex: number;
  onAnswer?: (isCorrect: boolean) => void;
  onBeginMinigame?: () => void;
  onEndMinigame?: () => void;
  onProceed?: () => void;
};

function DefaultContent({ minigameState }: { minigameState: MinigameState }) {
  return (
    <div className="flex h-40 w-full flex-col items-center justify-center">
      Placeholder Text
      {minigameState.previousScore === null && (
        <button
          className="ml-4 cursor-pointer rounded-sm bg-white/20 px-2 py-1"
          onClick={() => minigameState.onBeginMinigame?.()}
        >
          Begin Minigame
        </button>
      )}
      {minigameState.previousScore !== null && (
        <div className="ml-4 flex items-center gap-2 rounded-sm bg-white/20 px-2 py-1">
          <span>Previous Score: {minigameState.previousScore}</span>
          <button
            className="cursor-pointer rounded-sm bg-white/20 px-2 py-1"
            onClick={() => minigameState.onBeginMinigame?.()}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

type TrueFalseConfig = {
  statement: string;
  answer: boolean;
  pointValue?: number;
};

function TrueFalseMinigame({
  minigameState,
  trueFalseConfig,
}: {
  minigameState: MinigameState;
  trueFalseConfig: TrueFalseConfig;
}) {
  const [answered, setAnswered] = useState(false);

  function handleResponse(userAnswer: boolean) {
    const isCorrect = userAnswer === trueFalseConfig.answer;
    minigameState.onAnswer?.(isCorrect);
    setAnswered(true);
    const timeoutId = setTimeout(() => {
      minigameState.onProceed?.();
    }, 1000);
    return () => clearTimeout(timeoutId);
  }

  return (
    <div className="flex h-40 w-full flex-col items-center justify-center">
      <span>{trueFalseConfig.statement}</span>
      <div className="mt-4 flex gap-4">
        <button
          className="rounded-sm bg-green-500 px-2 py-1 text-white"
          onClick={() => handleResponse(true)}
        >
          True
        </button>
        <button
          className="rounded-sm bg-red-500 px-2 py-1 text-white"
          onClick={() => handleResponse(false)}
        >
          False
        </button>
      </div>
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
  {
    title: "Test Test #1",
    content: (minigameState: MinigameState) => (
      <TrueFalseMinigame
        minigameState={minigameState}
        trueFalseConfig={{
          statement: "The sky is blue.",
          answer: true,
        }}
      />
    ),
  },
  {
    title: "Test Test #2",
    content: (minigameState: MinigameState) => (
      <TrueFalseMinigame
        minigameState={minigameState}
        trueFalseConfig={{
          statement: "The grass is red.",
          answer: false,
        }}
      />
    ),
  },
  {
    title: "Test Test #3",
    content: (minigameState: MinigameState) => (
      <TrueFalseMinigame
        minigameState={minigameState}
        trueFalseConfig={{
          statement: "The earth is flat.",
          answer: false,
        }}
      />
    ),
  },
  {
    title: "Test Test #4",
    content: (minigameState: MinigameState) => (
      <TrueFalseMinigame
        minigameState={minigameState}
        trueFalseConfig={{
          statement:
            "React is a JavaScript library for building user interfaces.",
          answer: true,
        }}
      />
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
    onAnswer: onAnswer,
    onBeginMinigame: onBeginMinigame,
    onEndMinigame: onEndMinigame,
    onProceed: onProceed,
  });

  function onAnswer(isCorrect: boolean) {
    console.log("User answered:", isCorrect);
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

  function onBeginMinigame() {
    console.log("Minigame started");
    setMinigameState((prevState) => ({
      ...prevState,
      minigameActive: true,
      componentStartTime: Date.now(),
      currentScore: 0,
      currentMinigameIndex: 1,
    }));
  }

  function onEndMinigame() {
    console.log("Minigame ended");
    setMinigameState((prevState) => ({
      ...prevState,
      minigameActive: false,
      previousScore: prevState.currentScore,
    }));
  }

  function onProceed() {
    console.log("Proceeding to next minigame");
    setMinigameState((prevState) => {
      const nextMinigameIndex = prevState.currentMinigameIndex + 1;
      if (nextMinigameIndex >= ABOUT_CONTENT.length) {
        return {
          ...prevState,
          minigameActive: false,
          previousScore: prevState.currentScore,
          currentMinigameIndex: 0,
        };
      }
      return {
        ...prevState,
        currentMinigameIndex: nextMinigameIndex,
      };
    });
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
          <div className="pointer-events-auto flex h-50 w-full justify-center overflow-hidden sm:h-40">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`${ABOUT_CONTENT[minigameState.currentMinigameIndex].title}-content`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0, transition: { type: "spring" } }}
                exit={{
                  opacity: 0,
                  x: -50,
                  transition: { duration: 0.1 },
                }}
                className="my-auto w-full text-base font-normal tracking-tight"
              >
                {ABOUT_CONTENT[minigameState.currentMinigameIndex].content(
                  minigameState,
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
