import { motion } from "motion/react";
import { Suspense } from "react";
import HomeHtml from "../pages/home/HomeHtml";
import Navigation from "./Navigation";

export default function HtmlElementsContainer() {
  return (
    <Suspense fallback={null}>
      <motion.div className="pointer-events-none fixed top-0 left-0 z-1 flex h-screen w-screen items-center justify-start bg-slate-950/30">
        <Navigation />
        <HomeHtml />
      </motion.div>
    </Suspense>
  );
}
