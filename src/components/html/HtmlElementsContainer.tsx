import { AnimatePresence, motion } from "motion/react";
import useAppStore from "../../stores/useAppStore";
import Navigation from "./Navigation";
import AboutHtml from "./pages/about/AboutHtml";
import ContactHtml from "./pages/contact/ContactHtml";
import HomeHtml from "./pages/home/HomeHtml";
import ProjectsHtml from "./pages/projects/ProjectsHtml";
import SkillsHtml from "./pages/skills/SkillsHtml";
import ScreenWidthDebugDisplay from "./ScreenWidthDebugDisplay";

export default function HtmlElementsContainer() {
  const currentPage = useAppStore((state) => state.currentPage);
  const initialComponentsReady = useAppStore(
    (state) => state.initialComponentsReady,
  );

  return (
    <>
      {initialComponentsReady && (
        <motion.div className="pointer-events-none fixed top-0 left-0 z-1 flex h-screen w-screen items-center justify-start">
          <Navigation />
          <AnimatePresence mode="wait">
            {currentPage === "home" && <HomeHtml />}
            {currentPage === "about" && <AboutHtml />}
            {currentPage === "skills" && <SkillsHtml />}
            {currentPage === "projects" && <ProjectsHtml />}
            {currentPage === "contact" && <ContactHtml />}
          </AnimatePresence>
        </motion.div>
      )}
      <ScreenWidthDebugDisplay />
    </>
  );
}
