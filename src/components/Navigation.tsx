import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { PAGE_NAMES } from "../constants/constants";
import useAppStore from "../stores/useAppStore";

export default function Navigation() {
  const [currentPage, setCurrentPage] = useState(
    useAppStore.getState().currentPage,
  );

  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value !== previousValue) {
          setCurrentPage(value);
        }
      },
    );
    return () => {
      unsubCurrentPage();
    };
  }, []);

  return (
    <nav className="pointer-events-auto fixed top-0 left-0 z-10 flex w-full items-stretch px-8">
      <h2 className="my-4 flex text-2xl font-light tracking-tight">
        CLAYTON MAIN
      </h2>
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
    </nav>
  );
}
