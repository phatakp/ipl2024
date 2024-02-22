"use client";

import { motion } from "framer-motion";

export default function Animate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // exit={{ y: 100, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: 0.5, delay: 0.25 }}
    >
      {children}
    </motion.div>
  );
}
