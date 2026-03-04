import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { PAGE_NAMES } from "../constants/constants";
import useAppStore from "../stores/useAppStore";

export default function Navigation() {
  const [currentPage, setCurrentPage] = useState(
    useAppStore.getState().currentPage,
  );
  const [nameHovered, setNameHovered] = useState(false);

  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value !== previousValue) {
          setCurrentPage(value);
          if (!useAppStore.getState().displayThreeBackground) {
            useAppStore.setState({ displayThreeBackground: true });
          }
          if (useAppStore.getState().isBoring === true) {
            useAppStore.setState({ isBoring: false });
          }
        }
      },
    );
    return () => {
      unsubCurrentPage();
    };
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 1.2, duration: 0.5 } }}
      className="pointer-events-auto fixed top-0 left-0 z-10 flex w-full items-stretch px-8 select-none"
    >
      <motion.div
        className="my-4 flex items-center gap-1"
        onPointerEnter={() => setNameHovered(true)}
        onPointerLeave={() => setNameHovered(false)}
      >
        <h2 className="text-2xl font-light tracking-tight">CLAYTON MAIN</h2>
        <AnimatePresence>
          {nameHovered && (
            <motion.div
              className="text-sm tracking-tight text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {"👈 That's me!"}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="ml-auto flex items-center justify-center gap-2">
        {PAGE_NAMES.map((page) => (
          <motion.div
            key={page}
            className="relative flex h-full cursor-pointer items-center p-1 text-2xl font-light tracking-tight select-none"
            initial={false}
            animate={{
              color: page === currentPage ? "#111" : "#eee",
            }}
            onClick={() => useAppStore.setState({ currentPage: page })}
          >
            {page.toUpperCase()}
            {page === currentPage ? (
              <motion.div
                className="absolute right-0 bottom-0 left-0 -z-1 h-full rounded-b-lg bg-white"
                layoutId="selected-page-nav-indicator"
                id="selected-page-nav-indicator"
              />
            ) : null}
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
}
