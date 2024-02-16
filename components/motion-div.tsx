"use client";

import { Variants, motion } from "framer-motion";
import { ComponentPropsWithoutRef } from "react";

const variants: Variants = {
  offscreen: {
    x: 100,
    opacity: 0,
  },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

type MotionDivProps = ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
  className?: string;
};
export default function MotionDiv({ children, className }: MotionDivProps) {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.5 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
