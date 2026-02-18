import { motion } from "motion/react";
import { CONTENT_CONTAINER_CLASS_NAME } from "../../constants/constants";

export default function HistoryHtml() {
  return (
    <motion.div
      key="history-html-content-div"
      className={CONTENT_CONTAINER_CLASS_NAME}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl font-bold text-white">History Page</h1>
    </motion.div>
  );
}
