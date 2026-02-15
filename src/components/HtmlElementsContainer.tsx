import { AnimatePresence, motion } from "motion/react";
import AboutHtml from "../pages/about/AboutHtml";
import ContactHtml from "../pages/contact/ContactHtml";
import HistoryHtml from "../pages/history/HistoryHtml";
import HomeHtml from "../pages/home/HomeHtml";
import ProjectsHtml from "../pages/projects/ProjectsHtml";
import SkillsHtml from "../pages/skills/SkillsHtml";
import useAppStore from "../stores/useAppStore";
import Navigation from "./Navigation";
// import { useEffect } from "react";

export default function HtmlElementsContainer() {
  const currentPage = useAppStore((state) => state.currentPage);
  const initialComponentsReady = useAppStore(
    (state) => state.initialComponentsReady,
  );

  // useEffect(() => {
  //   const unsubCurrentPage = useAppStore.subscribe(
  //     (state) => state.currentPage,
  //     (value, previousValue) => {
  //       if (value === PAGE_NAME && previousValue !== PAGE_NAME) {
  //         UTILS.requestCameraUpdate({
  //           position: DEFAULT_CAMERA_POSITION,
  //           lookAt: DEFAULT_CAMERA_LOOK_AT,
  //           fov: DEFAULT_CAMERA_FOV,
  //         });
  //       }
  //     },
  //   );
  //   return () => {
  //     unsubCurrentPage();
  //   };
  // }, []);

  return (
    <>
      {initialComponentsReady && (
        <motion.div className="pointer-events-none fixed top-0 left-0 z-1 flex h-screen w-screen items-center justify-start bg-slate-950/30">
          <Navigation />
          <AnimatePresence mode="wait">
            {currentPage === "home" && <HomeHtml />}
            {currentPage === "about" && <AboutHtml />}
            {currentPage === "skills" && <SkillsHtml />}
            {currentPage === "projects" && <ProjectsHtml />}
            {currentPage === "history" && <HistoryHtml />}
            {currentPage === "contact" && <ContactHtml />}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
